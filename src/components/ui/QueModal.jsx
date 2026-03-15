import React from "react";

const QueModal = ({ isOpen, onClose, setOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center">
      <div className="absolute inset-0 bg-gray-900/70 backdrop-blur-xs transition-opacity"></div>

      <div className="relative bg-white rounded-[24px] h-fit w-[940px] z-10 py-[95px] shadow-xl flex flex-col items-center justify-center">
        <p className="text-[45px] mb-9 text-center font-ethereal leading-[64px] font-medium text-gray-800">
          Product not found. Edit your answers and <br /> try again.
        </p>

        <p
          onClick={() => {
            onClose();
            setOpen();
          }}
          className=" flex items-center justify-center w-full rounded-full text-[30px] mx-auto max-w-[522px] h-[100px] bg-[#002066] text-white"
        >
          Edit Question & Try Again
        </p>
      </div>
    </div>
  );
};

export default QueModal;
