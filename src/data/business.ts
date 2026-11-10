import type { Business } from "./types";

/**
 * ─────────────────────────────────────────────────────────────────────────
 *  BUSINESS INFORMATION — the single place to edit salon details.
 * ─────────────────────────────────────────────────────────────────────────
 *
 *  Values written as "{{TOKEN}}" are unknown. The website hides anything
 *  that is not configured, so nothing breaks while they are missing.
 *
 *  Verification status of each field is documented inline and in
 *  docs/business-research.md. Never add a value you have not confirmed.
 */
export const business: Business = {
  // VERIFIED — business name as it appears on Google.
  name: "THE RED HAIR FAMILY SALON",

  // DEMO — shortened brand name for tight spaces. Confirm with the owner.
  shortName: "The Red Hair",

  // DEMO — suggested marketing copy, not an existing slogan.
  tagline: "Your Style. Your Confidence.",

  // DEMO — suggested description.
  description: "A modern family salon experience in Bharhut Nagar, Satna.",

  // DEMO — broad categories for the hero. Replace with the salon's confirmed offering.
  serviceHighlights: {
    items: ["Hair", "Beauty", "Grooming", "Bridal"],
    status: "demo",
  },

  address: {
    line1: "Opposite Prithviraj Studio", // REPORTED — landmark
    area: "Bharhut Nagar", // REPORTED
    city: "Satna", // REPORTED
    state: "Madhya Pradesh",
    postalCode: "485001", // REPORTED — confirm the PIN code with the owner
    country: "India",
    status: "reported",
  },

  // REPORTED — figures observed on Google; they change over time.
  // Update `value`, `count` and `asOf` whenever you re-check the listing.
  // Set to `null` to hide every rating element on the site.
  rating: {
    value: 4.9,
    count: 223,
    source: "Google",
    asOf: "2026-09",
    status: "reported",
  },

  contact: {
    phone: "{{PHONE_NUMBER}}", // e.g. "98765 43210"
    whatsapp: "+91 90692 54035", // REPORTED — shared by Praveen on 15 Sep 2026; confirm with the owner
    email: "{{EMAIL}}",
  },

  links: {
    googleMaps: "{{GOOGLE_MAPS_URL}}", // Google Maps → Share → Copy link
    googleReviews: "{{GOOGLE_REVIEWS_URL}}", // optional; falls back to the Maps link
    instagram: "{{INSTAGRAM_URL}}",
    facebook: "{{FACEBOOK_URL}}",
  },

  // UNKNOWN — do not guess. Example once confirmed:
  // [{ days: "Mon – Sat", hours: "10:00 AM – 8:30 PM" }, { days: "Sunday", hours: "11:00 AM – 6:00 PM" }]
  hours: [],
};
