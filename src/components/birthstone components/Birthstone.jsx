import Link from "next/link";
import React from "react";
import AstroQueForm from "./AstroQueForm";

const Birthstone = () => {
  return (
    <div className=" relative  w-full h-screen">
      <div className=" w-full h-screen z-0 absolute top-0 left-0">
        <video
          src="https://ts-bucket.mum-objectstore.e2enetworks.net/evol_4b2a7deae5.mp4"
          loop
          autoPlay
          muted
          className=" w-full h-full object-cover"
        ></video>
        <div className="  absolute h-full w-full top-0 left-0 z-10 bg-blue-950/70"></div>
      </div>
      <div className=" relative z-50">
        <div className=" h-[103px]  bg-gray-100/10  flex justify-between items-center px-[50px] w-full ">
          <p className=" text-white text-[30px]">Star Gem</p>
          <Link
            href="/home"
            className="rounded-md border-[2.207px] text-xl text-white border-[#f9f9f966] px-3 py-2 grid place-content-center"
          >
            Home
          </Link>
        </div>
        <div className="  w-full">
          <AstroQueForm />
        </div>
      </div>
    </div>
  );
};

export default Birthstone;
