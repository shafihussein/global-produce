import { parsePhoneNumberFromString } from "libphonenumber-js";

export function validateNonEmptyString(value, fieldName) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${fieldName} must be a non-empty string`);
  }

  return value.trim();
}

export function normalizeEmail(email) {
  const normalized = validateNonEmptyString(email, "email").toLowerCase();
  return normalized;
}

export function validateEmail(email) {
  const normalized = normalizeEmail(email);
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(normalized)) {
    throw new Error("email must be valid");
  }

  return normalized;
}

export function normalizePhoneNumber(phoneNumber, defaultCountry = "US") {
  const rawPhone = validateNonEmptyString(phoneNumber, "phoneNumber");
  const parsed = parsePhoneNumberFromString(rawPhone, defaultCountry);

  if (!parsed || !parsed.isValid()) {
    throw new Error("phoneNumber must be valid");
  }

  return parsed.number;
}

export function validateDateOfBirth(dateOfBirth) {
  const isoLike = validateNonEmptyString(dateOfBirth, "dateOfBirth");
  const parsedDate = new Date(isoLike);

  if (Number.isNaN(parsedDate.getTime())) {
    throw new Error("dateOfBirth must be a valid ISO date string");
  }

  return parsedDate.toISOString();
}

export function validateSecurityQuestions(securityQuestions) {
  if (!Array.isArray(securityQuestions)) {
    throw new Error("securityQuestions must be an array");
  }

  return securityQuestions.map((item, index) => {
    if (!item || typeof item !== "object") {
      throw new Error(`securityQuestions[${index}] must be an object`);
    }

    return {
      quiz: validateNonEmptyString(
        item.quiz,
        `securityQuestions[${index}].quiz`,
      ),
      ans: validateNonEmptyString(item.ans, `securityQuestions[${index}].ans`),
    };
  });
}

export function validateAddress(address) {
  if (!address || typeof address !== "object") {
    throw new Error("address must be an object");
  }

  return {
    street: validateNonEmptyString(address.street || "", "address.street"),
    city: validateNonEmptyString(address.city || "", "address.city"),
    postalCode: validateNonEmptyString(
      address.postalCode || "",
      "address.postalCode",
    ),
    country: validateNonEmptyString(address.country || "", "address.country"),
  };
}
