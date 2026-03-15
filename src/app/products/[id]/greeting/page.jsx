"use client";

import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [typedValue, setTypedValue] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [greetingMessage, setGreetingMessage] = useState("");
  const recognitionRef = useRef(null);

  const dataforQuestionOptions = [
    {
      question: "Add a greeting to complete your gift?",
      options: [
        { src: "", label: "Romantic" },
        { src: "", label: "Funny" },
        { src: "", label: "Poetic" },
        { src: "", label: "Thoughtful" },
        { src: "", label: "Sassy" },
      ],
    },
    {
      question: "Would you like to use this message or try something else?",
      options: [
        { src: "", label: "Try a variation" },
        { src: "", label: "Make it shorter" },
        { src: "", label: "Make it warmer" },
        { src: "", label: "Make it more playful" },
        { src: "", label: "Change tone" },
      ],
    },
  ];
  const str = window.location.href;
  const parts = str.split("/").filter(Boolean); // ["sdf", "sdfs", "sdfsf", "sdfsdf"]
  const secondLast = parts[parts.length - 2];
  const currenturl = parts[parts.length - 1];

  const [productdetail, setproductdetail] = useState(null);
  useEffect(() => {
    const storedProducts = sessionStorage.getItem("products");

    if (storedProducts) {
      const products = JSON.parse(storedProducts);
      //   const productId = decodeURIComponent(params.id);
      const foundProduct = products?.filter(
        (e) => e?.pineconeMetadata?.productHandle === secondLast
      );
      if (foundProduct) {
        setproductdetail(foundProduct[0]);
      }
    }
  }, [secondLast]);

  // 🎤 Speech Recognition setup
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = "en-US";
        recognition.interimResults = true;
        recognition.continuous = true;

        recognition.onresult = (event) => {
          let liveTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            liveTranscript += event.results[i][0].transcript + " ";
          }
          setTypedValue(liveTranscript.trim());
          setSelectedOption(null);
        };

        recognition.onend = () => setIsListening(false);
        recognitionRef.current = recognition;
      }
    }
  }, []);

  // 🎤 Mic control
  const handleMicClick = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition not supported in this browser");
      return;
    }
    const recognition = recognitionRef.current;
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setTypedValue("");
      setSelectedOption(null);
      recognition.start();
      setIsListening(true);
    }
  };

  // 🟩 Option click logic with word limit control
  const handleOptionClick = async (option) => {
    setSelectedOption(option);
    setIsLoading(true);

    const wordLimit = option === "Make it shorter" ? 11 : 15;

    try {
      const res = await fetch(
        "https://evol.thumbstack.dev/api/products/greet-message",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pick: option,
            tone: "Keep Original",
            template: "Minimal & Chic",
            words: wordLimit,
            product: "bracelet",
          }),
        }
      );

      const data = await res.json();
      if (data.success && data.data?.greetingMessage) {
        setGreetingMessage(data.data.greetingMessage);
        setTypedValue(data.data.greetingMessage);
        setStep(2);
      }
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 🟦 "I’m good" button — go to step 2 keeping message
  const handleImGood = () => {
    if (typedValue.trim()) {
      setGreetingMessage(typedValue);
      setStep(2);
    }
  };

  const currentQuestion = dataforQuestionOptions[step - 1];
  return (
    <div className="relative w-full h-full">
      <div className="w-full h-screen absolute top-0 left-0 z-0">
        <video
          src="https://ts-bucket.mum-objectstore.e2enetworks.net/evol_4b2a7deae5.mp4"
          loop
          autoPlay
          muted
          className="w-full h-full object-cover"
        ></video>
      </div>

      <div className="relative z-50">
        {/* Header */}
        <div className="h-[103px] bg-white/10 flex justify-between items-center px-[50px] w-full">
          <p className="text-white text-[30px]">Gift a moment</p>
          <Link
            href="/home"
            className="rounded-full border-[2.207px] border-[#FFFFFF66] h-[64px] w-[64px] grid place-content-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="37"
              height="37"
              fill="none"
              viewBox="0 0 37 37"
            >
              <g clipPath="url(#clip0_1305_623)">
                <path
                  d="M28.7358 8.04492L8.04614 28.7346"
                  stroke="white"
                  strokeWidth="2.29885"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M28.7358 28.7346L8.04614 8.04492"
                  stroke="white"
                  strokeWidth="2.29885"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_1305_623">
                  <rect width="36.7816" height="36.7816" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </Link>
        </div>

        {/* Display screen */}
        <div className="relative w-full py-[64px] flex justify-center">
          <div className="w-[816px] h-[738px] rounded-[124px] px-[18px] py-[15px] bg-transparent border">
            <div className="rounded-[124px] overflow-hidden h-full w-full bg-blue-900">
              {isLoading ? (
                <div className="flex items-center justify-center h-full w-full">
                  <div className="flex space-x-2">
                    <span className="w-4 h-4 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-4 h-4 bg-white rounded-full animate-bounce [animation-delay:-0.10s]"></span>
                    <span className="w-4 h-4 bg-white rounded-full animate-bounce [animation-delay:-0.17s]"></span>

                    <span className="w-4 h-4 bg-white rounded-full animate-bounce"></span>
                  </div>
                </div>
              ) : typedValue ? (
                <div className="h-full px-[88px] py-[115px] w-full overflow-y-auto">
                  <p className="text-[42px] font-ethereal leading-[80px] text-white whitespace-pre-line">
                    {typedValue}
                  </p>
                </div>
              ) : (
                <div className="h-full w-full bg-blue-900">
                  <img
                    src={productdetail?.pineconeMetadata?.productImage}
                    alt=""
                    className="h-full w-full   object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Question Section */}
        <div className="px-[77px] mb-[73px]">
          <p className="text-center text-[40px] max-w-[670px] mx-auto leading-[76px] text-white">
            {currentQuestion.question}
          </p>

          <div className="px-[45px] mt-[32px] rounded-[12px] overflow-hidden bg-[#FFFFFF29] h-[108px] w-full border-2 flex gap-2 items-center border-[#EDD9D942]">
            <input
              type="text"
              value={typedValue}
              onChange={(e) => {
                setTypedValue(e.target.value);
                setSelectedOption(null);
              }}
              className="text-4xl h-full bg-transparent outline-none w-full text-white placeholder-white/60"
              placeholder="Type your answer..."
            />
            <button
              type="button"
              onClick={handleMicClick}
              className={`flex-shrink-0 ml-2 h-[63px] shadow-white w-[63px] rounded-full grid place-content-center transition ${
                isListening
                  ? "bg-red-500 animate-pulse"
                  : "bg-[#002066] shadow-md"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="29"
                viewBox="0 0 20 29"
                fill="none"
              >
                <path
                  d="M4 14V6C4 4.4087 4.63214 2.88258 5.75736 1.75736C6.88258 0.632141 8.4087 0 10 0C11.5913 0 13.1174 0.632141 14.2426 1.75736C15.3679 2.88258 16 4.4087 16 6V14C16 15.5913 15.3679 17.1174 14.2426 18.2426C13.1174 19.3679 11.5913 20 10 20C8.4087 20 6.88258 19.3679 5.75736 18.2426C4.63214 17.1174 4 15.5913 4 14ZM20 14C20 13.7348 19.8946 13.4804 19.7071 13.2929C19.5196 13.1054 19.2652 13 19 13C18.7348 13 18.4804 13.1054 18.2929 13.2929C18.1054 13.4804 18 13.7348 18 14C18 16.1217 17.1571 18.1566 15.6569 19.6569C14.1566 21.1571 12.1217 22 10 22C7.87827 22 5.84344 21.1571 4.34315 19.6569C2.84285 18.1566 2 16.1217 2 14C2 13.7348 1.89464 13.4804 1.70711 13.2929C1.51957 13.1054 1.26522 13 1 13C0.734784 13 0.48043 13.1054 0.292893 13.2929C0.105357 13.4804 0 13.7348 0 14C0.00304514 16.4782 0.924902 18.8672 2.5873 20.7051C4.24971 22.543 6.53455 23.6991 9 23.95V28C9 28.2652 9.10536 28.5196 9.29289 28.7071C9.48043 28.8946 9.73478 29 10 29C10.2652 29 10.5196 28.8946 10.7071 28.7071C10.8946 28.5196 11 28.2652 11 28V23.95C13.4654 23.6991 15.7503 22.543 17.4127 20.7051C19.0751 18.8672 19.997 16.4782 20 14Z"
                  fill="white"
                />
              </svg>
            </button>
          </div>

          {step === 1 && (
            <button
              onClick={handleImGood}
              className="px-10 font-ethereal py-4 mt-[38px] text-[40px] leading-[72px] h-[103px] w-full rounded-[2000px] bg-white text-black text-2xl font-semibold"
            >
              No, I’m good
            </button>
          )}
        </div>

        {/* Options Section */}
        <div className="w-full h-full">
          <p className="text-center text-[28px] text-white leading-[41px]">
            {step === 1 ? "Smart Picks for You" : "Suggestions"}
          </p>

          <div className="mt-[19px] no-scrollbar gap-[60px] py-5 flex flex-row overflow-x-scroll px-[77px]">
            {currentQuestion.options.map((option, i) => (
              <div
                key={i}
                onClick={() => handleOptionClick(option)}
                className={`flex-shrink-0 border-[0.7px] cursor-pointer border-[#FFBD7D] p-1 bg-yellow-300/20 shadow-amber-100 shadow-[0_0_20px_2px_rgba(255,189,125,0.8)] rounded-full w-[188px] h-[188px] transition ${
                  selectedOption === option.label ? "" : ""
                }`}
              >
                <div className="border relative border-[#FFBD7D] w-full h-full overflow-hidden rounded-full bg-[#D9D9D9] flex items-center justify-center text-[24px] text-white">
                  <p className="text-center font-ethereal textwhi z-50 px-2">
                    {option.label}
                  </p>
                  <div className="w-full absolute top-0 left-0 h-full object-cover">
                    <img
                      src="https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1654"
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    {selectedOption === option.label ? (
                      <div className=" absolute top-0 left-0 w-full h-full bg-black opacity-70"></div>
                    ) : (
                      <div className=" absolute top-0 left-0 w-full h-full bg-black opacity-60"></div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {step === 1 ? (
            <p className="text-white mb-[59px] mt-[76px] text-center text-2xl leading-[76px]">
              Not sure what to type? You can pick from the smart picks
            </p>
          ) : (
            <div className="h-[250px] flex items-center px-[100px]">
              <Link
                href={`${currenturl}/greeting-templates`}
                className="px-10 py-4 flex justify-center items-center font-ethereal text-[40px] leading-[72px] h-[103px] w-full rounded-[2000px] bg-white text-black text-2xl font-semibold"
              >
                Use this message
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
