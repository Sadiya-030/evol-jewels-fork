"use client";
import React, { useState } from "react";
import img1 from "../../../../../../public/close.svg";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css"; // base styles
import img12 from "../../../../../../public/shadow.png";
import Link from "next/link";
import template from "../../../../../../public/template.png";
const CenterFocusSlider = () => {
  const slides = [
    {
      id: 1,
      title: "Radiant Wishes",
      subtitle: "Warm & bright",
      img: template?.src,
    },
    {
      id: 2,
      title: "Minimal Bliss",
      subtitle: "Calm & clean",
      img: template?.src,
    },
    {
      id: 3,
      title: "Gift Joy",
      subtitle: "Playful & bold",
      img: template?.src,
    },
    {
      id: 4,
      title: "Soft Aura",
      subtitle: "Dreamy gradients",
      img: template?.src,
    },
    {
      id: 5,
      title: "Golden Hour",
      subtitle: "Warm evenings",
      img: template?.src,
    },
  ];

  const [activeIndex, setActiveIndex] = useState(3); // start with middle one
  const [swiper, setSwiper] = useState(null);
  React.useEffect(() => {
    if (swiper) {
      swiper.update();
      window.dispatchEvent(new Event("resize")); // ✅ triggers Swiper’s resize recalculation
    }
  }, [swiper]);

  return (
    <div className="w-full flex items-center h-full max-w-[1600px]">
      <Swiper
        onSwiper={(s) => {
          setSwiper(s);
          s.slideTo(2, 0); // start at middle
          setTimeout(() => {
            s.update(); // ✅ force Swiper to recalc sizes and centering
          }, 100); // slight delay ensures DOM fully rendered
        }}
        initialSlide={2} // 3rd slide active by default
        centeredSlides
        centeredSlidesBounds // fixes edge centering math
        slidesPerView="auto"
        spaceBetween="10px"
        loop={false}
        slideToClickedSlide
        slidesOffsetBefore={50} // equal peek on both sides
        slidesOffsetAfter={50}
        onSlideChange={(s) => setActiveIndex(s.realIndex)}
        className="   !py-10 "
      >
        {slides.map((item, i) => {
          const isActive = i === activeIndex;
          const distance = Math.abs(activeIndex - i); // 0 for center, 1 for neighbors…

          // scale & elevation based on distance
          const scale =
            distance === 0
              ? "scale-100"
              : distance === 1
              ? "scale-90"
              : "scale-75";
          const lift =
            distance === 0
              ? "-translate-y-6"
              : distance === 1
              ? "-translate-y-2"
              : "translate-y-0";
          const opacity = distance === 0 ? "opacity-100" : "opacity-70";

          return (
            <SwiperSlide
              key={item.id}
              className=" !w-fit   !flex !items-center !justify-center h-full pt-1"
              onClick={() => swiper?.slideTo(i)}
            >
              <div
                className={[
                  "relative transition-all    p-5 duration-500 ease-out",
                  "mx-auto will-change-transform",
                  scale,
                  lift,
                ].join(" ")}
                style={{ width: isActive ? 770 : 600 }} // center bigger
              >
                {/* Card frame */}
                <div
                  className={[
                    "rounded-[48px]  ",
                    "transition-shadow p-2 duration-500",
                    isActive ? " border-white/40" : " border-white/20",
                  ].join(" ")}
                >
                  {/* Image */}
                  <div className="relative h-[900px] rounded-[48px]  border-black p-4 border-2 w-full">
                    <div className=" h-full w-full rounded-[48px] relative  border-black border-2">
                      <img
                        src={item.img}
                        alt={item.title}
                        className={[
                          "absolute inset-0 h-full w-full rounded-[48px] object-cover",
                          "transition-all duration-500",
                          opacity,
                        ].join(" ")}
                      />
                    </div>
                    <div className=" absolute bottom-[-100px] h-[270px] w-full text-center  left-0">
                      <div className=" relative">
                        <div className=" h-full w-full">
                          <img
                            src={img12.src}
                            alt=""
                            className=" h-full w-full scale-115"
                          />
                        </div>
                        <div className=" w-full h-full flex items-center justify-center  absolute top-0 left-0">
                          <h2 className=" font-ethereal max-w-[300px] text-[80px] text-black">
                            {" "}
                            Minimal & Chic
                          </h2>
                        </div>
                      </div>
                    </div>
                    {/* vignette */}
                    {/* <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/30 to-transparent" /> */}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};
const page = () => {
  const str = window.location.href;
  const parts = str.split("/").filter(Boolean); // ["sdf", "sdfs", "sdfsf", "sdfsdf"]
  const secondLast = parts[parts.length - 3];
  return (
    <div className=" relative">
      <div className=" w-full h-screen z-0 absolute top-0 left-0">
        <video
          src="https://ts-bucket.mum-objectstore.e2enetworks.net/7946210_hd_720_1366_30fps_3_c58042e06d.mp4"
          loop
          autoPlay
          muted
          className=" w-full h-full object-cover"
        ></video>
        <div className=" absolute top-0 left-0 h-screen z-[1] w-full bg-white/80"></div>
      </div>
      <div className="min-h-screen h-full w-full  relative z-50 bg-white/70">
        <div className=" h-[137px] border-b border-[#CECECE] w-full flex items-center justify-between px-[50px]">
          <p className=" text-4xl  text-black">Gift a Moment</p>
          <button className=" bg-white border h-[63px] w-[63px] rounded-full grid place-content-center">
            <img
              src={img1.src}
              alt=""
              className=" h-[23px] object-cover w-[23px]"
            />
          </button>
        </div>
        <p className="mx-[100px] my-[78px]  rounded-[2000px] text-[22px] font-medium text-[#7C50E3] w-[calc(100vw-200px)] flex items-center justify-center gap-6 h-[66px] border border-[#7C50E336] bg-[#7C50E30A]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="33"
            height="33"
            viewBox="0 0 33 33"
            fill="none"
          >
            <g clipPath="url(#clip0_1625_1706)">
              <path
                d="M16.5 28.875C23.3345 28.875 28.875 23.3345 28.875 16.5C28.875 9.66548 23.3345 4.125 16.5 4.125C9.66548 4.125 4.125 9.66548 4.125 16.5C4.125 23.3345 9.66548 28.875 16.5 28.875Z"
                stroke="#7C50E3"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M15.4688 15.4688C15.7423 15.4688 16.0046 15.5774 16.198 15.7708C16.3914 15.9642 16.5 16.2265 16.5 16.5V21.6562C16.5 21.9298 16.6086 22.1921 16.802 22.3855C16.9954 22.5789 17.2577 22.6875 17.5312 22.6875"
                stroke="#7C50E3"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M15.9844 12.375C16.8387 12.375 17.5312 11.6824 17.5312 10.8281C17.5312 9.97381 16.8387 9.28125 15.9844 9.28125C15.1301 9.28125 14.4375 9.97381 14.4375 10.8281C14.4375 11.6824 15.1301 12.375 15.9844 12.375Z"
                fill="#7C50E3"
              />
            </g>
            <defs>
              <clipPath id="clip0_1625_1706">
                <rect width="33" height="33" fill="white" />
              </clipPath>
            </defs>
          </svg>
          Tap a piece to view details or add it to your shortlist
        </p>
        <p className=" mx-auto max-w-[588px] font-ethereal text-center text-[48px] leading-[80px] text-[#302B2C]">
          Which template feels just right for your gift?
        </p>
        <div className=" h-[1100px] ">
          {/* Slider */} <CenterFocusSlider />
        </div>
        <div className=" px-[100px]  h-[260px] flex items-center">
          <Link
            href={`/products/${secondLast}/print-greeting`}
            className="px-10 py-4  font-ethereal flex items-center justify-center  text-[40px] leading-[72px] h-[103px] w-full rounded-[2000px] bg-[#002066] text-white text-2xl font-semibold"
          >
            Choose the greeting{" "}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default page;
