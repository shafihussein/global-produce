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
  getUserIsActive,
  setUserIsActive,
} from "./User.ts";
import { ensureUniqueUserEmail } from "../services/userUniquenessService.ts";
import { saveCustomerRecord } from "../services/userPersistenceService.ts";
import type {
  Customer as CustomerType,
  OrdersContainer,
} from "../types/schemas.ts";

/**
 * Customer class extends User with order management.
 * Specializes the User entity for retail/ecommerce scenarios.
 *
 * @interface ICustomer extends IUser
 * - role: Literal "customer"
 * - orders: OrdersContainer with statuses: placed, processing, shipped, delivered, cancelled
 */
export class Customer extends User implements CustomerType {
  declare role: "customer";
  orders!: OrdersContainer;

  constructor(customerPayload: Record<string, unknown>) {
    super(customerPayload);
    // Customer is a specialized user object with orders management
    this.role = "customer";
    this.orders = {
      placed: [],
      processing: [],
      shipped: [],
      delivered: [],
      cancelled: [],
    };
  }
}

// ============================================================================
// Getter Exports (Customer-specific + inherited from User)
// ============================================================================

export function getCustomerId(customer: Customer): string {
  return customer.id;
}

export function getCustomerFullName(customer: Customer): string {
  return getUserFullName(customer);
}

export function getCustomerPhoneNumber(customer: Customer): string {
  return getUserPhoneNumber(customer);
}

export function getCustomerEmail(customer: Customer): string {
  return getUserEmail(customer);
}

export function getCustomerAddress(
  customer: Customer,
): ReturnType<typeof getUserAddress> {
  return getUserAddress(customer);
}

export function getCustomerOrders(customer: Customer): OrdersContainer {
  return customer.orders;
}

export function getCustomerIsActive(customer: Customer): boolean {
  return getUserIsActive(customer);
}

// ============================================================================
// Setter Exports (Customer-specific + inherited from User)
// ============================================================================

export function setCustomerId(_customer: Customer, _id: unknown): never {
  throw new Error("Customer ID is immutable");
}

export function setCustomerFullName(
  customer: Customer,
  fullName: unknown,
): string {
  return setUserFullName(customer, fullName);
}

export function setCustomerPhoneNumber(
  customer: Customer,
  phoneNumber: unknown,
): string {
  return setUserPhoneNumber(customer, phoneNumber);
}

export function setCustomerEmail(customer: Customer, email: unknown): string {
  return setUserEmail(customer, email);
}

export function setCustomerAddress(
  customer: Customer,
  address: unknown,
): ReturnType<typeof setUserAddress> {
  return setUserAddress(customer, address);
}

export function setCustomerOrders(
  customer: Customer,
  orders: unknown,
): OrdersContainer {
  if (!orders || typeof orders !== "object") {
    throw new Error("orders must be an object");
  }

  customer.orders = orders as OrdersContainer;
  return customer.orders;
}

export function setCustomerIsActive(
  customer: Customer,
  isActive: unknown,
): boolean {
  return setUserIsActive(customer, isActive);
}

// ============================================================================
// Factory Function (Default Export)
// ============================================================================

/**
 * Creates a new Customer instance with persistence:
 * 1. Validates email is globally unique across persisted users
 * 2. Initializes Customer class with builder pattern
 * 3. Persists to database/users/Customers/<id>.ts
 *
 * @param customerPayload - Raw customer data (email, name, phone, etc.)
 * @returns Fully initialized and persisted Customer instance
 */
export default function createCustomer(
  customerPayload: Record<string, unknown>,
): Customer {
  ensureUniqueUserEmail(customerPayload?.email);
  const customer = new Customer(customerPayload);
  saveCustomerRecord(customer);
  return customer;
}
