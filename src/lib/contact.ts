/**
 * Turns raw business data into safe, ready-to-render contact actions.
 * Anything unconfigured or invalid resolves to `null`, so components can
 * hide or disable the action instead of rendering a broken link.
 */

import type { SiteConfig } from "@/config/site";
import type { Business } from "@/data/types";
import { configuredOrNull } from "./placeholders";
import { formatIndianNumber, toInternationalIndianNumber } from "./validation";

export interface ResolvedNumber {
  /** Digits with country code, e.g. "919876543210". */
  international: string;
  /** "+91 98765 43210" */
  display: string;
  /** True when the number comes from a prototype demo override. */
  isDemo: boolean;
}

export interface SocialLink {
  id: "instagram" | "facebook" | "google";
  label: string;
  href: string;
}

export interface ResolvedContact {
  whatsapp: ResolvedNumber | null;
  phone: (ResolvedNumber & { href: string }) | null;
  directionsUrl: string;
  /** False when `directionsUrl` is an address search, not the exact listing. */
  hasExactMapsLink: boolean;
  reviewsUrl: string;
  socials: SocialLink[];
  addressLines: string[];
  fullAddress: string;
}

/** Accepts only absolute https URLs, so data can never inject `javascript:` links. */
export function safeHttpsUrl(value: string | null | undefined): string | null {
  const configured = configuredOrNull(value);
  if (!configured) return null;
  try {
    const url = new URL(configured);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

function resolveNumber(real: string, demo: string | undefined): ResolvedNumber | null {
  const realNumber = configuredOrNull(real);
  const international = realNumber ? toInternationalIndianNumber(realNumber) : null;
  if (international) {
    return { international, display: formatIndianNumber(international), isDemo: false };
  }
  const demoNumber = demo ? toInternationalIndianNumber(demo) : null;
  if (demoNumber) {
    return { international: demoNumber, display: formatIndianNumber(demoNumber), isDemo: true };
  }
  return null;
}

export function resolveContact(business: Business, config: SiteConfig): ResolvedContact {
  const { address } = business;
  const addressLines = [
    address.line1,
    address.area,
    [address.city, address.state].filter(Boolean).join(", "),
    address.postalCode,
  ].filter(Boolean);
  const fullAddress = addressLines.join(", ");

  // Without an exact place link, search Google Maps for the name and address.
  // This never invents coordinates or a place ID.
  const exactMaps = safeHttpsUrl(business.links.googleMaps);
  const searchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${business.name}, ${fullAddress}`,
  )}`;
  const directionsUrl = exactMaps ?? searchUrl;

  const phone = resolveNumber(business.contact.phone, config.demoContact.phone);
  const reviewsUrl = safeHttpsUrl(business.links.googleReviews) ?? directionsUrl;

  const socials: SocialLink[] = [];
  const instagram = safeHttpsUrl(business.links.instagram);
  if (instagram) socials.push({ id: "instagram", label: "Instagram", href: instagram });
  const facebook = safeHttpsUrl(business.links.facebook);
  if (facebook) socials.push({ id: "facebook", label: "Facebook", href: facebook });
  if (exactMaps) socials.push({ id: "google", label: "Google", href: exactMaps });

  return {
    whatsapp: resolveNumber(business.contact.whatsapp, config.demoContact.whatsapp),
    phone: phone ? { ...phone, href: `tel:+${phone.international}` } : null,
    directionsUrl,
    hasExactMapsLink: Boolean(exactMaps),
    reviewsUrl,
    socials,
    addressLines,
    fullAddress,
  };
}
