import { ensureEmailIsUnique } from "../utils/userMapper.ts";
import { readAllAdmins, readAllCustomers } from "./userPersistenceService.ts";

export function ensureUniqueUserEmail(email: unknown): string {
  const allAdmins = readAllAdmins() as Record<string, unknown>[];
  const allCustomers = readAllCustomers() as Record<string, unknown>[];
  return ensureEmailIsUnique(email, allAdmins, allCustomers);
}
