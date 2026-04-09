import fs from "node:fs";
import {
  clearAdminActivationToken,
  consumeAdminActivationToken,
  createAdminActivationToken,
  getAdminTokenFilePath,
  isAdminActivationTokenValid,
  readAdminActivationToken,
  saveAdminActivationToken,
} from "./adminActivationTokenService.ts";

describe("adminActivationTokenService", () => {
  beforeEach(() => {
    clearAdminActivationToken();
  });

  afterAll(() => {
    clearAdminActivationToken();
  });

  test("createAdminActivationToken creates token with requested length", () => {
    const token = createAdminActivationToken(24);
    expect(token).toHaveLength(24);
  });

  test("save/read token roundtrip", () => {
    saveAdminActivationToken("my-token");
    expect(readAdminActivationToken()).toBe("my-token");
    expect(fs.existsSync(getAdminTokenFilePath())).toBe(true);
  });

  test("isAdminActivationTokenValid checks exact match", () => {
    saveAdminActivationToken("abc123");
    expect(isAdminActivationTokenValid("abc123")).toBe(true);
    expect(isAdminActivationTokenValid("wrong")).toBe(false);
  });

  test("consumeAdminActivationToken is one-time and deletes file", () => {
    saveAdminActivationToken("one-time");
    expect(consumeAdminActivationToken("one-time")).toBe(true);
    expect(fs.existsSync(getAdminTokenFilePath())).toBe(false);
    expect(consumeAdminActivationToken("one-time")).toBe(false);
  });
});
