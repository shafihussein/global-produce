import path from "node:path";
import { fileURLToPath } from "node:url";
import { v7 as uuidv7 } from "uuid";
import {
  User,
  getUserEmail,
  setUserEmail,
  getUserFullName,
  setUserFullName,
  getUserPhoneNumber,
  setUserPhoneNumber,
  getUserAddress,
  setUserAddress,
  getUserOrders,
  setUserOrders,
  getUserSecurityQuestions,
  setUserSecurityQuestions,
  getUserIsActive,
  setUserIsActive,
} from "./User.js";
import { appendJsonRecord, readJsonArrayFile } from "../utils/fileStore.js";
import { ensureEmailIsUnique } from "../utils/userMapper.js";

const MODEL_DIRECTORY = path.dirname(fileURLToPath(import.meta.url));
const CUSTOMERS_FILE_PATH = path.resolve(
  MODEL_DIRECTORY,
  "../../database/users/Customers.js",
);
const ADMINS_FILE_PATH = path.resolve(
  MODEL_DIRECTORY,
  "../../database/users/Admins.js",
);

export class Customer extends User {
  constructor(customerPayload) {
    super(customerPayload);
    // Customer is a specialized user object.
    this.role = "customer";
  }
}

export function getCustomerId(customer) {
  return customer.id;
}

export function setCustomerId(customer, id) {
  customer.id = id;
  return customer.id;
}

export function getCustomerFullName(customer) {
  return getUserFullName(customer);
}

export function setCustomerFullName(customer, fullName) {
  return setUserFullName(customer, fullName);
}

export function getCustomerPhoneNumber(customer) {
  return getUserPhoneNumber(customer);
}

export function setCustomerPhoneNumber(customer, phoneNumber) {
  return setUserPhoneNumber(customer, phoneNumber);
}

export function getCustomerEmail(customer) {
  return getUserEmail(customer);
}

export function setCustomerEmail(customer, email) {
  return setUserEmail(customer, email);
}

export function getCustomerAddress(customer) {
  return getUserAddress(customer);
}

export function setCustomerAddress(customer, address) {
  return setUserAddress(customer, address);
}

export function getCustomerOrders(customer) {
  return getUserOrders(customer);
}

export function setCustomerOrders(customer, orders) {
  return setUserOrders(customer, orders);
}

export function getCustomerSecurityQuestions(customer) {
  return getUserSecurityQuestions(customer);
}

export function setCustomerSecurityQuestions(customer, securityQuestions) {
  return setUserSecurityQuestions(customer, securityQuestions);
}

export function getCustomerIsActive(customer) {
  return getUserIsActive(customer);
}

export function setCustomerIsActive(customer, isActive) {
  return setUserIsActive(customer, isActive);
}

export default function createCustomer(customerPayload) {
  const allCustomers = readJsonArrayFile(CUSTOMERS_FILE_PATH);
  const allAdmins = readJsonArrayFile(ADMINS_FILE_PATH);

  // Enforce unique identity across customer and admin collections.
  ensureEmailIsUnique(customerPayload?.email, allCustomers, allAdmins);

  const customer = new Customer({
    ...customerPayload,
    id: customerPayload?.id || uuidv7(),
  });

  appendJsonRecord(CUSTOMERS_FILE_PATH, customer);
  return customer;
}
