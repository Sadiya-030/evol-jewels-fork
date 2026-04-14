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
  const [vendingError, setVendingError] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { charmsSize, setCharmsSize, allCharms, setAllCharms } = charmsCode();
  const [AllCharms, setallCharms] = useState([]);
  const [isLoadingCharms, setIsLoadingCharms] = useState(true);
  const { id } = useParams();
  const searchParams = useSearchParams();
  const weight = searchParams.get("weight"); // Get weight from URL
  const imageUrl = searchParams.get("image"); // Get image from URL

  // Initialize AllCharms from store
  useEffect(() => {
    if (allCharms && allCharms.length > 0) {
      setallCharms(allCharms);
      setIsLoadingCharms(false);
    }
  }, [allCharms]);

  useEffect(() => {
    const getCharms = async () => {
      // If we already have cached data, no need to fetch
      if (allCharms && allCharms.length > 0) {
        return;
      }

      // Otherwise fetch from API
      setIsLoadingCharms(true);
      try {
        const data = await FetchCharms();
        setallCharms(data);
        setAllCharms(data); // Cache it
      } catch (error) {
        console.error("Error fetching charms:", error);
      } finally {
        setIsLoadingCharms(false);
      }
    };

    getCharms();
  }, []); // Only run once on mount
  const createCharms = useMemo(() => {
    const items = [];
    for (let i = 0; i < AllCharms?.length; i++) {
      items.push({
        id: `${AllCharms[i]?.grams}-${i}`,
        weight: Number(AllCharms[i]?.grams), // Convert to number for consistent comparison
        title: AllCharms[i]?.title,
        image: AllCharms[i]?.image?.url,
        top: Math.random() * 8000 + 200,
        left: Math.random() * 8000 + 200,
        size: Math.floor(Math.random() * (500 - 390 + 1)) + 390,
      });
    }
    return items;
  }, [AllCharms]);

  const charms = createCharms;

  // Use weight and image from URL query params for instant display
  const selectedCharms = useMemo(() => {
    // If we have the image URL from params, use it directly for faster display
    if (imageUrl && weight && id) {
      return {
        title: decodeURI(id),
        weight: Number(weight),
        image: decodeURIComponent(imageUrl),
      };
    }

    // Fallback: search in charms array
    return charms?.filter(
      (item) =>
        item?.title === decodeURI(id) &&
        (weight ? Number(item?.weight) === Number(weight) : true),
    )[0];
  }, [imageUrl, weight, id, charms]);

  const selectedAllCharms = useMemo(() => {
    const filtered = charms.filter((item) => {
      return Number(item.weight) === Number(selectedCharms?.weight);
    });
    return filtered;
  }, [charms, selectedCharms?.weight]);
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
        sesId,
      );

      if (data?.success === false) {
        setmodalmsg(data.error || data.message || "Something went wrong");
        if (data?.vendingMachineError) {
          // Vending machine error - keep session alive for retry
          setVendingError(true);
        } else {
          // Other errors - clear session
          sessionStorage.removeItem("charmSessionId");
          setCharmsSize(null);
        }
        setIsOpen(true);
        return;
      }

      // ✅ Full success - clear session
      sessionStorage.removeItem("charmSessionId");
      setCharmsSize(null);
      setVendingError(false);
      setmodalmsg("");
      setIsOpen(true);
    } catch (error) {
      setmodalmsg("Vending failed. Please try again.");
      setIsOpen(true);
    } finally {
      setIsVending(false);
    }
  };

  // Show loading state only if we don't have image from URL params
  const isLoading = !selectedCharms?.image;

  return (
    <div className="h-screen bg-white">
      {/* video background */}
      <SuccessModal
        msg={modalmsg}
        vendingMachineError={vendingError}
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setVendingError(false);
        }}
      />
      ; {/* main content */}
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
          <p className="text-gray-800 text-[30px] font-medium">Beans</p>
          <Link
            href="/home"
            className="rounded-md border-[2px] text-xl text-gray-800 border-gray-300 bg-gray-100 px-4 py-2 grid place-content-center hover:bg-gray-200 transition-colors"
          >
            Home
          </Link>
        </div>

        {isLoading ? (
          /* Loading Skeleton */
          <div className="relative h-[calc(100vh-103px)] flex items-center justify-center">
            <div className="flex flex-col items-center gap-8">
              <div className="h-[542px] w-[542px] overflow-hidden border border-[#A3C4EB] p-3 rounded-full animate-pulse">
                <div className="rounded-full h-full border border-[#A3C4EB] p-3 bg-gray-100"></div>
              </div>
              <div className="h-12 w-48 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          </div>
        ) : (
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
              <div className=" absolute   bottom-[60px] left-0 w-full h-fit">
                <div className=" w-[500px] mx-auto h-[110px] rounded-full overflow-hidden">
                  <div
                    onClick={!isVending ? handelSelectCharm : undefined}
                    className={`rounded-full font-ethereal text-[36px] w-full h-full
        flex items-center justify-center transition-all duration-200
        shadow-[0_4px_20px_rgba(29,123,255,0.3)]
        ${
          isVending
            ? "bg-gray-400 text-gray-200 cursor-not-allowed opacity-70"
            : "bg-[#1d7bfffc] text-white cursor-pointer hover:bg-[#0d6bef] hover:shadow-[0_6px_25px_rgba(29,123,255,0.5)] hover:scale-[1.02]"
        }
      `}
                  >
                    {isVending ? "Vending..." : "Claim Bean"}
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
              {selectedAllCharms && selectedAllCharms.length > 0 ? (
                <div className=" grid grid-cols-2 py-20 h-full gap-y-10 overflow-auto">
                  {selectedAllCharms.map((item, i) => (
                    <Link
                      href={`/home/charms/charms-code/select-charms/${item?.title}?weight=${item?.weight}&image=${encodeURIComponent(item?.image || "")}`}
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
              ) : (
                // Loading state for alternate charms
                <div className="grid grid-cols-2 py-20 h-full gap-y-10 overflow-auto">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="h-[398px] mx-auto w-[398px] overflow-hidden border border-[#A3C4EB] p-3 rounded-full animate-pulse"
                    >
                      <div className="rounded-full h-full border border-[#A3C4EB] bg-gray-100"></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
