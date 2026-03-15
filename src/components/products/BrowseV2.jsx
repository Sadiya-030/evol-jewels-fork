import React from "react";
import ProductCardV2 from "./ProductCardV2";

const BrowseV2 = ({ data, isLoading }) => {
  const grouped = data.reduce((acc, item) => {
    const type = item.pineconeMetadata?.productType || "unknown";

    if (!acc[type]) acc[type] = [];
    acc[type].push(item);

    return acc;
  }, {});

  return (
    <div className=" pb-[200px] ">
      <p className="mx-[100px] mt-[46px] mb-[33px] rounded-[2000px] text-[22px] font-medium text-[#7C50E3] w-[calc(100vw-200px)] flex items-center justify-center gap-6 h-[66px] border border-[#7C50E336] bg-[#7C50E30A]">
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
      <div className="px-[100px]">
        <p className=" text-[#302B2C] font-ethereal leading-[90px] text-5xl font-black">
          Find Your Perfect Match
        </p>
        <p className=" text-2xl text-[#302B2C]  leading-[80px]">
          Explore a selection crafted from your preferences and style cues.{" "}
        </p>
      </div>
      {isLoading ? (
        <div>
          <p className=" mx-[100px] mt-[75px] rounded-lg animate-pulse bg-gray-200 h-10 w-[180px] capitalize font-ethereal mb-[30px]  text-[#302B2C] text-[38px]"></p>
          <div className="flex gap-8 overflow-x-scroll no-scrollbar">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={`${i === 0 && "ml-[100px]"} ${
                  i === 5 && "mr-[100px]"
                } animate-pulse`}
              >
                <div className="w-[350px] h-[350px] bg-gray-200 rounded-xl"></div>

                <div className="mt-4 space-y-2">
                  <div className="h-4 w-40 bg-gray-200 rounded"></div>
                  <div className="h-4 w-28 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
          <p className=" mx-[100px] mt-[75px] rounded-lg animate-pulse bg-gray-200 h-10 w-[220px] capitalize font-ethereal mb-[30px]  text-[#302B2C] text-[38px]"></p>
          <div className="flex gap-8 overflow-x-scroll no-scrollbar">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={`${i === 0 && "ml-[100px]"} ${
                  i === 5 && "mr-[100px]"
                } animate-pulse`}
              >
                <div className="w-[350px] h-[350px] bg-gray-200 rounded-xl"></div>

                <div className="mt-4 space-y-2">
                  <div className="h-4 w-40 animate-pulse bg-gray-200 rounded"></div>
                  <div className="h-4 w-28 animate-pulse bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        Object.keys(grouped).map((type) => (
          <div key={type}>
            <p className=" capitalize font-ethereal px-[100px] mb-[30px] mt-[65px] text-[#302B2C] text-[38px]">
              {type}
            </p>

            <div className=" flex no-scrollbar gap-8 overflow-x-scroll">
              {grouped[type].map((item, i) => (
                <div
                  key={i}
                  className={` ${i === 0 && "ml-[100px]"} ${
                    i === grouped[type].length - 1 && "mr-[100px]"
                  } `}
                >
                  <ProductCardV2 data={item} />
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default BrowseV2;
