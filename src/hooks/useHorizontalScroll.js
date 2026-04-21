import { useEffect, useRef } from "react";

/**
 * Attach scroll handlers to a single container
 */
const attachScrollHandlers = (container) => {
  let isDown = false;
  let startX;
  let scrollLeft;

  const handleMouseDown = (e) => {
    isDown = true;
    container.classList.add("cursor-grabbing");
    startX = e.pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDown = false;
    container.classList.remove("cursor-grabbing");
  };

  const handleMouseUp = () => {
    isDown = false;
    container.classList.remove("cursor-grabbing");
  };

  const handleMouseMove = (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 2;
    container.scrollLeft = scrollLeft - walk;
  };

  // Add touch support
  let touchStartX;
  let touchScrollLeft;

  const handleTouchStart = (e) => {
    touchStartX = e.touches[0].clientX - container.offsetLeft;
    touchScrollLeft = container.scrollLeft;
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 0) return;
    const x = e.touches[0].clientX - container.offsetLeft;
    const walk = (x - touchStartX) * 2;
    container.scrollLeft = touchScrollLeft - walk;
  };

  container.addEventListener("mousedown", handleMouseDown);
  container.addEventListener("mouseleave", handleMouseLeave);
  container.addEventListener("mouseup", handleMouseUp);
  container.addEventListener("mousemove", handleMouseMove);
  container.addEventListener("touchstart", handleTouchStart, { passive: true });
  container.addEventListener("touchmove", handleTouchMove, { passive: true });

  return () => {
    container.removeEventListener("mousedown", handleMouseDown);
    container.removeEventListener("mouseleave", handleMouseLeave);
    container.removeEventListener("mouseup", handleMouseUp);
    container.removeEventListener("mousemove", handleMouseMove);
    container.removeEventListener("touchstart", handleTouchStart);
    container.removeEventListener("touchmove", handleTouchMove);
  };
};

/**
 * Hook to enable smooth horizontal scroll with touch support on a single container
 * Handles mouse drag, touch swipe, and momentum scrolling
 * @returns {React.RefObject} - Ref to attach to the scrollable container
 */
export const useHorizontalScroll = () => {
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    return attachScrollHandlers(container);
  }, []);

  return scrollContainerRef;
};

/**
 * Hook to enable horizontal scroll on all overflow-x-scroll children within a parent container
 * @returns {React.RefObject} - Ref to attach to the parent container
 */
export const useHorizontalScrollForChildren = () => {
  const parentRef = useRef(null);

  useEffect(() => {
    const parent = parentRef.current;
    if (!parent) return;

    // Find all horizontal scroll containers
    const scrollContainers = parent.querySelectorAll(".overflow-x-scroll");
    const cleanups = [];

    scrollContainers.forEach((container) => {
      const cleanup = attachScrollHandlers(container);
      cleanups.push(cleanup);
    });

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  return parentRef;
};
