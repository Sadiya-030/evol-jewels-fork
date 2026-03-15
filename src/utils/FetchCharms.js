// fetchCharms.js

export const FetchCharms = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_CMSURL}/api/charms?populate=*`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store", // or "force-cache" if needed
      }
    );

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
