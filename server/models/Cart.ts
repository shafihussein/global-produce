import { v7 as uuidv7 } from "uuid";
import type { Cart as CartType, CartItem } from "../types/schemas.ts";

/**
 * Cart class represents a shopping cart entity.
 *
 * @interface ICart
 * - id: UUID generated internally
 * - customerId: Reference to Customer ID
 * - items: Array of CartItem objects (productId, quantity, priceInCents)
 * - createdAt: ISO 8601 datetime
 * - updatedAt: ISO 8601 datetime
 */
export class Cart implements CartType {
  id!: string;
  customerId!: string;
  items!: CartItem[];
  createdAt!: string;
  updatedAt!: string;

  constructor(cartPayload: Record<string, unknown>) {
    this.id = uuidv7();
    this.customerId = cartPayload.customerId as string;
    this.items = (cartPayload.items as CartItem[]) || [];
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }
}

// ============================================================================
// Getter Exports
// ============================================================================

export function getCartId(cart: Cart): string {
  return cart.id;
}

export function getCartCustomerId(cart: Cart): string {
  return cart.customerId;
}

export function getCartItems(cart: Cart): CartItem[] {
  return cart.items;
}

export function getCartCreatedAt(cart: Cart): string {
  return cart.createdAt;
}

export function getCartUpdatedAt(cart: Cart): string {
  return cart.updatedAt;
}

// ============================================================================
// Setter Exports
// ============================================================================

export function setCartItems(cart: Cart, items: unknown): CartItem[] {
  if (!Array.isArray(items)) {
    throw new Error("items must be an array");
  }
  cart.items = items as CartItem[];
  cart.updatedAt = new Date().toISOString();
  return cart.items;
}

export function addCartItem(cart: Cart, item: CartItem): CartItem[] {
  cart.items.push(item);
  cart.updatedAt = new Date().toISOString();
  return cart.items;
}

export function removeCartItem(cart: Cart, productId: string): CartItem[] {
  cart.items = cart.items.filter((item) => item.productId !== productId);
  cart.updatedAt = new Date().toISOString();
  return cart.items;
}

export function clearCartItems(cart: Cart): CartItem[] {
  cart.items = [];
  cart.updatedAt = new Date().toISOString();
  return cart.items;
}

// ============================================================================
// Factory Function (Default Export)
// ============================================================================

/**
 * Creates a new Cart instance.
 * @param cartPayload - Raw cart data
 * @returns Initialized Cart instance
 */
export default function createCart(cartPayload: Record<string, unknown>): Cart {
  return new Cart(cartPayload);
}
