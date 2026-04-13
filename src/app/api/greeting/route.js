import { NextResponse } from "next/server";

export async function GET() {
  try {
    const url = `${process.env.CMSURL}/api/greeeting?populate[Greetings][populate]=*`;
    console.log("[Greeting API] Fetching from:", url);
    console.log("[Greeting API] Token exists:", !!process.env.STRAPI_API_TOKEN);

    const res = await fetch(url, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
    });

    console.log("[Greeting API] Response status:", res.status);

    if (!res.ok) {
      const errorText = await res.text();
      console.error("[Greeting API] Error response:", errorText);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to fetch greetings",
          status: res.status,
          details: errorText,
        },
        { status: res.status },
      );
    }

    const data = await res.json();
    console.log("[Greeting API] Success, greetings count:", data?.data?.Greetings?.length || 0);
    return NextResponse.json({
      success: true,
      greetings: data?.data?.Greetings || [],
    });
  } catch (error) {
    console.error("[Greeting API] Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error", details: error.message },
      { status: 500 },
    );
  }
}
