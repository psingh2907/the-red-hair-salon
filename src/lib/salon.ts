/**
 * Server-only loader: validates the data and removes references to image
 * files that don't exist, so a missing photo shows a styled placeholder
 * instead of a broken image. Import only from Server Components.
 */

import { existsSync } from "node:fs";
import path from "node:path";
import { siteConfig } from "@/config/site";
import { salonData } from "@/data";
import type { ImageAsset, SalonData } from "@/data/types";
import { assertProductionReady } from "./production-check";

function checkImage(image: ImageAsset): ImageAsset {
  const isLocal = image.src.startsWith("/");
  const exists = isLocal && existsSync(path.join(process.cwd(), "public", image.src));
  return exists ? image : { ...image, src: "" };
}

export function loadSalon(): SalonData {
  assertProductionReady(salonData, siteConfig);
  const data = salonData;
  return {
    ...data,
    hero: { image: checkImage(data.hero.image), interior: checkImage(data.hero.interior) },
    serviceCategories: data.serviceCategories.map((c) => ({ ...c, image: checkImage(c.image) })),
    featuredServices: data.featuredServices.map((f) => ({ ...f, image: checkImage(f.image) })),
    gallery: data.gallery.map((g) => ({ ...g, image: checkImage(g.image) })),
  };
}
