/**
 * WhatsApp message and link generation.
 * Kept separate from the UI so it can be reused (and tested) on its own.
 */

import {
  type AppointmentInput,
  normalizeIndianMobile,
  sanitizeLine,
  sanitizeMultiline,
  LIMITS,
} from "./validation";

/** Formats "2026-09-20" as "Sunday, 20 September 2026" without time-zone drift. */
export function formatPreferredDate(isoDate: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!match) return "";
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Builds the appointment enquiry text. Every value is sanitised and empty
 * lines are skipped, so the message can never contain "undefined" or "null".
 */
export function createWhatsAppMessage(
  input: AppointmentInput,
  businessName: string,
  serviceLabel?: string,
): string {
  const mobile = normalizeIndianMobile(input.phone);
  const lines: [string, string][] = [
    ["Name", sanitizeLine(input.name, LIMITS.name)],
    ["Phone", mobile ? `+91 ${mobile.slice(0, 5)} ${mobile.slice(5)}` : sanitizeLine(input.phone, 20)],
    ["Service", sanitizeLine(serviceLabel ?? input.service)],
    ["Preferred Date", formatPreferredDate(input.date)],
    ["Preferred Time", sanitizeLine(input.time)],
  ];

  const details = lines
    .filter(([, value]) => value)
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");

  const message = sanitizeMultiline(input.message);

  return [
    `Hi, I would like to enquire about an appointment at ${businessName}.`,
    "",
    details,
    ...(message ? ["", "Message:", message] : []),
  ].join("\n");
}

/** Short message used by the "Enquire on WhatsApp" buttons on services. */
export function createServiceEnquiryMessage(serviceName: string, businessName: string): string {
  return `Hi, I would like to know more about ${sanitizeLine(serviceName)} at ${businessName}.`;
}

/** General "WhatsApp us" opener. */
export function createGeneralEnquiryMessage(businessName: string): string {
  return `Hi, I would like to enquire about ${businessName}.`;
}

/**
 * Builds a wa.me link. `internationalNumber` must be digits only with the
 * country code (e.g. "919876543210"); resolve it with `resolveContact()`.
 */
export function buildWhatsAppUrl(internationalNumber: string, message: string): string {
  const digits = internationalNumber.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
