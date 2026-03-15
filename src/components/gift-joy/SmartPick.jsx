import React from "react";

const SmartPick = () => {
  return (
    <div className=" w-full  h-full">
      <p className=" text-center text-[28px] text-white leading-[41px]">
        Smart Picks for You
      </p>
      <div className=" mt-[59px] mb-[141px] gap-[60px] flex flex-row overflow-x-scroll">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((_f, i) => (
          <div className=" flex-shrink-0 border-[0.7px] border-[#FFBD7D] p-4 rounded-full w-[199px] h-[188px]">
            <div
              key={i}
              className="  border relative border-[#FFBD7D] w-full h-full overflow-hidden rounded-full bg-[#D9D9D9] flex items-center justify-center text-[64px]"
            >
              <img
                className=" w-full h-full object-cover"
                src="https://images.unsplash.com/photo-1760681555543-0a3c65fa10eb?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxNHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=60&w=900"
                alt=""
              />
              <div className=" absolute top-0 left-0 w-full h-full flex items-center justify-center pb-4 text-white text-[24px]">
                <p>Engagement</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className=" text-white text-center text-2xl leading-[76px] mb-[69px]">
        Not sure what to type? You can pick from the smart picks
      </p>
    </div>
  );
};

export default SmartPick;
