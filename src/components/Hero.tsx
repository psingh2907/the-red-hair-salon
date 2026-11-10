import { Fragment } from "react";
import type { Business, SalonData } from "@/data/types";
import type { ResolvedContact } from "@/lib/contact";
import { splitTagline } from "@/lib/format";
import { buildWhatsAppUrl, createGeneralEnquiryMessage } from "@/lib/whatsapp";
import { HeroLight } from "./motion/HeroLight";
import { SocialProof } from "./SocialProof";
import { Button } from "./ui/Button";
import { SalonImage } from "./ui/SalonImage";

interface HeroProps {
  business: Business;
  media: SalonData["hero"];
  contact: ResolvedContact;
}

/**
 * Hero section. The intro animation and parallax are added by MotionEffects
 * through the data-hero-* attributes below; HeroLight adds the light layer.
 */
export function Hero({ business, media, contact }: HeroProps) {
  const [taglineStart, taglineEnd] = splitTagline(business.tagline);
  const whatsappHref = contact.whatsapp
    ? buildWhatsAppUrl(contact.whatsapp.international, createGeneralEnquiryMessage(business.name))
    : "#book";

  return (
    <section
      id="top"
      data-tone="dark"
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden bg-ink text-ivory"
    >
      {/* Photography, light layer (never distorts faces), then gradients on top */}
      <div data-hero-media className="absolute inset-0 -z-10 lg:left-[46%]">
        <SalonImage image={media.image} sizes="(min-width: 1024px) 54vw, 100vw" eager />
        {media.image.src ? <HeroLight /> : null}
        <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/75 to-ink/10 lg:hidden" />
        <div className="absolute inset-x-0 top-0 h-36 bg-linear-to-b from-ink/80 to-transparent" />
        <div className="absolute inset-y-0 left-0 hidden w-48 bg-linear-to-r from-ink to-transparent lg:block" />
      </div>

      {/* Secondary image, desktop only */}
      {media.interior.src ? (
        <div className="absolute bottom-14 left-[calc(46%-5.5rem)] hidden aspect-[4/5] w-44 overflow-hidden border-[6px] border-ink shadow-2xl xl:block 2xl:w-52">
          <SalonImage image={media.interior} sizes="208px" />
        </div>
      ) : null}

      {/* On phones the hero stops above the fixed action bar (4rem + safe area). */}
      <div className="container-page flex min-h-[calc(100svh-4rem-env(safe-area-inset-bottom))] flex-col justify-end pb-8 pt-28 sm:pb-14 lg:min-h-[max(46rem,100svh)] lg:justify-center lg:pb-24 lg:pt-36">
        <div className="max-w-xl lg:max-w-[33rem] xl:max-w-[36rem]">
          <h1 id="hero-title">
            {/* Eyebrow and headline animate with pure CSS (see globals.css) so the
                largest text paints immediately, without waiting for JavaScript. */}
            <span className="hero-fade eyebrow flex items-center gap-3 text-gold">
              <span aria-hidden className="h-px w-8 bg-gold" />
              {business.name}
            </span>
            <span className="headline mt-5 block text-[3.15rem] sm:text-[4.4rem] lg:text-[4.9rem] xl:text-[5.6rem]">
              {taglineStart.split(" ").map((word, index) => (
                <Fragment key={`${word}-${index}`}>
                  {index > 0 ? " " : null}
                  <span className="hero-word-mask">
                    <span className="hero-word" style={{ animationDelay: `${300 + index * 80}ms` }}>
                      {word}
                    </span>
                  </span>
                </Fragment>
              ))}
              {taglineEnd ? (
                <>
                  {" "}
                  <span className="hero-accent inline-block">
                    <em className="text-shimmer inline-block pr-[0.08em] italic">{taglineEnd}</em>
                  </span>
                </>
              ) : null}
            </span>
          </h1>

          {business.serviceHighlights.items.length > 0 ? (
            <p
              data-hero-item="services"
              className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-ivory/85 sm:gap-x-3 sm:text-[0.78rem] sm:tracking-[0.24em]"
            >
              {business.serviceHighlights.items.map((item, index) => (
                <span key={item} className="flex items-center gap-2 sm:gap-3">
                  {index > 0 ? (
                    <span aria-hidden className="text-gold">
                      •
                    </span>
                  ) : null}
                  {item}
                </span>
              ))}
            </p>
          ) : null}

          <div data-hero-item="actions" className="mt-9 grid gap-3 sm:flex">
            <Button
              href="#book"
              size="lg"
              icon="calendar"
              magnetic
              track={{ event: "appointment_started", params: { location: "hero" } }}
            >
              Book Appointment
            </Button>
            <Button
              href={whatsappHref}
              external={Boolean(contact.whatsapp)}
              variant="outline-light"
              size="lg"
              icon="whatsapp"
              magnetic
              track={{ event: "whatsapp_click", params: { location: "hero" } }}
            >
              WhatsApp Us
            </Button>
          </div>

          <div data-hero-item="proof" className="mt-10 border-t border-ivory/15 pt-6">
            <SocialProof rating={business.rating} address={business.address} reviewsUrl={contact.reviewsUrl} />
          </div>
        </div>
      </div>
    </section>
  );
}
