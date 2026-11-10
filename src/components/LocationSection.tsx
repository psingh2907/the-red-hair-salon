import type { Business } from "@/data/types";
import type { ResolvedContact } from "@/lib/contact";
import { buildWhatsAppUrl, createGeneralEnquiryMessage } from "@/lib/whatsapp";
import { Button } from "./ui/Button";
import { Icon } from "./ui/Icon";
import { SectionHeading } from "./ui/SectionHeading";
import { TrackedLink } from "./ui/TrackedLink";

interface LocationSectionProps {
  business: Business;
  contact: ResolvedContact;
}

export function LocationSection({ business, contact }: LocationSectionProps) {
  const [firstLine, ...otherLines] = contact.addressLines;

  return (
    <section id="location" aria-labelledby="location-title" className="bg-paper py-24 lg:py-36">
      <div className="container-page grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="flex flex-col lg:col-span-5">
          <SectionHeading
            id="location-title"
            eyebrow="Visit"
            title={
              <>
                Find us <em>in {business.address.city}</em>
              </>
            }
          />

          <address className="mt-10 not-italic">
            <p className="eyebrow text-muted">Address</p>
            <p className="headline mt-3 text-[2.1rem]">{firstLine}</p>
            <p className="mt-3 text-base leading-relaxed text-muted">
              {otherLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
          </address>

          {business.hours.length > 0 ? (
            <div className="mt-10">
              <p className="eyebrow flex items-center gap-2 text-muted">
                <Icon name="clock" className="size-4" />
                Opening hours
              </p>
              <dl className="mt-4 divide-y divide-ink/10 border-y border-ink/10">
                {business.hours.map((entry) => (
                  <div key={entry.days} className="flex justify-between gap-6 py-3 text-[0.95rem]">
                    <dt className="font-medium">{entry.days}</dt>
                    <dd className="text-muted">{entry.hours}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button
              href={contact.directionsUrl}
              external
              size="lg"
              icon="navigation"
              magnetic
              track={{ event: "directions_click", params: { location: "location" } }}
            >
              Get Directions
            </Button>
            {contact.phone ? (
              <Button
                href={contact.phone.href}
                variant="outline-dark"
                size="lg"
                icon="phone"
                track={{ event: "call_click", params: { location: "location" } }}
              >
                {contact.phone.display}
              </Button>
            ) : null}
            {contact.whatsapp ? (
              <Button
                href={buildWhatsAppUrl(contact.whatsapp.international, createGeneralEnquiryMessage(business.name))}
                external
                variant="outline-dark"
                size="lg"
                icon="whatsapp"
                track={{ event: "whatsapp_click", params: { location: "location" } }}
              >
                WhatsApp
              </Button>
            ) : null}
          </div>
        </div>

        <div className="lg:col-span-7">
          <TrackedLink
            href={contact.directionsUrl}
            external
            track={{ event: "directions_click", params: { location: "map_card" } }}
            aria-label={`Open ${business.name} in Google Maps`}
            data-tone="dark"
            data-anim="fade"
            className="group relative block aspect-[4/3] overflow-hidden bg-ink text-ivory lg:aspect-auto lg:h-full lg:min-h-[34rem]"
          >
            <svg
              aria-hidden
              viewBox="0 0 800 600"
              preserveAspectRatio="xMidYMid slice"
              className="absolute inset-0 size-full transition-transform duration-[1.6s] ease-soft group-hover:scale-105"
            >
              <defs>
                <pattern id="map-grid" width="36" height="36" patternUnits="userSpaceOnUse">
                  <path d="M36 0H0V36" fill="none" stroke="#f5f1ea" strokeOpacity="0.045" />
                </pattern>
                <radialGradient id="map-glow">
                  <stop offset="0" stopColor="#7a1f24" stopOpacity="0.55" />
                  <stop offset="1" stopColor="#7a1f24" stopOpacity="0" />
                </radialGradient>
              </defs>
              <rect width="800" height="600" fill="url(#map-grid)" />
              <circle cx="400" cy="350" r="230" fill="url(#map-glow)" />
              <g fill="none" stroke="#f5f1ea" strokeLinecap="round">
                <path d="M-20 375C170 345 320 420 520 330S760 250 840 280" strokeOpacity="0.2" strokeWidth="14" />
                <path d="M255-20C300 160 245 300 330 620" strokeOpacity="0.13" strokeWidth="8" />
                <path d="M575-20 505 300 615 620" strokeOpacity="0.1" strokeWidth="6" />
                <path d="M-20 150 300 175 820 125" strokeOpacity="0.08" strokeWidth="5" />
                <path d="M0 525 380 475 820 545" strokeOpacity="0.08" strokeWidth="5" />
                <path d="M120-20 165 620M700-20 655 620" strokeOpacity="0.06" strokeWidth="3" />
              </g>
            </svg>

            <span className="eyebrow absolute left-5 top-5 text-[0.6rem] text-ivory/60">Map illustration</span>

            <div className="absolute left-1/2 top-[54%] flex -translate-x-1/2 -translate-y-full flex-col items-center">
              <div className="relative whitespace-nowrap bg-ivory px-4 py-2.5 text-center text-ink shadow-2xl">
                <p className="text-[0.62rem] font-bold uppercase tracking-[0.2em]">{business.shortName}</p>
                <p className="mt-0.5 text-[0.74rem] text-muted">{firstLine}</p>
                <span className="absolute left-1/2 top-full size-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-ivory" />
              </div>
              <span className="relative mt-5 flex size-5 items-center justify-center">
                <span className="absolute inset-0 rounded-full bg-rouge motion-safe:animate-pin-pulse" />
                <span className="relative size-5 rounded-full border-[3px] border-ivory bg-rouge" />
              </span>
            </div>

            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 border-t border-ivory/10 bg-ink/85 px-5 py-4 backdrop-blur sm:px-6">
              <span className="text-sm text-ivory/85">
                {business.address.area}, {business.address.city}
              </span>
              <span className="eyebrow flex shrink-0 items-center gap-2 text-gold">
                Open in Maps
                <Icon
                  name="arrow-up-right"
                  className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </span>
            </div>
          </TrackedLink>
        </div>
      </div>
    </section>
  );
}
