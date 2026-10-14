"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { useRef } from "react";
import { avatars, testimonials } from "@/data/products";
import { useSilkReveal } from "@/hooks/useSilkReveal";
import { MaskedLines } from "@/components/ui/MaskedLines";

export function Testimonials() {
  const root = useRef<HTMLElement>(null);
  useSilkReveal(root);

  return (
    <section ref={root} className="bg-ivory px-6 py-24 md:px-10 md:py-36">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex flex-col items-center text-center">
          <p data-silk className="eyebrow text-gold">
            Kind Words
          </p>
          <MaskedLines lines={["Loved by Every", "Silhouette"]} className="mt-4 font-serif text-5xl md:text-7xl" />
          <div data-silk className="mt-8 flex items-center gap-4">
            <div className="flex -space-x-3">
              {avatars.map((src) => (
                <span key={src} className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-ivory">
                  <Image src={src} alt="" fill sizes="40px" className="object-cover" />
                </span>
              ))}
            </div>
            <div className="text-left text-sm">
              <p className="flex items-center gap-1 font-medium">
                <Star className="h-3.5 w-3.5 fill-gold text-gold" /> 4.9/5
              </p>
              <p className="text-espresso/60">500+ Happy Customers</p>
            </div>
          </div>
        </div>

        <div className="mt-20 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <div key={t.name} className={i === 1 ? "md:translate-y-16" : ""}>
              <figure data-silk className="relative h-full overflow-hidden rounded-3xl bg-blush/60 p-8 md:p-10">
                <span aria-hidden className="absolute -top-6 right-6 font-serif text-[10rem] leading-none text-gold/25">
                  &ldquo;
                </span>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="h-3.5 w-3.5 fill-gold text-gold" />
                  ))}
                </div>
                <blockquote className="relative mt-6 font-serif text-xl leading-relaxed">{t.quote}</blockquote>
                <figcaption className="mt-8 flex items-center gap-3">
                  <span className="relative h-11 w-11 overflow-hidden rounded-full">
                    <Image src={t.avatar} alt={t.name} fill sizes="44px" className="object-cover" />
                  </span>
                  <span>
                    <span className="block text-sm font-medium">{t.name}</span>
                    <span className="block text-xs text-espresso/60">{t.location}</span>
                  </span>
                </figcaption>
              </figure>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
