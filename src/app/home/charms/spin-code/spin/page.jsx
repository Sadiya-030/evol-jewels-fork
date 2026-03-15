import SpinPage from "../../../../../components/spin/SpinPage";
import React from "react";

const page = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_CMSURL}/api/charms?filters[grams][$eq]=0.5&populate=image`,
    { cache: "no-store" }
  );

  const RESULT = await res.json();

  const spinres = await fetch(`${process.env.CMSURL}/api/spin`, {
    cache: "no-store",
  });

  const spinProbability = await spinres.json();
  return (
    <div>
      <SpinPage
        charmsssr={RESULT.data || []}
        Probability={spinProbability?.data?.Spin_probability}
      />
    </div>
  );
};

export default page;
