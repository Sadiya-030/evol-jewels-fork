"use client";
import React, { useState } from "react";

const PriceSlider = ({ price, setPrice }) => {
  //   const [price, setPrice] = useState(0);

  return (
    <div className="w-full relative rounded-lg bg-[#0020664b]  mx-auto p-4 border border-[#EBEBEB33] h-[180px] flex items-center justify-center">
      <input
        type="range"
        min="0"
        max="1000000"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
        className="w-full z-[55] cursor-pointer bg-white relative h-[5px] slider"
      />

      {/* Labels */}
      <div className="flex absolute top-0 left-0 w-full h-full justify-between mt-22 p-4  text-2xl font-medium">
        <span className="text-white">₹ 0</span>
        <span className="text-white">10 Lakh</span>
      </div>
    </div>
  );
};

export default PriceSlider;
