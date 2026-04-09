/**
 * User Spin Service
 * Handles all Strapi operations for user_spins collection
 *
 * Strapi Collection: user_spins
 * Fields:
 *   - name: string
 *   - phoneNumber: string (unique identifier)
 *   - spinAvailable: number (default: 1)
 */

const STRAPI_URL = process.env.CMSURL;
const SERVICE_UNAVAILABLE_MESSAGE =
  "Sorry, service unavailable. We are trying to get it back up!";

/**
 * Normalize phone number to consistent format
 * Removes spaces, dashes, and ensures consistent formatting
 * @param {string} phoneNumber - Raw phone number input
 * @returns {string} Normalized phone number
 */
export function normalizePhoneNumber(phoneNumber) {
  if (!phoneNumber) return "";
  // Remove all non-digit characters except leading +
  return phoneNumber.replace(/[^\d+]/g, "").trim();
}

/**
 * Validate phone number format
 * Expects country code + 10 digit number (e.g., +919876543210 or 9876543210)
 * @param {string} phoneNumber - Phone number to validate
 * @returns {{ valid: boolean, error?: string }}
 */
export function validatePhoneNumber(phoneNumber) {
  if (!phoneNumber) {
    return { valid: false, error: "Phone number is required" };
  }

  const normalized = normalizePhoneNumber(phoneNumber);

  // Check for minimum length (10 digits)
  const digitsOnly = normalized.replace(/\+/g, "");
  if (digitsOnly.length < 10) {
    return { valid: false, error: "Phone number must be at least 10 digits" };
  }

  // Check for maximum length (country code + 10 digits = max ~15)
  if (digitsOnly.length > 15) {
    return { valid: false, error: "Phone number is too long" };
  }

  return { valid: true };
}

/**
 * Fetch user by phone number from Strapi
 * @param {string} phoneNumber - Normalized phone number
 * @returns {Promise<{ success: boolean, data?: object, error?: string, status?: number }>}
 */
export async function getUserByPhone(phoneNumber) {
  const normalized = normalizePhoneNumber(phoneNumber);

  console.log(`[UserSpinService] Fetching user by phone: ${normalized}`);

  try {
    const res = await fetch(
      `${STRAPI_URL}/api/user-spins?filters[phoneNumber][$eq]=${normalized}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      console.error(
        `[UserSpinService] Strapi error: ${res.status} ${res.statusText}`
      );
      return {
        success: false,
        error: SERVICE_UNAVAILABLE_MESSAGE,
        status: 500,
      };
    }

    const result = await res.json();
    const user = result?.data?.[0];

    if (!user) {
      console.log(`[UserSpinService] User not found for phone: ${normalized}`);
      return {
        success: false,
        error: "User not found",
        status: 404,
      };
    }

    console.log(`[UserSpinService] User found: ${user.documentId}`);
    return {
      success: true,
      data: {
        documentId: user.documentId,
        name: user.name,
        phoneNumber: user.phoneNumber,
        spinAvailable: user.spinAvailable ?? 0,
      },
    };
  } catch (error) {
    console.error(`[UserSpinService] Fetch error:`, error);
    return {
      success: false,
      error: SERVICE_UNAVAILABLE_MESSAGE,
      status: 500,
    };
  }
}

/**
 * Create a new user in Strapi
 * @param {string} name - User's name
 * @param {string} phoneNumber - User's phone number
 * @returns {Promise<{ success: boolean, data?: object, error?: string, status?: number }>}
 */
export async function createUser(name, phoneNumber) {
  const normalized = normalizePhoneNumber(phoneNumber);

  console.log(
    `[UserSpinService] Creating user: ${name}, phone: ${normalized}`
  );

  // First check if user already exists
  const existingUser = await getUserByPhone(normalized);
  if (existingUser.success) {
    console.log(`[UserSpinService] User already exists: ${normalized}`);
    return {
      success: false,
      error: "User with this phone number already exists",
      status: 409, // Conflict
    };
  }

  // If error is not 404 (user not found), return the error
  if (existingUser.status !== 404) {
    return existingUser;
  }

  try {
    const res = await fetch(`${STRAPI_URL}/api/user-spins`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          name: name?.trim() || "",
          phoneNumber: normalized,
          spinAvailable: 1,
        },
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`[UserSpinService] Create error: ${res.status}`, errorText);
      return {
        success: false,
        error: SERVICE_UNAVAILABLE_MESSAGE,
        status: 500,
      };
    }

    const result = await res.json();
    const user = result?.data;

    if (!user) {
      console.error(`[UserSpinService] Create returned no data`);
      return {
        success: false,
        error: SERVICE_UNAVAILABLE_MESSAGE,
        status: 500,
      };
    }

    console.log(`[UserSpinService] User created: ${user.documentId}`);
    return {
      success: true,
      data: {
        documentId: user.documentId,
        name: user.name,
        phoneNumber: user.phoneNumber,
        spinAvailable: user.spinAvailable ?? 1,
      },
    };
  } catch (error) {
    console.error(`[UserSpinService] Create error:`, error);
    return {
      success: false,
      error: SERVICE_UNAVAILABLE_MESSAGE,
      status: 500,
    };
  }
}

/**
 * Decrement spin count for a user
 * Will not go below 0
 * @param {string} phoneNumber - User's phone number
 * @returns {Promise<{ success: boolean, data?: object, error?: string, status?: number }>}
 */
export async function decrementSpin(phoneNumber) {
  const normalized = normalizePhoneNumber(phoneNumber);

  console.log(`[UserSpinService] Decrementing spin for: ${normalized}`);

  // First get the user
  const userResult = await getUserByPhone(normalized);
  if (!userResult.success) {
    return userResult;
  }

  const user = userResult.data;
  const currentSpins = user.spinAvailable ?? 0;

  // Check if user has spins available
  if (currentSpins <= 0) {
    console.log(`[UserSpinService] No spins available for: ${normalized}`);
    return {
      success: false,
      error: "No spins available",
      status: 400,
    };
  }

  const newSpinCount = Math.max(0, currentSpins - 1);

  try {
    const res = await fetch(
      `${STRAPI_URL}/api/user-spins/${user.documentId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            spinAvailable: newSpinCount,
          },
        }),
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error(
        `[UserSpinService] Decrement error: ${res.status}`,
        errorText
      );
      return {
        success: false,
        error: SERVICE_UNAVAILABLE_MESSAGE,
        status: 500,
      };
    }

    const result = await res.json();
    const updatedUser = result?.data;

    if (!updatedUser) {
      console.error(`[UserSpinService] Decrement returned no data`);
      return {
        success: false,
        error: SERVICE_UNAVAILABLE_MESSAGE,
        status: 500,
      };
    }

    console.log(
      `[UserSpinService] Spin decremented: ${currentSpins} -> ${newSpinCount}`
    );
    return {
      success: true,
      data: {
        documentId: updatedUser.documentId,
        name: updatedUser.name,
        phoneNumber: updatedUser.phoneNumber,
        spinAvailable: updatedUser.spinAvailable ?? 0,
        previousSpinCount: currentSpins,
      },
    };
  } catch (error) {
    console.error(`[UserSpinService] Decrement error:`, error);
    return {
      success: false,
      error: SERVICE_UNAVAILABLE_MESSAGE,
      status: 500,
    };
  }
}
