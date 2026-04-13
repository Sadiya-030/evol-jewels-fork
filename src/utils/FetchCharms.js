// fetchCharms.js

export const FetchCharms = async () => {
  try {
    const res = await fetch("/api/charms", {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch charms: ${res.status}`);
    }

    const data = await res.json();
    return data?.charms;
  } catch (error) {
    console.error("Error fetching charms:", error);
    return null;
  }
};
