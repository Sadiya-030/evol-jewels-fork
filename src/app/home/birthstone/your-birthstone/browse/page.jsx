/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useMemo, useState } from "react";
import img1 from "../../../../../../public/close.svg";
import { useRouter } from "next/navigation";
// import BottomSliderForProdut from "../";
import { browseStore } from "../../../../../store/browseProduct";
import { shortlistedBirthstoneProd } from "../../../../../store/birthstone/shortlistedBirthstoneProd";
import BrowseV2 from "../../../../../components/products/BrowseV2";
import BottomSliderForProdut from "../../../../../components/BottomSliderForProduct";
// import BrowseV2 from "../";

export default function ProductsPage() {
  const router = useRouter();
  const { browseProducts, setBrowseProducts, clearBrowseProducts } =
    browseStore();
  const { clearLikes, toggleLike, likedProducts } = shortlistedBirthstoneProd();
  const [isLoading, setisLoading] = useState(false);
  const fetchProducts = async (tagString) => {
    setisLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CMSURL}/api/products/search`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query:
              "I want a gift for my sister and she likes ring gid://shopify/Product/9782295429434 gid://shopify/Product/8580955177274 gid://shopify/Product/8115579945274 gid://shopify/Product/8539391885626 gid://shopify/Product/9713166156090 gid://shopify/Product/9380841816378 gid://shopify/Product/9285483397434 gid://shopify/Product/9731609198906 gid://shopify/Product/9020434415930 gid://shopify/Product/9712279519546 gid://shopify/Product/8120423842106 gid://shopify/Product/10043819065658 gid://shopify/Product/9693463085370",
            topK: 36,
          }),
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
    if (!browseProducts) {
      fetchProducts();
    }
  }, []);

  const [isOpen, setisOpen] = useState(false);
  const [HeaderName, setHeaderName] = useState("");
  return (
    <div className="min-h-screen bg-gray-50">
      <div className=" h-[137px] w-full flex items-center justify-between px-[50px]">
        <p className=" text-4xl  text-black">Gift a Moment</p>
        <button
          onClick={() => {
            clearBrowseProducts();
            clearLikes();
            router?.back();
          }}
          className=" bg-white border h-[63px] w-[63px] rounded-full grid place-content-center"
        >
          <img
            src={img1.src}
            alt=""
            className=" h-[23px] object-cover w-[23px]"
          />
        </button>
      </div>

      <BrowseV2 data={browseProducts} isLoading={isLoading} />

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
        HeaderName={HeaderName}
        isOpen={isOpen}
        setisOpen={setisOpen}
        browseProducts={browseProducts}
        likedProducts={likedProducts}
        toggleLike={toggleLike}
      />
    </div>
  );
}
