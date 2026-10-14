"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { DESKTOP_MOTION, gsap } from "@/lib/gsap";
import { lookbook } from "@/data/products";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function Lookbook() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const mm = gsap.matchMedia(el);
    mm.add(DESKTOP_MOTION, () => {
      const track = el.querySelector<HTMLElement>("[data-track]")!;
      const distance = () => track.scrollWidth - window.innerWidth;

      const scroll = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => gsap.set("[data-progress]", { scaleX: self.progress }),
        },
      });

      gsap.utils.toArray<HTMLElement>("[data-parallax]", el).forEach((img, i) => {
        const depth = 6 + (i % 3) * 3;
        gsap.fromTo(
          img,
          { xPercent: -depth },
          {
            xPercent: depth,
            ease: "none",
            scrollTrigger: {
              trigger: img.parentElement,
              containerAnimation: scroll,
              start: "left right",
              end: "right left",
              scrub: true,
            },
          },
        );
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section id="lookbook" ref={root} className="relative overflow-hidden bg-ivory py-24 md:flex md:h-screen md:items-center md:py-0">
      <div
        data-track
        className={`no-scrollbar flex snap-x snap-mandatory items-end gap-6 overflow-x-auto px-6 md:gap-10 md:px-10 ${
          reduced ? "" : "md:w-max md:snap-none md:overflow-visible"
        }`}
      >
        <div className="flex w-[78vw] shrink-0 snap-start flex-col justify-end self-stretch pb-10 md:w-[34vw] md:pr-10">
          <p className="eyebrow text-gold">Lookbook · SS&rsquo;26</p>
          <h2 className="mt-4 font-serif text-5xl leading-[1.02] md:text-7xl">
            Stories in <em className="text-gold">Silk</em>
          </h2>
          <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-espresso/70">
            Eight frames from our season film &mdash; shot from Banaras ghats to coastal salt flats. Scroll to wander
            through.
          </p>
        </div>

        {lookbook.map((item, i) => (
          <figure key={item.caption} className="shrink-0 snap-center">
            <div
              className={`relative overflow-hidden rounded-2xl ${
                i % 2 === 0 ? "h-[60vh] md:h-[68vh]" : "h-[52vh] md:h-[58vh]"
              } aspect-[3/4]`}
            >
              <div data-parallax className="absolute inset-y-0 -left-[12%] -right-[12%]">
                <Image src={item.image} alt={item.caption} fill sizes="(min-width: 768px) 30vw, 80vw" className="object-cover" />
              </div>
            </div>
            <figcaption className="mt-4 flex items-baseline gap-3">
              <span className="font-serif text-sm text-gold">{String(i + 1).padStart(2, "0")}</span>
              <span className="font-serif text-xl">{item.caption}</span>
            </figcaption>
          </figure>
        ))}
        <div className="w-6 shrink-0 md:w-[10vw]" aria-hidden />
      </div>

      <div className="absolute inset-x-10 bottom-10 hidden h-px bg-espresso/10 md:block">
        <div data-progress className="h-full origin-left scale-x-0 bg-gold" />
      </div>
    </section>
  );
}
