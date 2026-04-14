"use client";
import React from "react";

const PriceSlider = ({ price, setPrice, noBudgetSelected, onPriceInteraction }) => {
  // Premium milestone bubbles
  const milestones = [
    { value: 25000, label: "25k", display: "₹25k" },
    { value: 50000, label: "50k", display: "₹50k" },
    { value: 100000, label: "1L", display: "₹1 Lakh" },
    { value: 250000, label: "2.5L", display: "₹2.5 Lakh" },
    { value: 500000, label: "5L", display: "₹5 Lakh" },
    { value: 1000000, label: "10L", display: "₹10 Lakh" },
  ];

  const handleMilestoneClick = (value) => {
    if (onPriceInteraction) onPriceInteraction();
    setPrice(value);
  };

  const handleSliderChange = (e) => {
    if (onPriceInteraction) onPriceInteraction();
    setPrice(Number(e.target.value));
  };

  return (
    <div className="w-full">
      {/* Milestone Bubbles Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {milestones.map((milestone) => {
          const isSelected = !noBudgetSelected && price === milestone.value;

          return (
            <button
              key={milestone.value}
              onClick={() => handleMilestoneClick(milestone.value)}
              className={`relative h-[110px] rounded-[20px] border-2 transition-all duration-300 ${
                isSelected
                  ? "bg-white border-white shadow-[0_0_40px_rgba(255,255,255,0.8)] scale-105"
                  : "bg-white/10 border-white/30 hover:bg-white/20 hover:border-white/50 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]"
              }`}
            >
              <div className="flex flex-col items-center justify-center h-full">
                <p
                  className={`font-ethereal text-[40px] leading-none mb-2 transition-colors ${
                    isSelected ? "text-[#002066]" : "text-white"
                  }`}
                >
                  {milestone.display}
                </p>
                {isSelected && (
                  <div className="absolute -top-2 -right-2 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M13.3334 4L6.00002 11.3333L2.66669 8"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Fine-tune Slider */}
      <div className="bg-white/5 rounded-2xl p-4 border border-white/20">
        <div className="relative w-full px-4">
          {/* Slider Track */}
          <div className="relative h-3 bg-white/20 rounded-full overflow-hidden">
            {/* Filled Track */}
            {!noBudgetSelected && (
              <div
                className="absolute h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full transition-all duration-200"
                style={{ width: `${(price / 1000000) * 100}%` }}
              />
            )}

            {/* Slider Input */}
            <input
              type="range"
              min="0"
              max="1000000"
              step="5000"
              value={noBudgetSelected ? 0 : price}
              onChange={handleSliderChange}
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-10"
            />

            {/* Slider Thumb */}
            {!noBudgetSelected && (
              <div
                className="absolute top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg border-4 border-blue-500 pointer-events-none transition-all duration-200"
                style={{ left: `calc(${(price / 1000000) * 100}% - 16px)` }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Range Labels */}
      <div className="flex justify-between mt-3 px-4">
        <span className="text-white/60 text-3xl font-hind">₹0</span>
        <span className="text-white/60 text-3xl font-hind">₹10 Lakh</span>
      </div>
    </div>
  );
};

export default PriceSlider;
