/* eslint-disable @next/next/no-img-element */
"use client";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Curate from "../../components/products/Curate";
import img1 from "../../../public/close.svg";
import TinderSwiper from "../../components/products/TinderSwiper";
import Browse from "../../components/products/Browse";
import { BsInfoCircle } from "react-icons/bs";
import { usePreferenceProdStore } from "../../store/preferenceProdStore";
import { useLikedStore } from "../../store/shortlistedProd";

const tabData = [
  {
    id: 1,
    name: "Curate",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 22 22"
        fill="none"
      >
        <path
          d="M18.0038 12.75C18.0057 13.0558 17.9128 13.3547 17.7379 13.6055C17.5629 13.8563 17.3146 14.0468 17.0269 14.1506L12.1913 15.9375L10.4101 20.7769C10.3046 21.0634 10.1137 21.3108 9.86328 21.4855C9.61282 21.6601 9.3148 21.7538 9.00944 21.7538C8.70407 21.7538 8.40606 21.6601 8.1556 21.4855C7.90514 21.3108 7.7143 21.0634 7.60881 20.7769L5.81631 15.9375L0.976936 14.1563C0.69037 14.0508 0.443055 13.8599 0.26836 13.6095C0.0936661 13.359 0 13.061 0 12.7556C0 12.4503 0.0936661 12.1522 0.26836 11.9018C0.443055 11.6513 0.69037 11.4605 0.976936 11.355L5.81631 9.5625L7.59756 4.72313C7.70305 4.43656 7.89389 4.18924 8.14435 4.01455C8.39481 3.83986 8.69282 3.74619 8.99819 3.74619C9.30355 3.74619 9.60157 3.83986 9.85203 4.01455C10.1025 4.18924 10.2933 4.43656 10.3988 4.72313L12.1913 9.5625L17.0307 11.3438C17.3185 11.4486 17.5667 11.6401 17.741 11.892C17.9153 12.1439 18.0072 12.4437 18.0038 12.75ZM12.7538 3.75H14.2538V5.25C14.2538 5.44891 14.3328 5.63968 14.4735 5.78033C14.6141 5.92098 14.8049 6 15.0038 6C15.2027 6 15.3935 5.92098 15.5341 5.78033C15.6748 5.63968 15.7538 5.44891 15.7538 5.25V3.75H17.2538C17.4527 3.75 17.6435 3.67098 17.7841 3.53033C17.9248 3.38968 18.0038 3.19891 18.0038 3C18.0038 2.80109 17.9248 2.61032 17.7841 2.46967C17.6435 2.32902 17.4527 2.25 17.2538 2.25H15.7538V0.75C15.7538 0.551088 15.6748 0.360322 15.5341 0.21967C15.3935 0.0790176 15.2027 0 15.0038 0C14.8049 0 14.6141 0.0790176 14.4735 0.21967C14.3328 0.360322 14.2538 0.551088 14.2538 0.75V2.25H12.7538C12.5549 2.25 12.3641 2.32902 12.2235 2.46967C12.0828 2.61032 12.0038 2.80109 12.0038 3C12.0038 3.19891 12.0828 3.38968 12.2235 3.53033C12.3641 3.67098 12.5549 3.75 12.7538 3.75ZM21.0038 6.75H20.2538V6C20.2538 5.80109 20.1748 5.61032 20.0341 5.46967C19.8935 5.32902 19.7027 5.25 19.5038 5.25C19.3049 5.25 19.1141 5.32902 18.9735 5.46967C18.8328 5.61032 18.7538 5.80109 18.7538 6V6.75H18.0038C17.8049 6.75 17.6141 6.82902 17.4735 6.96967C17.3328 7.11032 17.2538 7.30109 17.2538 7.5C17.2538 7.69891 17.3328 7.88968 17.4735 8.03033C17.6141 8.17098 17.8049 8.25 18.0038 8.25H18.7538V9C18.7538 9.19891 18.8328 9.38968 18.9735 9.53033C19.1141 9.67098 19.3049 9.75 19.5038 9.75C19.7027 9.75 19.8935 9.67098 20.0341 9.53033C20.1748 9.38968 20.2538 9.19891 20.2538 9V8.25H21.0038C21.2027 8.25 21.3935 8.17098 21.5341 8.03033C21.6748 7.88968 21.7538 7.69891 21.7538 7.5C21.7538 7.30109 21.6748 7.11032 21.5341 6.96967C21.3935 6.82902 21.2027 6.75 21.0038 6.75Z"
          fill="#002066"
        />
      </svg>
    ),
  },
  {
    id: 2,
    name: "Swipe",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="29"
        viewBox="0 0 28 29"
        fill="none"
      >
        <g clipPath="url(#clip0_1625_1571)">
          <path
            d="M6.99955 7.25C6.99955 5.80789 7.55267 4.42484 8.53724 3.40511C9.5218 2.38538 10.8572 1.8125 12.2495 1.8125C13.6419 1.8125 14.9773 2.38538 15.9619 3.40511C16.9464 4.42484 17.4995 5.80789 17.4995 7.25C17.4995 7.49035 17.4074 7.72086 17.2433 7.89082C17.0792 8.06077 16.8566 8.15625 16.6245 8.15625C16.3925 8.15625 16.1699 8.06077 16.0058 7.89082C15.8417 7.72086 15.7495 7.49035 15.7495 7.25C15.7495 6.28859 15.3808 5.36656 14.7244 4.68674C14.068 4.00692 13.1778 3.625 12.2495 3.625C11.3213 3.625 10.431 4.00692 9.77467 4.68674C9.11829 5.36656 8.74955 6.28859 8.74955 7.25C8.74955 7.49035 8.65736 7.72086 8.49326 7.89082C8.32917 8.06077 8.10661 8.15625 7.87455 8.15625C7.64248 8.15625 7.41992 8.06077 7.25583 7.89082C7.09173 7.72086 6.99955 7.49035 6.99955 7.25ZM22.6653 13.5938C21.7236 13.6391 20.9995 14.4796 20.9995 15.455V16.2796C21.0026 16.5135 20.92 16.7399 20.7684 16.9133C20.6169 17.0867 20.4075 17.1942 20.1825 17.2142C20.0628 17.2225 19.9428 17.2051 19.8298 17.1633C19.7169 17.1214 19.6135 17.056 19.526 16.971C19.4385 16.886 19.3688 16.7833 19.3212 16.6692C19.2737 16.5552 19.2493 16.4322 19.2495 16.308V13.6447C19.2495 12.6694 18.5255 11.8322 17.5838 11.7835C17.3471 11.7717 17.1107 11.8098 16.8887 11.8954C16.6667 11.9811 16.4638 12.1125 16.2923 12.2818C16.1208 12.451 15.9843 12.6546 15.891 12.8801C15.7977 13.1056 15.7496 13.3484 15.7495 13.5938V15.3757C15.7526 15.6095 15.67 15.8359 15.5184 16.0093C15.3669 16.1827 15.1575 16.2902 14.9325 16.3102C14.8128 16.3185 14.6928 16.3011 14.5798 16.2593C14.4669 16.2174 14.3635 16.152 14.276 16.067C14.1885 15.982 14.1188 15.8793 14.0712 15.7652C14.0237 15.6512 13.9993 15.5282 13.9995 15.404V7.30098C13.9995 6.32562 13.2755 5.48848 12.3338 5.43977C12.0971 5.42796 11.8607 5.46603 11.6387 5.55167C11.4167 5.63731 11.2138 5.76875 11.0423 5.938C10.8708 6.10726 10.7343 6.31081 10.641 6.53633C10.5477 6.76186 10.4996 7.00465 10.4995 7.25V20.8143C10.5022 21.0335 10.4299 21.2465 10.2953 21.4157C10.1608 21.5849 9.97275 21.6993 9.76455 21.7387H9.75142C9.6209 21.7538 9.48896 21.7287 9.3722 21.6664C9.25543 21.6041 9.15905 21.5075 9.09517 21.3886L6.7983 17.2607C6.32798 16.4156 5.29548 16.0633 4.45767 16.5107C4.24596 16.6223 4.05839 16.7772 3.90637 16.9662C3.75435 17.1553 3.64108 17.3743 3.57344 17.6102C3.5058 17.846 3.48522 18.0936 3.51294 18.3379C3.54066 18.5822 3.61612 18.8181 3.7347 19.0312L7.11986 25.8338C7.19708 25.97 7.30735 26.083 7.43973 26.1615C7.57211 26.24 7.72201 26.2813 7.87455 26.2812H22.7495C22.9121 26.2814 23.0715 26.2346 23.2098 26.1461C23.3481 26.0577 23.4599 25.9311 23.5327 25.7805C23.572 25.699 24.4995 24.0745 24.4995 21.1757V15.4062C24.4998 15.1607 24.4519 14.9177 24.3588 14.6919C24.2656 14.4661 24.1291 14.2623 23.9576 14.0928C23.786 13.9233 23.5831 13.7916 23.3609 13.7059C23.1388 13.6201 22.9021 13.5819 22.6653 13.5938Z"
            fill="#302B2C"
          />
        </g>
        <defs>
          <clipPath id="clip0_1625_1571">
            <rect width="28" height="29" fill="white" />
          </clipPath>
        </defs>
      </svg>
    ),
  },
];
export default function ProductsPage() {
  const { clearLikes } = useLikedStore();

  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { like, liked, unliked, clearPreferenceProd } =
    usePreferenceProdStore();
  useEffect(() => {
    const storedProducts = sessionStorage.getItem("products");
    const storedQuery = sessionStorage.getItem("searchQuery");

    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      router.push("/");
    }
    setIsLoading(false);
    clearLikes();
  }, [router]);

  const [selectedOpt, setselectedOpt] = useState("Curate");
  const [DisLikedProducts, setDisLikedProducts] = useState([]);

  // --- NEW: Curate pagination + selection ---
  const PAGE_SIZE = 7;
  const [curatePage, setCuratePage] = useState(0); // 0-based

  // const toggleCurateSelect = (prod) => {
  //   setCurateSelectedIds((prev) => {
  //     const next = new Set(prev);
  //     if (next.has(prod.id)) {
  //       next.delete(prod.id);
  //       unliked(prod?.id);
  //     } else {
  //       next.add(prod.id);
  //       like(prod);
  //     }
  //     return next;
  //   });
  // };

  // reset page when switching tabs
  useEffect(() => {
    if (selectedOpt === "Curate") setCuratePage(0);
  }, [selectedOpt]);

  const DislikedProdFun = (data) => {
    const alreadyDisLiked = DisLikedProducts?.some((d) => d?.id === data?.id);
    if (!alreadyDisLiked) setDisLikedProducts([...DisLikedProducts, data]);
  };

  // Reconsider plumbing you added earlier (kept as-is if you’re using Swipe)
  const [reinsertCard, setReinsertCard] = useState(null);
  const productsPerPage = 7;
  const totalPages = Math.ceil(products?.length / productsPerPage);
  return (
    <div className="min-h-screen min-w-screen overflow-hidden bg-gray-50">
      <div className=" h-[137px] w-full flex items-center justify-between px-[50px]">
        <p className=" text-4xl  text-black">Gift a Moment</p>
        <button
          onClick={() => {
            clearPreferenceProd();
            router.push("/home/gift-joy");
          }}
          className="  border border-[#181818c3] rounded-md h-fit w-fit grid place-content-center"
        >
          <p className=" text-black text-xl  px-3 py-2 grid place-content-center">
            Home
          </p>
        </button>
      </div>

      <div className=" border-t border-b border-[#CECECE] h-[126px] flex">
        {tabData.map((d, i) => (
          <div
            key={i}
            onClick={() => setselectedOpt(d?.name)}
            className={` border-blue-300 text-[#002066] cursor-pointer w-full text-xl relative leading-[42px]  flex items-center gap-3 justify-center `}
          >
            {d?.icon} {d?.name}
            {selectedOpt === d?.name && (
              <motion.div
                layoutId="underline"
                className="bg-[#002066] h-[4px] w-full absolute bottom-0 left-0"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </div>
        ))}
      </div>
      <p className=" mb-5 mt-9 mx-auto rounded-[2000px] text-[22px] font-medium text-[#7C50E3] w-[calc(100vw-200px)] flex items-center justify-center gap-6 h-[66px] border border-[#7C50E336] bg-[#7C50E30A]">
        <BsInfoCircle size={28} />
        Pick what you like , we’re learning your style to show you a fuller list
        next.
      </p>
      {selectedOpt === "Curate" ? (
        <>
          <Curate
            data={products}
            page={curatePage}
            pageSize={PAGE_SIZE}
            onToggleSelect={() => {}}
          />
        </>
      ) : selectedOpt === "Swipe" ? (
        <TinderSwiper
          DislikedProdFun={DislikedProdFun}
          data={products}
          reinsertCard={reinsertCard}
          onReinsertionHandled={() => setReinsertCard(null)}
        />
      ) : selectedOpt === "Browse" ? (
        <Browse data={products} />
      ) : null}

      {selectedOpt === "Curate" ? (
        curatePage === totalPages - 1 ? (
          <div className="bg-white fixed bottom-0 left-0 border-y items-center justify-between  h-[153px] w-full px-[99px] flex">
            <div className=" flex justify-end  w-full gap-[24px]">
              <button
                onClick={() => {
                  router.push("/products/browse");
                }}
                className=" text-white rounded-[200px] text-[26px] border bg-[#002066] h-[77px] leading-[54px] px-[34px] w-fit "
              >
                View Products
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white border-y items-center justify-between  h-[153px] w-full px-[99px] flex">
            <p className=" text-[26px] leading-[140px] text-[#302B2C]">
              {curatePage + 1} out of {totalPages} comparisons
            </p>
            <div className=" flex gap-[24px]">
              {curatePage < totalPages - 1 && (
                <button
                  className=" rounded-[200px] text-[26px] border border-[#0020661F] text-[#002066] h-[77px] leading-[54px] px-[34px] w-fit bg-[#00206614]"
                  onClick={() =>
                    setCuratePage((p) => Math.min(p + 1, totalPages - 1))
                  }
                >
                  Skip All
                </button>
              )}
              <button
                // disabled={curatePage >= totalPages - 1}
                onClick={() =>
                  setCuratePage((p) => Math.min(p + 1, totalPages - 1))
                }
                className=" text-white rounded-[200px] text-[26px] border bg-[#002066] h-[77px] leading-[54px] px-[34px] w-fit disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )
      ) : selectedOpt === "Swipe" ? (
        <div className="bg-white border-y items-center justify-end  h-[153px] w-full px-[99px] flex">
          <div className=" flex gap-[24px]">
            <button
              onClick={() => {
                router.push("products/browse");
              }}
              className=" text-white rounded-[200px] text-[26px] border bg-[#002066] h-[77px] leading-[54px] px-[34px] w-fit "
            >
              skip
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
