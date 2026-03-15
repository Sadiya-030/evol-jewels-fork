"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import img1 from "../../../../public/close.svg";
import Link from "next/link";
import PersonalTouch from "../../../components/PersonalTouch";
import { GoArrowLeft } from "react-icons/go";
import { useLikedStore } from "../../../store/shortlistedProd";
import { browseStore } from "../../../store/browseProduct";

export default function ProductDetailPage() {
  const { likedProducts, toggleLike } = useLikedStore();

  const router = useRouter();
  const params = useParams();
  const [PrsTouch, setPrsTouch] = useState(false);
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { browseProducts, hasHydrated } = browseStore();

  useEffect(() => {
    if (browseProducts) {
      const foundProduct = browseProducts?.filter(
        (e) => e?.pineconeMetadata?.productHandle === params?.id
      );

      if (foundProduct) {
        setProduct(foundProduct[0]);
        if (foundProduct.shopifyData?.variants?.edges?.length > 0) {
          setSelectedVariant(foundProduct.shopifyData.variants.edges[0].node);
        }
      } else {
        router.push("/browse");
      }
    } else {
      router.push("/");
    }
    setIsLoading(false);
  }, [browseProducts, params.id]);
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const { shopifyData, pineconeMetadata } = product;
  const images = shopifyData?.images || [];

  // const descriptionItems = parseDescription(shopifyData?.descriptionHtml);
  function extractJewelryDetails(descriptionHtml) {
    // 1️⃣ Split by comment markers
    const parts = descriptionHtml?.split("<!-- split -->").map((p) => p.trim());

    // 2️⃣ Create an object to store extracted info
    const details = {
      diamond: null,
      goldWeights: {}, // e.g. { '14KT': '3.00g', '18KT': '3.8g' }
      certification: null,
      description: [],
    };

    // 3️⃣ Loop through each part and extract relevant info
    parts.forEach((html) => {
      // Extract text content
      const text = html.replace(/<[^>]+>/g, "").trim();

      // Check for diamond / certification
      if (/diamond/i.test(text)) {
        if (/ef|vvs|si|vs/i.test(text)) {
          details.certification = text.match(/:\s*(.+)/)?.[1]?.trim() || text;
        }
        details.description.push(text);
      }

      // Check for KT Gold weights
      if (/14KT/i.test(text)) {
        const weight = text.match(/([\d.]+g)/i)?.[1];
        details.goldWeights["14KT"] = weight || null;
      }
      if (/18KT/i.test(text)) {
        const weight = text.match(/([\d.]+g)/i)?.[1];
        details.goldWeights["18KT"] = weight || null;
      }

      // Collect everything as description
      details.description.push(text);
    });

    // Remove duplicates from description
    details.description = [...new Set(details.description)];

    return details;
  }

  const ProdData = extractJewelryDetails(shopifyData?.descriptionHtml);
  return (
    <div className="min-h-screen bg-gray-50">
      <div className=" h-[137px] w-full flex items-center justify-between px-[50px]">
        <p className=" text-4xl  text-black">Gift a Moment</p>
        <Link
          href="/home"
          className="rounded-md border-[2.207px] text-xl text-black border-black px-3 py-2 grid place-content-center"
        >
          Home
        </Link>
      </div>

      <main className="mx-auto ">
        <div className=" bg-gray-100">
          <div className="  h-[180px] px-[60px] w-full items-center justify-between gap-4 flex">
            <Link href="/browse" className=" flex items-center gap-[25px]">
              <GoArrowLeft size={60} className=" flex-shrink-0 text-black" />

              <span className=" font-ethereal text-black text-[50px] line-clamp-2 leading-[60px]">
                {product?.pineconeMetadata?.productTitle}
              </span>
            </Link>
            {/* <IoMdHeartEmpty size={63} className="text-black flex-shrink-0" /> */}
            <svg
              onClick={(e) => {
                toggleLike(product);
              }}
              xmlns="http://www.w3.org/2000/svg"
              width="60"
              height="60"
              viewBox="0 0 30 26"
              fill={likedProducts.includes(product?.id) ? "red" : "none"}
            >
              <path
                d="M14.7665 24.6103L26.9837 12.2181C28.2659 10.9359 28.9862 9.19696 28.9862 7.38371C28.9862 5.57047 28.2659 3.83149 26.9837 2.54934C25.7016 1.26718 23.9626 0.546875 22.1493 0.546875C20.3361 0.546875 18.5971 1.26718 17.315 2.54934L14.7665 4.92278L12.2181 2.54934C10.9359 1.26718 9.19696 0.546875 7.38371 0.546875C5.57047 0.546875 3.83149 1.26718 2.54934 2.54934C1.26718 3.83149 0.546875 5.57047 0.546875 7.38371C0.546875 9.19696 1.26718 10.9359 2.54934 12.2181L14.7665 24.6103Z"
                stroke="#302B2C"
                strokeWidth="1.09375"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="relative  mb-[84px] mx-[95px]   w-auto h-[719px] bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={
                images[selectedImage]?.src ||
                pineconeMetadata?.productImage ||
                "/placeholder.svg"
              }
              alt={shopifyData?.title || "Product"}
              fill
              className="object-cover brightness-110  mix-blend-multiply  h-full w-full"
              priority
              // sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div className=" mt-[21px] pb-[54px]">
            {images.length > 1 && (
              <div className=" flex no-scrollbar overflow-x-auto gap-[19px]">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative ${index === 0 && "ml-[94px]"} ${
                      index === images.length - 1 && "mr-[94px]"
                    } h-[160px] flex-shrink-0 w-[160px] border bg-white rounded-[24px] overflow-hidden  transition-all 
                      
                    `}
                  >
                    <div
                      className={`cursor-pointer ${
                        selectedImage === index
                          ? "bg-black/30"
                          : "hover:bg-black/30 "
                      }  z-50 absolute top-0  left-0 w-full h-full `}
                    ></div>
                    <Image
                      src={image?.src}
                      alt={`Product view ${index + 1}`}
                      fill
                      className="object-cover h-full w-full"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="   flex flex-col justify-between w-full h-[580px]">
          <div className=" ">
            <div className=" px-[100px] mt-[33px] min-h-[81px] items-center flex justify-between">
              <p className=" text-black font-ethereal text-[38px]">
                {product?.pineconeMetadata?.productTitle}
              </p>
              <p className=" text-black text-[28px]">
                ₹{product?.pineconeMetadata?.productPrice}
              </p>
            </div>
            <div className=" px-[100px]">
              <p className=" text-[24px] mt-1.5 max-w-[585px] leading-[45px] text-[#000]">
                A delicate pendant inspired by morning dew. Designed for those
                who love simplicity and grace
              </p>
            </div>
            <div>
              <div className=" flex no-scrollbar gap-[24px] mt-[47px] overflow-x-auto">
                {ProdData?.goldWeights &&
                  Object.entries(ProdData.goldWeights).map(
                    ([purity, weight], i) => (
                      <div
                        key={weight}
                        className={`${i === 0 && "ml-[100px]"} flex gap-[24px]`}
                      >
                        <div className=" w-fit gap-[20px] border rounded-[16px] border-[#D4D4D4] h-[71px] px-[35px] flex items-center justify-center">
                          <p className=" text-black whitespace-nowrap">
                            Gold Purity
                          </p>
                          <p className=" text-[22px] text-black font-bold">
                            {purity}
                          </p>
                        </div>
                        <div className=" w-fit gap-[20px] border rounded-[16px] border-[#D4D4D4] h-[71px] px-[35px] flex items-center justify-center">
                          <p className=" text-black">Weight</p>
                          <p className=" text-[22px] text-black font-bold">
                            {weight}
                          </p>
                        </div>
                      </div>
                    )
                  )}

                <div
                  className={` w-fit ${
                    !ProdData?.goldWeights && "ml-[100px]"
                  } gap-[20px] mr-[100px] border rounded-[16px] border-[#D4D4D4] h-[71px] px-[35px] flex items-center justify-center`}
                >
                  <p className=" text-black">Certification</p>
                  <p className=" text-[22px] whitespace-nowrap text-black font-bold">
                    {ProdData?.certification}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className=" py-[38px]   px-[100px] bg-white h-fit  flex gap-[24px]  justify-end ">
            {/* <button className=" rounded-[200px] text-[26px] border border-[#0020661F] text-[#002066] h-[77px] leading-[54px] px-[34px] w-fit bg-[#00206614]">
              Ask for Support
            </button> */}
            <p
              onClick={(e) => {
                toggleLike(product);
              }}
              className=" rounded-[200px] flex items-center justify-center text-[26px] border border-[#0020661F] text-[#002066] h-[77px] leading-[54px] px-[34px] w-fit bg-[#00206614]"
            >
              Shortlist This
            </p>
            <p
              onClick={() => {
                setPrsTouch(true);
              }}
              className=" text-white flex items-center justify-center rounded-[200px] text-[26px] border bg-[#002066] h-[77px] leading-[54px] px-[34px] w-fit "
            >
              Choose This Gift
            </p>
          </div>
          <PersonalTouch
            prdName={product?.pineconeMetadata?.productTitle}
            isOpen={PrsTouch}
            product={product}
            href={`/browse/${product?.pineconeMetadata?.productHandle}/choose-greeting-templates`}
          />
        </div>
      </main>
    </div>
  );
}
