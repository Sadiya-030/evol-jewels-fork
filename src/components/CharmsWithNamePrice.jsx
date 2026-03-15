"use client";
import React, { useMemo } from "react";
import charms2 from "../../public/charmsicons2.png";

const COLORS = [
  "bg-yellow-200",
  "bg-red-200",
  "bg-gray-200",
  "bg-green-200",
  "bg-blue-200",
  "bg-purple-200",
];

const CharmsWithNamePrice = ({ size = 390, data }) => {
  const sizess = data.weight == 0.5 ? 330 : 390;
  // ✅ pick once per component instance
  const randomBg = useMemo(() => {
    return COLORS[Math.floor(Math.random() * COLORS.length)];
  }, []);
  return (
    <div
      style={{ height: sizess, width: sizess }}
      className="overflow-hidden border border-black p-3 rounded-full"
    >
      <div className="rounded-full h-full border overflow-hidden border-black flex flex-col w-full">
        <div className={`flex flex-col ${randomBg} rounded-full h-full w-full`}>
          <div className="w-full h-[65%] overflow-hidden rounded-full mt-[20px] p-12">
            <img
              src={data?.image}
              alt={data?.title}
              draggable={false}
              className="h-full w-full scale-125 object-contain pointer-events-none"
            />
          </div>

          <div className="h-[40%] mt-[-40px]">
            <p className="font-ethereal text-[42px] text-[#302B2C] leading-[80px] text-center">
              {data?.title}
            </p>
            <p className="font-ethereal text-center text-black text-[26px]">
              {data?.weight} g
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharmsWithNamePrice;
