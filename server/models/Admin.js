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
  getUserOrders,
  setUserOrders,
  getUserSecurityQuestions,
  setUserSecurityQuestions,
  getUserIsActive,
  setUserIsActive,
} from "./User.js";
import { appendJsonRecord, readJsonArrayFile } from "../utils/fileStore.js";
import { ensureEmailIsUnique } from "../utils/userMapper.js";
import {
  consumeAdminActivationToken,
  isAdminActivationTokenValid,
} from "../services/adminActivationTokenService.js";

const MODEL_DIRECTORY = path.dirname(fileURLToPath(import.meta.url));
const ADMINS_FILE_PATH = path.resolve(
  MODEL_DIRECTORY,
  "../../database/users/Admins.js",
);
const CUSTOMERS_FILE_PATH = path.resolve(
  MODEL_DIRECTORY,
  "../../database/users/Customers.js",
);

export class Admin extends User {
  constructor(adminPayload) {
    super(adminPayload);

    const providedToken =
      typeof adminPayload?.token === "string" ? adminPayload.token.trim() : "";
    const isValidToken = isAdminActivationTokenValid(providedToken);

    // Admin can be promoted to super-admin only by valid one-time activation token.
    this.role = "admin";
    this.token = providedToken || null;
    this.isSuperAdmin = isValidToken;
  }
}

export function getAdminId(admin) {
  return admin.id;
}

export function setAdminId(admin, id) {
  admin.id = id;
  return admin.id;
}

export function getAdminFullName(admin) {
  return getUserFullName(admin);
}

export function setAdminFullName(admin, fullName) {
  return setUserFullName(admin, fullName);
}

export function getAdminPhoneNumber(admin) {
  return getUserPhoneNumber(admin);
}

export function setAdminPhoneNumber(admin, phoneNumber) {
  return setUserPhoneNumber(admin, phoneNumber);
}

export function getAdminEmail(admin) {
  return getUserEmail(admin);
}

export function setAdminEmail(admin, email) {
  return setUserEmail(admin, email);
}

export function getAdminAddress(admin) {
  return getUserAddress(admin);
}

export function setAdminAddress(admin, address) {
  return setUserAddress(admin, address);
}

export function getAdminOrders(admin) {
  return getUserOrders(admin);
}

export function setAdminOrders(admin, orders) {
  return setUserOrders(admin, orders);
}

export function getAdminSecurityQuestions(admin) {
  return getUserSecurityQuestions(admin);
}

export function setAdminSecurityQuestions(admin, securityQuestions) {
  return setUserSecurityQuestions(admin, securityQuestions);
}

export function getAdminIsActive(admin) {
  return getUserIsActive(admin);
}

export function setAdminIsActive(admin, isActive) {
  return setUserIsActive(admin, isActive);
}

export function getAdminToken(admin) {
  return admin.token;
}

export function setAdminToken(admin, token) {
  admin.token = typeof token === "string" ? token.trim() : null;
  return admin.token;
}

export function getAdminIsSuperAdmin(admin) {
  return admin.isSuperAdmin;
}

export function setAdminIsSuperAdmin(admin, isSuperAdmin) {
  if (typeof isSuperAdmin !== "boolean") {
    throw new Error("isSuperAdmin must be boolean");
  }

  admin.isSuperAdmin = isSuperAdmin;
  return admin.isSuperAdmin;
}

export default function createAdmin(adminPayload) {
  const allAdmins = readJsonArrayFile(ADMINS_FILE_PATH);
  const allCustomers = readJsonArrayFile(CUSTOMERS_FILE_PATH);

  // Enforce unique identity across admin and customer collections.
  ensureEmailIsUnique(adminPayload?.email, allAdmins, allCustomers);

  const admin = new Admin({
    ...adminPayload,
    id: adminPayload?.id || uuidv7(),
  });

  if (admin.isSuperAdmin && admin.token) {
    consumeAdminActivationToken(admin.token);
  }

  appendJsonRecord(ADMINS_FILE_PATH, admin);
  return admin;
}
