/**
 * Analytics wrapper. On the client, pushed events land in the GTM dataLayer;
 * GA4 e-commerce events are declared in GTM (see README). On the server this
 * module is intentionally inert — server calls happen through the log payloads.
 */

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
    clarity_queue?: unknown[];
  }
}

export type CommerceEventName =
  | "view_item"
  | "add_to_cart"
  | "remove_from_cart"
  | "begin_checkout"
  | "add_shipping_info"
  | "purchase"
  | "view_item_list";

export type CustomEventName =
  | "buy_clicked"
  | "download_started"
  | "cart_abandoned"
  | "promo_applied"
  | "wishlist_add"
  | "affiliate_click";

export function trackClient(event: string, payload: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const w = window as Window;
  w.dataLayer = w.dataLayer ?? [];
  w.dataLayer.push({ event, ...payload });
}

export function trackPageView() {
  trackClient("page_view");
}

/** Server-side helper: record a download event for analytics purposes. */
export function recordServerEvent(
  _event: CustomEventName,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _payload: Record<string, unknown> = {}
): void {
  // Hook point: push to your analytics warehouse / GA4 Measurement Protocol.
}