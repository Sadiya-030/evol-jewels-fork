"use client";
import { shortlistedBirthstoneProd } from "./../../store/birthstone/shortlistedBirthstoneProd";
import Link from "next/link";
import React from "react";

const ProductCardV2 = ({ data }) => {
  const { likedProducts, toggleLike } = shortlistedBirthstoneProd();
  return (
    <Link
      href={`/home/birthstone/your-birthstone/browse/${data?.pineconeMetadata?.productHandle}`}
      className=" w-fit"
    >
      <div className=" relative w-[377px] border p-3 h-[377px] border-[#C6C2EC] rounded-[30px]">
        <div className=" border bg-white w-full h-full rounded-[30px] flex flex-col items-center justify-center p-4">
          <img
            src={data?.pineconeMetadata?.productImage}
            alt=""
            className=" h-full brightness-110 contrast-120  mix-blend-multiply w-auto object-cover mx-auto "
          />
        </div>
        <div className=" absolute top-[40px] right-[40px]">
          <svg
            onClick={(e) => {
              e.preventDefault(); // Prevent Link navigation
              e.stopPropagation(); // Stop event bubbling
              toggleLike(data);
            }}
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="26"
            viewBox="0 0 30 26"
            fill={likedProducts.includes(data?.id) ? "red" : "none"}
          >
            <path
              d="M14.7665 24.6103L26.9837 12.2181C28.2659 10.9359 28.9862 9.19696 28.9862 7.38371C28.9862 5.57047 28.2659 3.83149 26.9837 2.54934C25.7016 1.26718 23.9626 0.546875 22.1493 0.546875C20.3361 0.546875 18.5971 1.26718 17.315 2.54934L14.7665 4.92278L12.2181 2.54934C10.9359 1.26718 9.19696 0.546875 7.38371 0.546875C5.57047 0.546875 3.83149 1.26718 2.54934 2.54934C1.26718 3.83149 0.546875 5.57047 0.546875 7.38371C0.546875 9.19696 1.26718 10.9359 2.54934 12.2181L14.7665 24.6103Z"
              stroke="#302B2C"
              strokeWidth="1.09375"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      <div className=" flex flex-col mt-[38px] gap-1">
        <p className=" max-w-[301px] text-[26px] font-ethereal leading-[42px] text-[#302B2C]">
          {data?.pineconeMetadata?.productTitle}
        </p>
        <p className=" text-[28px] leading-[76px] font-hind font-medium text-[#302B2C]">
          ₹ {data?.pineconeMetadata?.productPrice}
        </p>
      </div>
    </Link>
  );
};

export default ProductCardV2;
