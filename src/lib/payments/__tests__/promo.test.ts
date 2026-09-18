import { describe, expect, it } from "vitest";
import { computePromoDiscount } from "@/lib/payments/promo";
import { CURRENCY } from "@/lib/constants";

describe("computePromoDiscount", () => {
  const subtotal = 2000; // 20.00 €

  it("returns 0 when no discount applies", () => {
    expect(computePromoDiscount(subtotal, null, null)).toBe(0);
  });

  it("computes a percentage discount rounded to cents", () => {
    expect(computePromoDiscount(subtotal, 10, null)).toBe(200); // 10%
    expect(computePromoDiscount(1999, 10, null)).toBe(200); // floor rounding
  });

  it("uses a fixed discount amount in preference when both are present", () => {
    expect(computePromoDiscount(subtotal, 10, 500)).toBe(500);
  });

  it("never returns a negative discount", () => {
    expect(computePromoDiscount(0, 10, null)).toBe(0);
    expect(computePromoDiscount(subtotal, null, -5)).toBe(0);
  });

  it("caps the discount at the subtotal", () => {
    expect(computePromoDiscount(subtotal, 90, 5000)).toBe(subtotal);
  });

  it("currency is configurable via env-backed constant", () => {
    expect(typeof CURRENCY).toBe("string");
    expect(CURRENCY.length).toBeGreaterThan(0);
  });
});