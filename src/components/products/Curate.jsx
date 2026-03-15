import { usePreferenceProdStore } from "../../store/preferenceProdStore";
import React, { useMemo } from "react";

const Curate = ({
  data,
  likedProdFun,
  // NEW props:
  page = 0,
  pageSize = 7,
  selectedIds, // Set of liked ids (persist across pages)
  onToggleSelect, // (product) => void
}) => {
  const isVideo = (url) => /\.(mp4|webm|ogg)$/i.test(url || "");

  const { liked, toggleLike, clearPreferenceProd } = usePreferenceProdStore();
  // current page slice (7 items)
  const pageItems = useMemo(() => {
    const start = page * pageSize;
    return (data || []).slice(start, start + pageSize);
  }, [data, page, pageSize]);

  const topFive = pageItems.slice(0, 5);
  const bottomTwo = pageItems.slice(5, 7);

  const handleClick = (prod) => {
    toggleLike(prod);
  };

  return (
    <div className="">
      <p className="text-[48px] font-ethereal  text-center leading-[90px] text-[#302B2C]">
        Which one feels more you?
      </p>
      <p className="text-[24px] font-ethereal text-[#302B2C] leading-[40px] text-center mb-[45px]">
        See a few options at once — tap your favorites to refine your shortlist.
      </p>

      {pageItems?.length ? (
        <div>
          {/* Top Grid (2 rows x 3 cols; middle tall) */}
          <div className="w-full h-[731px] grid grid-rows-2 grid-cols-3">
            {topFive.map((prod, i) => {
              const selected = [...liked]?.includes(prod.shopifyData?.id);

              return (
                <div
                  key={prod?.id}
                  onClick={() => handleClick(prod)}
                  className={`relative cursor-pointer transition-all duration-300 ${
                    i === 2 ? "row-span-2" : ""
                  } ${selected ? "" : ""}`}
                >
                  {isVideo(prod?.pineconeMetadata?.productImage) ? (
                    <video
                      src={prod?.pineconeMetadata?.productImage}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <img
                      src={prod?.pineconeMetadata?.productImage}
                      alt={prod?.pineconeMetadata?.productTitle}
                      className="h-full border w-full object-cover"
                    />
                  )}
                  <div
                    className={`absolute inset-0 bg-black/20 opacity-0  transition-opacity duration-300 ${
                      selected ? "opacity-100 bg-black/30" : ""
                    }`}
                  ></div>
                </div>
              );
            })}
          </div>

          {/* Bottom Row (2 items) */}
          <div className="h-[476px] flex w-full">
            {bottomTwo.map((prod) => {
              const selected = [...liked]?.includes(prod.shopifyData?.id);
              return (
                <div
                  key={prod?.id}
                  onClick={() => handleClick(prod)}
                  className={`relative cursor-pointer border-none transition-all duration-300 w-full ${
                    selected ? "" : ""
                  }`}
                >
                  {isVideo(prod?.pineconeMetadata?.productImage) ? (
                    <video
                      src={prod?.pineconeMetadata?.productImage}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <img
                      src={
                        prod?.pineconeMetadata?.productImage ||
                        prod?.pineconeMetadata?.productImage
                      }
                      alt={prod?.pineconeMetadata?.productTitle}
                      className="h-full w-full border object-cover"
                    />
                  )}
                  <div
                    className={`absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 ${
                      selected ? "opacity-100 bg-black/30" : ""
                    }`}
                  ></div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div>No Product Found</div>
      )}
    </div>
  );
};

export default Curate;
