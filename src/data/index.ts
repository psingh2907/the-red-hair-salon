/**
 * Everything the website knows about the business, in one object.
 * The UI receives this and never imports individual data files directly,
 * which is what makes the template reusable for another salon.
 */
import { business } from "./business";
import { gallery } from "./gallery";
import { highlights } from "./highlights";
import { hero } from "./media";
import { reviews } from "./reviews";
import { featuredServices, serviceCategories } from "./services";
import type { SalonData } from "./types";

export const salonData: SalonData = {
  business,
  hero,
  serviceCategories,
  featuredServices,
  gallery,
  highlights,
  reviews,
};
