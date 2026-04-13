"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { questionnaire } from "../../data/questionare";

export default function Questionnaire() {
  const router = useRouter();
  const [currentStepId, setCurrentStepId] = useState("recipient");
  const [answers, setAnswers] = useState({});
  const [tags, setTags] = useState([]);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const step = questionnaire[currentStepId];

  const fetchProducts = async (tagString) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CMSURL}/api/products/search`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: tagString,
            topK: 10,
          }),
        },
      );

      const data = await response.json();

      if (data.success && data.products) {
        sessionStorage.setItem("products", JSON.stringify(data.products));
        sessionStorage.setItem("searchQuery", tagString);
        router.push("/products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      alert("Failed to fetch products. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionClick = (option) => {
    setAnswers((prev) => ({ ...prev, [currentStepId]: option.label }));

    if (option.tag) {
      setTags((prev) => {
        const withoutOld = prev.filter((t) => t !== answers[currentStepId]);
        return [...withoutOld, option.tag];
      });
    }

    if (option.nextStep) {
      setHistory((prev) => [...prev, currentStepId]);
      setCurrentStepId(option.nextStep);
    } else {
      setHistory((prev) => [...prev, currentStepId]);

      const updatedTags = option.tag
        ? [...tags.filter((t) => t !== answers[currentStepId]), option.tag]
        : tags;
      const tagString = updatedTags.join(" ");
      console.log(tagString);

      fetchProducts(tagString);
    }
  };

  const handleBack = () => {
    if (history.length === 0) return;
    const prevHistory = [...history];
    const lastStep = prevHistory.pop();
    setHistory(prevHistory);
    setCurrentStepId(lastStep);
  };

  if (isLoading) {
    return (
      <div className="max-w-xl mx-auto p-6 border rounded-lg shadow-lg text-center">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
          <h2 className="text-xl font-bold mb-2">
            Finding your perfect pieces...
          </h2>
          <p className="text-gray-600">
            We are searching through our collection based on your preferences
          </p>
        </div>
      </div>
    );
  }

  if (!step) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold mb-4">
          Your personalized picks are ready!
        </h2>
        <p className="mb-2">Tags collected:</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {tags.map((t, i) => (
            <span
              key={i}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
            >
              {t}
            </span>
          ))}
        </div>

        <button
          onClick={() => {
            setCurrentStepId("recipient");
            setAnswers({});
            setTags([]);
            setHistory([]);
          }}
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Start Over
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto text-black p-6 border rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-6">{step.question}</h2>
      <div className="grid grid-cols-1 gap-4">
        {step.options.map((option, i) => (
          <button
            key={i}
            onClick={() => handleOptionClick(option)}
            className="p-3 border rounded-lg hover:bg-blue-50 transition"
          >
            {option.label}
          </button>
        ))}
      </div>

      {history.length > 0 && (
        <button
          onClick={handleBack}
          className="mt-6 px-4 py-2 border rounded-lg hover:bg-gray-100"
        >
          ← Back
        </button>
      )}
    </div>
  );
}
