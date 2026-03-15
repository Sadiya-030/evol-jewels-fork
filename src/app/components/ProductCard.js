"use client";

import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ product }) {
  const { shopifyData, pineconeMetadata } = product;
  
  const firstImage = shopifyData?.images?.edges?.[0]?.node?.src || pineconeMetadata?.productImage || "/placeholder.svg";
  
  const prices = shopifyData?.variants?.edges?.map(edge => parseFloat(edge.node.price)) || [];
  const minPrice = prices.length > 0 ? Math.min(...prices) : parseFloat(pineconeMetadata?.productPrice || 0);
  
  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(minPrice);

  const productId = encodeURIComponent(shopifyData?.id || pineconeMetadata?.productId || "");

  return (
    <Link href={`/products/${productId}`}>
      <div className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col">
        <div className="relative w-full h-80 bg-gray-100 overflow-hidden">
          <Image
            src={firstImage}
            alt={shopifyData?.title || pineconeMetadata?.productTitle || "Product"}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {pineconeMetadata?.productAvailable === "false" && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Out of Stock
            </div>
          )}
        </div>
        
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {shopifyData?.title || pineconeMetadata?.productTitle}
          </h3>
          
          <p className="text-sm text-gray-500 mb-3 capitalize">
            {shopifyData?.productType || pineconeMetadata?.productType}
          </p>
          
          <div className="mt-auto">
            <p className="text-2xl font-bold text-gray-900 mb-2">
              {formattedPrice}
              {prices.length > 1 && <span className="text-sm font-normal text-gray-500"> onwards</span>}
            </p>
            
            {shopifyData?.tags && shopifyData.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {shopifyData.tags.slice(0, 3).map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                  >
                    {tag.replace(/_/g, " ")}
                  </span>
                ))}
                {shopifyData.tags.length > 3 && (
                  <span className="text-xs text-gray-500 px-2 py-1">
                    +{shopifyData.tags.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

