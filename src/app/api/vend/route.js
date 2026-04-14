import { getSession, updateSession } from "../../lib/session";
import { NextResponse } from "next/server";

const getStrapiHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { weight, name, sessionId, spinFlow, spinFail } = body;
    const session = await getSession(sessionId);
    console.log(session);

    if (!session || session.state !== "CODE_VERIFIED") {
      return Response.json(
        { success: false, error: "Invalid vend attempt" },
        { status: 403 },
      );
    }

    if (spinFail) {
      const apiURL = spinFlow
        ? `${process.env.CMSURL}/api/spin-coupons/${session.couponID}`
        : `${process.env.CMSURL}/api/coupons/${session.couponID}`;

      const charmsValidRes = await fetch(apiURL, {
        method: "PUT",
        headers: getStrapiHeaders(),
        body: JSON.stringify({
          data: {
            isValidCoupon: false,
          },
        }),
      });
      const charmsValidResult = await charmsValidRes.json();

      if (charmsValidResult?.data === null || charmsValidResult.error) {
        throw new Error("Invalid Beans");
      }

      await updateSession(sessionId, {
        state: "VEND_LOCKED",
      });

      return NextResponse.json({
        success: true,
        message: "Spin successfully used",
        // espResponse: espText,
      });
    } else {
      // 1️⃣ Fetch slot data from CMS
      const fetchSlotRes = await fetch(
        `${process.env.CMSURL}/api/charms?filters[title][$eq]=${name}&filters[grams][$eq]=${weight}`,
        { headers: getStrapiHeaders() },
      );

      // ❌ If CMS API fails
      if (!fetchSlotRes.ok) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Sorry, Service Unavailable. We are Trying to Get it Back Up!",
          },
          { status: 400 },
        );
      }

      const slotResData = await fetchSlotRes.json();
      const charmsList = slotResData?.data || [];

      // ❌ No charms found at all
      if (charmsList.length === 0) {
        return NextResponse.json(
          { success: false, message: "Beans not found" },
          { status: 404 },
        );
      }

      // ✅ Find first charm with inventory > 0
      const availableCharm = charmsList.find(
        (item) => Number(item.inventory) > 0,
      );

      // ❌ All inventories are 0
      if (!availableCharm) {
        return NextResponse.json(
          {
            success: false,
            charmsNotfound: true,
            error: `${name} (${weight}g) is not available`,
          },
          { status: 404 },
        );
      }

      const slotNo = availableCharm.slotNo;
      const charmId = availableCharm.documentId;

      // Call vending machine FIRST (ESP32 or Simulator)
      const vendingUrl = process.env.VENDING_URL || "http://localhost:8080";
      let vendingMachineError = false;

      try {
        console.log(
          `[VEND] Calling vending machine at ${vendingUrl}/vend with slot ${slotNo}`,
        );
        const vendResponse = await fetch(`${vendingUrl}/vend`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slot: Number(slotNo), command: "VEND" }),
        });
        const vendResult = await vendResponse.json();
        console.log("[VEND] Vending machine response:", vendResult);

        if (!vendResponse.ok) {
          console.error("[VEND] Vending machine error:", vendResult);
          vendingMachineError = true;
        }
      } catch (vendError) {
        console.error(
          "[VEND] Failed to call vending machine:",
          vendError.message,
        );
        vendingMachineError = true;
      }

      // If vending machine had issues, return error WITHOUT invalidating coupon
      if (vendingMachineError) {
        return NextResponse.json(
          {
            success: false,
            vendingMachineError: true,
            message: "Contact the Store Staff!",
            slotNo: slotNo,
          },
          { status: 503 },
        );
      }

      // ✅ Vending successful - NOW decrement inventory and invalidate coupon
      await fetch(`${process.env.CMSURL}/api/charms/${charmId}`, {
        method: "PUT",
        headers: getStrapiHeaders(),
        body: JSON.stringify({
          data: {
            inventory: Number(availableCharm.inventory) - 1,
          },
        }),
      });

      const apiURL = spinFlow
        ? `${process.env.CMSURL}/api/spin-coupons/${session.couponID}`
        : `${process.env.CMSURL}/api/coupons/${session.couponID}`;

      const charmsValidRes = await fetch(apiURL, {
        method: "PUT",
        headers: getStrapiHeaders(),
        body: JSON.stringify({
          data: {
            isValidCoupon: false,
          },
        }),
      });
      const charmsValidResult = await charmsValidRes.json();
      console.log("charmsValidResult", charmsValidResult);
      if (charmsValidResult?.data === null || charmsValidResult.error) {
        throw new Error("Invalid Beans");
      }
      await updateSession(sessionId, {
        state: "VEND_LOCKED",
      });

      return NextResponse.json({
        success: true,
        message: "Beans vend successfully",
        slotNo: slotNo,
      });
    }
  } catch (error) {
    console.error("VEND ERROR:", error);

    return NextResponse.json(
      { success: false, message: error?.message || "Vending Failed" },
      { status: 500 },
    );
  }
}
