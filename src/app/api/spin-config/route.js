import { NextResponse } from "next/server";

/**
 * GET /api/spin-config
 * Returns spin configuration including probability and max available bean
 * Query params:
 *   - phoneNumber: Optional phone number to check if user is a priority user
 */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const phoneNumber = searchParams.get("phoneNumber");

    // Get spin probability from env var (default 0.25 = 25%)
    const spinProbability = parseFloat(process.env.SPIN_PROBABILITY) || 0.25;

    // Check if user is a priority user (always wins)
    let isPriorityUser = false;
    if (phoneNumber) {
      const priorityUsers = (process.env.PRIORITY_USERS || "")
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean);

      // Normalize phone number for comparison (remove spaces, dashes)
      const normalizedPhone = phoneNumber.replace(/[\s-]/g, "");
      isPriorityUser = priorityUsers.some((p) => {
        const normalizedPriority = p.replace(/[\s-]/g, "");
        return (
          normalizedPhone === normalizedPriority ||
          normalizedPhone.endsWith(normalizedPriority) ||
          normalizedPriority.endsWith(normalizedPhone)
        );
      });
    }

    // Fetch max available bean from CMS (highest grams with inventory > 0)
    let maxAvailableBean = null;
    try {
      const cmsUrl = process.env.CMSURL || process.env.NEXT_PUBLIC_CMSURL;
      const charmsRes = await fetch(
        `${cmsUrl}/api/charms?filters[inventory][$gt]=0&sort=grams:desc&pagination[limit]=1&populate=image`,
        { cache: "no-store" }
      );

      if (charmsRes.ok) {
        const charmsData = await charmsRes.json();
        if (charmsData?.data?.length > 0) {
          const charm = charmsData.data[0];
          maxAvailableBean = {
            id: charm.id,
            documentId: charm.documentId,
            title: charm.title,
            grams: charm.grams,
            slotNo: charm.slotNo,
            inventory: charm.inventory,
            image: charm.image?.url || null,
          };
        }
      }
    } catch (error) {
      console.error("[spin-config] Error fetching max available bean:", error);
    }

    return NextResponse.json({
      success: true,
      spinProbability,
      isPriorityUser,
      maxAvailableBean,
    });
  } catch (error) {
    console.error("[spin-config] Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
