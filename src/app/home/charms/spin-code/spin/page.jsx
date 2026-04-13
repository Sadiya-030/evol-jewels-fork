import SpinPage from "../../../../../components/spin/SpinPage";
import React from "react";

const getStrapiHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
});

const page = async () => {
  let RESULT = { data: [] };
  try {
    const res = await fetch(
      `${process.env.CMSURL}/api/charms?filters[grams][$lte]=0.5&populate=image&pagination[limit]=4`,
      { cache: "no-store", headers: getStrapiHeaders() },
    );
    if (res.ok) {
      RESULT = await res.json();
    } else {
      console.log("Beans API error:", res.status);
    }
  } catch (error) {
    console.log("Beans API not available:", error.message);
  }

  // Get spin probability from env var (default 0.25 = 25%)
  const spinProbability = parseFloat(process.env.SPIN_PROBABILITY) || 0.25;

  return (
    <div>
      <SpinPage charmsssr={RESULT.data || []} Probability={spinProbability} />
    </div>
  );
};

export default page;
