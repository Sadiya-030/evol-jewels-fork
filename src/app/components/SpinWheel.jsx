"use client";

import { useState } from "react";

const SpinWheel = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState(null);

  const segments = [
    { id: 1, emoji: "💰", label: "Money Bag", isWin: true, probability: 0.01 },
    { id: 2, emoji: "🌵", label: "Cactus", isWin: false, probability: 0.01 },
    { id: 3, emoji: "🍯", label: "Honey Pot", isWin: true, probability: 0.01 },
    { id: 4, emoji: "🌵", label: "Cactus", isWin: false, probability: 0.01 },
    { id: 5, emoji: "🥜", label: "Peanut", isWin: false, probability: 0.01 },
    { id: 6, emoji: "🌵", label: "Cactus", isWin: false, probability: 0.01 },
    { id: 7, emoji: "🍌", label: "Banana", isWin: true, probability: 0.01 },
    { id: 8, emoji: "🌵", label: "Cactus", isWin: false, probability: 0.01 },
  ];

  const segmentAngle = 360 / segments.length;

  const selectSegmentByProbability = () => {
    const totalProbability = segments.reduce(
      (sum, seg) => sum + seg.probability,
      0,
    );
    let random = Math.random() * totalProbability;

    for (let i = 0; i < segments.length; i++) {
      random -= segments[i].probability;
      if (random <= 0) {
        return { ...segments[i], index: i };
      }
    }

    return { ...segments[segments.length - 1], index: segments.length - 1 };
  };

  const spinWheel = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setResult(null);

    const targetSegment = selectSegmentByProbability();
    const targetIndex = targetSegment.index;

    const fullRotations = 5 + Math.floor(Math.random() * 3);

    const randomOffset =
      Math.random() * (segmentAngle * 0.5) - segmentAngle * 0.25;

    const segmentCenterOffset = (targetIndex + 0.5) * segmentAngle;

    const currentRotation = rotation % 360;

    const targetPosition = 360 - segmentCenterOffset + randomOffset;

    let rotationNeeded = targetPosition - currentRotation;

    if (rotationNeeded < 0) {
      rotationNeeded += 360;
    }

    const finalRotation = rotation + fullRotations * 360 + rotationNeeded;

    setRotation(finalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setResult(targetSegment);
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 flex items-center justify-center p-6">
      <div className="max-w-xl w-full">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-white mb-2">Spin the Wheel</h1>
          <p className="text-purple-200">
            Try your luck and win amazing prizes!
          </p>
        </div>

        <div className="relative w-full max-w-md mx-auto mb-10">
          <div className="relative w-full pb-[100%]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20">
              <div className="w-8 h-8 bg-yellow-400 rounded-full shadow-lg"></div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[16px] border-t-yellow-400"></div>
            </div>

            <div className="absolute inset-0">
              <div className="absolute inset-0 rounded-full shadow-2xl overflow-hidden border-8 border-yellow-500">
                <div
                  className="absolute inset-0 w-full h-full transition-transform duration-[5000ms] ease-out"
                  style={{
                    transform: `rotate(${rotation}deg)`,
                    transitionTimingFunction:
                      "cubic-bezier(0.17, 0.67, 0.12, 0.99)",
                  }}
                >
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    {segments.map((segment, index) => {
                      const startAngle =
                        (index * segmentAngle - 90) * (Math.PI / 180);
                      const endAngle =
                        ((index + 1) * segmentAngle - 90) * (Math.PI / 180);

                      const x1 = 50 + 50 * Math.cos(startAngle);
                      const y1 = 50 + 50 * Math.sin(startAngle);
                      const x2 = 50 + 50 * Math.cos(endAngle);
                      const y2 = 50 + 50 * Math.sin(endAngle);

                      const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;
                      const fillColor = index % 2 === 0 ? "#a855f7" : "#ec4899";

                      const midAngle =
                        startAngle + (segmentAngle / 2) * (Math.PI / 180);
                      const emojiX = 50 + 30 * Math.cos(midAngle);
                      const emojiY = 50 + 30 * Math.sin(midAngle);

                      return (
                        <g key={segment.id}>
                          <path
                            d={pathData}
                            fill={fillColor}
                            stroke="white"
                            strokeWidth="0.5"
                          />
                          <text
                            x={emojiX}
                            y={emojiY}
                            fontSize="8"
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            {segment.emoji}
                          </text>
                        </g>
                      );
                    })}
                  </svg>

                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full shadow-lg border-4 border-white z-10 flex items-center justify-center">
                    <div className="text-2xl">🎯</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <button
            onClick={spinWheel}
            disabled={isSpinning}
            className={`px-12 py-4 text-xl font-bold rounded-full shadow-xl transition-all duration-200 ${
              isSpinning
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 hover:scale-105 active:scale-95 cursor-pointer"
            } text-white uppercase`}
          >
            {isSpinning ? "SPINNING．．．" : "SPIN NOW!"}
          </button>
        </div>

        {result && (
          <div className="text-center">
            <div className="inline-block px-8 py-6 rounded-3xl bg-gray-600 shadow-xl">
              <p className="text-5xl mb-3">{result.emoji}</p>
              <p className="text-white font-bold text-xl">
                {result.isWin
                  ? `You Won ${result.label}!`
                  : `Better luck next time!`}
              </p>
            </div>
          </div>
        )}

        <div className="mt-10 text-center text-purple-200 text-sm">
          <p>Click the "SPIN NOW!" button to spin the wheel</p>
          <p className="mt-1">
            Each segment has individual probability - adjust in code
          </p>
        </div>
      </div>
    </div>
  );
};

export default SpinWheel;
