import Stripe from "stripe";
import { prisma } from "@/lib/db";
import { getStripe } from "@/lib/payments/stripe";
import { findOrCreateUser } from "@/lib/payments/checkout";
import { createDownloadTokensForOrder } from "@/lib/storage/download-token";
import { sendPurchaseConfirmation } from "@/lib/email";

/**
 * Processor for all Stripe events our store cares about. Idempotent: safe to be
 * called multiple times for the same event (Stripe retries webhooks).
 */
export async function processStripeEvent(event: Stripe.Event) {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutCompleted(session);
      break;
    }
    case "checkout.session.expired": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.metadata?.clientReferenceId) {
        await prisma.order.updateMany({
          where: { stripeSessionId: session.id },
          data: { status: "FAILED" },
        });
      }
      break;
    }
    case "charge.refunded": {
      const charge = event.data.object as Stripe.Charge;
      if (charge.payment_intent) {
        await prisma.order.updateMany({
          where: { stripePaymentIntentId: String(charge.payment_intent) },
          data: { status: "REFUNDED" },
        });
      }
      break;
    }
    default:
      break;
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const email = session.customer_details?.email?.trim().toLowerCase() ?? session.metadata?.email;
  if (!email || session.payment_status !== "paid") return;

  const paymentIntentId =
    typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id;

  // Idempotency guard.
  const existing = await prisma.order.findUnique({
    where: { stripeSessionId: session.id },
  });
  if (existing) return;

  const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id;
  const user = await findOrCreateUser(email, customerId);

  const lineSummary = parseLineSummary(session.metadata?.lineSummary);
  if (lineSummary.length === 0) return;

  const products = await prisma.product.findMany({
    where: { id: { in: lineSummary.map((l) => l.id) }, isActive: true },
  });
  if (products.length === 0) return;

  const subtotal = products.reduce((sum, p) => {
    const line = lineSummary.find((l) => l.id === p.id);
    return sum + p.priceCents * (line?.qty ?? 1);
  }, 0);
  const discountCents = Number(session.metadata?.discountCents ?? 0);
  const totalCents = session.amount_total ?? Math.max(0, subtotal - discountCents);

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        userId: user.id,
        email,
        stripeSessionId: session.id,
        stripePaymentIntentId: paymentIntentId,
        status: "PAID",
        totalCents,
        discountCents,
        promoCode: session.metadata?.promoCode || null,
        affiliateCode: session.metadata?.affiliateCode || null,
        items: {
          create: products.map((p) => ({
            productId: p.id,
            priceCents: p.priceCents,
            quantity: lineSummary.find((l) => l.id === p.id)?.qty ?? 1,
          })),
        },
      },
      include: { items: true },
    });

    // Increment sales counters and promo usage atomically with the order.
    await tx.product.updateMany({
      where: { id: { in: products.map((p) => p.id) } },
      data: { downloadCount: { increment: 1 } },
    });

    if (created.promoCode) {
      await tx.promoCode.update({
        where: { code: created.promoCode },
        data: { usedCount: { increment: 1 } },
      }).catch(() => undefined);
    }

    if (created.affiliateCode) {
      await tx.affiliateLink
        .update({
          where: { code: created.affiliateCode },
          data: { sales: { increment: 1 } },
        })
        .catch(() => undefined);
    }

    return created;
  });

  await createDownloadTokensForOrder(order.id);
  await sendPurchaseConfirmation(order.id);
}

function parseLineSummary(raw?: string): { id: string; qty: number }[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as { id: string; qty: number }[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((l) => typeof l.id === "string").map((l) => ({ id: l.id, qty: l.qty || 1 }));
  } catch {
    return [];
  }
}

/** Verifies a webhook signature and returns a typed Stripe event. */
export async function verifyAndConstructEvent(
  rawBody: Buffer | string,
  signature: string | null
): Promise<Stripe.Event | null> {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const stripe = getStripe();
  if (!signature || !secret) return null;
  return stripe.webhooks.constructEvent(
    typeof rawBody === "string" ? rawBody : rawBody.toString("utf8"),
    signature,
    secret
  );
}