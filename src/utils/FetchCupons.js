// fetchCoupons.js

export const FetchCupons = async () => {
  try {
    const res = await fetch(`${process.env.CMSURL}/api/coupons`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch charms: ${res.status}`);
    }

    const data = await res.json();
    return data?.data;
  } catch (error) {
    console.error("Error fetching charms:", error);
    return null;
  }
};
