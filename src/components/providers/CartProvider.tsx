"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { CART_COOKIE, parseCartCookie, serializeCartCookie, type CartItem } from "@/lib/cart";
import { trackClient } from "@/lib/analytics";

interface CartContextValue {
  items: CartItem[];
  count: number;
  addItem: (productId: string, quantity?: number) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  hasItem: (productId: string) => boolean;
}

const CartContext = createContext<CartContextValue | null>(null);

/** External store: reads and writes the cart cookie, notifies subscribers. */

const listeners = new Set<() => void>();

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

function readCartCookie(): CartItem[] {
  if (typeof document === "undefined") return [];
  const m = document.cookie.match(new RegExp(`(?:^|; )${CART_COOKIE}=([^;]*)`));
  if (!m) return [];
  try {
    return parseCartCookie(decodeURIComponent(m[1]));
  } catch {
    return [];
  }
}

function persistCart(items: CartItem[]) {
  const value = encodeURIComponent(serializeCartCookie(items));
  document.cookie = `${CART_COOKIE}=${value}; Path=/; Max-Age=${60 * 60 * 24 * 400}; SameSite=Lax`;
}

const emptyCart: CartItem[] = [];

export function CartProvider({ children }: { children: ReactNode }) {
  const persisted = useSyncExternalStore(subscribe, readCartCookie, () => emptyCart);
  const [localItems, setLocalItems] = useState<CartItem[] | null>(null);
  const items = localItems ?? persisted;

  const addItem = useCallback(
    (productId: string, quantity = 1) => {
      setLocalItems((prev) => {
        const base = prev ?? readCartCookie();
        const existing = base.find((i) => i.productId === productId);
        const next = existing
          ? base.map((i) =>
              i.productId === productId
                ? { ...i, quantity: Math.min(i.quantity + quantity, 10) }
                : i
            )
          : [...base, { productId, quantity }];
        persistCart(next);
        trackClient("add_to_cart", { items: [{ product_id: productId, quantity }] });
        return next;
      });
    },
    []
  );

  const removeItem = useCallback((productId: string) => {
    setLocalItems((prev) => {
      const base = prev ?? readCartCookie();
      const next = base.filter((i) => i.productId !== productId);
      persistCart(next);
      trackClient("remove_from_cart", { items: [{ product_id: productId }] });
      return next;
    });
  }, []);

  const setQuantity = useCallback((productId: string, quantity: number) => {
    setLocalItems((prev) => {
      const base = prev ?? readCartCookie();
      const next =
        quantity <= 0
          ? base.filter((i) => i.productId !== productId)
          : base.map((i) =>
              i.productId === productId ? { ...i, quantity: Math.min(quantity, 10) } : i
            );
      persistCart(next);
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setLocalItems([]);
    persistCart([]);
  }, []);

  const count = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);

  const hasItem = useCallback(
    (productId: string) => items.some((i) => i.productId === productId),
    [items]
  );

  const value = useMemo(
    () => ({ items, count, addItem, removeItem, setQuantity, clear, hasItem }),
    [items, count, addItem, removeItem, setQuantity, clear, hasItem]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}