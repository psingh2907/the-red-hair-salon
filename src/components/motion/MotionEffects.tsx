"use client";

/**
 * Page-wide motion (Level 1): smooth wheel scrolling (Lenis) and GSAP
 * animations wired to data attributes in the markup:
 *
 *   data-hero-item="services|actions|proof"  hero intro (after the CSS headline)
 *   data-hero-media       hero photo zoom-out + parallax
 *   data-anim="heading"   children rise in when visible
 *   data-anim="fade"      element rises in when visible
 *   data-anim="rise"      batched rise-in (cards, list items)
 *   data-anim="curtain"   image container opens like a curtain
 *   data-count="4.9"      number counts up
 *   data-stars            filled stars pop in one by one
 *   data-speed="6"        gentle parallax (tablet and up)
 *   data-magnetic         button follows the pointer (mouse devices)
 *
 * Performance notes:
 * - The hero headline animates with pure CSS (globals.css) so it paints at once.
 * - Scroll reveals use IntersectionObserver (asynchronous, no forced layout).
 *   ScrollTrigger is used only for the few scrubbed parallax effects.
 * - Initial hidden states are plain style writes, so setup never reads layout.
 * - Reveals only change opacity/transform, never visibility, so keyboard users
 *   can still reach every link (focusing scrolls the element into view).
 * Nothing runs when the visitor prefers reduced motion.
 */

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useEffect } from "react";
import { setLenis } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const EASE = "power3.out";

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function hide(elements: Iterable<Element>, transform?: string): void {
  for (const el of elements) {
    const style = (el as HTMLElement | SVGElement).style;
    style.opacity = "0";
    if (transform) style.transform = transform;
  }
}

/** Calls `onEnter` once per batch of elements that scroll into view. */
function whenVisible(elements: Element[], onEnter: (batch: Element[]) => void): () => void {
  if (!elements.length) return () => {};
  const observer = new IntersectionObserver(
    (entries) => {
      const batch = entries.filter((entry) => entry.isIntersecting).map((entry) => entry.target);
      if (!batch.length) return;
      batch.forEach((el) => observer.unobserve(el));
      onEnter(batch);
    },
    { rootMargin: "0px 0px -10% 0px" },
  );
  elements.forEach((el) => observer.observe(el));
  return () => observer.disconnect();
}

function countUp(el: HTMLElement): void {
  const raw = el.dataset.count ?? "";
  const target = Number.parseFloat(raw);
  if (!Number.isFinite(target)) return;
  const decimals = raw.split(".")[1]?.length ?? 0;
  const state = { value: 0 };
  gsap.to(state, {
    value: target,
    duration: 1.4,
    ease: "power2.out",
    onUpdate: () => {
      el.textContent = state.value.toFixed(decimals);
    },
  });
}

function filledStars(root: Element): SVGElement[] {
  return Array.from(root.children[1]?.querySelectorAll("svg") ?? []);
}

const popStars = (stars: SVGElement[]) =>
  gsap.fromTo(
    stars,
    { opacity: 0, scale: 0 },
    { opacity: 1, scale: 1, transformOrigin: "50% 50%", duration: 0.5, stagger: 0.09, ease: "back.out(2.5)" },
  );

export function MotionEffects() {
  // Smooth scrolling for mouse wheels and trackpads. Touch scrolling stays native.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const lenis = new Lenis({ anchors: { offset: -80 }, autoToggle: true, lerp: 0.1 });
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  useGSAP((_context, contextSafe) => {
    const root = document.documentElement;
    if (prefersReducedMotion()) {
      root.classList.remove("motion-init");
      return;
    }
    const safe = contextSafe ?? (<T,>(fn: T) => fn);
    const cleanups: Array<() => void> = [];

    // ── Hero (the headline itself is CSS-animated) ───────────────────────
    const hero = document.getElementById("top");
    if (hero) {
      const items = gsap.utils.toArray<HTMLElement>("[data-hero-item]", hero);
      const media = hero.querySelector<HTMLElement>("[data-hero-media]");
      const heroCount = hero.querySelector<HTMLElement>("[data-count]");
      const heroStarsRoot = hero.querySelector("[data-stars]");
      const heroStars = heroStarsRoot ? filledStars(heroStarsRoot) : [];

      hide(items);
      hide(heroStars);
      root.classList.remove("motion-init");

      const tl = gsap.timeline({ defaults: { ease: EASE, duration: 0.9 } });
      if (media) tl.fromTo(media, { scale: 1.12 }, { scale: 1, duration: 2.6, ease: "power2.out" }, 0);
      if (items.length) tl.fromTo(items, { opacity: 0, y: 18 }, { opacity: 1, y: 0, stagger: 0.12 }, 0.35);
      if (heroCount) tl.add(() => countUp(heroCount), 0.7);
      if (heroStars.length) tl.add(() => popStars(heroStars), 0.7);

      if (media) {
        gsap.to(media, {
          yPercent: 10,
          ease: "none",
          scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
        });
      }
    }

    // ── Scroll reveals (IntersectionObserver) ────────────────────────────
    // All initial states are written first; nothing below reads layout.
    // Real headings only slide (never transparent), so the heading outline stays intact.
    const headings = gsap.utils.toArray<HTMLElement>('[data-anim="heading"]');
    headings.forEach((el) => {
      for (const child of Array.from(el.children) as HTMLElement[]) {
        child.style.transform = "translateY(28px)";
        if (!/^H[1-6]$/.test(child.tagName)) child.style.opacity = "0";
      }
    });

    const fades = gsap.utils.toArray<HTMLElement>('[data-anim="fade"]');
    hide(fades, "translateY(40px)");

    const risers = gsap.utils.toArray<HTMLElement>('[data-anim="rise"]');
    hide(risers, "translateY(50px)");

    const curtains = gsap.utils.toArray<HTMLElement>('[data-anim="curtain"]');
    curtains.forEach((el) => {
      el.style.clipPath = "inset(100% 0% 0% 0%)";
    });

    const counters = gsap.utils.toArray<HTMLElement>("[data-count]").filter((el) => !el.closest("#top"));
    const starGroups = gsap.utils.toArray<HTMLElement>("[data-stars]").filter((el) => !el.closest("#top"));
    starGroups.forEach((el) => hide(filledStars(el)));

    cleanups.push(
      whenVisible(
        headings,
        safe((batch: Element[]) => {
          batch.forEach((el) =>
            gsap.to(el.children, { opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: EASE, clearProps: "transform" }),
          );
        }),
      ),
      whenVisible(
        fades,
        safe((batch: Element[]) => {
          gsap.to(batch, { opacity: 1, y: 0, duration: 1, ease: EASE, clearProps: "transform" });
        }),
      ),
      whenVisible(
        risers,
        safe((batch: Element[]) => {
          gsap.to(batch, { opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: EASE, clearProps: "transform" });
        }),
      ),
      whenVisible(
        curtains,
        safe((batch: Element[]) => {
          gsap.to(batch, {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.2,
            ease: "power4.inOut",
            stagger: 0.1,
            clearProps: "clipPath",
          });
          batch.forEach((el, index) => {
            const img = el.querySelector("img");
            if (!img) return;
            gsap.fromTo(
              img,
              { scale: 1.25 },
              { scale: 1, duration: 1.6, delay: index * 0.1, ease: EASE, clearProps: "transform" },
            );
          });
        }),
      ),
      whenVisible(
        counters,
        safe((batch: Element[]) => batch.forEach((el) => countUp(el as HTMLElement))),
      ),
      whenVisible(
        starGroups,
        safe((batch: Element[]) => batch.forEach((el) => popStars(filledStars(el)))),
      ),
    );

    // ── Parallax and magnetic buttons (device-dependent) ─────────────────
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      gsap.utils.toArray<HTMLElement>("[data-speed]").forEach((el) => {
        const speed = Number(el.dataset.speed) || 0;
        gsap.fromTo(
          el,
          { yPercent: speed },
          {
            yPercent: -speed,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
    });

    mm.add("(pointer: fine)", () => {
      const listeners = gsap.utils.toArray<HTMLElement>("[data-magnetic]").map((el) => {
        const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3" });
        const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3" });
        const move = (event: PointerEvent) => {
          const rect = el.getBoundingClientRect();
          xTo((event.clientX - rect.left - rect.width / 2) * 0.22);
          yTo((event.clientY - rect.top - rect.height / 2) * 0.32);
        };
        const leave = () => {
          xTo(0);
          yTo(0);
        };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        return () => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
        };
      });
      return () => listeners.forEach((remove) => remove());
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  });

  return null;
}
