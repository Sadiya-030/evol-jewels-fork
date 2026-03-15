"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import img1 from "../../../../public/close.svg";
import { div } from "framer-motion/client";
import Link from "next/link";
import PersonalTouch from "../../../components/PersonalTouch";
import { useGreetingStore } from "../../../store/greetingStore";

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [PrsTouch, setPrsTouch] = useState(false);
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedProducts = sessionStorage.getItem("products");

    if (storedProducts) {
      const products = JSON.parse(storedProducts);
      const productId = decodeURIComponent(params.id);
      const foundProduct = products?.filter(
        (e) => e?.pineconeMetadata?.productHandle === params?.id
      );
      if (foundProduct) {
        setProduct(foundProduct[0]);
        if (foundProduct.shopifyData?.variants?.edges?.length > 0) {
          setSelectedVariant(foundProduct.shopifyData.variants.edges[0].node);
        }
      } else {
        router.push("/products");
      }
    } else {
      router.push("/");
    }
    setIsLoading(false);
  }, [params.id, router]);

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
  const images = shopifyData?.images?.edges || [];

  // const descriptionItems = parseDescription(shopifyData?.descriptionHtml);
  function extractJewelryDetails(descriptionHtml) {
    // 1️⃣ Split by comment markers
    const parts = descriptionHtml.split("<!-- split -->").map((p) => p.trim());

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
        <button className=" bg-white border h-[63px] w-[63px] rounded-full grid place-content-center">
          <img
            src={img1.src}
            alt=""
            className=" h-[23px] object-cover w-[23px]"
          />
        </button>
      </div>

      <main className="mx-auto ">
        <div className=" bg-gray-100">
          <div className=" pt-[78px] ml-[56px]">
            <Link href="/products" className=" flex items-center gap-[35px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="63"
                height="63"
                viewBox="0 0 63 63"
                fill="none"
              >
                <g clipPath="url(#clip0_1584_2397)">
                  <path
                    d="M53.1562 31.5H9.84375"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M27.5625 13.7812L9.84375 31.5L27.5625 49.2188"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_1584_2397">
                    <rect width="63" height="63" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              <span className=" font-ethereal text-black text-[56px] leading-[71.863px;]">
                {product?.pineconeMetadata?.productTitle}
              </span>
            </Link>
          </div>
          <div className="relative  my-[84px] mx-[95px]   w-auto h-[719px] bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={
                images[selectedImage]?.node?.src ||
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
                      src={image.node.src}
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
        <div className="   flex flex-col justify-between w-full h-[658px]">
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

                <div className=" w-fit gap-[20px]  mr-[100px] border rounded-[16px] border-[#D4D4D4] h-[71px] px-[35px] flex items-center justify-center">
                  <p className=" text-black">Certification</p>
                  <p className=" text-[22px] whitespace-nowrap text-black font-bold">
                    {ProdData?.certification}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className=" py-[38px]   px-[100px] bg-white h-fit mt-[44px] flex gap-[24px]  justify-end ">
            {/* <button className=" rounded-[200px] text-[26px] border border-[#0020661F] text-[#002066] h-[77px] leading-[54px] px-[34px] w-fit bg-[#00206614]">
              Ask for Support
            </button> */}
            <p
              // href={`/products/${product?.pineconeMetadata?.productHandle}/print-greeting`}
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
            href={`/products/${product?.pineconeMetadata?.productHandle}/choose-greeting-templates`}
          />
        </div>
      </main>
    </div>
  );
}
