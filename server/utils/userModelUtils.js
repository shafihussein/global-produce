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
} from "./validators.js";

const UTILS_DIRECTORY = path.dirname(fileURLToPath(import.meta.url));
const USERS_DIRECTORY = path.resolve(UTILS_DIRECTORY, "../../database/users");

export function buildUserData(userPayload) {
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
    isActive: typeof userPayload.isActive === "boolean" ? userPayload.isActive : true,
  };
}

export function buildProfilePicDirectory(userId) {
  // Each user owns a dedicated profile picture directory under the file database.
  return path.resolve(USERS_DIRECTORY, userId, "profilePic");
}

export function ensureProfilePicDirectory(userId) {
  const profilePicDirectory = buildProfilePicDirectory(userId);
  fs.mkdirSync(profilePicDirectory, { recursive: true });
  return profilePicDirectory;
}

export function hashPassword(password) {
  const rawPassword = validateNonEmptyString(password, "password");
  return bcrypt.hashSync(rawPassword, 12);
}

export function assertGeneratedIdIsImmutable() {
  throw new Error("id is generated internally and cannot be set manually");
}

export function validateIsActive(isActive) {
  if (typeof isActive !== "boolean") {
    throw new Error("isActive must be boolean");
  }

  return isActive;
}

export function normalizeUserPhoneNumber(phoneNumber) {
  return normalizePhoneNumber(phoneNumber);
}

export function normalizeUserAddress(address) {
  return validateAddress(address);
}
