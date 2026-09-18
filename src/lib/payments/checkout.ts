import { getStripe, type CreateCheckoutInput } from "@/lib/payments/stripe";
import { prisma } from "@/lib/db";
import { generateToken } from "@/lib/utils";

const APP_URL = () => process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
const CURRENCY = (process.env.NEXT_PUBLIC_CURRENCY ?? "EUR").toLowerCase();

export async function findOrCreateUser(email: string, stripeCustomerId?: string) {
  const normalized = email.trim().toLowerCase();
  return prisma.user.upsert({
    where: { email: normalized },
    update: {
      ...(stripeCustomerId ? { stripeCustomerId } : {}),
    },
    create: {
      email: normalized,
      ...(stripeCustomerId ? { stripeCustomerId } : {}),
    },
  });
}

/**
 * Creates the Stripe Checkout Session. The full order is only materialized in
 * the database from the webhook handler, which is the single source of truth.
 */
export async function createCheckoutSession(input: CreateCheckoutInput) {
  const stripe = getStripe();
  const clientReferenceId = generateToken(16);

  const lineItems = input.lines.map((line) => ({
    quantity: line.quantity,
    price_data: {
      currency: CURRENCY,
      unit_amount: line.priceCents,
      product_data: {
        name: line.title,
        ...(line.image
          ? { images: [line.image] }
          : {}),
      },
    },
  }));

  // Inline coupon objects are not supported in Checkout: create a one-time
  // coupon server-side and reference it by id. The webhook recomputes the
  // discount independently for the order record.
  let discountCouponId: string | null = null;
  if (input.discountCents && input.discountCents > 0) {
    const coupon = await stripe.coupons.create({
      amount_off: input.discountCents,
      currency: CURRENCY,
      duration: "once",
      max_redemptions: 1,
    });
    discountCouponId = coupon.id;
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: input.email,
    client_reference_id: clientReferenceId,
    line_items: lineItems,
    success_url: `${APP_URL()}/succes?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${APP_URL()}/panier`,
    metadata: {
      clientReferenceId,
      email: input.email.trim().toLowerCase(),
      promoCode: input.promoCode ?? "",
      affiliateCode: input.affiliateCode ?? "",
      discountCents: String(input.discountCents ?? 0),
      lineSummary: JSON.stringify(
        input.lines.map((l) => ({ id: l.productId, qty: l.quantity }))
      ),
      ...input.metadata,
    },
    ...(discountCouponId
      ? {
          discounts: [{ coupon: discountCouponId }],
        }
      : {}),
  });

  return { url: session.url!, sessionId: session.id, clientReferenceId };
}

export { APP_URL, CURRENCY };