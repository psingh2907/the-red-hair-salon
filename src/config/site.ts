/**
 * Site-level configuration (not business data).
 *
 * Values come from environment variables so the same code can run as a
 * sales prototype or as the production website. See `.env.example`.
 */

function readEnv(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

const prototypeMode = process.env.NEXT_PUBLIC_PROTOTYPE_MODE !== "false";

export const siteConfig = {
  /**
   * `true`  — placeholder data and stock imagery are allowed, the site is
   *           hidden from search engines, and demo contact numbers may be used.
   * `false` — production: every critical field must be real, or the build fails.
   */
  prototypeMode,

  /** Public URL, used for canonical links, Open Graph and structured data. */
  url: readEnv(process.env.NEXT_PUBLIC_SITE_URL) ?? "http://localhost:3000",

  locale: "en_IN",

  /**
   * Prototype-only contact overrides, so the WhatsApp and Call flows can be
   * demonstrated live (for example, with your own number) before the salon's
   * real numbers are known. Ignored when `prototypeMode` is false.
   */
  demoContact: prototypeMode
    ? {
        whatsapp: readEnv(process.env.NEXT_PUBLIC_DEMO_WHATSAPP),
        phone: readEnv(process.env.NEXT_PUBLIC_DEMO_PHONE),
      }
    : { whatsapp: undefined, phone: undefined },
} as const;

export type SiteConfig = typeof siteConfig;
