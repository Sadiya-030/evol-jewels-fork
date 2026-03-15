"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BottomSlider from "../../components/BottomSlider";
import Player from "lottie-react";
import animation from "../../../public/circle.json";
import PriceSlider from "../../components/PriceSlider";
import Keyboard from "../../components/Keyboard";
import LoadingProd from "../../components/LoadingProd";
import { AnimatePresence, motion } from "framer-motion";
import VideoLayer from "../../components/ui/VideoLayer";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { IoArrowBackOutline, IoCloseOutline } from "react-icons/io5";
import BottomSliderGender from "../BottomSliderGender";
import ExitModal from "../ui/ExitModal";
import star from "../../../public/star.svg";
import QueModal from "../ui/QueModal";
import { browseStore } from "../../store/browseProduct";
const GiftJoyScreen = ({ setPageState }) => {
  const router = useRouter();
  // --- Gender slider state ---
  const [gender, setgender] = useState("");
  const [genderSlider, setgenderSlider] = useState(false); // start closed
  // Flow state (API-driven)
  const [history, setHistory] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [currentQuote, setCurrentQuote] = useState("");

  const [options, setOptions] = useState([]);
  const [flowStatus, setFlowStatus] = useState("idle");
  const [qaList, setQaList] = useState([]);
  const [isThinking, setIsThinking] = useState(false);

  // Existing UI state
  const [price, setPrice] = useState(0);
  const [selectButton, setselectButton] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [typedValue, setTypedValue] = useState("");
  const [selectedOption, setSelectedOption] = useState([]); // array for multi-select
  const [open, setOpen] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const {
    browseProducts,
    setBrowseProducts,
    clearBrowseProducts,
    hasHydrated,
  } = browseStore();
  // Handle click outside to close keyboard
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!showKeyboard) return;
      const target = event.target;
      if (target.closest('[data-keyboard="true"]')) return;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
      setShowKeyboard(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [showKeyboard]);

  const isBudgetStep =
    currentQuestion?.toLowerCase().includes("budget") ||
    currentQuestion?.toLowerCase().includes("price") ||
    options.some((item) => item.label.toLowerCase().includes("under"));

  const isoccasion = options.some((item) =>
    item.label.toLowerCase().includes("birthday")
  );
  const ismultipleSelect =
    options.some((item) => item.label.toLowerCase().includes("rings")) ||
    options.some((item) => item.label.toLowerCase().includes("14k gold")) ||
    options.some((item) => item.label.toLowerCase().includes("yellow gold")) ||
    options.some((item) => item.label.toLowerCase().includes("everyday wear"));

  // ---- Helpers ----
  const callFlowApi = async (newHistory) => {
    const res = await fetch("/api/jewelry-flow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ history: newHistory }),
    });

    if (!res.ok) {
      throw new Error("Failed to call jewelry-flow API");
    }

    const data = await res.json();
    return data;
  };

  const formatBudgetAnswer = () => {
    if (selectButton) {
      return "no budget";
    }

    if (price > 0) {
      return `₹${price.toLocaleString("en-IN")}`;
    }

    return "";
  };

  const rebuildQaListFromHistory = (hist) => {
    const list = [];
    for (let i = 0; i < hist.length - 1; i++) {
      if (hist[i].role === "assistant" && hist[i + 1].role === "user") {
        list.push({
          id: i,
          question: hist[i].content,
          answer: hist[i + 1].content,
        });
      }
    }
    setQaList(list);
  };

  // ---- Initial load ----
  useEffect(() => {
    const startFlow = async () => {
      try {
        setIsThinking(true);
        const data = await callFlowApi([]);

        if (data.status === "asking") {
          setFlowStatus("asking");
          setCurrentQuestion(data?.question);
          setCurrentQuote(data?.contextquote);
          setOptions(data.options || []);

          const initialHistory = [
            { role: "assistant", content: data.question || "" },
          ];
          setHistory(initialHistory);
          rebuildQaListFromHistory(initialHistory);
        } else if (data.status === "complete") {
          setFlowStatus("complete");

          if (Array.isArray(data.details)) {
            const list = data.details.map((d, idx) => ({
              id: d.question || idx,
              question: d.question,
              answer: d.answer,
            }));
            setQaList(list);
          }

          // include gender tag if selected
          const baseTags = data.tags || [];
          const extraGenderTag = gender ? [gender] : [];
          const tagString = [...baseTags].join(" ");

          if (tagString) {
            fetchProducts(tagString);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsThinking(false);
      }
    };

    startFlow();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const [quemodalState, setquemodalState] = useState(false);

  // ---- Product search ----
  const fetchProducts = async (tagString) => {
    setIsLoading(true);

    const isEngagement = history.some(
      (item) =>
        item.role === "user" &&
        item.content.toLowerCase().includes("engagement")
    );

    try {
      const response = await fetch(
        "https://evol.thumbstack.dev/api/products/search",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: tagString, topK: 21 }),
        }
      );

      const data = await response.json();
      if (data?.products?.length === 0) {
        setquemodalState(true);
        return;
      }
      if (data.success && data.products) {
        sessionStorage.setItem("products", JSON.stringify(data.products));
        sessionStorage.setItem("searchQuery", tagString);
        if (isEngagement || data?.products?.length < 10) {
          const onlyRings = data.products?.filter(
            (item) =>
              item?.pineconeMetadata?.productType?.toLowerCase() === "rings"
          );
          const PrdData = isEngagement ? onlyRings : data.products;
          setBrowseProducts(PrdData);
          router.push("/browse");
        } else {
          router.push("/products");
        }
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      alert("Failed to fetch products. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ---- UI handlers ----

  const handleOptionClick = (option) => {
    if (ismultipleSelect) {
      setSelectedOption((prev) => {
        if (prev.includes(option.label)) {
          return prev.filter((o) => o !== option.label); // unselect
        }
        return [...prev, option.label]; // add
      });

      setTypedValue((prev) => {
        const values = prev ? prev.split(", ") : [];
        if (values.includes(option.label)) {
          return values.filter((v) => v !== option.label).join(", ");
        }
        return [...values, option.label].join(", ");
      });
    } else {
      setSelectedOption([option.label]);
      setTypedValue(option.label);
    }
  };

  const handleKeyPress = (key) => {
    if (key === "Delete") {
      setTypedValue((prev) => prev.slice(0, -1));
      setSelectedOption((prev) => (prev ? prev.slice(0, -1) : null));
    } else {
      setTypedValue((prev) => prev + key);
      setSelectedOption((prev) => (prev || "") + key);
    }
  };

  const handleContinue = async () => {
    if (flowStatus === "complete" || isThinking) return;

    let answer = "";

    if (isBudgetStep) {
      answer = formatBudgetAnswer();

      if (!answer) {
        alert("Please select a budget or choose 'No Budget'");
        return;
      }
    } else if (isoccasion) {
      const optionText = Array.isArray(selectedOption)
        ? selectedOption.join(" ")
        : selectedOption;

      answer = [optionText, gender].filter(Boolean).join(" ");
    } else {
      if (ismultipleSelect) {
        answer = selectedOption.join(" ");
      } else {
        answer = selectedOption[0] || typedValue;
      }
      if (!answer) return;
    }

    try {
      setIsThinking(true);

      // 1. append user answer to history
      const historyWithAnswer = [...history, { role: "user", content: answer }];
      setHistory(historyWithAnswer);
      rebuildQaListFromHistory(historyWithAnswer);

      // 2. call flow API with this history
      const data = await callFlowApi(historyWithAnswer);

      if (data.status === "asking") {
        setFlowStatus("asking");
        setCurrentQuestion(data.question);
        setCurrentQuote(data?.contextquote);
        setOptions(data.options || []);

        const updatedHistory = [
          ...historyWithAnswer,
          { role: "assistant", content: data.question || "" },
        ];
        setHistory(updatedHistory);
        rebuildQaListFromHistory(updatedHistory);
        if (historyWithAnswer.length === 2) {
          setgenderSlider(true);
        }

        // reset per-question state
        setTypedValue("");
        setSelectedOption([]);
        setPrice(0);
        setselectButton(false);
      } else if (data.status === "complete") {
        setFlowStatus("complete");

        if (Array.isArray(data.details)) {
          const list = data.details.map((d, idx) => ({
            id: d.question || idx,
            question: d.question,
            answer: d.answer,
          }));
          setQaList(list);
        }

        // 👉 include gender tag when fetching products
        const baseTags = data.tags || [];
        const extraGenderTag = gender ? [gender] : [];
        const tagString = [...baseTags].join(" ");

        if (tagString) {
          fetchProducts(tagString);
        }
      }
    } catch (err) {
      console.error("Error continuing flow:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsThinking(false);
    }
  };

  const handleEdit = async (editIndex) => {
    try {
      setIsThinking(true);

      /**
       * Each QA = assistant + user
       * So history index = editIndex * 2
       */
      const cutIndex = editIndex * 2;

      const trimmedHistory = history.slice(0, cutIndex + 1);
      // keep assistant question

      setHistory(trimmedHistory);
      rebuildQaListFromHistory(trimmedHistory);

      // Call API with trimmed history
      const data = await callFlowApi(trimmedHistory);

      if (data.status === "asking") {
        setFlowStatus("asking");
        setCurrentQuestion(data.question);
        setCurrentQuote(data?.contextquote);
        setOptions(data.options || []);

        setHistory([
          ...trimmedHistory,
          { role: "assistant", content: data.question || "" },
        ]);
      }

      // reset input state
      setTypedValue("");
      setSelectedOption([]);
      setPrice(0);
      setselectButton(false);
      setOpen(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsThinking(false);
    }
  };

  const hasAnyAnswers = qaList.length > 0;
  const [IsExitModal, setIsExitModal] = useState(false);
  return (
    <div className="relative w-full h-full">
      <ExitModal isOpen={IsExitModal} onClose={() => setIsExitModal(false)} />
      <QueModal
        isOpen={quemodalState}
        onClose={() => setquemodalState(false)}
        setOpen={() => setOpen(true)}
      />
      {/* Product loading layer */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex items-center justify-center"
          >
            <LoadingProd />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom slider with Q/A summary */}
      <BottomSlider
        open={open}
        setOpen={setOpen}
        data={qaList}
        onEdit={handleEdit}
      />

      {/* BG video */}
      <VideoLayer src="https://ts-bucket.mum-objectstore.e2enetworks.net/evol_4b2a7deae5.mp4" />

      <div className="relative min-h-screen z-50">
        {/* Header */}
        <div className="h-[103px] mb-[76px] bg-gray-300/20 flex justify-between items-center px-[50px] w-full">
          <p className="text-white font-hind text-[30px]">Gift a moment</p>
          <p
            onClick={() => setIsExitModal(true)}
            className="rounded-md border-[2.207px] text-white text-xl border-[#FFFFFF66] px-3 py-2 grid place-content-center"
          >
            Home
          </p>
        </div>

        <div className=" px-[100px] w-full h-[108px]">
          {!hasAnyAnswers && (
            <p
              onClick={() => setPageState("")}
              className=" flex gap-[36px] font-hind text-white text-[36px] items-center  w-fit cursor-pointer"
            >
              <IoArrowBackOutline size={50} />
              Back
            </p>
          )}
        </div>

        {/* Floating Q count / edit button */}
        {hasAnyAnswers && (
          <button
            onClick={() => setOpen(true)}
            className="p-2 fixed top-[300px]  right-[80px] rounded-full h-[117px] w-[117px] border-[#7C50E3] border"
          >
            <div className=" h-full w-full relative">
              <p className="h-full bg-[#D4CBEB61] rounded-full w-full flex items-center justify-center text-white text-[54px] leading-[36px] text-center">
                {qaList.length}
              </p>
              <div className=" grid place-content-center bg-white absolute h-[53px] w-[53px] rounded-full top-[-15px] right-[-25px]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="29"
                  height="29"
                  viewBox="0 0 29 29"
                  fill="none"
                >
                  <g clipPath="url(#clip0_1705_4738)">
                    <path
                      d="M10.2233 23.8168H5.29442C5.06042 23.8168 4.836 23.7239 4.67053 23.5584C4.50507 23.3929 4.41211 23.1685 4.41211 22.9345V18.0057C4.41222 17.772 4.50503 17.5479 4.67019 17.3825L18.2711 3.78166C18.4365 3.61632 18.6609 3.52344 18.8948 3.52344C19.1287 3.52344 19.353 3.61632 19.5184 3.78166L24.4473 8.70718C24.6126 8.87263 24.7055 9.09696 24.7055 9.33086C24.7055 9.56477 24.6126 9.7891 24.4473 9.95455L10.8464 23.5587C10.6811 23.7239 10.4569 23.8167 10.2233 23.8168Z"
                      stroke="#7C50E3"
                      strokeWidth="1.76463"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M15.0005 7.05859L21.1767 13.2348"
                      stroke="#7C50E3"
                      strokeWidth="1.76463"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M18.0883 10.1445L7.50049 20.7323"
                      stroke="#7C50E3"
                      strokeWidth="1.76463"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M10.531 23.7668L4.46729 17.7031"
                      stroke="#7C50E3"
                      strokeWidth="1.76463"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_1705_4738">
                      <rect width="28.2341" height="28.2341" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
            </div>
          </button>
        )}

        {/* Center animation */}
        <div className=" relative w-full flex justify-center    mt-[88px] mb-[110px]">
          <img
            src={star.src}
            className=" absolute z-0 top-10 left-[260px]"
            alt="star icon"
          />
          <div className=" h-[471px] w-[471px] opacity-45 rounded-full ">
            <Player
              animationData={animation}
              loop
              autoplay
              renderer="svg"
              className="relative h-full scale-150 w-full"
            />
          </div>
          <img
            src={star.src}
            className=" absolute bottom-24 z-0 h-16 w-auto right-[380px]"
            alt="star icon"
          />
          <div className=" absolute top-0 left-0 z-10 w-full h-full flex items-center justify-center">
            <p className=" text-white no-ellipsis2 text-[60px] max-w-[700px] font-ethereal  leading-[80px] text-center">
              {currentQuote}
            </p>
          </div>
        </div>

        {/* Question */}
        <div className="px-[77px] ">
          <p className="text-center font-hind text-[40px] leading-[76px] text-white">
            {currentQuestion}
          </p>

          {isBudgetStep ? (
            <div className=" mt-[101px] mb-[100px] flex w-full justify-between items-center">
              <p className=" text-[80px] font-hind font-light text-white">
                ₹ {price?.toLocaleString()}
              </p>
              <button
                onClick={() => {
                  if (selectButton) {
                    // turn OFF no budget
                    setselectButton(false);
                    setPrice(0);
                  } else {
                    // turn ON no budget
                    setselectButton(true);
                    setPrice(1000000);
                  }
                }}
                className={`${
                  selectButton ? "bg-white/50 text-black" : "bg-transparent"
                } text-3xl border border-[#B6AFAF] cursor-pointer font-hind h-[83px] w-[236px] rounded-full flex items-center justify-center text-white`}
              >
                No budget
              </button>
            </div>
          ) : (
            !ismultipleSelect && (
              <div className="px-[45px] mt-[32px] mb-[134px] rounded-[12px] overflow-hidden bg-[#FFFFFF29] h-[108px] w-full border-2 flex gap-2 items-center border-[#EDD9D942]">
                <input
                  type="text"
                  value={typedValue}
                  onChange={(e) => {
                    setTypedValue(e.target.value);
                    setSelectedOption(e.target.value || null);
                  }}
                  onFocus={() => setShowKeyboard(true)}
                  className="text-4xl h-full bg-transparent outline-none w-full text-white placeholder-white/60"
                  placeholder="Type your answer..."
                />
              </div>
            )
          )}
        </div>

        {/* Options + CTA */}
        {isBudgetStep ? (
          <div className="px-[77px] py-6">
            <PriceSlider price={price} setPrice={setPrice} />
            <div className="text-center w-full h-full my-[90px]">
              <button
                onClick={handleContinue}
                disabled={isThinking}
                className="px-10 py-4 shadow-[0_0_30px_rgba(255,255,255,0.7)] cursor-pointer font-ethereal text-[40px] leading-[72px] h-[103px] w-full rounded-[2000px] bg-white text-[#302B2C] text-2xl font-semibold disabled:opacity-60"
              >
                {isThinking
                  ? "Figuring things out..."
                  : "Alright, let's move ahead"}
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full h-full">
            {!ismultipleSelect && (
              <p className="text-center text-[28px] text-white leading-[41px]">
                Smart Picks for You
              </p>
            )}
            <div className="mt-[32px] mb-[0] no-scrollbar gap-[60px] flex py-6 flex-row overflow-x-scroll px-[77px]">
              {options.map((option, i) => (
                <div
                  key={i}
                  onClick={() => handleOptionClick(option)}
                  className="flex-shrink-0 border-[0.7px] cursor-pointer border-[#FFBD7D] p-1 bg-yellow-300/20 shadow-amber-100 shadow-[0_0_20px_2px_rgba(255,189,125,0.8)] rounded-full w-[188px] h-[188px] transition"
                >
                  <div className="border relative border-[#FFBD7D] w-full h-full overflow-hidden rounded-full bg-[#D9D9D9] flex items-center justify-center text-[24px] text-white">
                    <p className="text-center tracking-wide font-ethereal z-50 px-2">
                      {option.label}
                    </p>
                    <div className="w-full absolute top-0 left-0 h-full object-cover">
                      <img
                        src={option?.src}
                        alt={option?.label}
                        className="w-full h-full object-cover"
                      />
                      <div
                        className={
                          selectedOption.includes(option.label)
                            ? "absolute top-0 left-0 w-full h-full bg-black opacity-80"
                            : "absolute top-0 left-0 w-full h-full bg-black opacity-65"
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {typedValue || selectedOption?.length !== 0 ? (
              <div className="text-center px-[100px] h-full my-[90px]">
                <button
                  onClick={handleContinue}
                  disabled={isThinking}
                  className="px-10 py-4 shadow-[0_0_30px_rgba(255,255,255,0.7)] cursor-pointer font-ethereal text-[40px] leading-[72px] h-[103px] w-full rounded-[2000px] bg-white text-[#302B2C] text-2xl font-semibold disabled:opacity-60"
                >
                  {isThinking ? "Loading..." : "Continue"}
                </button>
              </div>
            ) : (
              <p className="text-white my-[100px] items-center justify-center flex gap-3 text-center text-2xl leading-[76px] h-full ">
                <AiOutlineInfoCircle className=" font-hind" size={30} />
                <span className=" mb-[-5px]">
                  {!ismultipleSelect
                    ? "Not sure what to type? You can pick from the smart picks"
                    : "Select all the types of jewelry you’re drawn to — you can pick more than one!"}
                </span>
              </p>
            )}
          </div>
        )}
      </div>
      <div className="absolute bottom-0 left-0 w-full h-[400px] pointer-events-none bg-gradient-to-t from-black to-transparent"></div>

      {/* Keyboard */}
      <div className=" fixed bottom-0 left-0 w-full z-50">
        <Keyboard
          isOpen={showKeyboard}
          onClose={() => setShowKeyboard(false)}
          onKeyPress={handleKeyPress}
          handleContinue={handleContinue}
        />
      </div>

      {/* Gender slider – opens after first answer */}
      <BottomSliderGender
        isOpen={genderSlider}
        onClose={() => setgenderSlider(false)}
        onSelect={(val) => {
          setgender(val); // store selected gender
          setTimeout(() => {
            setgenderSlider(false); // close on select
          }, 1000);
        }}
        gender={gender}
      />
    </div>
  );
};

export default GiftJoyScreen;
