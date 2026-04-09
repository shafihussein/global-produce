import {
  createDefaultOrders,
  ensureEmailIsUnique,
  mapUserInput,
} from "./userMapper.ts";

describe("userMapper utils", () => {
  test("createDefaultOrders returns expected statuses", () => {
    expect(createDefaultOrders()).toEqual({
      delivered: [],
      cancelled: [],
      processing: [],
      shipped: [],
      placed: [],
    });
  });

  test("mapUserInput normalizes user payload", () => {
    const mapped = mapUserInput({
      fullName: "John Doe",
      phoneNumber: "+1 702-555-0101",
      email: "John@Example.COM",
      password: "secret",
      dateOfBirth: "2000-01-01",
      profilePic: "/img/john.png",
      address: {
        street: "123 Green St",
        city: "Vegas",
        postalCode: "12345",
        country: "US",
      },
      securityQuestions: [{ quiz: "pet", ans: "cat" }],
    });

    expect(mapped.email).toBe("john@example.com");
    expect(mapped.phoneNumber).toBe("+17025550101");
    expect(mapped.orders).toEqual(createDefaultOrders());
    expect(mapped.isActive).toBe(true);
  });

  test("ensureEmailIsUnique throws when duplicate exists", () => {
    expect(() =>
      ensureEmailIsUnique("duplicate@example.com", [
        { email: "duplicate@example.com" },
      ]),
    ).toThrow("User already exists");
  });

  test("ensureEmailIsUnique returns normalized email when unique", () => {
    expect(
      ensureEmailIsUnique("Unique@Example.com", [{ email: "a@example.com" }]),
    ).toBe("unique@example.com");
  });
});
