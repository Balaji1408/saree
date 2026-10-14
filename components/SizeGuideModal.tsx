"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";
import { useCart } from "@/components/providers/CartProvider";
import { useLenis } from "@/components/providers/LenisProvider";

const rows = [
  ["XS", "32", "26", "35"],
  ["S", "34", "28", "37"],
  ["M", "36", "30", "39"],
  ["L", "38", "32", "41"],
  ["XL", "40", "34", "43"],
  ["XXL", "42", "36", "45"],
];

export function SizeGuideModal() {
  const { sizeGuideOpen, setSizeGuideOpen } = useCart();
  const lenis = useLenis();

  useEffect(() => {
    if (!sizeGuideOpen) return;
    lenis?.stop();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSizeGuideOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [sizeGuideOpen, lenis, setSizeGuideOpen]);

  return (
    <AnimatePresence>
      {sizeGuideOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4" role="dialog" aria-modal="true" aria-label="Size guide">
          <motion.button
            aria-label="Close size guide"
            className="absolute inset-0 h-full w-full cursor-default bg-espresso/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSizeGuideOpen(false)}
          />
          <motion.div
            className="relative w-full max-w-lg rounded-3xl bg-ivory p-8 shadow-2xl md:p-10"
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              aria-label="Close size guide"
              onClick={() => setSizeGuideOpen(false)}
              className="absolute right-6 top-6"
            >
              <X className="h-5 w-5" strokeWidth={1.5} />
            </button>
            <p className="eyebrow text-gold">Fit Notes</p>
            <h2 className="mt-2 font-serif text-3xl">Size Guide</h2>
            <p className="mt-2 text-sm text-espresso/60">Body measurements in inches. Sarees are free size.</p>
            <table className="mt-6 w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gold/40">
                  {["Size", "Bust", "Waist", "Hip"].map((h) => (
                    <th key={h} className="eyebrow py-3 text-[10px] font-medium text-espresso/60">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row[0]} className="border-b border-espresso/10">
                    {row.map((cell, i) => (
                      <td key={i} className={`py-3 ${i === 0 ? "font-serif text-base" : ""}`}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-6 text-xs text-espresso/60">
              Between sizes? Choose <span className="text-gold">Made to Measure</span> at checkout and our atelier will
              call you.
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
