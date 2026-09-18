import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { contactSchema, sanitizeText } from "@/lib/validations";
import { createRateLimiter, clientIp, rateLimitResponse } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const limiter = createRateLimiter("CONTACT");
  const { success } = await limiter(clientIp(req));
  if (!success) return rateLimitResponse();

  const parsed = contactSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Message invalide." }, { status: 400 });
  }
  const { name, email, subject } = parsed.data;
  const message = sanitizeText(parsed.data.message, 3000);

  console.log(`[contact] ${name} <${email}> — ${subject}:\n${message}`);

  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: process.env.EMAIL_FROM ?? "Store <no-reply@localhost>",
      to: process.env.EMAIL_REPLY_TO ?? "support@localhost",
      replyTo: email,
      subject: `[Contact] ${subject}`,
      text: `${name} <${email}> — ${subject}\n\n${message}`,
    });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}