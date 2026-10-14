"use client";

import Image from "next/image";
import { Instagram } from "lucide-react";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { instagramFeed } from "@/data/products";
import { useLenis } from "@/components/providers/LenisProvider";

export function InstagramStrip() {
  const track = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  useEffect(() => {
    const el = track.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const loop = gsap.to(el, { xPercent: -50, ease: "none", duration: 50, repeat: -1 });
    let boost = 0;
    const off = lenis?.on("scroll", ({ velocity }: { velocity: number }) => {
      boost = Math.max(boost, Math.min(Math.abs(velocity) * 0.25, 6));
    });
    const tick = () => {
      boost *= 0.94;
      loop.timeScale(1 + boost);
    };
    gsap.ticker.add(tick);

    return () => {
      off?.();
      gsap.ticker.remove(tick);
      loop.kill();
    };
  }, [lenis]);

  return (
    <section aria-label="Instagram" className="relative overflow-hidden bg-blush py-20">
      <div ref={track} className="flex w-max gap-4">
        {[...instagramFeed, ...instagramFeed].map((src, i) => (
          <div key={i} className="relative aspect-square w-48 shrink-0 overflow-hidden rounded-2xl md:w-64">
            <Image src={src} alt="" fill sizes="256px" className="object-cover" />
          </div>
        ))}
      </div>

      <a
        href="https://instagram.com"
        target="_blank"
        rel="noreferrer"
        className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-3 rounded-full bg-ivory px-7 py-4 text-sm shadow-xl transition-transform hover:scale-105"
      >
        <Instagram className="h-4 w-4 text-gold" />
        <span className="font-serif text-base">@aurelle.official</span>
        <span className="text-espresso/40">&mdash;</span>
        <span className="eyebrow text-[10px]">Follow Us</span>
      </a>
    </section>
  );
}
