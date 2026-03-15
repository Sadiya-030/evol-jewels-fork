import React from "react";
import Diamond from "../../public/diamond.gif";
const LoadingProd = () => {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-gray-900/70 backdrop-blur-xs transition-opacity"></div>

      {/* Modal Box */}
      <div className="relative  bg-white rounded-[24px] h-fit w-[940px] z-10 py-[95px]  shadow-xl flex flex-col items-center justify-center">
        <div className="  h-[161px]  overflow-hidden w-[161px] rounded-full mb-[70px] bg-[#E2CDF4]">
          <img src={Diamond.src} alt="" className="  mx-auto mt-[-10px]" />
        </div>
        <p className="text-[56px] text-center font-ethereal leading-[64px] text-[#002066]">
          Finding the perfect <br /> piece for you…
        </p>
        <p className=" text-[26px] mt-[29px]  leading-[42px] mb-2 max-w-[664px] mx-auto text-center text-black">
          Shaping your sparkle, one detail at a time.
        </p>
      </div>
    </div>
  );
};

export default LoadingProd;
