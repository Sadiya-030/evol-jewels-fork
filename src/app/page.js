import Link from "next/link";
import evol from "../../public/evol.svg";
import img1 from "../../public/img1.png";
export default function Home() {
  return (
    <main className="min-h-screen w-screen overflow-hidden flex items-center justify-center bg-gray-50">
      <div className=" h-screen relative w-full bg-blue-500 flex flex-col items-center justify-center">
        <div className=" w-full h-screen z-0 absolute top-0 left-0">
          <div className="absolute h-full w-full top-0 left-0 z-10 bg-blue-950/75"></div>
        </div>
        <div className="absolute top-[700px] left-[-100px] flex  z-10items-center justify-center pointer-events-none">
          <div className="w-[1300px] h-[500px] rounded-full rotate-170 bg-[#bd72ff]/20 blur-[100px]"></div>
        </div>
        <div className=" absolute bottom-0 grid place-content-center w-full h-screen left-0 z-30 ">
          <div className=" z-10 w-[562px]  h-auto">
            <div className=" text-white text-[46px] font-ethereal absolute top-[820px] right-[300px]">
              AI
            </div>
            <img
              src={evol.src}
              alt=""
              className=" h-full w-full object-cover"
            />
          </div>
        </div>
        <div className=" z-50 relative w-full h-full flex items-end justify-start">
          <img src={img1.src} alt="" className="  " />
          <div className="absolute bottom-[134px] left-0 z-50 flex justify-center items-center w-full h-fit ">
            <Link
              href="/home"
              className=" h-[151px] shadow-[0_0_30px_rgba(255,255,255,0.7)] cursor-pointer w-[812px] p-2 rounded-[2000px] border-[3px] border-[#B7AEDB]"
            >
              <p className="border-[3px] shadow-[0_0_30px_rgba(255,255,255,0.7)] text-white font-ethereal text-[45px] text-center border-[#B7AEDB] rounded-[2000px] bg-[#522CB0] w-full h-full flex items-center justify-center">
                Touch here
              </p>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
