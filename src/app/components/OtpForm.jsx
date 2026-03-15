"use client";
import { useState } from "react";

export default function OtpForm() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");

  const sendOtp = async () => {
    setMessage("Sending．．．");
    const res = await fetch("/api/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setMessage(data.message);
    if (data.success) setStep(2);
  };

  const verifyOtp = async () => {
    setMessage("Verifying．．．");
    const res = await fetch("/api/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });
    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <div className="flex flex-col gap-4 max-w-sm mx-auto mt-10 border p-6 rounded-lg shadow-sm">
      {step === 1 && (
        <>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded"
          />
          <button
            onClick={sendOtp}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Send OTP
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="border p-2 rounded"
          />
          <button
            onClick={verifyOtp}
            className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
          >
            Verify OTP
          </button>
        </>
      )}

      <p className="text-gray-700 text-center">{message}</p>
    </div>
  );
}
