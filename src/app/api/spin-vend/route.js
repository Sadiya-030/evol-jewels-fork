import { getSession, updateSession } from "../../lib/session";
import { NextResponse } from "next/server";

/**
 * POST /api/spin-vend
 * Vends the max available bean (highest grams with inventory > 0) for spin wins
 * Body: { sessionId }
 */
export async function POST(req) {
  try {
    const body = await req.json();
    const { sessionId } = body;

    // Validate session
    const session = await getSession(sessionId);
    if (!session || session.state !== "CODE_VERIFIED") {
      return NextResponse.json(
        { success: false, error: "Invalid vend attempt" },
        { status: 403 }
      );
    }

    // Fetch max available bean from CMS (highest grams with inventory > 0)
    const cmsUrl = process.env.CMSURL || process.env.NEXT_PUBLIC_CMSURL;
    const charmsRes = await fetch(
      `${cmsUrl}/api/charms?filters[inventory][$gt]=0&sort=grams:desc&pagination[limit]=1&populate=image`,
      { cache: "no-store" }
    );

    if (!charmsRes.ok) {
      return NextResponse.json(
        {
          success: false,
          message: "Sorry, service unavailable. We are trying to get it back up!",
        },
        { status: 500 }
      );
    }

    const charmsData = await charmsRes.json();
    const charmsList = charmsData?.data || [];

    // No beans available
    if (charmsList.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No beans available in inventory",
        },
        { status: 404 }
      );
    }

    const maxBean = charmsList[0];
    const slotNo = maxBean.slotNo;
    const beanId = maxBean.documentId;

    console.log(
      `[spin-vend] Vending max available bean: ${maxBean.title} (${maxBean.grams}g) from slot ${slotNo}`
    );

    // Decrement inventory count
    await fetch(`${cmsUrl}/api/charms/${beanId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          inventory: Number(maxBean.inventory) - 1,
        },
      }),
    });

    // Mark spin coupon as used
    const apiURL = `${cmsUrl}/api/spin-coupons/${session.couponID}`;
    const couponRes = await fetch(apiURL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
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

    // Call vending machine (ESP32 or Simulator)
    const vendingUrl = process.env.VENDING_URL || "http://localhost:8080";
    try {
      console.log(
        `[spin-vend] Calling vending machine at ${vendingUrl}/vend with slot ${slotNo}`
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
      }
    } catch (vendError) {
      console.error(
        "[spin-vend] Failed to call vending machine:",
        vendError.message
      );
      // Don't fail the request if vending machine is unreachable - just log it
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
      { status: 500 }
    );
  }
}
