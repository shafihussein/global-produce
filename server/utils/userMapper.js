import {
  normalizePhoneNumber,
  validateAddress,
  validateDateOfBirth,
  validateEmail,
  validateNonEmptyString,
  validateSecurityQuestions,
} from "./validators.js";

// Keep a stable orders shape that mirrors the Excalidraw object definition.
export function createDefaultOrders() {
  return {
    delivered: [],
    cancelled: [],
    processing: [],
    shipped: [],
    placed: [],
  };
}

// Normalize and validate user payload before model construction.
export function mapUserInput(input) {
  if (!input || typeof input !== "object") {
    throw new Error("user input must be an object");
  }

  return {
    fullName: validateNonEmptyString(input.fullName, "fullName"),
    phoneNumber: normalizePhoneNumber(input.phoneNumber),
    email: validateEmail(input.email),
    password: validateNonEmptyString(input.password, "password"),
    dateOfBirth: validateDateOfBirth(input.dateOfBirth),
    profilePic: validateNonEmptyString(input.profilePic, "profilePic"),
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

// Validate uniqueness by email across multiple persisted collections.
export function ensureEmailIsUnique(email, ...collections) {
  const normalizedEmail = validateEmail(email);
  const found = collections
    .flat()
    .some((record) => record?.email === normalizedEmail);

  if (found) {
    throw new Error(`User already exists with email: ${normalizedEmail}`);
  }

  return normalizedEmail;
}
