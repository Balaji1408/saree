"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { DESKTOP_MOTION, gsap } from "@/lib/gsap";
import { useSilkReveal } from "@/hooks/useSilkReveal";
import { MaskedLines } from "@/components/ui/MaskedLines";

const copy =
  "Every AURELLE piece begins as a sketch and ends in the hands of artisans whose families have woven, embroidered and draped for generations. Zari is twisted by hand, borders are hemmed stitch by stitch, and each silhouette is fitted to you — not to a size chart.";

const stats = [
  { value: 120, suffix: "+", label: "hrs handwork" },
  { value: 100, suffix: "%", label: "pure fabrics" },
  { value: 1, suffix: ":1", label: "made to measure" },
];

export function FabricCraft() {
  const root = useRef<HTMLElement>(null);
  useSilkReveal(root);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const counters = gsap.utils.toArray<HTMLElement>("[data-count]", el);
    const countTo = (counter: HTMLElement) => {
      const target = Number(counter.dataset.count);
      const suffix = counter.dataset.suffix ?? "";
      const state = { v: 0 };
      return { state, target, render: () => (counter.textContent = `${Math.round(state.v)}${suffix}`) };
    };

    const mm = gsap.matchMedia(el);

    mm.add(DESKTOP_MOTION, () => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top top", end: "+=120%", pin: true, scrub: 1 },
      });
      tl.fromTo("[data-macro]", { scale: 1.3, xPercent: -4 }, { scale: 1, xPercent: 4, ease: "none", duration: 1 }, 0)
        .fromTo("[data-inset]", { yPercent: 30 }, { yPercent: -10, ease: "none", duration: 1 }, 0)
        .fromTo("[data-word]", { opacity: 0.12 }, { opacity: 1, stagger: 0.02, duration: 0.2, ease: "none" }, 0);
      counters.forEach((counter) => {
        const c = countTo(counter);
        tl.to(c.state, { v: c.target, duration: 0.5, ease: "power1.out", onUpdate: c.render }, 0.45);
      });
    });

    mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
      counters.forEach((counter) => {
        const c = countTo(counter);
        gsap.to(c.state, {
          v: c.target,
          duration: 1.6,
          ease: "power2.out",
          onUpdate: c.render,
          scrollTrigger: { trigger: counter, start: "top 90%", once: true },
        });
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section id="craft" ref={root} className="overflow-hidden bg-blush md:h-screen">
      <div className="mx-auto grid h-full max-w-[1440px] items-center gap-12 px-6 py-24 md:grid-cols-2 md:px-10 md:py-0 md:pt-16">
        <div className="relative h-[60vh] md:h-[78vh]">
          <div className="relative h-full overflow-hidden rounded-3xl">
            <div data-macro className="absolute inset-0">
              <Image
                src="/images/craft-zari.jpg"
                alt="Macro detail of hand-worked gold zari and temple jewellery"
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
          <div
            data-inset
            className="absolute -bottom-6 -right-2 hidden aspect-[3/4] w-[38%] overflow-hidden rounded-2xl border-[6px] border-blush shadow-xl md:block"
          >
            <Image
              src="/images/atelier-rack.jpg"
              alt="Hand-finished garments on the atelier rail"
              fill
              sizes="20vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="max-w-xl">
          <p data-silk className="eyebrow text-gold">
            Fabric &amp; Craft
          </p>
          <MaskedLines
            lines={["Hand-finished,", "heirloom-made."]}
            className="mt-4 font-serif text-5xl leading-[1.05] md:text-6xl"
          />
          <p className="mt-8 text-lg leading-relaxed">
            {copy.split(" ").map((word, i) => (
              <span key={i} data-word className="inline-block whitespace-pre">
                {word}{" "}
              </span>
            ))}
          </p>

          <div className="mt-12 grid grid-cols-3 gap-6">
            {stats.map((s) => (
              <div key={s.label} data-silk>
                <div className="hairline mb-5" />
                <p className="font-serif text-4xl text-gold md:text-5xl">
                  <span data-count={s.value} data-suffix={s.suffix}>
                    {s.value}
                    {s.suffix}
                  </span>
                </p>
                <p className="eyebrow mt-2 text-[10px] text-espresso/60">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
