"use client";

import { Heart, Search, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/components/providers/CartProvider";

const links = ["New In", "Dresses", "Occasion", "Ethnic", "About"];
const hrefs: Record<string, string> = {
  "New In": "#new-in",
  Dresses: "#showcase",
  Occasion: "#occasion",
  Ethnic: "#lookbook",
  About: "#craft",
};

export function Navbar() {
  const { count, wishlist, setCartOpen } = useCart();
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const next = document.getElementById("showcase");
      const pastHero = next ? next.getBoundingClientRect().top <= 80 : window.scrollY > window.innerHeight;
      setSolid(pastHero || document.documentElement.hasAttribute("data-hero-framed"));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-500 ${
        solid ? "bg-ivory/80 text-espresso shadow-sm backdrop-blur-md" : "bg-transparent text-ivory"
      }`}
    >
      <nav className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-6 md:px-10">
        <a href="#top" className="font-serif text-2xl tracking-[0.18em]">
          AURELLE
        </a>

        <ul className="hidden items-center gap-9 lg:flex">
          {links.map((link) => (
            <li key={link}>
              <a
                href={hrefs[link]}
                className="text-[13px] tracking-wide opacity-90 transition-opacity hover:opacity-100"
              >
                {link}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-5">
          <button aria-label="Search" className="hidden sm:block">
            <Search className="h-[18px] w-[18px]" strokeWidth={1.5} />
          </button>
          <button aria-label="Wishlist" className="relative">
            <Heart className="h-[18px] w-[18px]" strokeWidth={1.5} />
            {wishlist.size > 0 && (
              <span className="absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-gold px-1 text-[10px] font-semibold text-espresso">
                {wishlist.size}
              </span>
            )}
          </button>
          <button aria-label="Open bag" className="relative" onClick={() => setCartOpen(true)}>
            <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.5} />
            <span className="absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-gold px-1 text-[10px] font-semibold text-espresso">
              {count}
            </span>
          </button>
        </div>
      </nav>
    </header>
  );
}
