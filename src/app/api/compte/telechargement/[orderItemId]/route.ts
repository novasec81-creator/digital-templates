import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { createPresignedDownloadUrl } from "@/lib/storage/s3";
import { createRateLimiter, clientIp, rateLimitResponse } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

/**
 * Authenticated download for the account area: verifies the user owns the
 * order item and streams a fresh short-lived presigned URL. Retéléchargement
 * illimité une fois connecté (aucun compteur ni limite de temps).
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ orderItemId: string }> }
) {
  const limiter = createRateLimiter("DOWNLOAD");
  const { success } = await limiter(clientIp(req));
  if (!success) return rateLimitResponse();

  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Non connecté." }, { status: 401 });
  }

  const { orderItemId } = await params;

  const item = await prisma.orderItem.findFirst({
    where: {
      id: orderItemId,
      order: { userId: user.id, status: "PAID" },
    },
    include: { product: true },
  });

  if (!item) {
    return NextResponse.json({ error: "Élément introuvable." }, { status: 404 });
  }

  const url = await createPresignedDownloadUrl(item.product.fileKey);
  return NextResponse.json({ url });
}