"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import CharmsWithNamePrice from "../../../../../components/CharmsWithNamePrice";
import { motion } from "framer-motion";
import { Suspense } from "react";
import Experience from "../../../../../components/Experience";
import { charmsCode } from "../../../../../store/CharmsCode/charmsCode";
import { FetchCharms } from "../../../../../utils/FetchCharms";
import SuccessModal from "../../../../../components/ui/SuccessModal";
import { IoCloseOutline } from "react-icons/io5";

function PageContent() {
  const [modalmsg, setmodalmsg] = useState("");
  const { charmsSize, setCharmsSize } = charmsCode();
  const goldSize = charmsSize?.gold ? Number(charmsSize?.gold) : null;
  const [selectedWeight, setSelectedWeight] = useState(null);
  const [AllCharms, setallCharms] = useState([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const view = searchParams.get("view") || "experience"; // default view
  const [activeView, setActiveView] = useState(view);
  useEffect(() => {
    if (charmsSize === null || charmsSize === "") {
      router.push("/home/charms");
    }
  }, []);
  useEffect(() => {
    if (goldSize) {
      setSelectedWeight(String(goldSize));
    }
  }, [goldSize]);

  useEffect(() => {
    setActiveView(view);
  }, [view]);

  const handleViewChange = (newView) => {
    if (newView !== activeView) {
      setActiveView(newView);
      router.push(`?view=${newView}`, { scroll: false });
    }
  };
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
    if (!goldSize || !AllCharms?.length) return [];

    // 1️⃣ Filter by gold size (number-safe)
    const filtered = AllCharms.filter(
      (charm) => Number(charm?.grams) === Number(goldSize)
    );

    if (!filtered.length) return [];

    // 2️⃣ Ensure exactly 18 charms
    const result = [];
    let i = 0;

    while (result.length < 398) {
      const charm = filtered[i % filtered.length];

      result.push({
        id: `${charm?.grams}-${result.length}`,
        weight: Number(charm?.grams),
        title: charm?.title,
        image: charm?.image?.url,
        top: Math.random() * 8000 + 200,
        left: Math.random() * 8000 + 200,
        size: Math.floor(Math.random() * (500 - 390 + 1)) + 390,
      });

      i++;
    }

    return result;
  };

  const charms = createCharms();

  const filteredCharms = charms.filter(
    (item) => item.weight === selectedWeight
  );

  const [isOpen, setIsOpen] = useState(false);

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
        <div className=" absolute top-0 left-0 h-screen z-[1] w-full bg-white/90"></div>
      </div>
      {/* main content */}
      <div className="relative z-50 w-full h-full">
        {/* header */}
        <div className="h-[103px] relative z-50 mt-[-5px] flex-shrink-0 bg-gray-200/40 flex justify-between items-center px-[50px] w-full">
          <p className="text-black text-[30px]">Charms</p>

          <Link
            onClick={() => setCharmsSize(null)}
            href="/home/charms"
            className="rounded-md border-[2.207px] text-black text-xl border-[#19191966] px-3 py-2 grid place-content-center"
          >
            Home
          </Link>
        </div>

        {/* toggle buttons */}
        <div className="fixed z-[100] top-[204px] left-0 w-full h-20">
          <div className="flex gap-5 justify-center">
            <button
              onClick={() =>
                handleViewChange(
                  activeView === "Experience View"
                    ? "Grid View"
                    : "Experience View"
                )
              }
              className={`flex items-center h-20 justify-center w-[85px] bg-white transition-colors`}
            >
              {activeView !== "Experience View" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="39"
                  height="39"
                  viewBox="0 0 39 39"
                  fill="none"
                >
                  <g clip-path="url(#clip0_2911_7791)">
                    <path
                      d="M30.4688 7.3125H8.53125C7.85815 7.3125 7.3125 7.85815 7.3125 8.53125V30.4688C7.3125 31.1418 7.85815 31.6875 8.53125 31.6875H30.4688C31.1418 31.6875 31.6875 31.1418 31.6875 30.4688V8.53125C31.6875 7.85815 31.1418 7.3125 30.4688 7.3125Z"
                      stroke="black"
                      stroke-width="2.4375"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M19.5 7.3125V31.6875"
                      stroke="black"
                      stroke-width="2.4375"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M7.3125 19.5H31.6875"
                      stroke="black"
                      stroke-width="2.4375"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_2911_7791">
                      <rect width="39" height="39" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="36"
                  height="36"
                  viewBox="0 0 36 36"
                  fill="none"
                >
                  <g clipPath="url(#clip0_1584_3551)">
                    <path
                      d="M18 15.75C20.7959 15.75 23.0625 13.4834 23.0625 10.6875C23.0625 7.89156 20.7959 5.625 18 5.625C15.2041 5.625 12.9375 7.89156 12.9375 10.6875C12.9375 13.4834 15.2041 15.75 18 15.75Z"
                      stroke="black"
                      strokeWidth="2.25"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M26.4375 29.25C29.2334 29.25 31.5 26.9834 31.5 24.1875C31.5 21.3916 29.2334 19.125 26.4375 19.125C23.6416 19.125 21.375 21.3916 21.375 24.1875C21.375 26.9834 23.6416 29.25 26.4375 29.25Z"
                      stroke="black"
                      strokeWidth="2.25"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9.5625 29.25C12.3584 29.25 14.625 26.9834 14.625 24.1875C14.625 21.3916 12.3584 19.125 9.5625 19.125C6.76656 19.125 4.5 21.3916 4.5 24.1875C4.5 26.9834 6.76656 29.25 9.5625 29.25Z"
                      stroke="black"
                      strokeWidth="2.25"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_1584_3551">
                      <rect width="36" height="36" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              )}
            </button>
            <div className=" flex border border-black flex-row">
              <button
                onClick={() => handleViewChange("Experience View")}
                className={`text-[30px] leading-[88px] min-w-[300px] flex items-center h-20 justify-center w-fit px-10 ${
                  activeView === "Experience View"
                    ? "bg-black text-white"
                    : "text-black bg-white"
                }  transition-colors`}
              >
                Experience View
              </button>
              <button
                onClick={() => handleViewChange("Grid View")}
                className={`text-[30px] leading-[88px] min-w-[300px] flex items-center h-20 justify-center w-fit px-10 ${
                  activeView !== "Experience View"
                    ? "bg-black text-white"
                    : "text-black bg-white"
                }  transition-colors`}
              >
                Grid View
              </button>
            </div>
          </div>
        </div>

        {activeView !== "Experience View" && (
          <div className="fixed z-[100] bottom-[80px] left-0 w-full h-20">
            <div className="flex gap-5 justify-center">
              <div className="relative">
                <div className="flex bg-white border border-black rounded-full overflow-hidden">
                  {["0.5", "1"].map((w) => {
                    const isDisabled = goldSize === Number(w);
                    const isSelected = selectedWeight === Number(w);

                    return (
                      <button
                        key={w}
                        disabled={!isDisabled}
                        onClick={() => setSelectedWeight(w)}
                        className={`px-8 py-2 text-[20px] h-20 w-[200px] transition-all duration-300
        ${
          !isDisabled
            ? "cursor-not-allowed bg-gray-500 opacity-40 text-black"
            : !isSelected
            ? "bg-black text-white cursor-pointer"
            : "bg-transparent text-black opacity-70 cursor-pointer"
        }
      `}
                      >
                        {w} g
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="w-full h-[calc(100vh-103px)]">
          {activeView === "Experience View" ? (
            <Experience
              setmodalmsg={setmodalmsg}
              spinFlow={false}
              setIsOpen={setIsOpen}
              charms={charms}
              goldSize={goldSize}
              filteredCharms={AllCharms}
            />
          ) : (
            <div className="h-full w-full overflow-auto">
              <div className="w-full h-full grid grid-cols-2 pt-[250px] gap-y-24">
                {charms.map((data, I) => (
                  <Link
                    key={I}
                    href={`/home/charms/charms-code/select-charms/${data?.title}`}
                    style={{
                      paddingBottom:
                        I === filteredCharms.length - 1 ? "200px" : undefined,
                    }}
                    className="flex h-fit justify-center"
                  >
                    <motion.div
                      animate={{
                        // opacity: data.weight === selectedWeight ? 1 : 0.4,
                        scale: data.weight === selectedWeight ? 1 : 0.95,
                      }}
                      transition={{ duration: 0.4 }}
                    >
                      <CharmsWithNamePrice data={data} />
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <PageContent />
    </Suspense>
  );
}
