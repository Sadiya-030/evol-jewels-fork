"use client";
import { useEffect, useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/free-mode";
import img2 from "../../../public/heart.png";
import img3 from "../../../public/RING.png";

import { useRouter } from "next/navigation";
import { charmsCode } from "../../store/CharmsCode/charmsCode";

const CardSlider2 = () => {
  const scrollContainerRef = useRef(null);
  const router = useRouter();
  const slides = [
    {
      id: 1,
      title: "Claim",
      url: "/home/charms/charms-code",
      desc: "Have a special code? Redeem it here to unlock your gold bean.",
      buttonLabel: "Enter Code",
      charm: img3.src,
      src: "/gift-joy.png",
    },
    {
      id: 2,
      title: "Spin",
      url: "/home/charms/spin-code",
      buttonLabel: "Spin now",
      charm: img2.src,

      desc: "Try your luck - one spin could win you a gold ball.",
      src: "https://images.unsplash.com/photo-1746678223017-bd2fc129093a?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=987",
    },
  ];
  const { setCharmsSize } = charmsCode();

  const [activeIndex, setActiveIndex] = useState(0);
  const [swiperInst, setSwiperInst] = useState(null);

  useEffect(() => {
    setCharmsSize(null);
  }, []);

  // Enable smooth touch scrolling
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    const handleMouseDown = (e) => {
      isDown = true;
      container.classList.add("cursor-grabbing");
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
    };

    const handleMouseLeave = () => {
      isDown = false;
      container.classList.remove("cursor-grabbing");
    };

    const handleMouseUp = () => {
      isDown = false;
      container.classList.remove("cursor-grabbing");
    };

    const handleMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 2;
      container.scrollLeft = scrollLeft - walk;
    };

    container.addEventListener("mousedown", handleMouseDown);
    container.addEventListener("mouseleave", handleMouseLeave);
    container.addEventListener("mouseup", handleMouseUp);
    container.addEventListener("mousemove", handleMouseMove);

    return () => {
      container.removeEventListener("mousedown", handleMouseDown);
      container.removeEventListener("mouseleave", handleMouseLeave);
      container.removeEventListener("mouseup", handleMouseUp);
      container.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={scrollContainerRef}
      className="w-full mt-[46px] mb-[106px] overflow-x-auto no-scrollbar scrollbar-hide cursor-grab touch-pan-x"
      style={{
        WebkitOverflowScrolling: "touch",
        scrollBehavior: "smooth",
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[950px] h-[1100px] rounded-full bg-white/23 blur-[50px]"></div>
      </div>

      <Swiper
        onSwiper={setSwiperInst}
        centeredSlides={true}
        slidesPerView="auto"
        spaceBetween={74}
        loop={false}
        slideToClickedSlide={true}
        onSlideChangeTransitionStart={(swiper) =>
          setActiveIndex(swiper.realIndex)
        }
        className="h-fit mt-4"
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
              className="!w-auto !flex !justify-center !items-baseline transition-transform duration-300"
            >
              <div className="h-[1270px] flex justify-center items-end w-full">
                <div className="w-[751px] h-fit">
                  <div
                    onClick={handleCardClick}
                    className={`${
                      isActive ? "h-[838px] cursor-pointer" : "h-[600px]"
                    } transition-all duration-1000 ease-in-out relative w-[751px] overflow-visible p-6 rounded-[72px] border-[2px] border-[#E7A758]`}
                  >
                    <div className="overflow-hidden relative text-[45px] text-center rounded-[64px] w-full h-full flex items-center justify-center">
                      <img
                        src={slide.src}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="absolute bottom-[-95px] left-0 z-50 flex items-center justify-center w-full h-fit">
                      <div className="relative flex items-center justify-center">
                        <div className="absolute w-[220px] h-[220px] rounded-full bg-yellow-400/30 blur-3xl"></div>
                        <img
                          src={slide.charm}
                          alt=""
                          className="relative h-[195px]"
                        />
                      </div>
                    </div>

                    <div className="absolute top-[-139px] w-full z-50 flex justify-center left-0">
                      <p className="text-[144px] font-ethereal text-white tracking-[-9px] w-fit leading-[286px] text-center">
                        {slide.title}
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
                      <p className="text-white mt-[110px] mx-auto mb-[36px] max-w-[441px] text-center text-[26px]">
                        {slide.desc}
                      </p>
                      <p className="text-white mt-[36px] text-center text-[28px]">
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

      <div className="flex no-scrollbar relative gap-4 mt-[0px] h-fit py-[50px] items-center justify-center">
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

export default CardSlider2;
