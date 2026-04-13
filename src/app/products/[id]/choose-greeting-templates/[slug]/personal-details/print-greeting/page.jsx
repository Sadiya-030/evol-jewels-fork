"use client";
import React, { useState } from "react";
import img1 from "../../../../../../../../public/close.svg";
import PrintModal from "../../../../../../../components/PrintModal";
import template from "../../../../../../../../public/greetings/A5 - 6.jpg";
import { GoArrowRight } from "react-icons/go";
import envolap from "../../../../../../../../public/envolap.gif";
import { useGreetingStore } from "../../../../../../../store/greetingStore";
import { usePathname, useRouter } from "next/navigation";
import pencil from "../../../../../../../../public/Pencil.svg";
import BottomSheet from "../../../../../../../components/BottomSheet";
const page = () => {
  const [isOpen, setisOpen] = useState();
  const [editTemp, seteditTemp] = useState(false);
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);
  const last2 = parts[0];
  const secondLast2 = parts[1];
  const secondLast = parts[parts.length - 2];
  const { product, selectedCard } = useGreetingStore();
  const router = useRouter();
  const onBtn1Click = () => {
    const newPath = pathname.split("/").slice(0, -2).join("/");
    router.push(`${newPath}`);
  };
  const onBtn2Click = () => {
    const newPath = pathname.split("/").slice(0, -3).join("/");
    router.push(`${newPath}`);
  };
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="  relative z-20">
        <div className=" h-[137px] border-b border-[#CECECE] w-full flex items-center justify-between px-[50px]">
          <p className=" text-4xl  text-black">Gift a Moment</p>
          <button className=" bg-white border h-[63px] w-[63px] rounded-full grid place-content-center">
            <img
              src={img1.src}
              alt=""
              className=" h-[23px] object-cover w-[23px]"
            />
          </button>
        </div>
        <div className=" flex flex-col justify-between h-[1775px] pt-[100px] ">
          <div className="  px-[53px]">
            <div>
              <p className=" text-[40px] mb-11 text-[#302B2C]">
                Your Chosen Piece
              </p>
              <div className=" w-full items-center  flex gap-[60px]">
                <div className=" h-[396px] relative flex-shrink-0 w-[322px] p-3  rounded-[30px] border border-[#C6C2EC]">
                  <div className=" overflow-hidden bg-white border rounded-3xl h-full w-full">
                    <img
                      src={product?.product?.pineconeMetadata?.productImage}
                      alt={product?.product?.pineconeMetadata?.productTitle}
                    />
                  </div>
                  <div
                    onClick={() => {
                      router.push(`/${last2}`);
                    }}
                    className=" absolute flex items-center justify-center top-[-15px] right-[-15px] rounded-full bg-white h-[77px] w-[77px] shadow-lg"
                  >
                    <img src={pencil?.src} alt="" className=" scale-90" />
                  </div>
                </div>
                <div className=" w-full">
                  <div className=" mb-[91px]">
                    <p className=" text-[#302B2C] font-ethereal text-3xl mb-5">
                      {product?.product?.pineconeMetadata?.productTitle}
                    </p>
                    <p className=" text-[28px] font-hind text-black font-semibold">
                      ₹{product?.product?.pineconeMetadata?.productPrice}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      router?.push(
                        `/products/${product?.product?.pineconeMetadata?.productHandle}`
                      );
                    }}
                    className="  rounded-full border-black border w-full h-[78px] text-[26px] text-[#002066]"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
            <div className=" my-[71px] border border-[#D8D8D8]"></div>
            {product?.isSkip ? (
              <div className=" pt-32">
                <div className=" mx-auto h-[161px]  overflow-hidden w-[161px] rounded-full mb-[70px] bg-[#E2CDF4]">
                  <img
                    src={envolap.src}
                    alt=""
                    className="  mx-auto mt-[-10px]"
                  />
                </div>
                <div>
                  <p className=" text-center text-[40px] font-hind text-[#302B2C]">
                    Want to add a greeting?
                  </p>
                  <p className=" text-center mt-5 text-2xl font-hind text-black">
                    You can include a personalised card with this gift.
                  </p>
                </div>
                <p
                  onClick={() => {
                    setSelectedCard({
                      ...selectedCard,
                      msg: "",
                      yourName: "",
                      theirName: "",
                    });
                    router.push(
                      `/${last2}/${secondLast2}/choose-greeting-templates`
                    );
                  }}
                  className=" text-[26px] flex justify-center mt-20 items-center gap-3 text-[#002066]"
                >
                  Add Greeting <GoArrowRight size={34} />
                </p>
              </div>
            ) : (
              <div>
                <p className=" text-[40px] mb-[71px] text-[#302B2C]">
                  Your Greeting Card
                </p>
                <div className=" pr-10">
                  <div className=" relative">
                    <img
                      src={template.src}
                      alt=""
                      className=" h-full shadow-lg w-full object-cover"
                    />
                    <div
                      onClick={() => {
                        seteditTemp(true);
                      }}
                      className=" absolute z-50 flex items-center justify-center top-[-15px] right-[-15px] rounded-full bg-white h-[101px] w-[101px] shadow-lg"
                    >
                      <img src={pencil?.src} alt="pencil" className=" " />
                    </div>
                    <div className=" absolute flex items-center flex-col justify-center top-0 left-0 w-full h-full object-cover ">
                      <div className=" flex flex-col justify-center items-center gap-3">
                        <div className="text-3xl text-center flex items-center justify-center gap-4 h-fit max-w-[680px] w-full text-[#302B2C] font-ethereal">
                          <div className=" h-0.5 w-[100px] bg-yellow-400" />{" "}
                          <span className=" capitalize min-w-[219px]">
                            {" "}
                            For {selectedCard?.theirName}
                          </span>
                          <div className=" h-0.5 w-[100px] bg-yellow-400" />
                        </div>
                        <p className="text-3xl text-center h-fit max-w-[680px] w-full text-[#302B2C] font-ethereal">
                          {selectedCard?.msg}
                        </p>
                        <p className="text-3xl capitalize text-center h-fit max-w-[680px] w-full text-[#302B2C] font-ethereal">
                          - {selectedCard?.yourName}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className=" px-[100px]  pb-[20px] pt-[38px] items-center border-t bg-[#FFFFFF] border-[#D4D4D4] justify-between  flex w-full">
            <p className=" text-[30px] text-[#302B2C]">
              Total ₹{product?.product?.pineconeMetadata?.productPrice}
            </p>
            <button
              onClick={() => setisOpen(true)}
              className=" bg-[#002066] rounded-[200px] h-[77px] w-[283px] text-[30px] flex items-center justify-center"
            >
              Print greeting
            </button>
          </div>
        </div>
      </div>
      <PrintModal isOpen={isOpen} setIsOpen={setisOpen} />
      <BottomSheet
        isOpen={editTemp}
        onClose={() => seteditTemp(false)}
        onBtn1Click={onBtn1Click}
        onBtn2Click={onBtn2Click}
      />
    </div>
  );
};

export default page;
