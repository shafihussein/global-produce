import {
  validateDateOfBirth,
  validateEmail,
  validateNonEmptyString,
} from "../utils/validators";
import {
  assertGeneratedIdIsImmutable,
  buildUserData,
  ensureProfilePicDirectory,
  hashPassword,
  normalizeUserAddress,
  normalizeUserPhoneNumber,
  validateIsActive,
} from "../utils/userModelUtils";
import type { User as UserType, Address } from "../types/schemas";

/**
 * User class represents the base user entity.
 * All properties are initialized in constructor via buildUserData.
 * Used as parent for Customer and Admin specializations.
 *
 * @interface IUser
 * - id: UUID generated internally, immutable
 * - fullName: Non-empty string
 * - phoneNumber: E.164 normalized phone
 * - email: Valid email address (normalized lowercase)
 * - password: BCrypt-hashed password
 * - dateOfBirth: ISO 8601 datetime
 * - profilePic: Directory path string (created at user creation)
 * - address: Address object with street, city, postalCode, country
 * - createdAt: ISO 8601 datetime (defaults to now)
 * - isActive: Boolean (defaults to true)
 */
export class User implements UserType {
  id!: string;
  fullName!: string;
  phoneNumber!: string;
  email!: string;
  password!: string;
  dateOfBirth!: string;
  profilePic!: string;
  address!: Address;
  createdAt!: string;
  isActive!: boolean;

  constructor(userPayload: Record<string, unknown>) {
    const userData = buildUserData(userPayload);

    // Initialize all user properties from validated data
    this.id = userData.id;
    this.fullName = userData.fullName;
    this.phoneNumber = userData.phoneNumber;
    this.email = userData.email;
    this.password = userData.password;
    this.dateOfBirth = userData.dateOfBirth;
    this.profilePic = userData.profilePic;
    this.address = userData.address;
    this.createdAt = userData.createdAt;
    this.isActive = userData.isActive;
  }
}

// ============================================================================
// Getter Exports
// ============================================================================

export function getUserId(user: User): string {
  return user.id;
}

export function getUserFullName(user: User): string {
  return user.fullName;
}

export function getUserPhoneNumber(user: User): string {
  return user.phoneNumber;
}

export function getUserEmail(user: User): string {
  return user.email;
}

export function getUserPassword(user: User): string {
  return user.password;
}

export function getUserDateOfBirth(user: User): string {
  return user.dateOfBirth;
}

export function getUserProfilePic(user: User): string {
  return user.profilePic;
}

export function getUserAddress(user: User): Address {
  return user.address;
}

export function getUserCreatedAt(user: User): string {
  return user.createdAt;
}

export function getUserIsActive(user: User): boolean {
  return user.isActive;
}

// ============================================================================
// Setter Exports
// ============================================================================

export function setUserId(_user: User, _id: unknown): never {
  assertGeneratedIdIsImmutable();
}

export function setUserFullName(user: User, fullName: unknown): string {
  user.fullName = validateNonEmptyString(fullName, "fullName");
  return user.fullName;
}

export function setUserPhoneNumber(user: User, phoneNumber: unknown): string {
  user.phoneNumber = normalizeUserPhoneNumber(phoneNumber);
  return user.phoneNumber;
}

export function setUserEmail(user: User, email: unknown): string {
  user.email = validateEmail(email);
  return user.email;
}

export function setUserPassword(user: User, password: unknown): string {
  user.password = hashPassword(password);
  return user.password;
}

export function setUserDateOfBirth(user: User, dateOfBirth: unknown): string {
  user.dateOfBirth = validateDateOfBirth(dateOfBirth);
  return user.dateOfBirth;
}

export function setUserProfilePic(user: User, profilePic: unknown): string {
  user.profilePic = validateNonEmptyString(profilePic, "profilePic");
  return user.profilePic;
}

export function setUserAddress(user: User, address: unknown): Address {
  user.address = normalizeUserAddress(address);
  return user.address;
}

export function setUserCreatedAt(user: User, createdAt: unknown): string {
  user.createdAt = validateDateOfBirth(createdAt);
  return user.createdAt;
}

export function setUserIsActive(user: User, isActive: unknown): boolean {
  user.isActive = validateIsActive(isActive);
  return user.isActive;
}

// ============================================================================
// Factory Function (Default Export)
// ============================================================================

/**
 * Creates a new User instance with full initialization:
 * 1. Validates and normalizes input via buildUserData
 * 2. Creates user directory structure (profilePic)
 * 3. Hashes password via bcrypt
 * Returns fully initialized user object.
 */
export default function createUser(userPayload: Record<string, unknown>): User {
  const user = new User(userPayload);
  user.profilePic = ensureProfilePicDirectory(user.id);
  user.password = hashPassword(user.password);

  return user;
}
