import createUser, {
  getUserEmail,
  getUserFullName,
  getUserIsActive,
  setUserEmail,
  setUserFullName,
  setUserIsActive,
} from "./User.ts";

describe("User model", () => {
  test("createUser builds normalized user object", () => {
    const user = createUser({
      fullName: "Jane Doe",
      phoneNumber: "+1 702-555-0102",
      email: "Jane@Example.com",
      password: "strong-pass",
      dateOfBirth: "1995-06-15",
      profilePic: "/media/jane.jpg",
      address: {
        street: "123 Green St",
        city: "Vegas",
        postalCode: "12345",
        country: "US",
      },
      securityQuestions: [{ quiz: "pet", ans: "milo" }],
    });

    expect(user.id).toBeTruthy();
    expect(getUserEmail(user)).toBe("jane@example.com");
    expect(getUserIsActive(user)).toBe(true);
  });

  test("named setters update fields", () => {
    const user = createUser({
      fullName: "Jane Doe",
      phoneNumber: "+1 702-555-0102",
      email: "Jane@Example.com",
      password: "strong-pass",
      dateOfBirth: "1995-06-15",
      profilePic: "/media/jane.jpg",
      address: {
        street: "123 Green St",
        city: "Vegas",
        postalCode: "12345",
        country: "US",
      },
      securityQuestions: [{ quiz: "pet", ans: "milo" }],
    });

    setUserFullName(user, "Janet Doe");
    setUserEmail(user, "janet@example.com");
    setUserIsActive(user, false);

    expect(getUserFullName(user)).toBe("Janet Doe");
    expect(getUserEmail(user)).toBe("janet@example.com");
    expect(getUserIsActive(user)).toBe(false);
  });

  test("setUserEmail throws for invalid value", () => {
    const user = createUser({
      fullName: "Jane Doe",
      phoneNumber: "+1 702-555-0102",
      email: "Jane@Example.com",
      password: "strong-pass",
      dateOfBirth: "1995-06-15",
      profilePic: "/media/jane.jpg",
      address: {
        street: "123 Green St",
        city: "Vegas",
        postalCode: "12345",
        country: "US",
      },
      securityQuestions: [{ quiz: "pet", ans: "milo" }],
    });

    expect(() => setUserEmail(user, "bad-email")).toThrow(
      "email must be valid",
    );
  });
});
