import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(`${process.env.CMSURL}/api/charms?populate=*`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: "Failed to fetch charms" },
        { status: res.status },
      );
    }

    const data = await res.json();
    return NextResponse.json({
      success: true,
      charms: data?.data || [],
    });
  } catch (error) {
    console.error("Error fetching charms:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
