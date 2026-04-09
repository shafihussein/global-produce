import {
  normalizePhoneNumber,
  validateAddress,
  validateDateOfBirth,
  validateEmail,
  validateNonEmptyString,
  validateSecurityQuestions,
} from "./validators.ts";
import type { OrdersContainer } from "../types/schemas.ts";

/**
 * Creates default orders container with empty arrays for each status.
 * Used when customer is initialized without prior orders.
 */
export function createDefaultOrders(): OrdersContainer {
  return {
    delivered: [],
    cancelled: [],
    processing: [],
    shipped: [],
    placed: [],
  };
}

/**
 * Normalizes and validates user input payload before model construction.
 * Applies constraints from Excalidraw design.
 * Throws on validation failure.
 */
export function mapUserInput(input: Record<string, unknown>): Record<string, unknown> {
  if (!input || typeof input !== "object") {
    throw new Error("user input must be an object");
  }

  return {
    fullName: validateNonEmptyString(input.fullName, "fullName"),
    phoneNumber: normalizePhoneNumber(input.phoneNumber),
    email: validateEmail(input.email),
    password: validateNonEmptyString(input.password, "password"),
    dateOfBirth: validateDateOfBirth(input.dateOfBirth),
    profilePic: validateNonEmptyString(input.profilePic || "", "profilePic"),
    address: validateAddress(input.address),
    orders: input.orders || createDefaultOrders(),
    securityQuestions: validateSecurityQuestions(input.securityQuestions || []),
    createdAt:
      typeof input.createdAt === "string"
        ? input.createdAt
        : new Date().toISOString(),
    isActive: typeof input.isActive === "boolean" ? input.isActive : true,
  };
}

/**
 * Validates that email is unique across multiple persisted collections.
 * Checks email against all provided collections (Customers, Admins, etc).
 * Throws if email already exists in any collection.
 * Returns normalized email if unique.
 */
export function ensureEmailIsUnique(
  email: unknown,
  ...collections: Array<Record<string, unknown>[]>
): string {
  const normalizedEmail = validateEmail(email);
  const found = collections.flat().some((record) => record?.email === normalizedEmail);

  if (found) {
    throw new Error(`User already exists with email: ${normalizedEmail}`);
  }

  return normalizedEmail;
}
