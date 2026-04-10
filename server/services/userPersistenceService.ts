import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  listDirectoryFiles,
  readJsonObjectFile,
  writeJsonObjectFile,
} from "../utils/fileStore.ts";
import type { Admin, Customer } from "../types/schemas.ts";

const SERVICE_DIRECTORY = path.dirname(fileURLToPath(import.meta.url));
const USERS_DIRECTORY = path.resolve(SERVICE_DIRECTORY, "../../database/users");
const ADMINS_DIRECTORY = path.resolve(USERS_DIRECTORY, "Admin");
const CUSTOMERS_DIRECTORY = path.resolve(USERS_DIRECTORY, "Customers");

function buildEntityFilePath(baseDirectory: string, id: string): string {
  return path.resolve(baseDirectory, `${id}.ts`);
}

export function saveAdminRecord(admin: Admin): Admin {
  const filePath = buildEntityFilePath(ADMINS_DIRECTORY, admin.id);
  writeJsonObjectFile(filePath, admin as Record<string, unknown>);
  return admin;
}

export function saveCustomerRecord(customer: Customer): Customer {
  const filePath = buildEntityFilePath(CUSTOMERS_DIRECTORY, customer.id);
  writeJsonObjectFile(filePath, customer as Record<string, unknown>);
  return customer;
}

export function readAllAdmins(): Admin[] {
  const files = listDirectoryFiles(ADMINS_DIRECTORY).filter((fileName) =>
    fileName.endsWith(".ts"),
  );

  return files
    .map((fileName) =>
      readJsonObjectFile<Admin>(path.resolve(ADMINS_DIRECTORY, fileName)),
    )
    .filter((admin): admin is Admin => Boolean(admin));
}

export function readAllCustomers(): Customer[] {
  const files = listDirectoryFiles(CUSTOMERS_DIRECTORY).filter((fileName) =>
    fileName.endsWith(".ts"),
  );

  return files
    .map((fileName) =>
      readJsonObjectFile<Customer>(path.resolve(CUSTOMERS_DIRECTORY, fileName)),
    )
    .filter((customer): customer is Customer => Boolean(customer));
}
