export interface CartItem {
  productId: string;
  quantity: number;
}

export const CART_COOKIE = "cart";

export function parseCartCookie(value: string | undefined | null): CartItem[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (i): i is CartItem =>
        typeof i?.productId === "string" && typeof i?.quantity === "number"
    );
  } catch {
    return [];
  }
}

export function serializeCartCookie(items: CartItem[]): string {
  return JSON.stringify(items);
}