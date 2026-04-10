export const markCouponAsUsed = async (
  matchedCoupon,
  spinFlow = false,
  weight,
  charmName,
  sessionId
) => {
  try {
    const vendRes = await fetch("/api/vend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        weight: weight,
        name: charmName,
        sessionId: sessionId,
        spinFlow: spinFlow,
      }),
    });

    const vendResult = await vendRes.json();
    if (vendResult?.success === false || vendResult.charmsNotfound) {
      return vendResult;
    }
    const espResponse = await fetch("http://EVOLVendingMachine.local/vend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        command: "VEND",
        slot: vendResult?.slotNo,
      }),
    });

    if (!espResponse.ok) {
      throw new Error("Sorry, service unavailable. We are trying to get it back up!");
    }

    const espText = await espResponse.text();

    return vendResult;
  } catch (error) {
    console.error("markCouponAsUsed error:", error);
    return {
      error: error.message || "markCouponAsUsed failed",
      sucess: false,
    };
  }
};

export const markSpinCouponAsUsed = async (sessionID) => {
  try {
    // 1️⃣ Update coupon in Strapi (set false)
    const vendRes = await fetch("/api/vend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sessionId: sessionID,
        spinFlow: true,
        spinFail: true,
      }),
    });

    if (!vendRes.ok) {
      throw new Error("Failed to update coupon");
    }

    const result = await vendRes.json();

    // ✅ Vend success → do nothing
    return result;
  } catch (error) {
    console.error("markCouponAsUsed error:", error);
    // throw error;
    return {
      error: error.message || "markCouponAsUsed failed",
      sucess: false,
    };
  }
};
