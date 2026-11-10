"use client";

/**
 * Face-safe hero effect: light only, never distortion.
 *
 * - A soft warm spotlight follows the mouse over the hero photo (mouse devices).
 * - A faint brass sheen sweeps across the photo every few seconds (CSS only).
 *
 * The photo's pixels are never moved or colour-split, so faces always look
 * exactly as photographed. Skipped entirely for reduced motion.
 */

import { useEffect, useRef } from "react";

export function HeroLight() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = ref.current;
    if (!layer) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const section = layer.closest("section");
    if (!section) return;

    let frame = 0;
    const onMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = layer.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        const inside = x >= 0 && x <= 100 && y >= 0 && y <= 100;
        layer.style.setProperty("--light-x", `${x}%`);
        layer.style.setProperty("--light-y", `${y}%`);
        layer.style.setProperty("--light-opacity", inside ? "1" : "0");
      });
    };
    const onLeave = () => layer.style.setProperty("--light-opacity", "0");

    section.addEventListener("pointermove", onMove);
    section.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <div ref={ref} aria-hidden className="hero-light pointer-events-none absolute inset-0" />;
}
