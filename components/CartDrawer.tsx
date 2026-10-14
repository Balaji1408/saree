"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { useEffect } from "react";
import { useCart } from "@/components/providers/CartProvider";
import { useLenis } from "@/components/providers/LenisProvider";
import { formatPrice } from "@/lib/format";

export function CartDrawer() {
  const { items, subtotal, setQty, removeItem, cartOpen, setCartOpen } = useCart();
  const lenis = useLenis();

  useEffect(() => {
    if (!cartOpen) return;
    lenis?.stop();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setCartOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [cartOpen, lenis, setCartOpen]);

  return (
    <AnimatePresence>
      {cartOpen && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Shopping bag">
          <motion.button
            aria-label="Close bag"
            className="absolute inset-0 h-full w-full cursor-default bg-espresso/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
          />
          <motion.aside
            data-lenis-prevent
            className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-ivory shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <header className="flex items-center justify-between border-b border-gold/30 px-7 py-6">
              <h2 className="font-serif text-2xl">Your Bag</h2>
              <button aria-label="Close bag" onClick={() => setCartOpen(false)}>
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </header>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-7 text-center">
                <ShoppingBag className="h-10 w-10 text-gold" strokeWidth={1} />
                <p className="font-serif text-xl">Your bag is waiting for its first dress.</p>
                <button
                  onClick={() => setCartOpen(false)}
                  className="eyebrow mt-2 underline decoration-gold underline-offset-8"
                >
                  Continue browsing
                </button>
              </div>
            ) : (
              <ul className="flex-1 space-y-6 overflow-y-auto px-7 py-6">
                {items.map((item) => (
                  <li key={item.key} className="flex gap-4">
                    <div className="relative aspect-[3/4] w-24 shrink-0 overflow-hidden rounded-xl">
                      <Image src={item.product.images[0]} alt={item.product.name} fill sizes="96px" className="object-cover" />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between gap-2">
                        <p className="font-serif text-lg leading-snug">{item.product.name}</p>
                        <button
                          aria-label={`Remove ${item.product.name}`}
                          onClick={() => removeItem(item.key)}
                          className="h-fit text-espresso/40 hover:text-espresso"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="mt-1 text-xs text-espresso/60">
                        {item.size} · {item.color}
                      </p>
                      <div className="mt-auto flex items-center justify-between pt-3">
                        <div className="flex items-center rounded-full border border-espresso/20">
                          <button
                            aria-label="Decrease quantity"
                            onClick={() => setQty(item.key, item.qty - 1)}
                            className="grid h-8 w-8 place-items-center"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-6 text-center text-sm">{item.qty}</span>
                          <button
                            aria-label="Increase quantity"
                            onClick={() => setQty(item.key, item.qty + 1)}
                            className="grid h-8 w-8 place-items-center"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <span className="text-gold">{formatPrice(item.product.price * item.qty)}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <footer className="border-t border-gold/30 px-7 py-6">
              <div className="flex items-baseline justify-between">
                <span className="eyebrow text-espresso/60">Subtotal</span>
                <span className="font-serif text-2xl">{formatPrice(subtotal)}</span>
              </div>
              <p className="mt-1 text-xs text-espresso/50">Complimentary shipping &amp; alterations across India.</p>
              <button
                disabled={items.length === 0}
                onClick={() => alert("Checkout will be wired to Razorpay.")}
                className="mt-5 w-full rounded-full bg-gold py-4 text-[13px] font-medium uppercase tracking-[0.25em] text-espresso transition-opacity disabled:opacity-40"
              >
                Checkout
              </button>
            </footer>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
