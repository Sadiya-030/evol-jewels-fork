"use client";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import charmsImg from "../../../../../../../public/charmsicons2.png";
import SuccessModal from "../../../../../../components/ui/SuccessModal";
import { charmsCode } from "../../../../../../store/CharmsCode/charmsCode";
import { FetchCharms } from "../../../../../../utils/FetchCharms";
import { markCouponAsUsed } from "../../../../../../utils/Apis";

const Page = () => {
  const [modalmsg, setmodalmsg] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { charmsSize, setCharmsSize } = charmsCode();
  const [AllCharms, setallCharms] = useState([]);
  const { id } = useParams();
  useEffect(() => {
    const getCharms = async () => {
      try {
        const data = await FetchCharms();
        setallCharms(data);
      } catch (error) {
        console.error(error);
      }
    };

    getCharms();
  }, []);
  const createCharms = () => {
    const items = [];
    for (let i = 0; i < AllCharms?.length; i++) {
      items.push({
        id: `${AllCharms[i]?.grams}-${i}`,
        weight: AllCharms[i]?.grams,
        title: AllCharms[i]?.title,
        image: AllCharms[i]?.image?.url,
        top: Math.random() * 8000 + 200,
        left: Math.random() * 8000 + 200,
        size: Math.floor(Math.random() * (500 - 390 + 1)) + 390,
      });
    }
    return items;
  };
  const charms = createCharms();
  const selectedCharms = charms?.filter(
    (item) => item?.title === decodeURI(id) && item?.weight === charmsSize?.gold
  )[0];
  const selectedAllCharms = charms.filter(
    (item) => item.weight === selectedCharms?.weight
  );
  const [isVending, setIsVending] = useState(false);

  // const handelSelectCharm = async () => {
  //   const sesId = sessionStorage.getItem("charmSessionId");
  //   console.log(selectedCharms?.weight, selectedCharms?.title);
  //   const data = await markCouponAsUsed(
  //     charmsSize,
  //     false,
  //     selectedCharms?.weight,
  //     selectedCharms?.title,
  //     sesId
  //   );
  //   console.log(data);
  //   if (data?.success === false) {
  //     setmodalmsg(data.error || "Something went wrong");
  //     setIsOpen(true);
  //     return;
  //   }
  //   sessionStorage.removeItem("charmSessionId");
  //   setIsOpen(true);
  //   setCharmsSize(null);
  // };

  const handelSelectCharm = async () => {
    if (isVending) return; // 🔒 THROTTLE

    setIsVending(true);

    try {
      const sesId = sessionStorage.getItem("charmSessionId");

      if (!sesId) {
        setmodalmsg("Session expired. Please re-enter charm code.");
        setIsOpen(true);
        return;
      }

      if (!selectedCharms) {
        setmodalmsg("Invalid charm selection");
        setIsOpen(true);
        return;
      }

      const data = await markCouponAsUsed(
        charmsSize,
        false,
        selectedCharms?.weight,
        selectedCharms?.title,
        sesId
      );

      if (data?.success === false) {
        setmodalmsg(data.error || "Something went wrong");
        setIsOpen(true);
        return;
      }

      // ✅ success
      sessionStorage.removeItem("charmSessionId");
      setCharmsSize(null);
      setmodalmsg("");
      setIsOpen(true);
    } catch (error) {
      setmodalmsg("Vending failed. Please try again.");
      setIsOpen(true);
    } finally {
      setIsVending(false);
    }
  };

  return (
    <div className="h-screen bg-white">
      {/* video background */}
      <SuccessModal
        msg={modalmsg}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
      ;{" "}
      <div className="w-full h-screen absolute top-0 left-0 z-0">
        <video
          src="https://ts-bucket.mum-objectstore.e2enetworks.net/7946210_hd_720_1366_30fps_3_c58042e06d.mp4"
          loop
          autoPlay
          muted
          className="w-full h-full object-cover"
        ></video>
        <div className=" absolute top-0 left-0 h-screen z-[1] w-full bg-white/80"></div>
      </div>
      {/* main content */}
      <div className="relative z-50 w-full h-full">
        {/* header */}
        <div className="h-[103px] mt-[-5px] flex-shrink-0 bg-white/95 backdrop-blur-md shadow-sm flex justify-between items-center px-[50px] w-full">
          <Link
            href="/home/charms/charms-code/select-charms"
            className="flex text-gray-800 items-center gap-4 text-[24px]"
          >
            <ArrowLeft size={32} className="text-gray-800" />
            Back
          </Link>
          <p className="text-gray-800 text-[30px] font-medium">Charms</p>
          <Link
            href="/home"
            className="rounded-md border-[2px] text-xl text-gray-800 border-gray-300 bg-gray-100 px-4 py-2 grid place-content-center hover:bg-gray-200 transition-colors"
          >
            Home
          </Link>
        </div>

        <div className=" relative  h-[calc(100vh-103px)]">
          <div className="  relative h-[50%] w-full flex justify-center items-center">
            <div className=" absolute top-16 left-0 w-full h-fit px-20">
              <p className=" text-center text-[#302B2C] font-ethereal text-[140px]">
                {selectedCharms?.title}
              </p>
            </div>
            <div className=" h-[542px] mb-12 w-[542px] overflow-hidden border border-[#A3C4EB] p-3 rounded-full">
              <div className=" rounded-full h-full border  border-[#A3C4EB] p-3 flex flex-col  w-full">
                <div className="rounded-full h-full bg-white flex flex-col  w-full">
                  <div className="w-full h-[69%] rounded-full   mt-[26px] p-12">
                    <img
                      alt={selectedCharms?.title}
                      src={selectedCharms?.image}
                      className=" h-full w-full scale-125  object-contain"
                    />
                  </div>
                  <div className=" h-[30%]">
                    <p className="  text-center font-ethereal text-black text-[26px]">
                      {selectedCharms?.weight} g
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className=" absolute   bottom-[75px] left-0 w-full h-fit">
              <div className=" w-[441px] mx-auto p-2 h-[95px] rounded-full overflow-hidden border border-[#D6D6D6]">
                <div
                  onClick={!isVending ? handelSelectCharm : undefined}
                  className={`rounded-full font-ethereal text-[30px] w-full h-full
      flex items-center justify-center
      ${
        isVending
          ? "bg-gray-400 text-gray-700 cursor-not-allowed"
          : "bg-[#1d7bfffc] text-white cursor-pointer"
      }
    `}
                >
                  {isVending ? "Vending..." : "Select Charm"}
                </div>
              </div>
            </div>
          </div>
          <Link
            href={`/home/charms/charms-code/select-charms`}
            className=" absolute top-[48.4%]  left-[47%]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="63"
              height="63"
              viewBox="0 0 63 63"
              fill="none"
            >
              <circle
                cx="31.5"
                cy="31.5"
                r="31"
                fill="white"
                stroke="#B29D9D"
              />
              <rect
                x="21.6016"
                y="20.7742"
                width="29.1667"
                height="1.16667"
                transform="rotate(45 21.6016 20.7742)"
                fill="#302B2C"
                stroke="#B29D9D"
                strokeWidth="1.16667"
              />
              <rect
                y="0.824958"
                width="29.1667"
                height="1.16667"
                transform="matrix(-0.707107 0.707107 0.707107 0.707107 40.8151 20.1908)"
                fill="#302B2C"
                stroke="#B29D9D"
                strokeWidth="1.16667"
              />
            </svg>
          </Link>
          <div className="  h-[50%] overflow-auto border-t-2 border-[#C6AFAF] w-full">
            <div className=" grid grid-cols-2 py-20 h-full gap-y-10 overflow-auto">
              {selectedAllCharms.map((item, i) => (
                <Link
                  href={`/home/charms/charms-code/select-charms/${item?.title}`}
                  key={i}
                  className=" h-[398px] mx-auto w-[398px] overflow-hidden border border-[#A3C4EB] p-3 rounded-full"
                >
                  <div className=" rounded-full h-full border  border-[#A3C4EB] flex flex-col  w-full">
                    <div className="w-full h-[65%] rounded-full  mt-[20px] p-12">
                      <img
                        src={item.image}
                        alt={item.title}
                        className=" h-full w-full scale-125  object-contain"
                      />
                    </div>
                    <div className=" h-[40%] mt-[-38px]">
                      <p className=" font-ethereal text-[42px] text-[#302B2C] h-full leading-[122px] text-center">
                        {item.title}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
