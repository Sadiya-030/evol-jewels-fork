/**
 * User Spin Decrement API Route
 *
 * PUT /api/user-spin/spin
 *   - Decrement spinAvailable by 1 after successful spin
 *   - Body: { phoneNumber }
 *   - Returns: Updated user object with new spinAvailable count
 *   - 200: Spin decremented successfully
 *   - 400: No spins available / Validation error
 *   - 404: User not found
 *   - 500: Service unavailable
 */

import { NextResponse } from "next/server";
import {
  decrementSpin,
  validatePhoneNumber,
} from "../../../lib/userSpinService";

/**
 * PUT /api/user-spin/spin
 * Decrement spin count after successful spin
 */
export async function PUT(req) {
  try {
    const body = await req.json();
    const { phoneNumber } = body;

    console.log(`[API] PUT /api/user-spin/spin - phoneNumber: ${phoneNumber}`);

    // Validate phone number
    if (!phoneNumber) {
      return NextResponse.json(
        { success: false, message: "Phone number is required" },
        { status: 400 },
      );
    }

    const validation = validatePhoneNumber(phoneNumber);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, message: validation.error },
        { status: 400 },
      );
    }

    // Decrement spin in Strapi
    const result = await decrementSpin(phoneNumber);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.error },
        { status: result.status || 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Spin used successfully",
      data: {
        name: result.data.name,
        phoneNumber: result.data.phoneNumber,
        spinAvailable: result.data.spinAvailable,
        previousSpinCount: result.data.previousSpinCount,
      },
    });
  } catch (error) {
    console.error("[API] PUT /api/user-spin/spin error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Sorry, Service Unavailable. We are Trying to Get it Back Up!",
      },
      { status: 500 },
    );
  }
}
