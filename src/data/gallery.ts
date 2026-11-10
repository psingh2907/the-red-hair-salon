import type { GalleryItem, ImageAsset } from "./types";

/**
 * GALLERY
 *
 * ⚠ DEMO IMAGERY. These are licensed stock photos used to show the layout.
 * They are NOT the salon's work and must be replaced with the salon's own
 * photographs (with client permission) before launch.
 *
 * To replace: drop new photos into public/images/ (same file names, or
 * update `src`), rewrite `alt` to describe the new photo, remove `credit`
 * and set `status: "verified"`.
 *
 * The layout works with any number of items. Category filters appear only
 * when at least two categories have two or more photos.
 */
function stock(
  src: string,
  alt: string,
  credit: NonNullable<ImageAsset["credit"]>,
  position?: string,
): ImageAsset {
  return { src, alt, credit, position, status: "demo" };
}

export const gallery: GalleryItem[] = [
  {
    id: "g01",
    category: "Bridal",
    image: stock(
      "/images/gallery-01.jpg",
      "Makeup artist applying lipstick to a bride with braided hair",
      { author: "Fahad Puthawala", source: "Pexels", url: "https://www.pexels.com/photo/34037603/" },
      "50% 35%",
    ),
  },
  {
    id: "g02",
    category: "Salon",
    image: stock(
      "/images/gallery-02.jpg",
      "Three maroon styling chairs facing a long mirror in a bright salon",
      { author: "Guilherme Petri", source: "Unsplash", url: "https://unsplash.com/photos/PtOfbGkU3uI" },
    ),
  },
  {
    id: "g03",
    category: "Hair",
    image: stock(
      "/images/gallery-03.jpg",
      "Barber trimming a man's hair with scissors and a comb",
      { author: "Gulom Nazarov", source: "Unsplash", url: "https://images.unsplash.com/photo-1657105052497-f996284ffff8" },
      "50% 40%",
    ),
  },
  {
    id: "g04",
    category: "Beauty",
    image: stock(
      "/images/gallery-04.jpg",
      "Nail technician in black gloves shaping a client's nails",
      { author: "Gustavo Fring", source: "Pexels", url: "https://www.pexels.com/photo/7446914/" },
    ),
  },
  {
    id: "g05",
    category: "Bridal",
    image: stock(
      "/images/gallery-05.jpg",
      "Portrait of a bride in a red and gold dupatta with traditional jewellery",
      { author: "SKG Photography", source: "Unsplash", url: "https://unsplash.com/photos/zW7hVlt6Oa0" },
      "50% 25%",
    ),
  },
  {
    id: "g06",
    category: "Hair",
    image: stock(
      "/images/gallery-06.jpg",
      "Client choosing a shade from a hair colour swatch book",
      { author: "Jonathan Borba", source: "Pexels", url: "https://www.pexels.com/photo/28868043/" },
    ),
  },
  {
    id: "g07",
    category: "Salon",
    image: stock(
      "/images/gallery-07.jpg",
      "Styling station with a mirror, wooden shelves and a pendant lamp",
      { author: "Kawê Rodrigues", source: "Unsplash", url: "https://unsplash.com/photos/HIeq4qMEBfM" },
    ),
  },
  {
    id: "g08",
    category: "Beauty",
    image: stock(
      "/images/gallery-08.jpg",
      "Close-up of eye makeup being applied with a fine brush",
      { author: "Fahad Puthawala", source: "Pexels", url: "https://www.pexels.com/photo/34025162/" },
      "50% 40%",
    ),
  },
  {
    id: "g09",
    category: "Hair",
    image: stock(
      "/images/gallery-09.jpg",
      "Smiling stylist blow-drying a client's short hair",
      { author: "Adam Winger", source: "Unsplash", url: "https://images.unsplash.com/photo-1562322140-8baeececf3df" },
    ),
  },
  {
    id: "g10",
    category: "Beauty",
    image: stock(
      "/images/gallery-10.jpg",
      "Freshly painted red manicure resting on a white towel",
      { author: "cottonbro studio", source: "Pexels", url: "https://www.pexels.com/photo/3997384/" },
    ),
  },
];
