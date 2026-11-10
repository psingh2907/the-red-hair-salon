import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { siteConfig } from "@/config/site";
import { business } from "@/data/business";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const { address } = business;
const title = `${business.name} | Salon in ${address.city}, ${address.state}`;
const serviceWords = business.serviceHighlights.items.map((item) => item.toLowerCase());
const serviceList =
  serviceWords.length > 1
    ? `${serviceWords.slice(0, -1).join(", ")} and ${serviceWords.at(-1)}`
    : (serviceWords[0] ?? "salon");
const description = `Discover ${business.name} in ${address.area}, ${address.city} for ${serviceList} services.`;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title,
  description,
  applicationName: business.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: "/",
    siteName: business.name,
    title,
    description,
    images: [{ url: "/images/og-image.jpg", width: 1200, height: 630, alt: business.name }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/og-image.jpg"],
  },
  // Prototype builds stay out of search results until the owner approves launch.
  robots: siteConfig.prototypeMode ? { index: false, follow: false } : { index: true, follow: true },
  formatDetection: { telephone: false },
};

const MOTION_INIT_SCRIPT =
  'try{if(!window.matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("motion-init")}catch(e){}';

export const viewport: Viewport = {
  themeColor: "#0e0c0b",
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" className={`${cormorant.variable} ${manrope.variable} antialiased`} suppressHydrationWarning>
      <head>
        {/* Prepares the hero intro before first paint; skipped for reduced motion. */}
        <script dangerouslySetInnerHTML={{ __html: MOTION_INIT_SCRIPT }} />
      </head>
      <body className="pb-action-bar min-h-svh lg:pb-0">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-ivory focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-ink"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
