/**
 * Lets any "Enquire" button pre-select a service in the appointment form
 * and scroll to it, without the components knowing about each other.
 */
import { getLenis } from "./motion";

export const SELECT_SERVICE_EVENT = "salon:select-service";
export const BOOKING_SECTION_ID = "book";

export function requestBooking(serviceId?: string): void {
  if (typeof window === "undefined") return;
  if (serviceId) {
    window.dispatchEvent(new CustomEvent<string>(SELECT_SERVICE_EVENT, { detail: serviceId }));
  }
  const section = document.getElementById(BOOKING_SECTION_ID);
  if (!section) return;

  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(section, { offset: -80 });
    return;
  }
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  section.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
}
