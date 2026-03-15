"use client";
import { useLikedStore } from "../store/shortlistedProd";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const BottomSliderForProdut = ({
  isOpen,
  setisOpen,
  HeaderName,
  browseProducts,
  likedProducts,
  toggleLike,
}) => {
  const shortlisted = browseProducts.filter((p) =>
    likedProducts.includes(p?.id)
  );
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black z-[90]"
            onClick={() => setisOpen(false)}
          />

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: "40%" }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 90, damping: 18 }}
            className="fixed bottom-0  left-0 w-full h-[100%] bg-white rounded-t-[50px] shadow-[24px] z-[100] pt-[83px] px-[77px]"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <p className="text-[50px] font-medium text-black">
                {HeaderName ? HeaderName : "Edit Preferences"}
              </p>
              <button
                onClick={() => setisOpen(false)}
                className="text-black font-semibold hover:opacity-70 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="61"
                  height="61"
                  viewBox="0 0 61 61"
                  fill="none"
                >
                  <path
                    d="M47.6562 13.3438L13.3438 47.6562M47.6562 47.6562L13.3438 13.3438"
                    stroke="black"
                    strokeWidth="3.8125"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            {/* Content Area */}
            <div className="flex flex-col gap-[56px] h-[55%] mt-[50px] pb-[150px] overflow-y-scroll">
              {shortlisted?.map((d, i) => (
                <div
                  key={d?.id ?? i}
                  className="  flex gap-[40px] items-center"
                >
                  <div className=" border relative p-3 border-[#C6C2EC] rounded-[30px] h-[372px] w-[312px]">
                    <div className=" rounded-[30px] h-full w-full border border-[#E1E1E1]">
                      <img
                        src={d?.pineconeMetadata?.productImage}
                        alt=""
                        className=" h-full w-full object-cover"
                      />
                    </div>
                    <div
                      onClick={() => toggleLike(d)}
                      className=" p-3 shadow-md border  rounded-full bg-white absolute top-[-20px] right-[-20px]"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 32 32"
                        fill="none"
                      >
                        <g clipPath="url(#clip0_1584_2644)">
                          <path
                            d="M27 7H5"
                            stroke="#7C50E3"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M13 13V21"
                            stroke="#7C50E3"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M19 13V21"
                            stroke="#7C50E3"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M25 7V26C25 26.2652 24.8946 26.5196 24.7071 26.7071C24.5196 26.8946 24.2652 27 24 27H8C7.73478 27 7.48043 26.8946 7.29289 26.7071C7.10536 26.5196 7 26.2652 7 26V7"
                            stroke="#7C50E3"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M21 7V5C21 4.46957 20.7893 3.96086 20.4142 3.58579C20.0391 3.21071 19.5304 3 19 3H13C12.4696 3 11.9609 3.21071 11.5858 3.58579C11.2107 3.96086 11 4.46957 11 5V7"
                            stroke="#7C50E3"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_1584_2644">
                            <rect width="32" height="32" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    </div>
                  </div>
                  <div className=" h-fit  flex justify-center flex-col">
                    <h2 className=" text-[30px] text-[#302B2C] ">
                      {d?.pineconeMetadata?.productHandle}
                    </h2>
                    <p className=" mt-3.5 mb-[91px] text-[28px] text-[#000]">
                      ₹ {d?.pineconeMetadata?.productPrice}
                    </p>
                    <div className=" flex items-center gap-[24px]">
                      {HeaderName === "Disliked products" && (
                        <button className=" text-[26px] rounded-[200px] border px-[32px] h-[78px] flex items-center justify-center text-[#002066]">
                          Reconsider
                        </button>
                      )}
                      <Link
                        href={`/products/browse/${d?.pineconeMetadata?.productHandle}`}
                        className=" text-[26px] rounded-[200px] border px-[32px] h-[78px] flex items-center justify-center text-[#002066]"
                      >
                        View Details
                      </Link>
                      {HeaderName === "Liked products" && (
                        <button className=" rounded-[200px] text-[26px] border px-[32px] h-[78px] flex items-center justify-center text-[#002066]">
                          Add to Gift Tray
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BottomSliderForProdut;
