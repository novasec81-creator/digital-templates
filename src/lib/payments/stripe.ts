import Stripe from "stripe";

/**
 * Thin wrapper around the Stripe SDK. All other modules import Stripe from here
 * so the payment provider can be swapped without touching the rest of the app.
 */
export function getStripe(): Stripe {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  return new Stripe(secret, {
    apiVersion: "2026-08-26.dahlia",
    typescript: true,
  });
}

export type CheckoutLine = {
  productId: string;
  title: string;
  priceCents: number;
  quantity: number;
  image?: string;
};

export type CreateCheckoutInput = {
  email: string;
  lines: CheckoutLine[];
  discountCents?: number;
  promoCode?: string;
  affiliateCode?: string;
  metadata?: Record<string, string>;
};