import type { SalonData } from "./types";

/**
 * SITE IMAGERY (hero + salon interior)
 *
 * ⚠ DEMO IMAGERY — licensed stock photos, not the salon. Replace with the
 * salon's own photographs in public/images/ before launch.
 *
 * Tips for the hero photo: at least 1600px on the long side, portrait or
 * square, subject slightly off-centre. Adjust `position` to control the crop.
 */
export const hero: SalonData["hero"] = {
  image: {
    src: "/images/hero.jpg",
    alt: "Stylist cutting a client's long dark hair with scissors",
    position: "55% 35%",
    credit: { author: "Farhad Ibrahimzade", source: "Unsplash", url: "https://images.unsplash.com/photo-1700760934268-8aa0ef52ce0a" },
    status: "demo",
  },
  interior: {
    src: "/images/salon-interior.jpg",
    alt: "Salon interior with ornate white mirrors and black styling chairs",
    position: "50% 50%",
    credit: { author: "Benyamin Bohlouli", source: "Unsplash", url: "https://unsplash.com/photos/vSZbEjCSDRw" },
    status: "demo",
  },
};
