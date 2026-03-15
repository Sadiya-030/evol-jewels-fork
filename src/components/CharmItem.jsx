import { motion, useTransform } from "framer-motion";
import CharmsWithNamePrice from "./CharmsWithNamePrice";

const CENTER = 3000;
const MAX_DISTANCE = 1200;

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

const CharmItem = ({ item, x, y }) => {
  const scale = useTransform([x, y], ([latestX, latestY]) => {
    const dx = CENTER + latestX - item.left;
    const dy = CENTER + latestY - item.top;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const normalized = clamp(1 - distance / MAX_DISTANCE, 0.4, 1);
    return normalized;
  });

  const opacity = useTransform(scale, [0.4, 1], [0.5, 1]);

  return (
    <motion.div
      className="absolute flex items-center justify-center"
      style={{
        top: item.top,
        left: item.left,
        scale,
        opacity,
      }}
      transition={{ type: "spring", stiffness: 150, damping: 18 }}
    >
      <CharmsWithNamePrice size={item.size} />
    </motion.div>
  );
};

export default CharmItem;
