"use client";

import { type KeyboardEvent, useRef, useState } from "react";
import type { ServiceCategory } from "@/data/types";
import { cn } from "@/lib/cn";
import { ServiceCard } from "./ServiceCard";
import { SalonImage } from "./ui/SalonImage";
import { SectionHeading } from "./ui/SectionHeading";

interface ServicesProps {
  categories: ServiceCategory[];
  businessName: string;
  whatsappNumber: string | null;
}

export function Services({ categories, businessName, whatsappNumber }: ServicesProps) {
  const [activeId, setActiveId] = useState(categories[0]?.id ?? "");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  if (categories.length === 0) return null;

  function onTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const keys: Record<string, number> = {
      ArrowRight: (index + 1) % categories.length,
      ArrowLeft: (index - 1 + categories.length) % categories.length,
      Home: 0,
      End: categories.length - 1,
    };
    if (!(event.key in keys)) return;
    event.preventDefault();
    const next = keys[event.key];
    setActiveId(categories[next].id);
    tabRefs.current[next]?.focus();
  }

  return (
    <section id="services" aria-labelledby="services-title" className="bg-ivory py-24 lg:py-36">
      <div className="container-page">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            id="services-title"
            eyebrow="Services"
            title={
              <>
                Everything your look <em>needs</em>
              </>
            }
            intro="Explore what we offer, then send a quick enquiry. We'll help you choose what's right for you."
          />

          <div
            role="tablist"
            aria-label="Service categories"
            className="no-scrollbar -mx-5 flex gap-8 overflow-x-auto border-b border-ink/15 px-5 sm:mx-0 sm:px-0 lg:gap-10"
          >
            {categories.map((category, index) => {
              const selected = category.id === activeId;
              return (
                <button
                  key={category.id}
                  ref={(node) => {
                    tabRefs.current[index] = node;
                  }}
                  id={`tab-${category.id}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls={`panel-${category.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActiveId(category.id)}
                  onKeyDown={(event) => onTabKeyDown(event, index)}
                  className={cn(
                    "relative shrink-0 pb-4 headline text-[1.75rem] transition-colors duration-300 sm:text-[2rem]",
                    "after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:bg-rouge after:transition-transform after:duration-500 after:ease-soft",
                    selected ? "text-ink after:scale-x-100" : "text-ink/55 after:scale-x-0 hover:text-ink/75",
                  )}
                >
                  {category.name}
                  <sup className="ml-1.5 font-sans text-[0.62rem] font-semibold tracking-wider text-muted">
                    {String(category.services.length).padStart(2, "0")}
                  </sup>
                </button>
              );
            })}
          </div>
        </div>

        {categories.map((category) => (
          <div
            key={category.id}
            id={`panel-${category.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${category.id}`}
            hidden={category.id !== activeId}
            className="mt-10 motion-safe:animate-fade-up lg:mt-16"
          >
            <div className="grid gap-8 lg:grid-cols-12 lg:gap-16">
              <div className="relative aspect-[4/3] overflow-hidden bg-sand sm:aspect-[16/9] lg:col-span-5 lg:aspect-[4/5]">
                <SalonImage image={category.image} sizes="(min-width: 1024px) 38vw, 100vw" />
                <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-ink/70 to-transparent p-5 pt-16 lg:p-7 lg:pt-24">
                  <p className="eyebrow text-ivory">{category.name}</p>
                  <p className="headline mt-2 text-2xl text-ivory lg:text-[1.9rem]">{category.summary}</p>
                </div>
              </div>

              <div className="lg:col-span-7">
                <h3 className="sr-only">{category.name} services</h3>
                <ul className="border-t border-ink/10">
                  {category.services.map((service, index) => (
                    <li key={service.id}>
                      <ServiceCard
                        service={service}
                        index={index}
                        businessName={businessName}
                        whatsappNumber={whatsappNumber}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
