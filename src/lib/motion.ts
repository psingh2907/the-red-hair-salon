/**
 * Shared access to the smooth-scroll instance, so non-motion code (for
 * example "Enquire" buttons) can scroll smoothly without importing Lenis.
 */
import type Lenis from "lenis";

let instance: Lenis | null = null;

export function setLenis(lenis: Lenis | null): void {
  instance = lenis;
}

export function getLenis(): Lenis | null {
  return instance;
}
