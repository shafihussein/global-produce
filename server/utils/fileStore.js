import fs from "node:fs";
import path from "node:path";

// Ensure nested directories exist before writing files.
export function ensureDirectoryForFile(filePath) {
  const directory = path.dirname(filePath);
  fs.mkdirSync(directory, { recursive: true });
}

// Read a JSON array file safely; missing or empty files become an empty array.
export function readJsonArrayFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return [];
  }

  const content = fs.readFileSync(filePath, "utf8").trim();
  if (!content) {
    return [];
  }

  const parsed = JSON.parse(content);
  if (!Array.isArray(parsed)) {
    throw new Error(`Expected array JSON in ${filePath}`);
  }

  return parsed;
}

// Persist an array as pretty JSON for readability in the file-based database.
export function writeJsonArrayFile(filePath, records) {
  if (!Array.isArray(records)) {
    throw new Error("records must be an array");
  }

  ensureDirectoryForFile(filePath);
  const serialized = JSON.stringify(records, null, 2);
  fs.writeFileSync(filePath, serialized, "utf8");
}

// Append one JSON object record into an array-backed JSON file.
export function appendJsonRecord(filePath, record) {
  const currentRecords = readJsonArrayFile(filePath);
  currentRecords.push(record);
  writeJsonArrayFile(filePath, currentRecords);
  return record;
}

// Find a single record by key/value in an array-backed JSON file.
export function findRecordByKey(filePath, key, value) {
  const currentRecords = readJsonArrayFile(filePath);
  return currentRecords.find((record) => record?.[key] === value) || null;
}
