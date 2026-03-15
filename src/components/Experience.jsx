"use client";
import React, { useMemo, useRef, useState, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useDragControls,
  animate,
} from "framer-motion";
import CharmsWithNamePrice from "./CharmsWithNamePrice";
import { markCouponAsUsed } from "../utils/Apis";
import { charmsCode } from "../store/CharmsCode/charmsCode";
import { IoCloseOutline } from "react-icons/io5";

// --- helpers: build a honeycomb/hex grid (apple watch-ish) ---
function makeHoneycomb(itemsCount, ringCount = 8, step = 110) {
  const coords = [];
  const dirs = [
    [1, 0],
    [1, -1],
    [0, -1],
    [-1, 0],
    [-1, 1],
    [0, 1],
  ];

  coords.push([0, 0]);

  for (let k = 1; k <= ringCount; k++) {
    let q = -k,
      r = k;
    for (let side = 0; side < 6; side++) {
      for (let i = 0; i < k; i++) {
        coords.push([q, r]);
        q += dirs[side][0];
        r += dirs[side][1];
      }
    }
  }

  const toPx = (q, r) => {
    const x = step * (Math.sqrt(3) * q + (Math.sqrt(3) / 2) * r);
    const y = step * ((3 / 2) * r);
    return { x, y };
  };

  return coords.slice(0, itemsCount).map(([q, r], idx) => ({
    id: idx + 1,
    ...toPx(q, r),
  }));
}

const Experience = ({
  setmodalmsg,
  charms = [],
  goldSize,
  setIsOpen,
  spinFlow,
  filteredCharms,
}) => {
  const [isVending, setIsVending] = useState(false);

  const wrapRef = useRef(null);
  const [center, setCenter] = useState({ x: 0, y: 0 });
  const [focusedId, setFocusedId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  // track viewport center
  const { charmsSize, setCharmsSize } = charmsCode();

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      setCenter({ x: rect.width / 2, y: rect.height / 2 });
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  // drag motion values
  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);

  const x = useSpring(mvX, { stiffness: 120, damping: 20, mass: 0.6 });
  const y = useSpring(mvY, { stiffness: 120, damping: 20, mass: 0.6 });

  const dragControls = useDragControls();

  const layout = useMemo(
    () => makeHoneycomb(charms.length, 80, 320),
    [charms.length]
  );
  const focusItem = (pos, id) => {
    setFocusedId(id);

    animate(mvX, center.x - pos.x, {
      type: "spring",
      stiffness: 120,
      damping: 20,
      mass: 0.6,
    });

    animate(mvY, center.y - pos.y, {
      type: "spring",
      stiffness: 120,
      damping: 20,
      mass: 0.6,
    });
  };
  // const handelSelectCharm = async () => {
  //   if (isVending) return; // 🔒 throttle

  //   const sesId = sessionStorage.getItem("charmSessionId");
  //   const datacharm = charms.filter((item) => item.id === focusedId)[0];
  //   const data = await markCouponAsUsed(
  //     charmsSize,
  //     spinFlow,
  //     datacharm?.weight,
  //     datacharm?.title,
  //     sesId
  //   );
  //   if (data?.success === false) {
  //     setmodalmsg(data?.error);
  //     setIsOpen(true);
  //     return;
  //   }
  //   sessionStorage.removeItem("charmSessionId");
  //   setmodalmsg("");
  //   setIsOpen(true);
  //   setFocusedId("");
  //   setCharmsSize(null);
  // };
  const handelSelectCharm = async () => {
    if (isVending) return; // 🔒 throttle

    setIsVending(true);

    try {
      const sesId = sessionStorage.getItem("charmSessionId");
      if (!sesId) {
        setmodalmsg("Session expired. Please re-enter code.");
        setIsOpen(true);
        return;
      }

      const datacharm = charms.find((item) => item.id === focusedId);
      const data = await markCouponAsUsed(
        charmsSize,
        spinFlow,
        datacharm?.weight,
        datacharm?.title,
        sesId
      );

      if (data?.success === false) {
        setmodalmsg(data?.error);
        setIsOpen(true);
        return;
      }
      // const espResponse = await fetch("http://EVOLVendingMachine.local/vend", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     command: "VEND",
      //     slot: 3,
      //   }),
      // });

      // if (!espResponse.ok) {
      //   throw new Error("Service unavailable");
      // }

      // const espText = await espResponse.text();

      sessionStorage.removeItem("charmSessionId");
      setFocusedId("");
      setmodalmsg("");
      setIsOpen(true);
      setCharmsSize(null);
    } finally {
      setIsVending(false);
    }
  };
  return (
    <div
      ref={wrapRef}
      className="fixed inset-0 overflow-hidden touch-none"
      onPointerDown={(e) => {
        if (focusedId) return; // 🔴 block drag start
        dragControls.start(e);
      }}
    >
      <motion.div
        drag={!focusedId} // 🔴 disable drag when focused
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
        dragControls={dragControls}
        dragListener={false}
        style={{ x, y }}
        dragMomentum={!focusedId} // optional but recommended
        dragElastic={focusedId ? 0 : 0.8}
        dragConstraints={{ top: -4000, left: -4000, right: 4000, bottom: 4000 }}
        className="absolute inset-0"
      >
        {charms.map((item, i) => (
          <HoneyItem
            key={i}
            item={item}
            pos={layout[i]}
            center={center}
            dragX={x}
            dragY={y}
            onFocus={focusItem}
            focusedId={focusedId}
            isDragging={isDragging}
            goldSize={goldSize}
          />
        ))}
      </motion.div>
      {focusedId && (
        <div className="fixed bottom-[570px] left-[680px]  z-50">
          <div
            onClick={() => setFocusedId("")}
            className=" h-[80px] w-[80px] grid place-content-center rounded-full bg-gray-600 text-white text-3xl font-semibold shadow-lg"
          >
            <IoCloseOutline size={45} />
          </div>
        </div>
      )}
      {focusedId && (
        <div className="fixed bottom-[570px] left-1/2 -translate-x-1/2 z-50">
          <div
            onClick={!isVending ? handelSelectCharm : undefined}
            className={`px-10 py-5 rounded-full text-3xl text-black font-semibold shadow-lg
    ${isVending ? "bg-gray-400 cursor-not-allowed" : "bg-blue-200"}
  `}
          >
            {isVending ? "Vending..." : "Select Charm"}
          </div>
        </div>
      )}
    </div>
  );
};

function HoneyItem({
  item,
  pos,
  center,
  dragX,
  dragY,
  onFocus,
  focusedId,
  isDragging,
  goldSize,
  isselectedChaems,
}) {
  const isFocused = focusedId === item.id;
  const isGoldMatch = goldSize === Number(item?.weight);
  return (
    <div>
      <motion.div
        onPointerDown={(e) => {
          e.stopPropagation();
          onFocus(pos, item.id);
        }}
        className={[
          "absolute flex items-center transition-all duration-300 justify-center cursor-pointer select-none will-change-transform",
          isFocused ? "z-20" : "z-10",
        ].join(" ")}
        style={{
          left: pos.x,
          top: pos.y,

          scale: isGoldMatch ? (isFocused ? 1.2 : 1) : 1,
          opacity: isGoldMatch && isFocused ? 1 : 0.5,
          y: isFocused ? 22 : 0,

          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          className={[
            "rounded-full transition-all duration-300",
            isFocused ? "ring-4 ring-white shadow-2xl" : "grayscale-[0.3]",
          ].join(" ")}
        >
          <CharmsWithNamePrice size={item?.size} data={item} />
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Experience;
