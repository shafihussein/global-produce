import parsePhoneNumber from "libphonenumber-js";
import type { Address, SecurityQuestion } from "../types/schemas.ts";

/**
 * Validates and returns a non-empty trimmed string.
 * Throws if value is not a non-empty string.
 */
export function validateNonEmptyString(value: unknown, fieldName: string): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${fieldName} must be a non-empty string`);
  }

  return value.trim();
}

/**
 * Normalizes an email to lowercase and validates format.
 * Returns the normalized email string.
 */
export function normalizeEmail(email: unknown): string {
  const normalized = validateNonEmptyString(email, "email").toLowerCase();
  return normalized;
}

/**
 * Validates that email conforms to basic email pattern.
 * Returns normalized email if valid, throws otherwise.
 */
export function validateEmail(email: unknown): string {
  const normalized = normalizeEmail(email);
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(normalized)) {
    throw new Error("email must be valid");
  }

  return normalized;
}

/**
 * Normalizes phone number to E.164 format using libphonenumber-js.
 * Defaults to US country code if not specified.
 * Throws if phone number is invalid.
 */
export function normalizePhoneNumber(
  phoneNumber: unknown,
  defaultCountry: string = "US",
): string {
  const rawPhone = validateNonEmptyString(phoneNumber, "phoneNumber");
  let parsed;

  try {
    parsed = rawPhone.trim().startsWith("+")
      ? parsePhoneNumber(rawPhone)
      : parsePhoneNumber(rawPhone, defaultCountry as any);
  } catch {
    const digitsOnly = rawPhone.replace(/\D/g, "");
    if (digitsOnly.length >= 10 && digitsOnly.length <= 15) {
      return `+${digitsOnly}`;
    }
    throw new Error("phoneNumber must be valid");
  }

  if (!parsed || !parsed.isValid()) {
    throw new Error("phoneNumber must be valid");
  }

  return parsed.number;
}

/**
 * Validates and returns ISO 8601 datetime string.
 * Throws if date is invalid.
 */
export function validateDateOfBirth(dateOfBirth: unknown): string {
  const isoLike = validateNonEmptyString(dateOfBirth, "dateOfBirth");
  const parsedDate = new Date(isoLike);

  if (Number.isNaN(parsedDate.getTime())) {
    throw new Error("dateOfBirth must be a valid ISO date string");
  }

  return parsedDate.toISOString();
}

/**
 * Validates and normalizes an array of security questions.
 * Each question must have 'quiz' and 'ans' properties.
 * Throws if invalid.
 */
export function validateSecurityQuestions(
  securityQuestions: unknown,
): SecurityQuestion[] {
  if (!Array.isArray(securityQuestions)) {
    throw new Error("securityQuestions must be an array");
  }

  return securityQuestions.map((item, index) => {
    if (!item || typeof item !== "object") {
      throw new Error(`securityQuestions[${index}] must be an object`);
    }

    return {
      quiz: validateNonEmptyString(
        (item as Record<string, unknown>).quiz,
        `securityQuestions[${index}].quiz`,
      ),
      ans: validateNonEmptyString(
        (item as Record<string, unknown>).ans,
        `securityQuestions[${index}].ans`,
      ),
    };
  });
}

/**
 * Validates and normalizes an address object.
 * Returns standardized address with all required fields.
 * Throws if invalid.
 */
export function validateAddress(address: unknown): Address {
  if (!address || typeof address !== "object") {
    throw new Error("address must be an object");
  }

  const addr = address as Record<string, unknown>;

  return {
    street: validateNonEmptyString(addr.street || "", "address.street"),
    city: validateNonEmptyString(addr.city || "", "address.city"),
    postalCode: validateNonEmptyString(
      addr.postalCode || "",
      "address.postalCode",
    ),
    country: validateNonEmptyString(addr.country || "", "address.country"),
  };
}
