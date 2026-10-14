"use client";

import Image from "next/image";
import { Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { MaskedLines } from "@/components/ui/MaskedLines";
import { useLenis } from "@/components/providers/LenisProvider";
import { useImageSequence } from "@/hooks/useImageSequence";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { showcaseLooks } from "@/data/products";

const FRAME_COUNT = 132;
const FILM_VERSION = 4;
const frameSrc = (i: number) => `/seq/saree_${String(i + 1).padStart(3, "0")}.webp?v=${FILM_VERSION}`;

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  const lenis = useLenis();
  const { draw, progress, ready } = useImageSequence({
    canvas,
    count: FRAME_COUNT,
    src: frameSrc,
    subjectX: 0.58,
    screenX: 0.64,
    zoom: 1.12,
    enabled: !reduced,
  });
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (reduced || ready) {
      setRevealed(true);
      return;
    }
    const fallback = setTimeout(() => setRevealed(true), 6000);
    return () => clearTimeout(fallback);
  }, [ready, reduced]);

  useEffect(() => {
    if (!lenis) return;
    if (revealed) lenis.start();
    else lenis.stop();
  }, [lenis, revealed]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const mm = gsap.matchMedia(el);
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const film = { frame: 0 };

      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "+=320%",
            pin: true,
            scrub: 1,
            onUpdate: (self) =>
              document.documentElement.toggleAttribute("data-hero-framed", self.progress > 0.78),
          },
        })
        .to(
          film,
          {
            frame: FRAME_COUNT - 1,
            duration: 0.8,
            onUpdate: () => draw(Math.round(film.frame)),
          },
          0,
        )
        .to("[data-hero-copy]", { yPercent: -30, opacity: 0, duration: 0.18 }, 0.04)
        .fromTo("[data-chapter]", { opacity: 0 }, { opacity: 1, duration: 0.08 }, 0.3)
        .from("[data-chapter-line]", { yPercent: 110, stagger: 0.03, duration: 0.1, ease: "power2.out" }, 0.3)
        .from("[data-chapter-note]", { opacity: 0, y: 30, duration: 0.08 }, 0.36)
        .to("[data-chapter]", { opacity: 0, y: -40, duration: 0.1 }, 0.6)
        .to("[data-hero-frame]", { clipPath: "inset(9% 5% 9% 5% round 28px)", duration: 0.2 }, 0.8)
        .to("[data-hero-scrub]", { scale: 1.06, duration: 0.2 }, 0.8)
        .to(el, { backgroundColor: showcaseLooks[0].accent, duration: 0.2 }, 0.8);

      gsap
        .timeline({
          scrollTrigger: {
            trigger: document.getElementById("showcase"),
            start: "top bottom",
            end: "top top",
            scrub: 1,
          },
        })
        .to("[data-hero-frame]", { yPercent: 12, scale: 0.8, ease: "none" }, 0)
        .to("[data-hero-frame]", { opacity: 0, ease: "power1.inOut" }, 0);

      return () => document.documentElement.removeAttribute("data-hero-framed");
    });

    return () => mm.revert();
  }, [draw]);

  useEffect(() => {
    const el = root.current;
    if (!el || !revealed || reduced) return;

    const ctx = gsap.context(() => {
      gsap.from("[data-hero-copy] [data-line]", {
        yPercent: 110,
        duration: 1.3,
        ease: "power4.out",
        stagger: 0.12,
        delay: 0.35,
      });
      gsap.from("[data-intro]", {
        opacity: 0,
        y: 60,
        skewY: 4,
        duration: 1.1,
        ease: "power4.out",
        stagger: 0.08,
        delay: 0.65,
      });
      gsap.from("[data-hero-zoom]", { scale: 1.2, duration: 2.6, ease: "power3.out" });
    }, el);

    return () => ctx.revert();
  }, [revealed, reduced]);

  return (
    <>
      <div
        aria-hidden
        className={`fixed inset-0 z-[60] flex flex-col items-center justify-center bg-ivory transition-opacity duration-1000 ${
          revealed ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        <p className="font-serif text-3xl tracking-[0.3em] text-espresso">AURELLE</p>
        <div className="mt-6 h-px w-56 overflow-hidden bg-espresso/10">
          <div
            className="h-full origin-left bg-gold transition-transform duration-300"
            style={{ transform: `scaleX(${progress})` }}
          />
        </div>
        <p className="eyebrow mt-4 text-[10px] text-espresso/50">Loading the film · {Math.round(progress * 100)}%</p>
      </div>

      <section id="top" ref={root} className="relative h-screen overflow-hidden bg-ivory" aria-label="Spring Summer 26 film">
        <div
          data-hero-frame
          className="absolute inset-0 overflow-hidden bg-espresso"
          style={{ clipPath: "inset(0% 0% 0% 0% round 0px)" }}
        >
          <div data-hero-zoom className="absolute inset-0">
            <div data-hero-scrub className="absolute inset-0">
              <Image
                src={`/images/hero-poster.jpg?v=${FILM_VERSION}`}
                alt="Bride in a rust and gold bridal saree with kundan jewellery, adjusting her earrings in soft light"
                fill
                priority
                sizes="100vw"
                className="object-cover object-center md:object-left"
              />
              <canvas ref={canvas} className="absolute inset-0 h-full w-full" aria-hidden />
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-espresso/75 via-espresso/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-espresso/60 to-transparent" />

          <div data-chapter className="pointer-events-none absolute inset-0 opacity-0">
            <div className="absolute inset-0 bg-gradient-to-r from-espresso/70 via-espresso/20 to-transparent" />
            <div className="relative mx-auto flex h-full max-w-[1440px] items-center px-6 md:px-10">
              <div className="max-w-lg text-ivory">
                <p data-chapter-note className="eyebrow text-gold">
                  The Saree Edit
                </p>
                <h2 className="mt-4 font-serif text-[clamp(2.75rem,6.5vw,6rem)] leading-[1]">
                  <span className="block overflow-hidden pb-[0.08em]">
                    <span data-chapter-line className="block">
                      Six yards of
                    </span>
                  </span>
                  <span className="block overflow-hidden pb-[0.08em]">
                    <span data-chapter-line className="block italic text-gold">
                      handwoven silk.
                    </span>
                  </span>
                </h2>
                <p data-chapter-note className="mt-6 max-w-sm text-sm leading-relaxed text-ivory/80">
                  Banarasi, Kanjivaram and Chanderi &mdash; woven by hand for the days you will remember forever.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          data-hero-copy
          className="relative z-10 mx-auto flex h-full max-w-[1440px] flex-col justify-center px-6 pb-8 pt-24 text-ivory md:px-10"
        >
          <p data-intro className="eyebrow mb-6 text-gold [@media(max-height:640px)]:mb-3">
            Spring · Summer &rsquo;26
          </p>
          <MaskedLines
            as="h1"
            lines={["Dressed in", "Poetry."]}
            className="font-serif text-[clamp(2.75rem,min(10vw,16vh),9.5rem)] leading-[0.95] tracking-tight"
          />
          <p
            data-intro
            className="mt-8 max-w-md text-[15px] leading-relaxed text-ivory/85 [@media(max-height:640px)]:mt-4"
          >
            Gowns, sarees and occasion dresses cut from pure silks and finished by hand in our atelier &mdash; made to
            move the way you do.
          </p>
          <div data-intro className="mt-10 flex flex-wrap items-center gap-4 [@media(max-height:640px)]:mt-6">
            <a
              href="#new-in"
              className="rounded-full bg-gold px-8 py-4 text-[13px] font-medium uppercase tracking-[0.2em] text-espresso transition-transform duration-300 hover:-translate-y-0.5"
            >
              Shop the Collection
            </a>
            <a
              href="#lookbook"
              className="group flex items-center gap-3 rounded-full border border-ivory/50 px-7 py-[15px] text-[13px] uppercase tracking-[0.2em] backdrop-blur-sm transition-colors hover:bg-ivory/10"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              Watch the Film
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
