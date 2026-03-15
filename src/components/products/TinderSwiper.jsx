"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import img1 from "../../../public/shadow.png";
import { IoCloseOutline } from "react-icons/io5";
import { usePreferenceProdStore } from "../../store/preferenceProdStore";

export default function TinderSwiper({ data }) {
  const { liked, toggleLike, clearPreferenceProd } = usePreferenceProdStore();
  const [cards, setCards] = useState(() =>
    data?.filter((item) => !liked.has(item.shopifyData?.id))
  );

  const [swipeDirection, setSwipeDirection] = useState(null);

  const removeTopCard = () => {
    setCards((prev) => prev.slice(1));
    setSwipeDirection(null);
  };

  const handleButtonSwipe = (direction) => {
    if (!cards.length) return;
    const topCard = cards[0];
    if (direction === "left") "";
    if (direction === "right") toggleLike(topCard);
    setSwipeDirection(direction);
    setTimeout(() => removeTopCard(), 300);
  };

  return (
    <div className="flex flex-col  h-[1380px] bg-[#FBFAF8">
      <p className="text-[48px] font-ethereal text-center leading-[90px] text-[#302B2C]">
        Let us understand your taste{" "}
      </p>
      <p className="text-[24px] text-[#302B2C] font-hind leading-[40px] text-center mb-[44px]">
        Tap Like or Dislike on the products to personalize your gift results{" "}
      </p>
      <div className="flex flex-col items-center justify-center">
        <div className="relative w-full bg-[#FBFAF8]  h-[50vh] mx-auto">
          <AnimatePresence>
            {cards.length > 0 ? (
              cards
                .map((card, index) => {
                  const isTop = index === 0;
                  const animateProps =
                    swipeDirection && isTop
                      ? {
                          x: swipeDirection === "right" ? 500 : -500,
                          opacity: 0,
                          rotate: swipeDirection === "right" ? 20 : -20,
                        }
                      : { x: 0, opacity: 1, rotate: 0 };

                  return (
                    <motion.div
                      key={card.id}
                      className={`absolute w-[879px] h-[929px]  flex items-center justify-center left-1/9 rounded-t-[112px]  bg-white   `}
                      style={{
                        zIndex: cards.length - index,
                        scale: 1 - index * 0.03,
                      }}
                      drag={isTop ? "x" : false}
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={1}
                      initial={{ scale: 1.0, opacity: 0 }}
                      animate={animateProps}
                      exit={{ opacity: 0 }}
                      whileDrag={{ cursor: "grabbing" }}
                      onDragEnd={(event, info) => {
                        if (Math.abs(info.offset.x) > 100) {
                          const direction =
                            info.offset.x > 0 ? "right" : "left";
                          handleButtonSwipe(direction);
                        }
                      }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="w-[879px]  rounded-t-[112px]  bg-white border border-b-0  border-[#473CE342] overflow-hidden  h-[925px]  p-4 pb-0 ">
                        <div className=" w-[839px] h-[949px] rounded-t-[112px]  bg-slate-50  border-b-0 border "></div>
                      </div>
                      <div className=" bg-white absolute bottom-0 left-0 w-full h-[40px] rounded-t-[150px]"></div>
                      <div className=" absolute  bottom-[-10%]   bg-red z-[333]   left-0 w-full flex items-center justify-center pb-[30px]">
                        <img
                          src={img1.src}
                          alt=""
                          className="   mt-[200px]  h-[220px] scale-125  w-full bg-red"
                        />
                        <div className=" w-full h-fit  pt-5 overflow-visible    absolute bottom-[70px] left-0">
                          <p className=" font-ethereal line-clamp-2 text-[65px] leading-[85px] text-[#302B2C] mx-auto text-center tracking-[-4.7px] max-w-[676px]">
                            {card?.pineconeMetadata?.productTitle}{" "}
                          </p>
                          <p className=" text-[34px] relative z-50 text-black text-center w-full">
                            ₹{card?.pineconeMetadata?.productPrice}
                          </p>
                        </div>
                      </div>
                      <div className=" absolute z-50  flex items-center justify-center  inset-0 w-full h-full ">
                        <div className=" h-[500px]   bg-slat-50 w-fit mx-auto white  mt-10">
                          <img
                            src={card?.pineconeMetadata?.productImage}
                            alt=""
                            className=" h-full   mix-blend-multiply  w-auto object-cover mx-auto "
                          />
                        </div>
                      </div>
                    </motion.div>
                  );
                })
                .reverse()
            ) : (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-5xl font-semibold mt-24 text-slate-300 mx-auto text-center"
              >
                No more cards
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {cards?.length > 0 && (
          <div className="flex gap-10 mt-[72px]">
            <button
              onClick={() => handleButtonSwipe("left")}
              className=" h-fit w-fit p-1.5 rounded-full border border-[#C13535] bg-transparent "
            >
              <div className=" w-[316px] rounded-full  flex flex-row items-center justify-center gap-2 h-[96px] bg-[#c1353533]">
                <p className=" text-[#C13535] text-3xl">Not my taste</p>
                <IoCloseOutline
                  size={40}
                  className="text-[#C13535] flex-shrink-0"
                />
              </div>
            </button>
            <button
              onClick={() => handleButtonSwipe("right")}
              className=" h-fit rounded-full w-fit p-1.5 border border-[#0F8E50] bg-transparent "
            >
              <div className=" w-[316px] rounded-full  flex flex-row items-center justify-center gap-4 h-[96px] bg-[#0F8E5017]">
                <p className=" text-green-600 text-3xl">My taste</p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="18"
                  viewBox="0 0 24 18"
                  fill="none"
                >
                  <path
                    d="M0.951172 9.50606L7.60649 16.1614L22.8186 0.949219"
                    stroke="#0F8E50"
                    strokeWidth="1.90152"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
