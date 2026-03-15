import { saveSession } from "../../lib/session";
import { v4 as uuid } from "uuid";

export async function POST(req) {
  const { code, isSpinPage } = await req.json();
  console.log(code, isSpinPage);
  // 🔹 Fetch from Strapi
  let res;
  const apiUrl = isSpinPage
    ? `${process.env.CMSURL}api/spin-coupons?filters[code][$eq]=${code}`
    : `${process.env.CMSURL}api/coupons?filters[code][$eq]=${code}`;
  console.log('API URL:', apiUrl);
  try {
    res = await fetch(apiUrl, {
      cache: "no-store",
    });
  } catch (error) {
    console.error("Strapi fetch failed:", error);
    return Response.json(
      { success: false, message: "Service unavailable" },
      { status: 503 }
    );
  }

  const result = await res.json();
  console.log("result", result);
  const coupon = result?.data?.[0];
  console.log("coupon", coupon);
  if (!coupon || !coupon.isValidCoupon) {
    return Response.json(
      { success: false, message: "Invalid coupon" },
      { status: 403 }
    );
  }
  if (isSpinPage) {
    if (Number(coupon.gold) === 1) {
      return Response.json(
        { success: false, message: "Invalid coupon" },
        { status: 403 }
      );
    }
  }

  // 2. Create session
  const sessionId = uuid();
  console.log("sessionId", sessionId);
  await saveSession({
    sessionId,
    couponID: coupon.documentId,
    couponCode: coupon.code,
    state: "CODE_VERIFIED",
    expiresAt: Date.now() + 3 * 60 * 1000,
  });
  console.log("sessionId send");

  return Response.json({
    success: true,
    sessionId: sessionId,
    goldWeight: coupon?.gold,
  });
}
