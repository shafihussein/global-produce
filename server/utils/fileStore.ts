import fs from "node:fs";
import path from "node:path";

/**
 * Ensures parent directory exists for a file path.
 * Creates nested directories recursively if needed.
 */
export function ensureDirectoryForFile(filePath: string): void {
  const directory = path.dirname(filePath);
  fs.mkdirSync(directory, { recursive: true });
}

/**
 * Reads a JSON array file safely.
 * Returns empty array if file missing, empty, or invalid JSON.
 * Throws if file contains non-array JSON.
 */
export function readJsonArrayFile<T = Record<string, unknown>>(
  filePath: string,
): T[] {
  if (!fs.existsSync(filePath)) {
    return [];
  }

  const content = fs.readFileSync(filePath, "utf8").trim();
  if (!content) {
    return [];
  }

  const parsed: unknown = JSON.parse(content);
  if (!Array.isArray(parsed)) {
    throw new Error(`Expected array JSON in ${filePath}`);
  }

  return parsed as T[];
}

/**
 * Writes an array of records as pretty JSON (2-space indent).
 * Ensures parent directory exists first.
 * Throws if records is not an array.
 */
export function writeJsonArrayFile<T extends Record<string, unknown>>(
  filePath: string,
  records: T[],
): void {
  if (!Array.isArray(records)) {
    throw new Error("records must be an array");
  }

  ensureDirectoryForFile(filePath);
  const serialized = JSON.stringify(records, null, 2);
  fs.writeFileSync(filePath, serialized, "utf8");
}

/**
 * Appends a single record to an array-backed JSON file.
 * Reads current records, appends record, writes all back.
 * Returns the appended record.
 */
export function appendJsonRecord<T extends Record<string, unknown>>(
  filePath: string,
  record: T,
): T {
  const currentRecords = readJsonArrayFile<T>(filePath);
  currentRecords.push(record);
  writeJsonArrayFile(filePath, currentRecords);
  return record;
}

/**
 * Reads a JSON object file safely.
 * Returns null if file missing or empty.
 * Throws if JSON is invalid or not an object.
 */
export function readJsonObjectFile<T = Record<string, unknown>>(
  filePath: string,
): T | null {
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const content = fs.readFileSync(filePath, "utf8").trim();
  if (!content) {
    return null;
  }

  const parsed: unknown = JSON.parse(content);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error(`Expected object JSON in ${filePath}`);
  }

  return parsed as T;
}

/**
 * Writes a single record as pretty JSON (2-space indent).
 * Ensures parent directory exists first.
 */
export function writeJsonObjectFile<T extends Record<string, unknown>>(
  filePath: string,
  record: T,
): void {
  ensureDirectoryForFile(filePath);
  const serialized = JSON.stringify(record, null, 2);
  fs.writeFileSync(filePath, serialized, "utf8");
}

/**
 * Lists file names in a directory.
 * Returns empty array when directory does not exist.
 */
export function listDirectoryFiles(directoryPath: string): string[] {
  if (!fs.existsSync(directoryPath)) {
    return [];
  }

  return fs
    .readdirSync(directoryPath)
    .filter((childName) =>
      fs.statSync(path.resolve(directoryPath, childName)).isFile(),
    );
}

/**
 * Finds a single record by key/value match in array-backed JSON file.
 * Returns first matching record, or null if not found.
 */
export function findRecordByKey<T extends Record<string, unknown>>(
  filePath: string,
  key: string,
  value: unknown,
): T | null {
  const currentRecords = readJsonArrayFile<T>(filePath);
  const found = currentRecords.find((record) => record?.[key] === value);
  return found || null;
}
