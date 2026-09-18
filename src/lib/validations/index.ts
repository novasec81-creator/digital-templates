import { z } from "zod";

export const emailSchema = z.string().trim().toLowerCase().email();

export const productSlugSchema = z
  .string()
  .min(2)
  .max(120)
  .regex(/^[a-z0-9-]+$/, "Slug invalide");

export const cartItemSchema = z.object({
  productId: z.string().cuid(),
  quantity: z.number().int().min(1).max(10),
});

export const checkoutSchema = z.object({
  email: emailSchema,
  items: z.array(cartItemSchema).min(1).max(50),
  promoCode: z
    .string()
    .trim()
    .toUpperCase()
    .max(30)
    .optional()
    .nullable()
    .transform((v) => (v ? v : null)),
});

export const promoCheckSchema = z.object({
  code: z.string().trim().toUpperCase().min(1).max(30),
  cart: z.array(cartItemSchema).min(1),
});

export const reviewSchema = z.object({
  productId: z.string().cuid(),
  rating: z.number().int().min(1).max(5),
  authorName: z.string().trim().min(2).max(60),
  content: z.string().trim().min(10).max(800),
});

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: emailSchema,
  subject: z.string().trim().min(2).max(120).default("Contact"),
  message: z.string().trim().min(10).max(3000),
});

export const loginRequestSchema = z.object({
  email: emailSchema,
  redirectTo: z.string().max(200).optional().default("/mes-achats"),
});

export const loginVerifySchema = z.object({
  token: z.string().length(64),
  redirectTo: z.string().max(200).optional().default("/mes-achats"),
});

/** Sanitize user-generated text (used for reviews): strip tags, cap length. */
export function sanitizeText(input: string, max = 800): string {
  return input
    .replace(/<[^>]*>/g, "") // strip HTML tags
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "") // strip inline event handlers
    .trim()
    .slice(0, max);
}