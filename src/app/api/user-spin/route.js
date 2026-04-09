/**
 * User Spin API Routes
 *
 * GET /api/user-spin?phoneNumber=xxx
 *   - Fetch user by phone number
 *   - Returns: { name, phoneNumber, spinAvailable }
 *   - 200: User found
 *   - 404: User not found
 *   - 500: Service unavailable
 *
 * POST /api/user-spin
 *   - Create new user (first-time spin user)
 *   - Body: { name, phoneNumber }
 *   - Returns: Created user object with spinAvailable: 1
 *   - 200: User created
 *   - 400: Validation error
 *   - 409: User already exists
 *   - 500: Service unavailable
 */

import { NextResponse } from "next/server";
import {
  getUserByPhone,
  createUser,
  validatePhoneNumber,
  normalizePhoneNumber,
} from "../../lib/userSpinService";

/**
 * GET /api/user-spin?phoneNumber=xxx
 * Fetch user by phone number
 */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const phoneNumber = searchParams.get("phoneNumber");

    console.log(`[API] GET /api/user-spin - phoneNumber: ${phoneNumber}`);

    // Validate phone number
    if (!phoneNumber) {
      return NextResponse.json(
        { success: false, message: "Phone number is required" },
        { status: 400 }
      );
    }

    const validation = validatePhoneNumber(phoneNumber);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, message: validation.error },
        { status: 400 }
      );
    }

    // Fetch user from Strapi
    const result = await getUserByPhone(phoneNumber);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.error },
        { status: result.status || 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        name: result.data.name,
        phoneNumber: result.data.phoneNumber,
        spinAvailable: result.data.spinAvailable,
      },
    });
  } catch (error) {
    console.error("[API] GET /api/user-spin error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Sorry, service unavailable. We are trying to get it back up!",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/user-spin
 * Create new user for first-time spin
 */
export async function POST(req) {
  try {
    const body = await req.json();
    const { name, phoneNumber } = body;

    console.log(
      `[API] POST /api/user-spin - name: ${name}, phoneNumber: ${phoneNumber}`
    );

    // Validate required fields
    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, message: "Name is required" },
        { status: 400 }
      );
    }

    if (!phoneNumber) {
      return NextResponse.json(
        { success: false, message: "Phone number is required" },
        { status: 400 }
      );
    }

    // Validate phone number format
    const validation = validatePhoneNumber(phoneNumber);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, message: validation.error },
        { status: 400 }
      );
    }

    // Create user in Strapi
    const result = await createUser(name, phoneNumber);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.error },
        { status: result.status || 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "User created successfully",
      data: {
        name: result.data.name,
        phoneNumber: result.data.phoneNumber,
        spinAvailable: result.data.spinAvailable,
      },
    });
  } catch (error) {
    console.error("[API] POST /api/user-spin error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Sorry, service unavailable. We are trying to get it back up!",
      },
      { status: 500 }
    );
  }
}
