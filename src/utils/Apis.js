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

    // Check for errors from the server
    if (vendResult?.success === false || vendResult.charmsNotfound) {
      return vendResult;
    }

    // Server already handles vending machine communication via /api/vend
    return vendResult;
  } catch (error) {
    console.error("markCouponAsUsed error:", error);
    return {
      error:
        "Unable to process your request. Please contact store staff for assistance.",
      success: false,
    };
  }
};

export const markSpinCouponAsUsed = async (sessionID) => {
  try {
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
    return result;
  } catch (error) {
    console.error("markSpinCouponAsUsed error:", error);
    return {
      error:
        "Unable to process your request. Please contact store staff for assistance.",
      success: false,
    };
  }
};
