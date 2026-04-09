import {
  normalizeEmail,
  normalizePhoneNumber,
  validateAddress,
  validateDateOfBirth,
  validateEmail,
  validateNonEmptyString,
  validateSecurityQuestions,
} from "./validators.ts";

describe("validators utils", () => {
  test("validateNonEmptyString trims and returns valid value", () => {
    expect(validateNonEmptyString("  hello  ", "field")).toBe("hello");
  });

  test("validateNonEmptyString throws for blank values", () => {
    expect(() => validateNonEmptyString("   ", "field")).toThrow(
      "field must be a non-empty string",
    );
  });

  test("validateEmail normalizes to lowercase", () => {
    expect(validateEmail("User@Example.COM")).toBe("user@example.com");
    expect(normalizeEmail("A@B.C")).toBe("a@b.c");
  });

  test("validateEmail throws for invalid format", () => {
    expect(() => validateEmail("not-an-email")).toThrow("email must be valid");
  });

  test("normalizePhoneNumber returns E.164 format", () => {
    expect(normalizePhoneNumber("+1 702-555-0101")).toBe("+17025550101");
  });

  test("normalizePhoneNumber throws for invalid number", () => {
    expect(() => normalizePhoneNumber("abc")).toThrow(
      "phoneNumber must be valid",
    );
  });

  test("validateDateOfBirth returns ISO string", () => {
    expect(validateDateOfBirth("2000-01-01")).toContain("2000-01-01");
  });

  test("validateAddress validates shape", () => {
    expect(
      validateAddress({
        street: "123 Green St",
        city: "Vegas",
        postalCode: "12345",
        country: "US",
      }),
    ).toEqual({
      street: "123 Green St",
      city: "Vegas",
      postalCode: "12345",
      country: "US",
    });
  });

  test("validateSecurityQuestions enforces quiz/ans", () => {
    expect(validateSecurityQuestions([{ quiz: "pet", ans: "cat" }])).toEqual([
      { quiz: "pet", ans: "cat" },
    ]);
    expect(() => validateSecurityQuestions([{ quiz: "pet" }])).toThrow();
  });
});
