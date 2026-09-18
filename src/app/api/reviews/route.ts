import { NextRequest, NextResponse } from "next/server";
import { reviewSchema, sanitizeText } from "@/lib/validations";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { createRateLimiter, clientIp, rateLimitResponse } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const limiter = createRateLimiter("REVIEW");
  const { success } = await limiter(clientIp(req));
  if (!success) return rateLimitResponse();

  const parsed = reviewSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Avis invalide." }, { status: 400 });
  }
  const { productId, rating, authorName, content } = parsed.data;

  const user = await getSessionUser();

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || !product.isActive) {
    return NextResponse.json({ error: "Produit introuvable." }, { status: 404 });
  }

  // XSS protection: strip tags and event handlers (see sanitizeText).
  const sanitizedContent = sanitizeText(content);
  const sanitizedName = sanitizeText(authorName, 60);
  if (sanitizedContent.length < 10) {
    return NextResponse.json({ error: "Votre avis est trop court." }, { status: 400 });
  }

  const hasValidPurchase = user
    ? Boolean(
        await prisma.orderItem.findFirst({
          where: { productId, order: { userId: user.id, status: "PAID" } },
        })
      )
    : false;

  await prisma.review.create({
    data: {
      productId,
      userId: user?.id ?? null,
      authorName: sanitizedName,
      rating,
      content: sanitizedContent,
      isVerified: hasValidPurchase,
      isApproved: false, // moderation
    },
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}