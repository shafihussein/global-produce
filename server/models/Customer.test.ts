import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import createCustomer, { Customer, getCustomerEmail } from "./Customer.ts";

const MODEL_DIRECTORY = path.dirname(fileURLToPath(import.meta.url));
const CUSTOMERS_FILE_PATH = path.resolve(
  MODEL_DIRECTORY,
  "../../database/users/Customers.ts",
);
const ADMINS_FILE_PATH = path.resolve(
  MODEL_DIRECTORY,
  "../../database/users/Admins.ts",
);

let customersBackup: string | null = null;
let adminsBackup: string | null = null;

describe("Customer model", () => {
  beforeAll(() => {
    customersBackup = fs.existsSync(CUSTOMERS_FILE_PATH)
      ? fs.readFileSync(CUSTOMERS_FILE_PATH, "utf8")
      : null;
    adminsBackup = fs.existsSync(ADMINS_FILE_PATH)
      ? fs.readFileSync(ADMINS_FILE_PATH, "utf8")
      : null;
  });

  beforeEach(() => {
    fs.mkdirSync(path.dirname(CUSTOMERS_FILE_PATH), { recursive: true });
    fs.writeFileSync(CUSTOMERS_FILE_PATH, "[]", "utf8");
    fs.writeFileSync(ADMINS_FILE_PATH, "[]", "utf8");
  });

  afterAll(() => {
    if (customersBackup === null) {
      fs.rmSync(CUSTOMERS_FILE_PATH, { force: true });
    } else {
      fs.writeFileSync(CUSTOMERS_FILE_PATH, customersBackup, "utf8");
    }

    if (adminsBackup === null) {
      fs.rmSync(ADMINS_FILE_PATH, { force: true });
    } else {
      fs.writeFileSync(ADMINS_FILE_PATH, adminsBackup, "utf8");
    }
  });

  test("createCustomer persists JSON array object in Customers.ts", () => {
    const customer = createCustomer({
      fullName: "Customer One",
      phoneNumber: "+1 702-555-0111",
      email: "customer.one@example.com",
      password: "safe-pass",
      dateOfBirth: "1999-01-01",
      profilePic: "/media/customer.jpg",
      address: {
        street: "111 Apple St",
        city: "Vegas",
        postalCode: "12345",
        country: "US",
      },
      securityQuestions: [{ quiz: "pet", ans: "leo" }],
    });

    expect(customer).toBeInstanceOf(Customer);
    expect(getCustomerEmail(customer)).toBe("customer.one@example.com");

    const persisted = JSON.parse(fs.readFileSync(CUSTOMERS_FILE_PATH, "utf8"));
    expect(Array.isArray(persisted)).toBe(true);
    expect(persisted).toHaveLength(1);
    expect(persisted[0].email).toBe("customer.one@example.com");
  });

  test("createCustomer rejects duplicate email across admins and customers", () => {
    fs.writeFileSync(
      ADMINS_FILE_PATH,
      JSON.stringify([{ email: "duplicate@example.com" }], null, 2),
      "utf8",
    );

    expect(() =>
      createCustomer({
        fullName: "Customer Two",
        phoneNumber: "+1 702-555-0222",
        email: "duplicate@example.com",
        password: "safe-pass",
        dateOfBirth: "1994-01-01",
        profilePic: "/media/customer2.jpg",
        address: {
          street: "222 Orange St",
          city: "Vegas",
          postalCode: "12345",
          country: "US",
        },
        securityQuestions: [{ quiz: "color", ans: "blue" }],
      }),
    ).toThrow("User already exists");
  });
});
