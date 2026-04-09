import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import randomToken from "random-token";

const SERVICE_DIRECTORY = path.dirname(fileURLToPath(import.meta.url));
const TOKEN_FILE_PATH = path.resolve(
  SERVICE_DIRECTORY,
  "../../database/admin_activation_token.txt",
);

export function getAdminTokenFilePath() {
  return TOKEN_FILE_PATH;
}

// Generate a cryptographically random activation token for super-admin bootstrap.
export function createAdminActivationToken(length = 48) {
  return randomToken(length);
}

export function saveAdminActivationToken(token) {
  if (typeof token !== "string" || !token.trim()) {
    throw new Error("token must be a non-empty string");
  }

  fs.writeFileSync(TOKEN_FILE_PATH, token.trim(), "utf8");
  return token.trim();
}

export function readAdminActivationToken() {
  if (!fs.existsSync(TOKEN_FILE_PATH)) {
    return null;
  }

  const token = fs.readFileSync(TOKEN_FILE_PATH, "utf8").trim();
  return token || null;
}

export function isAdminActivationTokenValid(token) {
  if (typeof token !== "string" || !token.trim()) {
    return false;
  }

  const currentToken = readAdminActivationToken();
  return Boolean(currentToken && currentToken === token.trim());
}

// Consume and destroy token file so it can only bootstrap super admin once.
export function consumeAdminActivationToken(token) {
  const isValid = isAdminActivationTokenValid(token);
  if (!isValid) {
    return false;
  }

  fs.unlinkSync(TOKEN_FILE_PATH);
  return true;
}

export function clearAdminActivationToken() {
  if (fs.existsSync(TOKEN_FILE_PATH)) {
    fs.unlinkSync(TOKEN_FILE_PATH);
  }
}

export default function generateAndPersistAdminActivationToken(length = 48) {
  const token = createAdminActivationToken(length);
  return saveAdminActivationToken(token);
}
