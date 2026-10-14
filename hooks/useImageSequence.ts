"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

type Options = {
  canvas: RefObject<HTMLCanvasElement>;
  count: number;
  src: (index: number) => string;
  /** Horizontal position (0–1) of the subject inside the source frame. */
  subjectX?: number;
  /** Where (0–1 across the canvas) the subject should land on landscape screens; portrait screens centre it. */
  screenX?: number;
  /** Extra scale on top of cover-fit, giving the crop room to move the subject. */
  zoom?: number;
  enabled?: boolean;
};

/**
 * Preloads a numbered frame sequence and paints any frame onto a canvas with
 * `object-fit: cover` behaviour. Frames that have not arrived yet fall back to
 * the nearest loaded one, so scrubbing never shows a blank canvas.
 */
export function useImageSequence({
  canvas,
  count,
  src,
  subjectX = 0.5,
  screenX = 0.5,
  zoom = 1,
  enabled = true,
}: Options) {
  const images = useRef<HTMLImageElement[]>([]);
  const current = useRef(0);
  const [loaded, setLoaded] = useState(0);

  const draw = useCallback(
    (index: number) => {
      const el = canvas.current;
      const ctx = el?.getContext("2d");
      if (!el || !ctx) return;
      current.current = index;

      let img: HTMLImageElement | undefined;
      for (let offset = 0; offset < count && !img; offset++) {
        const back = images.current[index - offset];
        const fwd = images.current[index + offset];
        if (back?.complete && back.naturalWidth) img = back;
        else if (fwd?.complete && fwd.naturalWidth) img = fwd;
      }
      if (!img) return;

      const { width: cw, height: ch } = el;
      const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight) * zoom;
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      const target = cw < ch ? 0.5 : screenX;
      const x = Math.min(0, Math.max(cw - w, cw * target - w * subjectX));
      ctx.drawImage(img, x, (ch - h) / 2, w, h);
    },
    [canvas, count, subjectX, screenX, zoom],
  );

  useEffect(() => {
    const el = canvas.current;
    if (!el || !enabled) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      el.width = Math.round(el.clientWidth * dpr);
      el.height = Math.round(el.clientHeight * dpr);
      draw(current.current);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [canvas, draw, enabled]);

  useEffect(() => {
    if (!enabled) return;
    let done = 0;
    let cancelled = false;
    images.current = Array.from({ length: count }, (_, i) => {
      const img = new Image();
      img.decoding = "async";
      const settle = () => {
        if (cancelled) return;
        done += 1;
        setLoaded(done);
        if (i === current.current || i === 0) draw(current.current);
      };
      img.onload = settle;
      img.onerror = settle;
      img.src = src(i);
      return img;
    });
    return () => {
      cancelled = true;
    };
  }, [count, src, draw, enabled]);

  return { draw, progress: count ? loaded / count : 1, ready: loaded >= count };
}
