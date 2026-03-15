import { NextResponse } from "next/server";
import redis from "../../lib/redis";

export async function POST(req) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, message: "Email and OTP required" },
        { status: 400 }
      );
    }

    const storedOtp = await redis.get(`otp:${email}`);

    if (!storedOtp) {
      return NextResponse.json(
        { success: false, message: "OTP expired or not found" },
        { status: 400 }
      );
    }

    if (storedOtp !== otp) {
      return NextResponse.json(
        { success: false, message: "Invalid OTP" },
        { status: 400 }
      );
    }

    await redis.del(`otp:${email}`);

    return NextResponse.json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json(
      { success: false, message: "Verification failed" },
      { status: 500 }
    );
  }
}
