import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  appendJsonRecord,
  ensureDirectoryForFile,
  findRecordByKey,
  readJsonArrayFile,
  writeJsonArrayFile,
} from "./fileStore.ts";

const TEST_DIRECTORY = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../.tmp-tests/file-store",
);
const TEST_FILE = path.join(TEST_DIRECTORY, "records.json");

describe("fileStore utils", () => {
  beforeEach(() => {
    fs.rmSync(TEST_DIRECTORY, { recursive: true, force: true });
  });

  afterAll(() => {
    fs.rmSync(TEST_DIRECTORY, { recursive: true, force: true });
  });

  test("ensureDirectoryForFile creates directory tree", () => {
    ensureDirectoryForFile(TEST_FILE);
    expect(fs.existsSync(TEST_DIRECTORY)).toBe(true);
  });

  test("readJsonArrayFile returns empty array when file does not exist", () => {
    const result = readJsonArrayFile(TEST_FILE);
    expect(result).toEqual([]);
  });

  test("writeJsonArrayFile writes readable array JSON", () => {
    writeJsonArrayFile(TEST_FILE, [{ id: "1" }]);
    const content = fs.readFileSync(TEST_FILE, "utf8");
    expect(content).toContain("\n");
    expect(readJsonArrayFile(TEST_FILE)).toEqual([{ id: "1" }]);
  });

  test("appendJsonRecord appends records in order", () => {
    appendJsonRecord(TEST_FILE, { id: "1" });
    appendJsonRecord(TEST_FILE, { id: "2" });
    expect(readJsonArrayFile(TEST_FILE)).toEqual([{ id: "1" }, { id: "2" }]);
  });

  test("findRecordByKey returns matching record or null", () => {
    writeJsonArrayFile(TEST_FILE, [{ id: "a", email: "a@example.com" }]);
    expect(findRecordByKey(TEST_FILE, "email", "a@example.com")).toEqual({
      id: "a",
      email: "a@example.com",
    });
    expect(
      findRecordByKey(TEST_FILE, "email", "missing@example.com"),
    ).toBeNull();
  });
});
