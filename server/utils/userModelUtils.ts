import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import bcrypt from "bcrypt";
import { v7 as uuidv7 } from "uuid";
import {
  normalizePhoneNumber,
  validateAddress,
  validateDateOfBirth,
  validateEmail,
  validateNonEmptyString,
} from "./validators.ts";
import type { User, Address } from "../types/schemas.ts";

const UTILS_DIRECTORY = path.dirname(fileURLToPath(import.meta.url));
const USERS_DIRECTORY = path.resolve(UTILS_DIRECTORY, "../../database/users");

/**
 * Builds and validates complete user data from input payload.
 * Generates UUID, normalizes all fields, applies defaults.
 * Returns fully initialized user data object.
 */
export function buildUserData(
  userPayload: Record<string, unknown>,
): Omit<User, "role"> {
  if (!userPayload || typeof userPayload !== "object") {
    throw new Error("user input must be an object");
  }

  return {
    id: uuidv7(),
    fullName: validateNonEmptyString(userPayload.fullName, "fullName"),
    phoneNumber: normalizePhoneNumber(userPayload.phoneNumber),
    email: validateEmail(userPayload.email),
    password: validateNonEmptyString(userPayload.password, "password"),
    dateOfBirth: validateDateOfBirth(userPayload.dateOfBirth),
    profilePic: "",
    address: validateAddress(userPayload.address),
    createdAt:
      typeof userPayload.createdAt === "string"
        ? new Date(userPayload.createdAt).toISOString()
        : new Date().toISOString(),
    isActive:
      typeof userPayload.isActive === "boolean" ? userPayload.isActive : true,
  };
}

/**
 * Builds the filesystem path for a user's profile picture directory.
 * Returns path but does NOT create directory.
 */
export function buildProfilePicDirectory(userId: string): string {
  return path.resolve(USERS_DIRECTORY, userId, "profilePic");
}

/**
 * Ensures profile picture directory exists for given user.
 * Creates directory recursively if needed.
 * Returns the directory path.
 */
export function ensureProfilePicDirectory(userId: string): string {
  const profilePicDirectory = buildProfilePicDirectory(userId);
  fs.mkdirSync(profilePicDirectory, { recursive: true });
  return profilePicDirectory;
}

/**
 * Hashes password using bcrypt with cost factor 12.
 * Validates input is non-empty string first.
 * Returns bcrypt hash.
 */
export function hashPassword(password: unknown): string {
  const rawPassword = validateNonEmptyString(password, "password");
  return bcrypt.hashSync(rawPassword, 12);
}

/**
 * Enforces that user ID is immutable.
 * Throws error if attempt to set ID is made.
 */
export function assertGeneratedIdIsImmutable(): never {
  throw new Error("id is generated internally and cannot be set manually");
}

/**
 * Validates that isActive is boolean type.
 * Throws if invalid, returns value if valid.
 */
export function validateIsActive(isActive: unknown): boolean {
  if (typeof isActive !== "boolean") {
    throw new Error("isActive must be boolean");
  }

  return isActive;
}

/**
 * Normalizes phone number to E.164 format.
 * Wrapper around validateNonEmptyString + normalizePhoneNumber.
 */
export function normalizeUserPhoneNumber(phoneNumber: unknown): string {
  return normalizePhoneNumber(phoneNumber);
}

/**
 * Normalizes address object.
 * Wrapper around validateAddress.
 */
export function normalizeUserAddress(address: unknown): Address {
  return validateAddress(address);
}
