"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { Product } from "@/data/products";

export type CartItem = {
  key: string;
  product: Product;
  size: string;
  color: string;
  qty: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  addItem: (product: Product, size?: string, color?: string) => void;
  setQty: (key: string, qty: number) => void;
  removeItem: (key: string) => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  wishlist: Set<string>;
  toggleWishlist: (id: string) => void;
  sizeGuideOpen: boolean;
  setSizeGuideOpen: (open: boolean) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [wishlist, setWishlist] = useState<Set<string>>(() => new Set());

  const addItem = useCallback((product: Product, size?: string, color?: string) => {
    const chosenSize = size ?? product.sizes[Math.min(2, product.sizes.length - 1)];
    const chosenColor = color ?? product.colors[0].name;
    const key = `${product.id}|${chosenSize}|${chosenColor}`;
    setItems((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { key, product, size: chosenSize, color: chosenColor, qty: 1 }];
    });
    setCartOpen(true);
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setItems((prev) =>
      qty <= 0 ? prev.filter((i) => i.key !== key) : prev.map((i) => (i.key === key ? { ...i, qty } : i)),
    );
  }, []);

  const removeItem = useCallback((key: string) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
  }, []);

  const toggleWishlist = useCallback((id: string) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count: items.reduce((n, i) => n + i.qty, 0),
      subtotal: items.reduce((n, i) => n + i.qty * i.product.price, 0),
      addItem,
      setQty,
      removeItem,
      cartOpen,
      setCartOpen,
      wishlist,
      toggleWishlist,
      sizeGuideOpen,
      setSizeGuideOpen,
    }),
    [items, addItem, setQty, removeItem, cartOpen, wishlist, toggleWishlist, sizeGuideOpen],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
