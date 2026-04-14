"use client";
import React from "react";
import Link from "next/link";
import { RefreshCw, AlertCircle } from "lucide-react";

const ServiceError = ({ onRetry, homeLink = "/home" }) => {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center">
      {/* Background */}
      <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm"></div>

      {/* Modal */}
      <div className="relative bg-white rounded-[32px] w-[90%] max-w-[800px] z-10 py-[80px] px-[60px] shadow-2xl flex flex-col items-center justify-center">
        {/* Icon */}
        <div className="w-[120px] h-[120px] rounded-full bg-red-100 flex items-center justify-center mb-8">
          <AlertCircle size={60} className="text-red-600" />
        </div>

        {/* Title */}
        <h2 className="text-[42px] font-ethereal text-center text-gray-800 mb-4">
          Sorry, Service Unavailable
        </h2>

        {/* Subtitle */}
        <p className="text-[24px] text-center text-gray-500 mb-12 max-w-[500px]">
          We are Trying to Get it Back Up!
          <br />
          Please Try Again Later.
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-4 w-full max-w-[400px]">
          {onRetry && (
            <button
              onClick={onRetry}
              className="flex items-center justify-center gap-3 w-full h-[80px] bg-[#002066] text-white rounded-full text-[26px] font-medium hover:bg-[#001a52] transition-colors"
            >
              <RefreshCw size={28} />
              Try Again
            </button>
          )}
          <Link
            href={homeLink}
            className="flex items-center justify-center w-full h-[80px] border-2 border-gray-300 text-gray-700 rounded-full text-[26px] font-medium hover:bg-gray-50 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServiceError;
