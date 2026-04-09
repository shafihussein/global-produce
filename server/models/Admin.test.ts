import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import createAdmin, { Admin, getAdminIsSuperAdmin } from "./Admin.ts";
import {
  clearAdminActivationToken,
  getAdminTokenFilePath,
  saveAdminActivationToken,
} from "../services/adminActivationTokenService.ts";

const MODEL_DIRECTORY = path.dirname(fileURLToPath(import.meta.url));
const ADMINS_FILE_PATH = path.resolve(
  MODEL_DIRECTORY,
  "../../database/users/Admins.ts",
);
const CUSTOMERS_FILE_PATH = path.resolve(
  MODEL_DIRECTORY,
  "../../database/users/Customers.ts",
);

let adminsBackup: string | null = null;
let customersBackup: string | null = null;
let tokenBackup: string | null = null;

describe("Admin model", () => {
  beforeAll(() => {
    adminsBackup = fs.existsSync(ADMINS_FILE_PATH)
      ? fs.readFileSync(ADMINS_FILE_PATH, "utf8")
      : null;
    customersBackup = fs.existsSync(CUSTOMERS_FILE_PATH)
      ? fs.readFileSync(CUSTOMERS_FILE_PATH, "utf8")
      : null;
    tokenBackup = fs.existsSync(getAdminTokenFilePath())
      ? fs.readFileSync(getAdminTokenFilePath(), "utf8")
      : null;
  });

  beforeEach(() => {
    fs.mkdirSync(path.dirname(ADMINS_FILE_PATH), { recursive: true });
    fs.writeFileSync(ADMINS_FILE_PATH, "[]", "utf8");
    fs.writeFileSync(CUSTOMERS_FILE_PATH, "[]", "utf8");
    clearAdminActivationToken();
  });

  afterAll(() => {
    if (adminsBackup === null) {
      fs.rmSync(ADMINS_FILE_PATH, { force: true });
    } else {
      fs.writeFileSync(ADMINS_FILE_PATH, adminsBackup, "utf8");
    }

    if (customersBackup === null) {
      fs.rmSync(CUSTOMERS_FILE_PATH, { force: true });
    } else {
      fs.writeFileSync(CUSTOMERS_FILE_PATH, customersBackup, "utf8");
    }

    if (tokenBackup === null) {
      clearAdminActivationToken();
    } else {
      fs.writeFileSync(getAdminTokenFilePath(), tokenBackup, "utf8");
    }
  });

  test("createAdmin persists admin array object and extends User", () => {
    const admin = createAdmin({
      fullName: "Admin One",
      phoneNumber: "+1 702-555-0333",
      email: "admin.one@example.com",
      password: "safe-pass",
      dateOfBirth: "1989-01-01",
      profilePic: "/media/admin.jpg",
      address: {
        street: "333 Berry St",
        city: "Vegas",
        postalCode: "12345",
        country: "US",
      },
      securityQuestions: [{ quiz: "pet", ans: "tiger" }],
    });

    expect(admin).toBeInstanceOf(Admin);
    expect(getAdminIsSuperAdmin(admin)).toBe(false);

    const persisted = JSON.parse(fs.readFileSync(ADMINS_FILE_PATH, "utf8"));
    expect(Array.isArray(persisted)).toBe(true);
    expect(persisted).toHaveLength(1);
    expect(persisted[0].email).toBe("admin.one@example.com");
  });

  test("createAdmin enables one-time super admin when token is valid", () => {
    saveAdminActivationToken("super-activation-token");

    const admin = createAdmin({
      fullName: "Super Admin",
      phoneNumber: "+1 702-555-0444",
      email: "super.admin@example.com",
      password: "safe-pass",
      dateOfBirth: "1980-01-01",
      profilePic: "/media/super-admin.jpg",
      address: {
        street: "444 Plum St",
        city: "Vegas",
        postalCode: "12345",
        country: "US",
      },
      securityQuestions: [{ quiz: "car", ans: "blue" }],
      token: "super-activation-token",
    });

    expect(getAdminIsSuperAdmin(admin)).toBe(true);
    expect(fs.existsSync(getAdminTokenFilePath())).toBe(false);
  });

  test("createAdmin rejects duplicate email across customers", () => {
    fs.writeFileSync(
      CUSTOMERS_FILE_PATH,
      JSON.stringify([{ email: "dup@example.com" }], null, 2),
      "utf8",
    );

    expect(() =>
      createAdmin({
        fullName: "Admin Two",
        phoneNumber: "+1 702-555-0555",
        email: "dup@example.com",
        password: "safe-pass",
        dateOfBirth: "1991-01-01",
        profilePic: "/media/admin-two.jpg",
        address: {
          street: "555 Melon St",
          city: "Vegas",
          postalCode: "12345",
          country: "US",
        },
        securityQuestions: [{ quiz: "school", ans: "west" }],
      }),
    ).toThrow("User already exists");
  });
});
