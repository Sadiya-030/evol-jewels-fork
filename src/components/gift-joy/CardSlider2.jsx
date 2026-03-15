"use client";
import { useEffect } from "react";
import img2 from "../../../public/heart.png";
import img3 from "../../../public/RING.png";

import Link from "next/link";
import { charmsCode } from "../../store/CharmsCode/charmsCode";

const CardSlider2 = () => {
  const slides = [
    {
      id: 1,
      title: "Claim",
      url: "/home/charms/charms-code",
      desc: "Have a special code? Redeem it here to unlock your gold charm.",
      buttonLabel: "Enter Code",
      charm: img3.src,
      src: "https://ts-bucket.mum-objectstore.e2enetworks.net/Frame_1000010385_4_9af7edbaaa.png",
    },
    {
      id: 2,
      title: "Spin",
      url: "/home/charms/spin-code",
      buttonLabel: "Spin now",
      charm: img2.src,

      desc: "Try your luck — one spin could win you a gold ball.",
      src: "https://images.unsplash.com/photo-1746678223017-bd2fc129093a?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=987",
    },
  ];
  const { setCharmsSize } = charmsCode();

  useEffect(() => {
    setCharmsSize(null);
  }, []);

  return (
    <div className="w-full mt-[46px] mb-[106px]  overflow-x-auto no-scrollbar scrollbar-hide ">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[950px] h-[1100px]  rounded-full bg-white/23 blur-[50px]"></div>
      </div>
      {/* ✅ Removed w-full — allows natural overflow */}
      <div className="flex gap-[80px] px-[150px] no-scrollbar scrollbar-hide w-max">
        {slides.map((slide) => (
          <div
            key={slide.id}
            className="flex-shrink-0 transition-transform duration-300"
          >
            <div className="h-[1270px]  overflow-hidden flex justify-center items-end">
              <div className="w-[751px]">
                <div className="h-[838px] relative w-[751px] overflow-visible p-6 rounded-[72px] border-[2px] border-[#E7A758]">
                  <div className=" overflow-hidden relative text-[45px] text-center rounded-[64px] w-full h-full flex items-center justify-center">
                    <img
                      src={slide.src}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="absolute bottom-[-95px] left-0 z-50 flex items-center justify-center w-full h-fit">
                    <img src={slide.charm} alt="" className="h-[195px]" />
                  </div>

                  <div className="absolute top-[-139px] w-full z-50 flex justify-center left-0">
                    <p className="text-[144px] font-ethereal text-white tracking-[-9px] w-fit leading-[286px] text-center">
                      {slide.title}
                    </p>
                  </div>
                </div>

                <div className="h-fit  pb-6">
                  <p className="text-white mt-[110px] mx-auto mb-[36px] max-w-[441px] text-center text-[26px]">
                    {slide.desc}
                  </p>
                  <Link
                    href={slide.url}
                    className="text-[40px]  shadow-[0_0_30px_rgba(255,255,255,0.7)] font-ethereal h-[103px] max-w-[379px] mx-auto bg-white text-black flex items-center justify-center w-full rounded-[2000px]"
                  >
                    {slide?.buttonLabel}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardSlider2;
