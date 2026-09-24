import { NextRequest, NextResponse } from "next/server";
import {
  AFFILIATE_COOKIE,
  AFFILIATE_TTL_SECONDS,
  isAffiliateCodeSafe,
} from "@/lib/affiliate-shared";

/**
 * When a visitor lands with ?ref=CODE, persist the affiliate code in a cookie
 * (30 days) so the commission can be attributed at checkout, then strip the
 * query param to keep URLs clean.
 */
export function proxy(req: NextRequest) {
  const ref = req.nextUrl.searchParams.get("ref");

  if (ref && isAffiliateCodeSafe(ref)) {
    const clean = req.nextUrl.clone();
    clean.searchParams.delete("ref");
    const response = NextResponse.redirect(clean);
    response.cookies.set(AFFILIATE_COOKIE, ref, {
      path: "/",
      maxAge: AFFILIATE_TTL_SECONDS,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};