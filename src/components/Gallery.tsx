"use client";

import { type KeyboardEvent, type MouseEvent, useMemo, useRef, useState } from "react";
import type { GalleryCategory, GalleryItem } from "@/data/types";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { Button } from "./ui/Button";
import { Icon } from "./ui/Icon";
import { SalonImage } from "./ui/SalonImage";
import { SectionHeading } from "./ui/SectionHeading";

interface GalleryProps {
  items: GalleryItem[];
  /** Shows a small "sample imagery" note while stock photos are in use. */
  showSampleNote: boolean;
}

type Filter = "All" | GalleryCategory;

/**
 * Editorial layout: items flow in groups of three, alternating a large
 * tile on the left and on the right. Trailing groups of one or two fill
 * the row, so any number of photos lays out without gaps.
 */
function tileLayout(index: number, total: number): { className: string; large: boolean } {
  const group = Math.floor(index / 3);
  const remaining = total - group * 3;
  if (remaining === 1) return { className: "col-span-2 row-span-2 md:col-span-12", large: true };
  if (remaining === 2) return { className: "col-span-1 row-span-2 md:col-span-6", large: false };
  const position = index % 3;
  const large = group % 2 === 0 ? position === 0 : position === 1;
  return large
    ? { className: "col-span-2 row-span-2 md:col-span-7", large: true }
    : { className: "col-span-1 md:col-span-5", large: false };
}

export function Gallery({ items, showSampleNote }: GalleryProps) {
  const [filter, setFilter] = useState<Filter>("All");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const filters = useMemo<Filter[]>(() => {
    const counts = new Map<GalleryCategory, number>();
    for (const item of items) counts.set(item.category, (counts.get(item.category) ?? 0) + 1);
    const eligible = [...counts.entries()].filter(([, count]) => count >= 2).map(([category]) => category);
    return eligible.length >= 2 ? ["All", ...eligible] : [];
  }, [items]);

  const visible = filter === "All" ? items : items.filter((item) => item.category === filter);

  if (items.length === 0) return null;

  const active = openIndex === null ? null : visible[openIndex];

  function open(index: number) {
    setOpenIndex(index);
    dialogRef.current?.showModal();
    trackEvent("gallery_open", { category: visible[index]?.category });
  }

  function step(delta: number) {
    setOpenIndex((current) => (current === null ? null : (current + delta + visible.length) % visible.length));
  }

  function onDialogKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key === "ArrowRight") step(1);
    if (event.key === "ArrowLeft") step(-1);
  }

  /** Clicking the backdrop area (not a control or the photo) closes the viewer. */
  function onDialogClick(event: MouseEvent<HTMLElement>) {
    if (event.target === event.currentTarget) dialogRef.current?.close();
  }

  return (
    <section id="gallery" aria-labelledby="gallery-title" className="bg-paper py-24 lg:py-36">
      <div className="container-page">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            id="gallery-title"
            eyebrow="Gallery"
            title={
              <>
                See the <em>experience</em>
              </>
            }
            intro="The looks, the little details and the space you'll walk into."
          />
          {filters.length > 0 ? (
            <div role="group" aria-label="Filter photos" className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 md:mx-0 md:px-0">
              {filters.map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={filter === option}
                  onClick={() => setFilter(option)}
                  className={cn(
                    "h-10 shrink-0 rounded-full border px-5 text-[0.68rem] font-semibold uppercase tracking-[0.16em] transition-colors duration-300",
                    filter === option
                      ? "border-ink bg-ink text-ivory"
                      : "border-ink/20 text-ink/70 hover:border-ink hover:text-ink",
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <ul
          className="mt-10 grid auto-rows-[9.5rem] grid-flow-dense grid-cols-2 gap-2 min-[400px]:auto-rows-[10.5rem] sm:auto-rows-[13rem] md:mt-14 md:auto-rows-[15rem] md:grid-cols-12 md:gap-4 lg:auto-rows-[18rem]"
        >
          {visible.map((item, index) => {
            const layout = tileLayout(index, visible.length);
            return (
              <li key={item.id} className={cn("relative", layout.className)}>
                <button
                  type="button"
                  onClick={() => open(index)}
                  aria-label={`View larger: ${item.image.alt}`}
                  data-anim="curtain"
                  className="group absolute inset-0 overflow-hidden bg-sand"
                >
                  <SalonImage
                    image={item.image}
                    sizes={layout.large ? "(min-width: 768px) 58vw, 100vw" : "(min-width: 768px) 42vw, 50vw"}
                    className="transition-transform duration-[1.2s] ease-soft group-hover:scale-[1.04]"
                  />
                  <span className="absolute inset-0 bg-linear-to-t from-ink/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100" />
                  <span className="eyebrow absolute bottom-4 left-4 translate-y-2 text-ivory opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                    {item.category}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="mt-10 flex flex-col gap-6 border-t border-ink/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="headline text-[1.75rem]">Like what you see?</p>
            {showSampleNote ? (
              <p className="mt-1 text-xs text-muted">Sample imagery shown for preview.</p>
            ) : null}
          </div>
          <Button href="#book" variant="outline-dark" icon="arrow-right" iconPosition="end">
            Book Your Visit
          </Button>
        </div>
      </div>

      <dialog
        ref={dialogRef}
        aria-label="Photo viewer"
        data-lenis-prevent
        onClose={() => setOpenIndex(null)}
        onKeyDown={onDialogKeyDown}
        onClick={onDialogClick}
        data-tone="dark"
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-ink/95 p-0 text-ivory backdrop:bg-ink/80"
      >
        {active ? (
          <div className="flex h-full flex-col" onClick={onDialogClick}>
            <div className="flex items-center justify-between px-4 py-3 sm:px-6">
              <p className="eyebrow text-mist">
                {active.category} · {(openIndex ?? 0) + 1} / {visible.length}
              </p>
              <button
                type="button"
                autoFocus
                onClick={() => dialogRef.current?.close()}
                className="flex size-11 items-center justify-center"
              >
                <Icon name="close" className="size-6" title="Close photo viewer" />
              </button>
            </div>
            <div className="relative mx-4 flex-1 sm:mx-20">
              <SalonImage image={active.image} sizes="100vw" fit="contain" />
            </div>
            <div className="flex items-center justify-between gap-4 px-4 pb-6 pt-4 pb-safe sm:px-6">
              <button
                type="button"
                onClick={() => step(-1)}
                className="flex size-11 items-center justify-center border border-ivory/20 hover:border-ivory"
              >
                <Icon name="chevron-left" className="size-5" title="Previous photo" />
              </button>
              <p className="line-clamp-2 text-center text-sm text-mist">{active.image.alt}</p>
              <button
                type="button"
                onClick={() => step(1)}
                className="flex size-11 items-center justify-center border border-ivory/20 hover:border-ivory"
              >
                <Icon name="chevron-right" className="size-5" title="Next photo" />
              </button>
            </div>
          </div>
        ) : null}
      </dialog>
    </section>
  );
}
