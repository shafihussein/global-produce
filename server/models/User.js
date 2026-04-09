import { v7 as uuidv7 } from "uuid";
import { mapUserInput } from "../utils/userMapper.js";
import {
  normalizePhoneNumber,
  validateAddress,
  validateDateOfBirth,
  validateEmail,
  validateNonEmptyString,
  validateSecurityQuestions,
} from "../utils/validators.js";

export class User {
  constructor(userPayload) {
    const normalized = mapUserInput(userPayload);

    // Core user profile fields from the design object.
    this.id = userPayload?.id || uuidv7();
    this.fullName = normalized.fullName;
    this.phoneNumber = normalized.phoneNumber;
    this.email = normalized.email;
    this.password = normalized.password;
    this.dateOfBirth = normalized.dateOfBirth;
    this.profilePic = normalized.profilePic;
    this.address = normalized.address;
    this.orders = normalized.orders;
    this.securityQuestions = normalized.securityQuestions;
    this.createdAt = normalized.createdAt;
    this.isActive = normalized.isActive;
  }
}

export function getUserId(user) {
  return user.id;
}

export function setUserId(user, id) {
  user.id = validateNonEmptyString(id, "id");
  return user.id;
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
  user.phoneNumber = normalizePhoneNumber(phoneNumber);
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
  user.password = validateNonEmptyString(password, "password");
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
  user.address = validateAddress(address);
  return user.address;
}

export function getUserOrders(user) {
  return user.orders;
}

export function setUserOrders(user, orders) {
  if (!orders || typeof orders !== "object") {
    throw new Error("orders must be an object");
  }

  user.orders = orders;
  return user.orders;
}

export function getUserSecurityQuestions(user) {
  return user.securityQuestions;
}

export function setUserSecurityQuestions(user, securityQuestions) {
  user.securityQuestions = validateSecurityQuestions(securityQuestions);
  return user.securityQuestions;
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
  if (typeof isActive !== "boolean") {
    throw new Error("isActive must be boolean");
  }

  user.isActive = isActive;
  return user.isActive;
}

export default function createUser(userPayload) {
  return new User(userPayload);
}
