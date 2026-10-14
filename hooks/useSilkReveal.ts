"use client";

import { useEffect, type RefObject } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Wires the shared AURELLE entrance language inside `scope`:
 * - `[data-silk]`      fade + rise + un-skew, staggered per batch
 * - `[data-lines]`     masked headline lines (children marked `[data-line]`) slide up
 * - `[data-kenburns]`  slow scale 1.15 → 1 scrubbed while the frame crosses the viewport
 *
 * Do not put `data-kenburns` inside pinned sections; scrubbed triggers there need the pin's own timeline.
 */
export function useSilkReveal(scope: RefObject<HTMLElement>) {
  useEffect(() => {
    const root = scope.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const silk = gsap.utils.toArray<HTMLElement>("[data-silk]", root);
      if (silk.length) {
        gsap.set(silk, { opacity: 0, y: 60, skewY: 4 });
        ScrollTrigger.batch(silk, {
          start: "top 90%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              skewY: 0,
              duration: 1.1,
              ease: "power4.out",
              stagger: 0.08,
              overwrite: true,
            }),
        });
      }

      gsap.utils.toArray<HTMLElement>("[data-lines]", root).forEach((group) => {
        gsap.from(group.querySelectorAll("[data-line]"), {
          yPercent: 110,
          duration: 1.1,
          ease: "power4.out",
          stagger: 0.12,
          scrollTrigger: { trigger: group, start: "top 88%", once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-kenburns]", root).forEach((el) => {
        gsap.fromTo(
          el,
          { scale: 1.15 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: el.parentElement ?? el,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });
    }, root);

    return () => ctx.revert();
  }, [scope]);
}
