import type { SalonData } from "@/data/types";
import type { ResolvedContact } from "@/lib/contact";

interface StructuredDataProps {
  data: SalonData;
  contact: ResolvedContact;
  siteUrl: string;
}

/**
 * schema.org BeautySalon markup. Only real, configured values are included:
 * demo phone numbers, placeholder links and stock photos are left out.
 *
 * `aggregateRating` is deliberately omitted: Google does not allow a
 * business to mark up its own rating (self-serving reviews).
 */
export function StructuredData({ data, contact, siteUrl }: StructuredDataProps) {
  const { business, hero } = data;
  const { address } = business;

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    "@id": `${siteUrl}/#salon`,
    name: business.name,
    url: siteUrl,
    address: {
      "@type": "PostalAddress",
      streetAddress: [address.line1, address.area].filter(Boolean).join(", "),
      addressLocality: address.city,
      addressRegion: address.state,
      postalCode: address.postalCode,
      addressCountry: "IN",
    },
  };

  if (business.description) jsonLd.description = business.description;
  if (contact.phone && !contact.phone.isDemo) jsonLd.telephone = `+${contact.phone.international}`;
  if (contact.hasExactMapsLink) jsonLd.hasMap = contact.directionsUrl;

  const sameAs = contact.socials.map((social) => social.href);
  if (sameAs.length) jsonLd.sameAs = sameAs;

  if (hero.interior.src && hero.interior.status === "verified" && !hero.interior.credit) {
    jsonLd.image = new URL(hero.interior.src, siteUrl).toString();
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
    />
  );
}
