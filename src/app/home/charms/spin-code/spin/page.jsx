import SpinPage from "../../../../../components/spin/SpinPage";
import React from "react";

const page = async () => {
  // Fetch charms with lower grams (1-2g) for spin wheel prizes
  let RESULT = { data: [] };
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_CMSURL}/api/charms?filters[grams][$lte]=2&populate=image&pagination[limit]=4`,
      { cache: "no-store" },
    );
    if (res.ok) {
      RESULT = await res.json();
    } else {
      console.log("Charms API error:", res.status);
    }
  } catch (error) {
    console.log("Charms API not available:", error.message);
  }

  // Default spin probability if API fails
  let spinProbability = { data: { Spin_probability: 0.25 } };
  try {
    const spinres = await fetch(`${process.env.CMSURL}/api/spin`, {
      cache: "no-store",
    });
    if (spinres.ok) {
      spinProbability = await spinres.json();
    }
  } catch (error) {
    console.log("Spin probability API not available, using default");
  }

  return (
    <div>
      <SpinPage
        charmsssr={RESULT.data || []}
        Probability={spinProbability?.data?.Spin_probability || 0.25}
      />
    </div>
  );
};

export default page;
