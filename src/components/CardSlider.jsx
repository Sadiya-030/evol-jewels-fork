"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/free-mode";
import img2 from "../../public/bow.png";
import { useState } from "react";
import { useRouter } from "next/navigation";
import gemstone from "../../public/gemstone.jpg";
import charms1 from "../../public/charmsicons1.png";
import charms2 from "../../public/charmsicons2.png";
import charms3 from "../../public/charmsicons3.png";
const CardSlider = () => {
  const router = useRouter();
  const slides = [
    {
      id: 1,
      title: "Gift Joy",
      url: "/home/gift-joy",
      description: "This is card 1 description",
      stone: img2.src,
      src: "/giftjoy.png",
    },
    {
      id: 2,
      title: "Charms",
      url: "/home/charms",
      description: "This is card 2 description",
      stone: charms1.src,

      src: "/charms.png",
    },
    {
      id: 3,
      title: "Your Birthstone",
      url: "/home/birthstone",
      description: "Find the perfect star gem to match your occasion.",
      stone: charms3.src,
      src: gemstone.src,
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [swiperInst, setSwiperInst] = useState(null);
  return (
    <div className="w-full h-[1563px] mt-10     overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[900px] h-[1150px] rounded-full bg-white/20 blur-[50px]"></div>
      </div>

      <Swiper
        centeredSlides={true} // ⬅️ left-align active slide
        slidesPerView="auto"
        spaceBetween={74}
        loop={false}
        slideToClickedSlide={true} // 👈 enables click-to-activate
        autoplay={{ delay: 2000, disableOnInteraction: false }}
        onSlideChangeTransitionStart={(swiper) =>
          setActiveIndex(swiper.realIndex)
        }
        className="h-fit   mt-4"
      >
        {slides.map((slide, index) => {
          const isActive = index === activeIndex;

          const handleCardClick = () => {
            if (isActive) {
              router.push(slide.url);
            }
          };

          return (
            <SwiperSlide
              key={slide.id}
              className="!w-auto  !flex !justify-center !items-baseline transition-transform duration-300"
            >
              <div className="h-[1350px]   flex justify-center items-end w-full">
                <div className="w-[776px] h-fit">
                  <div
                    onClick={handleCardClick}
                    className={`${
                      isActive ? "h-[926px] cursor-pointer" : "h-[600px]"
                    } transition-all duration-1000 ease-in-out relative w-[776px] overflow-visible p-[18px] rounded-[55px] border-[2px] border-[#BE996A]`}
                  >
                    <div className=" overflow-hidden relative text-[45px] text-center  rounded-[50px]  w-full h-full flex items-center justify-center">
                      <div className="absolute bottom-0 left-0 z-50 flex items-center justify-center w-full h-full">
                        <img
                          src={slide.src}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>

                    <div className="absolute bottom-[-95px] left-0 z-[9999] flex items-center justify-center w-full h-fit">
                      <div className="relative flex items-center justify-center">
                        {/* Gold glow */}
                        <div className="absolute w-[220px] h-[220px] rounded-full bg-yellow-400/30 blur-3xl"></div>

                        {/* Image */}
                        <img
                          src={slide.stone}
                          alt=""
                          className="relative h-[195px]"
                        />
                      </div>{" "}
                    </div>

                    <div className="absolute top-[-100px]  w-full z-50 flex justify-center left-0">
                      <p className="text-[200px] font-ethereal text-white tracking-[-9px] w-fit leading-[206px] text-center">
                        {slide?.title}
                      </p>
                    </div>
                  </div>

                  <div className="h-[200px] relative transition-all duration-1000 ease-in-out">
                    <div
                      className={`${
                        isActive
                          ? "bottom-0 opacity-100"
                          : "bottom-[-100px] opacity-0"
                      } absolute left-0 w-full h-fit transition-all pb-6 px-4 duration-1000 ease-in-out`}
                    >
                      <p className="text-white mt-[134px] text-center text-[28px]">
                        Tap to Explore
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
      <div className="flex no-scrollbar relative gap-4 mt-[0px] h-fit py-[103px]   items-center justify-center">
        {slides.map((_, i) => {
          const isActive = i === activeIndex;
          return (
            <button
              key={i}
              onClick={() => swiperInst?.slideTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-4 rounded-full transition-all duration-300 ${
                isActive ? "w-10 opacity-100" : "w-4 opacity-50"
              } bg-white`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CardSlider;
