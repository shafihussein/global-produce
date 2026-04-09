import {
  validateDateOfBirth,
  validateEmail,
  validateNonEmptyString,
} from "../utils/validators.js";
import {
  assertGeneratedIdIsImmutable,
  buildUserData,
  ensureProfilePicDirectory,
  hashPassword,
  normalizeUserAddress,
  normalizeUserPhoneNumber,
  validateIsActive,
} from "../utils/userModelUtils.js";

export class User {
  constructor(userPayload) {
    const userData = buildUserData(userPayload);

    // Core user profile fields from the design object.
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

export function getUserId(user) {
  return user.id;
}

export function setUserId(user, id) {
  assertGeneratedIdIsImmutable();
}

export function getUserFullName(user) {
  return user.fullName;
}

export function setUserFullName(user, fullName) {
  user.fullName = validateNonEmptyString(fullName, "fullName");
  return user.fullName;
}

export function getUserPhoneNumber(user) {
  return user.phoneNumber;
}

export function setUserPhoneNumber(user, phoneNumber) {
  user.phoneNumber = normalizeUserPhoneNumber(phoneNumber);
  return user.phoneNumber;
}

export function getUserEmail(user) {
  return user.email;
}

export function setUserEmail(user, email) {
  user.email = validateEmail(email);
  return user.email;
}

export function getUserPassword(user) {
  return user.password;
}

export function setUserPassword(user, password) {
  user.password = hashPassword(password);
  return user.password;
}

export function getUserDateOfBirth(user) {
  return user.dateOfBirth;
}

export function setUserDateOfBirth(user, dateOfBirth) {
  user.dateOfBirth = validateDateOfBirth(dateOfBirth);
  return user.dateOfBirth;
}

export function getUserProfilePic(user) {
  return user.profilePic;
}

export function setUserProfilePic(user, profilePic) {
  user.profilePic = validateNonEmptyString(profilePic, "profilePic");
  return user.profilePic;
}

export function getUserAddress(user) {
  return user.address;
}

export function setUserAddress(user, address) {
  user.address = normalizeUserAddress(address);
  return user.address;
}

export function getUserCreatedAt(user) {
  return user.createdAt;
}

export function setUserCreatedAt(user, createdAt) {
  user.createdAt = validateDateOfBirth(createdAt);
  return user.createdAt;
}

export function getUserIsActive(user) {
  return user.isActive;
}

export function setUserIsActive(user, isActive) {
  user.isActive = validateIsActive(isActive);
  return user.isActive;
}

export default function createUser(userPayload) {
  const user = new User(userPayload);
  user.profilePic = ensureProfilePicDirectory(user.id);
  user.password = hashPassword(user.password);

  return user;
}
