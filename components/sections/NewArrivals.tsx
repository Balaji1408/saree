"use client";

import Image from "next/image";
import { Heart } from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";
import { Flip, gsap, ScrollTrigger } from "@/lib/gsap";
import { products, type Category, type Product } from "@/data/products";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/components/providers/CartProvider";
import { useSilkReveal } from "@/hooks/useSilkReveal";
import { MaskedLines } from "@/components/ui/MaskedLines";

type Filter = "All" | Category;
const filters: Filter[] = ["All", "Dresses", "Gowns", "Ethnic"];
const arrivals = products.filter((p) => p.isNew).slice(0, 8);

export function NewArrivals() {
  const root = useRef<HTMLElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);
  const [filter, setFilter] = useState<Filter>("All");
  useSilkReveal(root);

  const choose = (next: Filter) => {
    if (next === filter || !grid.current) return;
    flipState.current = Flip.getState(grid.current.querySelectorAll("[data-card]"));
    setFilter(next);
  };

  useLayoutEffect(() => {
    const state = flipState.current;
    if (!state || !grid.current) return;
    flipState.current = null;
    Flip.from(state, {
      targets: grid.current.querySelectorAll("[data-card]"),
      duration: 0.8,
      ease: "power3.inOut",
      scale: true,
      absolute: true,
      onEnter: (els) =>
        gsap.fromTo(
          els,
          { opacity: 0, scale: 0.9, y: 0, skewY: 0 },
          { opacity: 1, scale: 1, duration: 0.6, ease: "power3.out" },
        ),
      onComplete: () => ScrollTrigger.refresh(),
    });
  }, [filter]);

  return (
    <section id="new-in" ref={root} className="bg-blush px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p data-silk className="eyebrow text-gold">
              Just In
            </p>
            <MaskedLines lines={["New Arrivals"]} className="mt-3 font-serif text-5xl md:text-7xl" />
          </div>
          <div data-silk className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => choose(f)}
                className={`rounded-full border px-5 py-2 text-xs uppercase tracking-[0.2em] transition-colors ${
                  f === filter ? "border-espresso bg-espresso text-ivory" : "border-espresso/20 hover:border-espresso"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="hairline mt-10" />

        <div ref={grid} className="mt-12 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-4 md:gap-x-6">
          {arrivals.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              hidden={filter !== "All" && product.category !== filter}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product, hidden }: { product: Product; hidden: boolean }) {
  const { addItem, wishlist, toggleWishlist } = useCart();
  const loved = wishlist.has(product.id);

  return (
    <article data-card data-flip-id={product.id} data-silk className={`group ${hidden ? "hidden" : ""}`}>
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-ivory">
        <div data-kenburns className="absolute inset-0">
          <div className="absolute inset-0 transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(min-width: 768px) 25vw, 50vw"
              className="object-cover transition-opacity duration-700 group-hover:opacity-0"
            />
            <Image
              src={product.images[1]}
              alt=""
              fill
              sizes="(min-width: 768px) 25vw, 50vw"
              className="object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
            />
          </div>
        </div>

        <span className="absolute left-3 top-3 rounded-full bg-gold px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-espresso">
          New
        </span>
        <button
          onClick={() => toggleWishlist(product.id)}
          aria-label={loved ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          aria-pressed={loved}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-ivory/85 backdrop-blur transition-transform hover:scale-110"
        >
          <Heart className={`h-4 w-4 ${loved ? "fill-gold text-gold" : ""}`} strokeWidth={1.5} />
        </button>
        <button
          onClick={() => addItem(product)}
          className="absolute inset-x-3 bottom-3 rounded-full bg-espresso/90 py-3 text-[11px] uppercase tracking-[0.2em] text-ivory backdrop-blur transition-transform duration-500 ease-out md:translate-y-[160%] md:group-hover:translate-y-0"
        >
          Add to Bag
        </button>
      </div>

      <h3 className="mt-4 font-serif text-lg leading-snug">{product.name}</h3>
      <p className="mt-1 flex items-baseline gap-2 text-sm">
        <span className="text-gold">{formatPrice(product.price)}</span>
        <span className="text-espresso/40 line-through">{formatPrice(product.mrp)}</span>
      </p>
    </article>
  );
}
