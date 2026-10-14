"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import { occasions } from "@/data/products";
import { useSilkReveal } from "@/hooks/useSilkReveal";
import { MaskedLines } from "@/components/ui/MaskedLines";

export function ShopByOccasion() {
  const root = useRef<HTMLElement>(null);
  useSilkReveal(root);
  const [feature, ...rest] = occasions;

  return (
    <section id="occasion" ref={root} className="bg-ivory px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-[1440px]">
        <p data-silk className="eyebrow text-gold">
          Curated Edits
        </p>
        <MaskedLines lines={["Shop by Occasion"]} className="mt-3 font-serif text-5xl md:text-7xl" />

        <div className="mt-14 grid gap-4 md:h-[110vh] md:grid-cols-2 md:grid-rows-3 md:gap-6">
          <OccasionCard {...feature} className="h-[70vh] md:row-span-3 md:h-auto" large />
          {rest.map((o) => (
            <OccasionCard key={o.title} {...o} className="h-[40vh] md:h-auto" />
          ))}
        </div>
      </div>
    </section>
  );
}

type CardProps = {
  title: string;
  image: string;
  count: string;
  className?: string;
  large?: boolean;
};

function OccasionCard({ title, image, count, className = "", large }: CardProps) {
  return (
    <a href="#new-in" data-silk className={`group relative block overflow-hidden rounded-3xl ${className}`}>
      <div data-kenburns className="absolute inset-0">
        <Image
          src={image}
          alt={`${title} collection`}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-espresso/75 via-espresso/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 md:p-8">
        <div className="text-ivory">
          <p className="eyebrow text-ivory/70">{count}</p>
          <h3 className={`mt-2 font-serif ${large ? "text-4xl md:text-6xl" : "text-3xl md:text-4xl"}`}>{title}</h3>
        </div>
        <span className="flex shrink-0 items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-[11px] uppercase tracking-[0.2em] text-espresso transition-all duration-500 ease-out md:translate-x-6 md:opacity-0 md:group-hover:translate-x-0 md:group-hover:opacity-100">
          Explore <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </a>
  );
}
