"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { DESKTOP_MOTION, gsap } from "@/lib/gsap";
import { productById, showcaseLooks } from "@/data/products";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/components/providers/CartProvider";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useSilkReveal } from "@/hooks/useSilkReveal";

const looks = showcaseLooks.map((look) => ({ ...look, product: productById(look.productId) }));
type ShowcaseLook = (typeof looks)[number];
const pad = (n: number) => String(n).padStart(2, "0");

export function DressShowcase() {
  const reduced = useReducedMotion();

  return (
    <section id="showcase" aria-label="Featured looks" className="relative -mt-px">
      {reduced ? (
        <SwipeCards />
      ) : (
        <>
          <div className="hidden md:block">
            <PinnedShowcase />
          </div>
          <div className="md:hidden">
            <SwipeCards />
          </div>
        </>
      )}
    </section>
  );
}

function PinnedShowcase() {
  const root = useRef<HTMLDivElement>(null);
  const segments = useRef<(HTMLSpanElement | null)[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const n = looks.length;

    const mm = gsap.matchMedia(el);
    mm.add(DESKTOP_MOTION, () => {
      const slides = gsap.utils.toArray<HTMLElement>("[data-slide]", el);
      gsap.set(slides.slice(1), { opacity: 0, scale: 0.85, rotateY: -14, transformPerspective: 1200 });

      gsap
        .timeline({
          defaults: { ease: "power3.out", duration: 0.6 },
          scrollTrigger: { trigger: el, start: "top bottom", end: "top top", scrub: 1 },
        })
        .from(
          "[data-enter-stage]",
          { yPercent: 24, scale: 0.82, rotateX: 10, opacity: 0, transformPerspective: 1400, duration: 0.8 },
          0,
        )
        .from("[data-enter-mark]", { xPercent: -35, opacity: 0 }, 0.15)
        .from("[data-enter-copy]", { y: 90, opacity: 0, stagger: 0.1 }, 0.25);

      const tl = gsap.timeline({
        defaults: { ease: "power3.inOut", duration: 0.7 },
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: `+=${n * 90}%`,
          pin: true,
          scrub: 1,
          onUpdate: (self) => {
            const p = self.progress;
            setActive(Math.min(n - 1, Math.floor(p * n)));
            segments.current.forEach((seg, i) => {
              if (seg) gsap.set(seg, { scaleX: gsap.utils.clamp(0, 1, p * n - i) });
            });
          },
        },
      });

      // Transition i is centred on time i so the active index flips exactly mid-swap.
      for (let i = 1; i < n; i++) {
        const at = i - 0.35;
        tl.to(slides[i - 1], { xPercent: -18, opacity: 0, filter: "blur(14px)" }, at)
          .to(slides[i], { opacity: 1, scale: 1, rotateY: 0 }, at)
          .to(el, { "--accent": looks[i].accent }, at);
      }
      tl.set({}, {}, n);
    });

    return () => mm.revert();
  }, []);

  return (
    <div
      ref={root}
      className="relative h-screen overflow-hidden"
      style={{ "--accent": looks[0].accent, background: "var(--accent)" } as CSSProperties}
    >
      <div className="mx-auto grid h-full max-w-[1440px] grid-cols-[3fr_2fr] items-center gap-12 px-10 pt-16">
        <div className="relative flex h-full items-center justify-center">
          <span className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 select-none font-serif text-[16vw] italic leading-none text-espresso/[0.05]">
            <span data-enter-mark className="block">
              {pad(active + 1)}
            </span>
          </span>
          <div data-enter-stage className="relative aspect-[3/4] h-[76vh] [perspective:1200px]">
            {looks.map((look, i) => (
              <div key={look.productId} data-slide className="absolute inset-0 overflow-hidden rounded-3xl shadow-2xl">
                <Image
                  src={look.product.images[0]}
                  alt={look.product.name}
                  fill
                  sizes="(min-width: 768px) 40vw, 100vw"
                  priority={i === 0}
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-md">
          <div data-enter-copy className="flex items-baseline gap-3 font-serif">
            <span className="text-7xl">{pad(active + 1)}</span>
            <span className="text-xl text-espresso/50">/ {pad(looks.length)}</span>
          </div>
          <div data-enter-copy className="mt-5 flex gap-2">
            {looks.map((look, i) => (
              <span key={look.productId} className="h-[2px] flex-1 overflow-hidden bg-espresso/15">
                <span
                  ref={(node) => {
                    segments.current[i] = node;
                  }}
                  className="block h-full origin-left scale-x-0 bg-gold"
                />
              </span>
            ))}
          </div>
          <div data-enter-copy>
            <LookDetails key={active} look={looks[active]} />
          </div>
        </div>
      </div>
    </div>
  );
}

function LookDetails({ look }: { look: ShowcaseLook }) {
  const { addItem, setSizeGuideOpen } = useCart();
  const { product } = look;
  const [size, setSize] = useState(product.sizes[Math.min(2, product.sizes.length - 1)]);
  const [color, setColor] = useState(product.colors[0].name);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-line]", { yPercent: 110, duration: 0.9, ease: "power4.out", stagger: 0.08 });
      gsap.from("[data-fade]", { opacity: 0, y: 20, duration: 0.8, ease: "power3.out", stagger: 0.05, delay: 0.1 });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className="mt-10">
      <p data-fade className="eyebrow text-espresso/60">
        {look.label}
      </p>
      <h3 className="mt-3 font-serif text-5xl leading-[1.05]">
        <span className="block overflow-hidden pb-1">
          <span data-line className="block">
            {product.name}
          </span>
        </span>
      </h3>
      <p data-fade className="mt-4 text-sm leading-relaxed text-espresso/70">
        {product.fabric}
      </p>
      <p data-fade className="mt-5 flex items-baseline gap-3">
        <span className="font-serif text-2xl text-gold">{formatPrice(product.price)}</span>
        <span className="text-sm text-espresso/40 line-through">{formatPrice(product.mrp)}</span>
      </p>

      <div data-fade className="mt-7">
        <div className="flex items-center justify-between">
          <span className="eyebrow text-espresso/60">Size</span>
          <button onClick={() => setSizeGuideOpen(true)} className="text-xs underline underline-offset-4">
            Size guide
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {product.sizes.map((s) => (
            <button
              key={s}
              onClick={() => setSize(s)}
              className={`min-w-11 rounded-full border px-3 py-2 text-xs transition-colors ${
                s === size ? "border-espresso bg-espresso text-ivory" : "border-espresso/20 hover:border-espresso"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div data-fade className="mt-6 flex items-center gap-3">
        <span className="eyebrow mr-2 text-espresso/60">Colour</span>
        {product.colors.map((c) => (
          <button
            key={c.name}
            aria-label={c.name}
            title={c.name}
            onClick={() => setColor(c.name)}
            className={`h-7 w-7 rounded-full ring-offset-2 ring-offset-[var(--accent)] transition ${
              c.name === color ? "ring-1 ring-espresso" : ""
            }`}
            style={{ background: c.hex }}
          />
        ))}
      </div>

      <button
        data-fade
        onClick={() => addItem(product, size, color)}
        className="mt-9 w-full rounded-full bg-espresso py-4 text-[13px] uppercase tracking-[0.25em] text-ivory transition-transform duration-300 hover:-translate-y-0.5"
      >
        Add to Bag
      </button>
    </div>
  );
}

function SwipeCards() {
  const { addItem } = useCart();
  const root = useRef<HTMLDivElement>(null);
  useSilkReveal(root);

  return (
    <div ref={root} className="bg-blush py-20">
      <div className="px-6">
        <p data-silk className="eyebrow text-espresso/60">
          The Edit · 04 Looks
        </p>
        <h2 data-silk className="mt-3 font-serif text-4xl">
          Featured Silhouettes
        </h2>
      </div>
      <div className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4">
        {looks.map((look, i) => (
          <article key={look.productId} data-silk className="w-[78vw] max-w-sm shrink-0 snap-center">
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl">
              <Image src={look.product.images[0]} alt={look.product.name} fill sizes="80vw" className="object-cover" />
              <span className="absolute left-4 top-4 font-serif text-2xl text-ivory drop-shadow">{pad(i + 1)}</span>
            </div>
            <p className="eyebrow mt-4 text-espresso/60">{look.label}</p>
            <h3 className="mt-1 font-serif text-2xl">{look.product.name}</h3>
            <div className="mt-2 flex items-center justify-between">
              <span className="font-serif text-lg text-gold">{formatPrice(look.product.price)}</span>
              <button
                onClick={() => addItem(look.product)}
                className="rounded-full bg-espresso px-5 py-2.5 text-[11px] uppercase tracking-[0.2em] text-ivory"
              >
                Add to Bag
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
