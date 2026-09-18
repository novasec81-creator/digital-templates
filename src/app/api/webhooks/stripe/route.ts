import { NextRequest, NextResponse } from "next/server";
import { processStripeEvent, verifyAndConstructEvent } from "@/lib/payments/webhook";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;
  try {
    const rawBody = await req.arrayBuffer();
    event = await verifyAndConstructEvent(Buffer.from(rawBody), signature);
  } catch (err) {
    console.error("[stripe-webhook] invalid signature", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (!event) {
    return NextResponse.json({ error: "Webhook not processed" }, { status: 400 });
  }

  try {
    await processStripeEvent(event);
  } catch (err) {
    console.error("[stripe-webhook] processing error", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}