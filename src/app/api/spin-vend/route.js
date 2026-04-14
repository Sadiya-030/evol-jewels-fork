import { getSession, updateSession } from "../../lib/session";
import { NextResponse } from "next/server";

const getStrapiHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
});

/**
 * POST /api/spin-vend
 * Vends the max available 0.5g bean for spin wins (both phone and coupon flows)
 * Spin flow ONLY vends 0.5g (Half gram) beans
 * Body: { sessionId?, phoneNumber? } - provide sessionId for coupon flow, phoneNumber for phone flow
 */
export async function POST(req) {
  try {
    const body = await req.json();
    const { sessionId, phoneNumber } = body;

    // Determine flow type
    const isPhoneFlow = !!phoneNumber;
    const isCouponFlow = !!sessionId;

    if (!isPhoneFlow && !isCouponFlow) {
      return NextResponse.json(
        {
          success: false,
          error: "Either sessionId or phoneNumber is required",
        },
        { status: 400 },
      );
    }

    // Validate session for coupon flow
    let session = null;
    if (isCouponFlow) {
      session = await getSession(sessionId);
      if (!session || session.state !== "CODE_VERIFIED") {
        return NextResponse.json(
          { success: false, error: "Invalid vend attempt" },
          { status: 403 },
        );
      }
    }

    const cmsUrl = process.env.CMSURL || process.env.NEXT_PUBLIC_CMSURL;

    console.log(
      `[spin-vend] ${isPhoneFlow ? "Phone" : "Coupon"} flow - ${isPhoneFlow ? phoneNumber : sessionId}`,
    );

    // Fetch max available 0.5g bean from CMS (only Half gram beans with inventory > 0)
    const charmsRes = await fetch(
      `${cmsUrl}/api/charms?filters[inventory][$gt]=0&filters[grams][$eq]=0.5&sort=inventory:desc&pagination[limit]=1&populate=image`,
      {
        cache: "no-store",
        headers: getStrapiHeaders(),
      },
    );

    if (!charmsRes.ok) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Sorry, Service Unavailable. We are Trying to Get it Back Up!",
        },
        { status: 500 },
      );
    }

    const charmsData = await charmsRes.json();
    const charmsList = charmsData?.data || [];

    // No 0.5g beans available
    if (charmsList.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No 0.5g beans available in inventory",
        },
        { status: 404 },
      );
    }

    const maxBean = charmsList[0];
    const slotNo = maxBean.slotNo;
    const beanId = maxBean.documentId;

    console.log(
      `[spin-vend] Vending max available 0.5g bean: ${maxBean.title} (${maxBean.grams}g) from slot ${slotNo}`,
    );

    // Call vending machine FIRST (ESP32 or Simulator)
    const vendingUrl = process.env.VENDING_URL || "http://localhost:8080";
    let vendingMachineError = false;

    try {
      console.log(
        `[spin-vend] Calling vending machine at ${vendingUrl}/vend with slot ${slotNo}`,
      );
      const vendResponse = await fetch(`${vendingUrl}/vend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slot: Number(slotNo), command: "VEND" }),
      });
      const vendResult = await vendResponse.json();
      console.log("[spin-vend] Vending machine response:", vendResult);

      if (!vendResponse.ok) {
        console.error("[spin-vend] Vending machine error:", vendResult);
        vendingMachineError = true;
      }
    } catch (vendError) {
      console.error(
        "[spin-vend] Failed to call vending machine:",
        vendError.message,
      );
      vendingMachineError = true;
    }

    // If vending machine had issues, return error WITHOUT invalidating coupon/inventory
    if (vendingMachineError) {
      return NextResponse.json(
        {
          success: false,
          vendingMachineError: true,
          message: "Contact the Store Staff!",
          slotNo: slotNo,
          wonBean: {
            title: maxBean.title,
            grams: maxBean.grams,
            image: maxBean.image?.url || null,
          },
        },
        { status: 503 },
      );
    }

    // ✅ Vending successful - NOW decrement inventory and invalidate coupon
    await fetch(`${cmsUrl}/api/charms/${beanId}`, {
      method: "PUT",
      headers: getStrapiHeaders(),
      body: JSON.stringify({
        data: {
          inventory: Number(maxBean.inventory) - 1,
        },
      }),
    });

    // Mark spin coupon as used (coupon flow only)
    if (isCouponFlow && session) {
      const apiURL = `${cmsUrl}/api/spin-coupons/${session.couponID}`;
      const couponRes = await fetch(apiURL, {
        method: "PUT",
        headers: getStrapiHeaders(),
        body: JSON.stringify({
          data: {
            isValidCoupon: false,
          },
        }),
      });
      const couponResult = await couponRes.json();

      if (couponResult?.data === null || couponResult.error) {
        throw new Error("Failed to mark coupon as used");
      }

      // Update session state
      await updateSession(sessionId, {
        state: "VEND_LOCKED",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Bean vended successfully",
      slotNo: slotNo,
      wonBean: {
        title: maxBean.title,
        grams: maxBean.grams,
        image: maxBean.image?.url || null,
      },
    });
  } catch (error) {
    console.error("[spin-vend] ERROR:", error);

    return NextResponse.json(
      { success: false, message: error?.message || "Vending Failed" },
      { status: 500 },
    );
  }
}
