/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import img1 from "../../../../public/close.svg";
import Browse from "../../../components/products/Browse";
import BottomSliderForProdut from "../../../components/BottomSliderForProduct";
import { usePreferenceProdStore } from "../../../store/preferenceProdStore";
import { browseStore } from "../../../store/browseProduct";
import { useLikedStore } from "../../../store/shortlistedProd";

export default function ProductsPage() {
  const router = useRouter();
  const {
    browseProducts,
    setBrowseProducts,
    clearBrowseProducts,
    hasHydrated,
  } = browseStore();
  const { clearLikes, toggleLike, likedProducts } = useLikedStore();

  const { liked } = usePreferenceProdStore();
  const [isLoading, setisLoading] = useState(false);
  const fetchProducts = async (tagString) => {
    setisLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CMSURL}/api/products/search`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: tagString, topK: 36 }),
        },
      );

      const data = await response.json();
      if (data.success && data.products) {
        setBrowseProducts(data.products);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      alert("Failed to fetch products. Please try again.");
    } finally {
      setisLoading(false);
    }
  };

  useEffect(() => {
    // Wait for Zustand to hydrate from localStorage
    if (!hasHydrated) return;

    const storedQuery = sessionStorage.getItem("searchQuery");

    // If data already exists → do NOT call API
    if (browseProducts.length > 0) {
      return;
    }

    if (!storedQuery) return;

    // Fetch only when products are empty
    fetchProducts(`${storedQuery} ${[...liked].join(" ")}`);
  }, [hasHydrated]); // <-- IMPORTANT!

  const [isOpen, setisOpen] = useState(false);
  const [HeaderName, setHeaderName] = useState("");
  const [modalProdData, setmodalProdData] = useState([]);
  return (
    <div className="min-h-screen">
      <div className="min-h-screen absolute inset-0 overflow-hidden z-20">
        <div className=" h-[137px] w-full flex items-center justify-between px-[50px]">
          <p className=" text-4xl  text-black">Gift a Moment</p>
          <button
            onClick={() => {
              clearBrowseProducts();
              clearLikes();
              router.push("/home/gift-joy");
            }}
            className="  border border-[#18181866] rounded-md h-fit w-fit grid place-content-center"
          >
            <p className=" text-black text-xl  px-3 py-2 grid place-content-center">
              Home
            </p>
          </button>
        </div>
        <div className=" overflow-scroll h-[1620px]">
          <Browse
            engagement={false}
            data={browseProducts}
            isLoading={isLoading}
          />
        </div>

        <div className="bg-white fixed bottom-0 left-0 border-y items-center justify-between  h-[153px] w-full px-[99px] flex">
          <div className=" flex justify-end  w-full gap-[24px]">
            <button
              onClick={() => {
                clearBrowseProducts();
                clearLikes();
                router.push("/products");
              }}
              className=" rounded-[200px] text-[26px] border border-[#0020661F] text-[#002066] h-[77px] leading-[54px] px-[34px] w-fit bg-[#00206614]"
            >
              Edit Preferences
            </button>
            <button
              onClick={() => {
                setHeaderName("Shortlisted products");
                setisOpen(true);
              }}
              className=" text-white rounded-[200px] text-[26px] border bg-[#002066] h-[77px] leading-[54px] px-[34px] w-fit "
            >
              View Shortlisted{" "}
            </button>
          </div>
        </div>

        <BottomSliderForProdut
          toggleLike={toggleLike}
          likedProducts={likedProducts}
          HeaderName={HeaderName}
          isOpen={isOpen}
          setisOpen={setisOpen}
          browseProducts={browseProducts}
        />
      </div>
    </div>
  );
}
