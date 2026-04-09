import path from "node:path";
import { fileURLToPath } from "node:url";
import { v7 as uuidv7 } from "uuid";
import {
  User,
  getUserEmail,
  setUserEmail,
  getUserFullName,
  setUserFullName,
  getUserPhoneNumber,
  setUserPhoneNumber,
  getUserAddress,
  setUserAddress,
  getUserIsActive,
  setUserIsActive,
} from "./User.ts";
import { appendJsonRecord, readJsonArrayFile } from "../utils/fileStore.ts";
import { ensureEmailIsUnique } from "../utils/userMapper.ts";
import {
  consumeAdminActivationToken,
  isAdminActivationTokenValid,
} from "../services/adminActivationTokenService.ts";
import type { Admin as AdminType } from "../types/schemas.ts";

const MODEL_DIRECTORY = path.dirname(fileURLToPath(import.meta.url));
const ADMINS_FILE_PATH = path.resolve(
  MODEL_DIRECTORY,
  "../../database/users/Admins.ts",
);
const CUSTOMERS_FILE_PATH = path.resolve(
  MODEL_DIRECTORY,
  "../../database/users/Customers.ts",
);

/**
 * Admin class extends User with super-admin role management.
 * Specializes User for administrative/management scenarios.
 *
 * @interface IAdmin extends IUser
 * - role: Literal "admin"
 * - token: One-time activation token for super-admin promotion (nullable)
 * - isSuperAdmin: Boolean flag set when valid token is provided (defaults false)
 */
export class Admin extends User implements AdminType {
  declare role: "admin";
  token!: string | null;
  isSuperAdmin!: boolean;

  constructor(adminPayload: Record<string, unknown>) {
    super(adminPayload);

    const providedToken =
      typeof adminPayload?.token === "string" ? adminPayload.token.trim() : "";
    const isValidToken = isAdminActivationTokenValid(providedToken);

    // Admin can be promoted to super-admin only by valid one-time activation token
    this.role = "admin";
    this.token = providedToken || null;
    this.isSuperAdmin = isValidToken;
  }
}

// ============================================================================
// Getter Exports (Admin-specific + inherited from User)
// ============================================================================

export function getAdminId(admin: Admin): string {
  return admin.id;
}

export function getAdminFullName(admin: Admin): string {
  return getUserFullName(admin);
}

export function getAdminPhoneNumber(admin: Admin): string {
  return getUserPhoneNumber(admin);
}

export function getAdminEmail(admin: Admin): string {
  return getUserEmail(admin);
}

export function getAdminAddress(admin: Admin): ReturnType<typeof getUserAddress> {
  return getUserAddress(admin);
}

export function getAdminIsActive(admin: Admin): boolean {
  return getUserIsActive(admin);
}

export function getAdminToken(admin: Admin): string | null {
  return admin.token;
}

export function getAdminIsSuperAdmin(admin: Admin): boolean {
  return admin.isSuperAdmin;
}

// ============================================================================
// Setter Exports (Admin-specific + inherited from User)
// ============================================================================

export function setAdminId(_admin: Admin, _id: unknown): never {
  throw new Error("Admin ID is immutable");
}

export function setAdminFullName(admin: Admin, fullName: unknown): string {
  return setUserFullName(admin, fullName);
}

export function setAdminPhoneNumber(admin: Admin, phoneNumber: unknown): string {
  return setUserPhoneNumber(admin, phoneNumber);
}

export function setAdminEmail(admin: Admin, email: unknown): string {
  return setUserEmail(admin, email);
}

export function setAdminAddress(admin: Admin, address: unknown): ReturnType<typeof setUserAddress> {
  return setUserAddress(admin, address);
}

export function setAdminIsActive(admin: Admin, isActive: unknown): boolean {
  return setUserIsActive(admin, isActive);
}

export function setAdminToken(admin: Admin, token: unknown): string | null {
  admin.token = typeof token === "string" ? token.trim() : null;
  return admin.token;
}

export function setAdminIsSuperAdmin(admin: Admin, isSuperAdmin: unknown): boolean {
  if (typeof isSuperAdmin !== "boolean") {
    throw new Error("isSuperAdmin must be boolean");
  }

  admin.isSuperAdmin = isSuperAdmin;
  return admin.isSuperAdmin;
}

// ============================================================================
// Factory Function (Default Export)
// ============================================================================

/**
 * Creates a new Admin instance with persistence:
 * 1. Validates email is unique across Admins and Customers
 * 2. Initializes Admin class with token validation for super-admin promotion
 * 3. Consumes token if valid (one-time bootstrap only)
 * 4. Persists to database/users/Admins.ts JSON array
 *
 * @param adminPayload - Raw admin data (email, name, phone, optional token, etc.)
 * @returns Fully initialized and persisted Admin instance
 */
export default function createAdmin(
  adminPayload: Record<string, unknown>,
): Admin {
  const allAdmins = readJsonArrayFile<Admin>(ADMINS_FILE_PATH) as any;
  const allCustomers = readJsonArrayFile(CUSTOMERS_FILE_PATH) as any;

  // Enforce unique email across both admin and customer collections
  ensureEmailIsUnique(adminPayload?.email, allAdmins, allCustomers);

  const admin = new Admin({
    ...adminPayload,
    id: adminPayload?.id || uuidv7(),
  });

  // Consume one-time token if used for super-admin promotion
  if (admin.isSuperAdmin && admin.token) {
    consumeAdminActivationToken(admin.token);
  }

  appendJsonRecord(ADMINS_FILE_PATH, admin as any);
  return admin;
}
