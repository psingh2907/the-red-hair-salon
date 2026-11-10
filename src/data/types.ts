/**
 * Data contracts for the salon website template.
 *
 * The UI depends only on these types — never on a specific business.
 * To launch the same site for another salon, replace the files in
 * `src/data/` and the photographs in `public/images/`.
 */

/**
 * How much a piece of business data can be trusted.
 *
 * - `verified`  confirmed with the owner (or an authoritative source)
 * - `reported`  publicly observed or supplied second-hand; confirm with the owner
 * - `demo`      prototype placeholder; must be replaced before launch
 */
export type DataStatus = "verified" | "reported" | "demo";

/**
 * Unknown values are written as `{{TOKEN}}` placeholders (for example
 * `"{{PHONE_NUMBER}}"`). The UI treats them as "not configured" and never
 * renders them.
 */
export type Configurable = string;

export interface Address {
  /** Street, building or landmark line. */
  line1: string;
  area: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Rating {
  /** Average star rating, 0–5. */
  value: number;
  /** Number of reviews at the time of `asOf`. Displayed as "223+". */
  count: number;
  source: "Google";
  /** When the figures were last checked (YYYY-MM). */
  asOf: string;
  status: DataStatus;
}

export interface OpeningHours {
  /** e.g. "Monday" or "Mon – Sat" */
  days: string;
  /** e.g. "10:00 AM – 8:00 PM" or "Closed" */
  hours: string;
}

export interface ImageAsset {
  /** Path inside `public/`, e.g. "/images/hero.jpg". */
  src: string;
  /** Describes what is in the photo. Replace together with the photo. */
  alt: string;
  /** Focal point for cropping, as CSS object-position. Defaults to "center". */
  position?: string;
  /** Where a temporary stock photo came from. Remove for the salon's own photos. */
  credit?: { author: string; source: "Unsplash" | "Pexels"; url: string };
  status: DataStatus;
}

export interface Business {
  name: string;
  /** Used where the full name is too long (mobile navbar, footer mark). */
  shortName: string;
  tagline: string;
  description: string;
  /** Short service words shown in the hero, e.g. Hair • Beauty • Bridal. */
  serviceHighlights: { items: string[]; status: DataStatus };
  address: Address & { status: DataStatus };
  rating: Rating | null;
  contact: {
    /** Indian mobile or landline, any format. */
    phone: Configurable;
    /** WhatsApp number with or without +91. */
    whatsapp: Configurable;
    email: Configurable;
  };
  links: {
    /** Exact Google Maps place link. Falls back to an address search if unset. */
    googleMaps: Configurable;
    /** Link that opens the Google reviews panel. Falls back to Maps. */
    googleReviews: Configurable;
    instagram: Configurable;
    facebook: Configurable;
  };
  /** Leave empty until confirmed. Empty hours are never displayed. */
  hours: OpeningHours[];
}

export interface Service {
  id: string;
  name: string;
  description: string;
  status: DataStatus;
}

export interface ServiceCategory {
  id: string;
  name: string;
  /** One short line shown under the category name. */
  summary: string;
  image: ImageAsset;
  services: Service[];
}

export interface FeaturedService {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  image: ImageAsset;
  /** Matches a `Service.id`, used to pre-select the booking form. */
  serviceId: string;
}

export type GalleryCategory = "Hair" | "Beauty" | "Bridal" | "Salon";

export interface GalleryItem {
  id: string;
  category: GalleryCategory;
  image: ImageAsset;
}

export interface Highlight {
  title: string;
  description: string;
  icon: "star" | "family" | "sparkle" | "pin";
}

export interface Review {
  author: string;
  rating: number;
  text: string;
  /** Human-readable date, e.g. "August 2026". */
  date: string;
  source: "Google";
  /** Only add reviews that are real and that you have permission to show. */
  status: "verified";
}

export interface SalonData {
  business: Business;
  hero: { image: ImageAsset; interior: ImageAsset };
  serviceCategories: ServiceCategory[];
  featuredServices: FeaturedService[];
  gallery: GalleryItem[];
  highlights: Highlight[];
  reviews: Review[];
}
