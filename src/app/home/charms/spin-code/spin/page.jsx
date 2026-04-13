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

  // Default spin probability if API fails
  let spinProbability = { data: { Spin_probability: 0.01 } };
  try {
    const spinres = await fetch(`${process.env.CMSURL}/api/spin`, {
      cache: "no-store",
      headers: getStrapiHeaders(),
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
        Probability={spinProbability?.data?.Spin_probability || 0.01}
      />
    </div>
  );
};

export default page;
