import { z } from "zod";

// ============================================================================
// Address Schema
// ============================================================================
export const AddressSchema = z.object({
  street: z.string().min(1, "street is required"),
  city: z.string().min(1, "city is required"),
  postalCode: z.string().min(1, "postalCode is required"),
  country: z.string().min(1, "country is required"),
});

export type Address = z.infer<typeof AddressSchema>;

// ============================================================================
// Security Question Schema
// ============================================================================
export const SecurityQuestionSchema = z.object({
  quiz: z.string().min(1, "quiz is required"),
  ans: z.string().min(1, "answer is required"),
});

export type SecurityQuestion = z.infer<typeof SecurityQuestionSchema>;

// ============================================================================
// User Schema (Base)
// ============================================================================
export const UserInputSchema = z.object({
  fullName: z.string().min(1, "fullName is required"),
  phoneNumber: z.string().min(1, "phoneNumber is required"),
  email: z.string().email("email must be valid"),
  password: z.string().min(1, "password is required"),
  dateOfBirth: z.string().datetime("dateOfBirth must be ISO datetime"),
  address: AddressSchema,
  createdAt: z.string().datetime().optional(),
  isActive: z.boolean().default(true),
  id: z.string().uuid().optional(),
});

export type UserInput = z.infer<typeof UserInputSchema>;

export const UserSchema = UserInputSchema.extend({
  id: z.string().uuid("id must be valid UUID"),
  profilePic: z.string(),
  password: z.string().min(1),
  createdAt: z.string().datetime(),
  isActive: z.boolean(),
});

export type User = z.infer<typeof UserSchema>;

// ============================================================================
// Orders Schema
// ============================================================================
export const OrderStatusSchema = z.enum([
  "placed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
]);

export type OrderStatus = z.infer<typeof OrderStatusSchema>;

export const OrderSchema = z.object({
  id: z.string().uuid(),
  productId: z.string().uuid(),
  quantity: z.number().int().positive(),
  priceInCents: z.number().int().nonnegative(),
  status: OrderStatusSchema,
  createdAt: z.string().datetime(),
});

export type Order = z.infer<typeof OrderSchema>;

export const OrdersContainerSchema = z.object({
  placed: OrderSchema.array().default([]),
  processing: OrderSchema.array().default([]),
  shipped: OrderSchema.array().default([]),
  delivered: OrderSchema.array().default([]),
  cancelled: OrderSchema.array().default([]),
});

export type OrdersContainer = z.infer<typeof OrdersContainerSchema>;

// ============================================================================
// Customer Schema
// ============================================================================
export const CustomerSchema = UserSchema.extend({
  role: z.literal("customer"),
  orders: OrdersContainerSchema,
});

export type Customer = z.infer<typeof CustomerSchema>;

// ============================================================================
// Admin Schema
// ============================================================================
export const AdminSchema = UserSchema.extend({
  role: z.literal("admin"),
  token: z.string().nullable().default(null),
  isSuperAdmin: z.boolean().default(false),
});

export type Admin = z.infer<typeof AdminSchema>;

// ============================================================================
// Product Schema
// ============================================================================
export const ProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "name is required"),
  description: z.string().min(1, "description is required"),
  priceInCents: z.number().int().positive("priceInCents must be positive"),
  category: z.string().min(1, "category is required"),
  stock: z.number().int().nonnegative(),
  image: z.string().url().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Product = z.infer<typeof ProductSchema>;

// ============================================================================
// Inventory Schema
// ============================================================================
export const InventorySchema = z.object({
  id: z.string().uuid(),
  productId: z.string().uuid(),
  quantity: z.number().int().nonnegative(),
  warehouseLocation: z.string().min(1),
  lastRestockedAt: z.string().datetime(),
});

export type Inventory = z.infer<typeof InventorySchema>;

// ============================================================================
// Cart Schema
// ============================================================================
export const CartItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive(),
  priceInCents: z.number().int().nonnegative(),
});

export type CartItem = z.infer<typeof CartItemSchema>;

export const CartSchema = z.object({
  id: z.string().uuid(),
  customerId: z.string().uuid(),
  items: CartItemSchema.array().default([]),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Cart = z.infer<typeof CartSchema>;

// ============================================================================
// Review Schema
// ============================================================================
export const ReviewSchema = z.object({
  id: z.string().uuid(),
  productId: z.string().uuid(),
  customerId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(1, "comment is required"),
  createdAt: z.string().datetime(),
});

export type Review = z.infer<typeof ReviewSchema>;
