import { v7 as uuidv7 } from "uuid";
import type { Product as ProductType } from "../types/schemas.ts";

/**
 * Product class represents a retail product entity.
 *
 * @interface IProduct
 * - id: UUID generated internally
 * - name: Product display name
 * - description: Product details
 * - priceInCents: Price in cents (integer) - zero decimals
 * - category: Product category classification
 * - stock: Quantity available in inventory
 * - image: URL to product image (optional)
 * - createdAt: ISO 8601 datetime
 * - updatedAt: ISO 8601 datetime
 */
export class Product implements ProductType {
  id!: string;
  name!: string;
  description!: string;
  priceInCents!: number;
  category!: string;
  stock!: number;
  image?: string;
  createdAt!: string;
  updatedAt!: string;

  constructor(productPayload: Record<string, unknown>) {
    this.id = uuidv7();
    this.name = productPayload.name as string;
    this.description = productPayload.description as string;
    this.priceInCents = productPayload.priceInCents as number;
    this.category = productPayload.category as string;
    this.stock = productPayload.stock as number;
    this.image = productPayload.image as string | undefined;
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }
}

// ============================================================================
// Getter Exports
// ============================================================================

export function getProductId(product: Product): string {
  return product.id;
}

export function getProductName(product: Product): string {
  return product.name;
}

export function getProductDescription(product: Product): string {
  return product.description;
}

export function getProductPriceInCents(product: Product): number {
  return product.priceInCents;
}

export function getProductCategory(product: Product): string {
  return product.category;
}

export function getProductStock(product: Product): number {
  return product.stock;
}

export function getProductImage(product: Product): string | undefined {
  return product.image;
}

export function getProductCreatedAt(product: Product): string {
  return product.createdAt;
}

export function getProductUpdatedAt(product: Product): string {
  return product.updatedAt;
}

// ============================================================================
// Setter Exports
// ============================================================================

export function setProductName(product: Product, name: unknown): string {
  if (typeof name !== "string") {
    throw new Error("name must be a non-empty string");
  }
  product.name = name;
  product.updatedAt = new Date().toISOString();
  return product.name;
}

export function setProductDescription(product: Product, description: unknown): string {
  if (typeof description !== "string") {
    throw new Error("description must be a non-empty string");
  }
  product.description = description;
  product.updatedAt = new Date().toISOString();
  return product.description;
}

export function setProductPriceInCents(product: Product, priceInCents: unknown): number {
  if (typeof priceInCents !== "number" || priceInCents < 0) {
    throw new Error("priceInCents must be non-negative");
  }
  product.priceInCents = priceInCents;
  product.updatedAt = new Date().toISOString();
  return product.priceInCents;
}

export function setProductCategory(product: Product, category: unknown): string {
  if (typeof category !== "string") {
    throw new Error("category must be a non-empty string");
  }
  product.category = category;
  product.updatedAt = new Date().toISOString();
  return product.category;
}

export function setProductStock(product: Product, stock: unknown): number {
  if (typeof stock !== "number" || stock < 0) {
    throw new Error("stock must be non-negative");
  }
  product.stock = stock;
  product.updatedAt = new Date().toISOString();
  return product.stock;
}

export function setProductImage(product: Product, image: unknown): string | undefined {
  product.image = typeof image === "string" ? image : undefined;
  product.updatedAt = new Date().toISOString();
  return product.image;
}

// ============================================================================
// Factory Function (Default Export)
// ============================================================================

/**
 * Creates a new Product instance.
 * @param productPayload - Raw product data
 * @returns Initialized Product instance
 */
export default function createProduct(productPayload: Record<string, unknown>): Product {
  return new Product(productPayload);
}
