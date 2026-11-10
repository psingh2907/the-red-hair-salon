import type { Business } from "@/data/types";
import type { ResolvedContact } from "@/lib/contact";
import { buildWhatsAppUrl, createGeneralEnquiryMessage } from "@/lib/whatsapp";
import { Brand } from "./Brand";
import type { NavLink } from "./Navbar";
import { Button } from "./ui/Button";
import { Icon } from "./ui/Icon";
import { TrackedLink } from "./ui/TrackedLink";

interface FooterProps {
  business: Business;
  contact: ResolvedContact;
  links: NavLink[];
  showPhotoCredit: boolean;
}

const linkClass = "text-[0.92rem] text-ivory/75 transition-colors hover:text-ivory";

export function Footer({ business, contact, links, showPhotoCredit }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer data-tone="dark" className="bg-ink text-ivory">
      <div className="container-page grid gap-12 py-20 md:grid-cols-12 lg:py-24">
        <div className="md:col-span-12 lg:col-span-5">
          <Brand name={business.name} shortName={business.shortName} size="lg" />
          <p className="mt-6 max-w-sm text-[0.95rem] leading-relaxed text-mist">{business.description}</p>
          <Button href="#book" className="mt-8">
            Book Appointment
          </Button>
        </div>

        <nav aria-label="Footer" className="md:col-span-4 lg:col-span-2">
          <p className="eyebrow text-gold">Explore</p>
          <ul className="mt-5 space-y-3">
            {links.map((link) => (
              <li key={link.href}>
                <a href={link.href} className={linkClass}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-4 lg:col-span-3">
          <p className="eyebrow text-gold">Visit</p>
          <address className="mt-5 text-[0.92rem] not-italic leading-relaxed text-ivory/75">
            {contact.addressLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </address>
          <TrackedLink
            href={contact.directionsUrl}
            external
            track={{ event: "directions_click", params: { location: "footer" } }}
            className="mt-4 inline-flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-gold hover:text-ivory"
          >
            Get Directions
            <Icon name="arrow-up-right" className="size-3.5" />
          </TrackedLink>
        </div>

        <div className="md:col-span-4 lg:col-span-2">
          <p className="eyebrow text-gold">Connect</p>
          <ul className="mt-5 space-y-3">
            {contact.whatsapp ? (
              <li>
                <TrackedLink
                  href={buildWhatsAppUrl(contact.whatsapp.international, createGeneralEnquiryMessage(business.name))}
                  external
                  track={{ event: "whatsapp_click", params: { location: "footer" } }}
                  className={`${linkClass} inline-flex items-center gap-2`}
                >
                  <Icon name="whatsapp" className="size-4" />
                  WhatsApp
                </TrackedLink>
              </li>
            ) : null}
            {contact.phone ? (
              <li>
                <TrackedLink
                  href={contact.phone.href}
                  track={{ event: "call_click", params: { location: "footer" } }}
                  className={`${linkClass} inline-flex items-center gap-2`}
                >
                  <Icon name="phone" className="size-4" />
                  {contact.phone.display}
                </TrackedLink>
              </li>
            ) : null}
            {contact.socials.map((social) => (
              <li key={social.id}>
                <TrackedLink
                  href={social.href}
                  external
                  track={
                    social.id === "instagram"
                      ? { event: "instagram_click", params: { location: "footer" } }
                      : social.id === "facebook"
                        ? { event: "facebook_click", params: { location: "footer" } }
                        : { event: "directions_click", params: { location: "footer_google" } }
                  }
                  className={`${linkClass} inline-flex items-center gap-2`}
                >
                  <Icon name={social.id} className="size-4" />
                  {social.label}
                </TrackedLink>
              </li>
            ))}
            <li>
              <TrackedLink
                href={contact.reviewsUrl}
                external
                track={{ event: "google_reviews_click", params: { location: "footer" } }}
                className={`${linkClass} inline-flex items-center gap-2`}
              >
                <Icon name="star" className="size-4" />
                Google Reviews
              </TrackedLink>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ivory/10">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-ivory/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {business.name}
          </p>
          {showPhotoCredit ? <p>Sample photography from Unsplash and Pexels</p> : null}
        </div>
      </div>
    </footer>
  );
}
