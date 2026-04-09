import { v7 as uuidv7 } from "uuid";
import type { Inventory as InventoryType } from "../types/schemas.ts";

/**
 * Inventory class represents warehouse inventory tracking.
 *
 * @interface IInventory
 * - id: UUID generated internally
 * - productId: Reference to Product ID
 * - quantity: Amount in stock at location (non-negative integer)
 * - warehouseLocation: Location code/identifier in warehouse
 * - lastRestockedAt: ISO 8601 datetime of last restock
 */
export class Inventory implements InventoryType {
  id!: string;
  productId!: string;
  quantity!: number;
  warehouseLocation!: string;
  lastRestockedAt!: string;

  constructor(inventoryPayload: Record<string, unknown>) {
    this.id = uuidv7();
    this.productId = inventoryPayload.productId as string;
    this.quantity = inventoryPayload.quantity as number;
    this.warehouseLocation = inventoryPayload.warehouseLocation as string;
    this.lastRestockedAt = new Date().toISOString();
  }
}

// ============================================================================
// Getter Exports
// ============================================================================

export function getInventoryId(inventory: Inventory): string {
  return inventory.id;
}

export function getInventoryProductId(inventory: Inventory): string {
  return inventory.productId;
}

export function getInventoryQuantity(inventory: Inventory): number {
  return inventory.quantity;
}

export function getInventoryWarehouseLocation(inventory: Inventory): string {
  return inventory.warehouseLocation;
}

export function getInventoryLastRestockedAt(inventory: Inventory): string {
  return inventory.lastRestockedAt;
}

// ============================================================================
// Setter Exports
// ============================================================================

export function setInventoryQuantity(inventory: Inventory, quantity: unknown): number {
  if (typeof quantity !== "number" || quantity < 0) {
    throw new Error("quantity must be non-negative");
  }
  inventory.quantity = quantity;
  return inventory.quantity;
}

export function setInventoryWarehouseLocation(
  inventory: Inventory,
  warehouseLocation: unknown,
): string {
  if (typeof warehouseLocation !== "string") {
    throw new Error("warehouseLocation must be a string");
  }
  inventory.warehouseLocation = warehouseLocation;
  return inventory.warehouseLocation;
}

export function updateInventoryRestock(inventory: Inventory, quantity: unknown): number {
  if (typeof quantity !== "number" || quantity < 0) {
    throw new Error("quantity must be non-negative");
  }
  inventory.quantity = quantity;
  inventory.lastRestockedAt = new Date().toISOString();
  return inventory.quantity;
}

// ============================================================================
// Factory Function (Default Export)
// ============================================================================

/**
 * Creates a new Inventory instance.
 * @param inventoryPayload - Raw inventory data
 * @returns Initialized Inventory instance
 */
export default function createInventory(
  inventoryPayload: Record<string, unknown>,
): Inventory {
  return new Inventory(inventoryPayload);
}
