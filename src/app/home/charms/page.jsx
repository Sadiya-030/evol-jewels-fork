import SmartPick from "../../../components/gift-joy/SmartPick";
import CardSlider2 from "../../../components/gift-joy/CardSlider2";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div className=" relative  w-full h-screen">
      <div className=" w-full h-screen z-0 absolute top-0 left-0">
        <div className="  absolute h-full w-full top-0 left-0 z-10 bg-blue-950/85"></div>
      </div>
      <div className=" relative    z-50">
        <div className=" h-[103px]  bg-gray-100/10  flex justify-between items-center px-[50px] w-full ">
          <p className=" text-white text-[30px]">Beans</p>
          <Link
            href="/home"
            className="border-[2.207px]  border-[#ffffffc8] rounded-md h-fit w-fit grid place-content-center"
          >
            <p className="  text-xl text-white  px-3 py-2 grid place-content-center">
              Home
            </p>
          </Link>
        </div>
        <p className="font-hind mb-[80px] mt-[76px]  text-white backdrop-blur-3xl rounded-[2000px] mx-auto flex items-center justify-center gap-[18px] text-2xl w-fit border min-h-[83px] px-[68px] border-[#FFFFFF54]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="35"
            height="35"
            viewBox="0 0 33 33"
            fill="none"
          >
            <g clipPath="url(#clip0)">
              <path
                d="M16.5 28.875C23.3345 28.875 28.875 23.3345 28.875 16.5C28.875 9.66548 23.3345 4.125 16.5 4.125C9.66548 4.125 4.125 9.66548 4.125 16.5C4.125 23.3345 9.66548 28.875 16.5 28.875Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M15.4688 15.4688C15.7423 15.4688 16.0046 15.5774 16.198 15.7708C16.3914 15.9642 16.5 16.2265 16.5 16.5V21.6562C16.5 21.9298 16.6086 22.1921 16.802 22.3855C16.9954 22.5789 17.2577 22.6875 17.5312 22.6875"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M15.9844 12.375C16.8387 12.375 17.5312 11.6824 17.5312 10.8281C17.5312 9.97381 16.8387 9.28125 15.9844 9.28125C15.1301 9.28125 14.4375 9.97381 14.4375 10.8281C14.4375 11.6824 15.1301 12.375 15.9844 12.375Z"
                fill="white"
              />
            </g>
            <defs>
              <clipPath id="clip0">
                <rect width="33" height="33" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <span className=" mt-1.5">
            Select a journey and we’ll craft the perfect jewellery experience
            for you.
          </span>
        </p>
        <p className=" text-[44px] font-ethereal leading-[88px] max-w-[656px] mx-auto text-white text-center">
          Discover different ways to get your gold beans
        </p>
        <CardSlider2 />
      </div>
      <div className="absolute bottom-0 left-0 w-full h-[400px]  pointer-events-none bg-gradient-to-t from-black to-transparent"></div>
    </div>
  );
};

export default page;
