import { NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";
import redis from "../../lib/redis";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
console.log(process.env.SENDGRID_API_KEY, "process.env.SENDGRID_API_KEY");

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email required" },
        { status: 400 }
      );
    }

    const sentCountKey = `otp_count:${email}`;
    const sentCount = await redis.get(sentCountKey);
    // if (sentCount && parseInt(sentCount) >= 3) {
    //   return NextResponse.json(
    //     {
    //       success: false,
    //       message: "Too many OTP requests. Try again later.",
    //     },
    //     { status: 429 }
    //   );
    // }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await redis.setex(`otp:${email}`, 300, otp);

    await redis.multi().incr(sentCountKey).expire(sentCountKey, 3600).exec();

    const msg = {
      to: email,
      from: process.env.FROM_EMAIL,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
      html: `<h2>Your OTP is <strong>${otp}</strong></h2><p>It expires in 5 minutes.</p>`,
    };
    

    await sgMail.send(msg);
    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send OTP" },
      { status: 500 }
    );
  }
}
