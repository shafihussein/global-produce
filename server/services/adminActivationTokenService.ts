import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import randomToken from "random-token";

const SERVICE_DIRECTORY = path.dirname(fileURLToPath(import.meta.url));
const TOKEN_FILE_PATH = path.resolve(
  SERVICE_DIRECTORY,
  "../../database/admin_activation_token.txt",
);

/**
 * Returns the file path where admin activation token is persisted.
 */
export function getAdminTokenFilePath(): string {
  return TOKEN_FILE_PATH;
}

/**
 * Generates a cryptographically random activation token for super-admin bootstrap.
 * Token length defaults to 48 characters.
 */
export function createAdminActivationToken(length: number = 48): string {
  return randomToken(length);
}

/**
 * Saves admin activation token to TOKEN_FILE_PATH.
 * Validates token is non-empty string first.
 * Returns trimmed token.
 */
export function saveAdminActivationToken(token: unknown): string {
  if (typeof token !== "string" || !token.trim()) {
    throw new Error("token must be a non-empty string");
  }

  fs.writeFileSync(TOKEN_FILE_PATH, token.trim(), "utf8");
  return token.trim();
}

/**
 * Reads admin activation token from file if it exists.
 * Returns token string, or null if file missing or empty.
 */
export function readAdminActivationToken(): string | null {
  if (!fs.existsSync(TOKEN_FILE_PATH)) {
    return null;
  }

  const token = fs.readFileSync(TOKEN_FILE_PATH, "utf8").trim();
  return token || null;
}

/**
 * Validates that provided token matches the current saved token.
 * Returns true if token is valid and matches, false otherwise.
 */
export function isAdminActivationTokenValid(token: unknown): boolean {
  if (typeof token !== "string" || !token.trim()) {
    return false;
  }

  const currentToken = readAdminActivationToken();
  return Boolean(currentToken && currentToken === token.trim());
}

/**
 * Consumes (and destroys) the admin activation token.
 * Removes token file so bootstrap can only happen once.
 * Validates token before consuming.
 * Returns true if consumed, false if invalid.
 */
export function consumeAdminActivationToken(token: unknown): boolean {
  const isValid = isAdminActivationTokenValid(token);
  if (!isValid) {
    return false;
  }

  if (fs.existsSync(TOKEN_FILE_PATH)) {
    fs.unlinkSync(TOKEN_FILE_PATH);
  }
  return true;
}

/**
 * Clears/deletes the admin activation token file if it exists.
 * Safe to call when file doesn't exist.
 */
export function clearAdminActivationToken(): void {
  if (fs.existsSync(TOKEN_FILE_PATH)) {
    fs.unlinkSync(TOKEN_FILE_PATH);
  }
}

/**
 * Generates and persists a new admin activation token in one operation.
 * Token length defaults to 48 characters.
 * Returns the generated and saved token.
 */
export default function generateAndPersistAdminActivationToken(
  length: number = 48,
): string {
  const token = createAdminActivationToken(length);
  return saveAdminActivationToken(token);
}
