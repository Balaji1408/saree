"use client";

import { ArrowRight, MessageCircle } from "lucide-react";
import { useRef, useState, type FormEvent } from "react";
import { useCart } from "@/components/providers/CartProvider";
import { useSilkReveal } from "@/hooks/useSilkReveal";

const columns = [
  { title: "Shop", links: ["New In", "Dresses", "Gowns", "Sarees", "Lehengas"] },
  { title: "Help", links: ["Size Guide", "Shipping & Returns", "Care Guide", "FAQs"] },
  { title: "Contact", links: ["hello@aurelle.in", "+91 98765 43210", "WhatsApp Concierge", "Book an Appointment"] },
];

const payments = ["UPI", "Visa", "Mastercard", "Razorpay"];

export function Footer() {
  const root = useRef<HTMLElement>(null);
  const { setSizeGuideOpen } = useCart();
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);
  useSilkReveal(root);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (email.includes("@")) setJoined(true);
  };

  return (
    <footer ref={root} className="relative overflow-hidden bg-espresso px-4 pb-8 pt-40 md:px-10">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-6 select-none text-center font-serif text-[22vw] leading-none tracking-tight text-ivory/[0.06]"
      >
        AURELLE
      </span>

      <div data-silk className="relative z-10 mx-auto max-w-[1280px] rounded-3xl bg-ivory p-8 shadow-2xl md:p-14">
        <div className="grid gap-12 md:grid-cols-[1.3fr_2fr]">
          <div>
            <p className="font-serif text-3xl tracking-[0.18em]">AURELLE</p>
            <p className="eyebrow mt-8 text-gold">Newsletter</p>
            <h3 className="mt-3 font-serif text-3xl leading-tight">Get 10% off your first dress</h3>
            {joined ? (
              <p className="mt-6 text-sm text-espresso/70">Welcome to the atelier &mdash; your code is on its way.</p>
            ) : (
              <form onSubmit={submit} className="mt-6 flex items-center rounded-full border border-espresso/20 p-1.5">
                <label htmlFor="newsletter" className="sr-only">
                  Email address
                </label>
                <input
                  id="newsletter"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="min-w-0 flex-1 bg-transparent px-4 text-sm outline-none placeholder:text-espresso/40"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="grid h-11 w-11 place-items-center rounded-full bg-gold text-espresso transition-transform hover:scale-105"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {columns.map((col) => (
              <div key={col.title}>
                <p className="eyebrow text-espresso/50">{col.title}</p>
                <ul className="mt-5 space-y-3 text-sm">
                  {col.links.map((link) => (
                    <li key={link}>
                      {link === "Size Guide" ? (
                        <button onClick={() => setSizeGuideOpen(true)} className="hover:text-gold">
                          {link}
                        </button>
                      ) : link === "WhatsApp Concierge" ? (
                        <a href="#" className="inline-flex items-center gap-1.5 hover:text-gold">
                          <MessageCircle className="h-3.5 w-3.5" /> {link}
                        </a>
                      ) : (
                        <a href="#" className="hover:text-gold">
                          {link}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="hairline my-10" />

        <div className="flex flex-col-reverse items-start justify-between gap-6 text-xs text-espresso/60 md:flex-row md:items-center">
          <p>&copy; {new Date().getFullYear()} AURELLE Atelier. All rights reserved.</p>
          <ul className="flex flex-wrap gap-2" aria-label="Accepted payment methods">
            {payments.map((p) => (
              <li
                key={p}
                className="rounded-md border border-espresso/15 bg-white px-3 py-1.5 text-[11px] font-semibold tracking-wide text-espresso"
              >
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
