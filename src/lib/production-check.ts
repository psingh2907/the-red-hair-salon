/**
 * Production readiness check.
 *
 * In prototype mode, placeholders are expected and this check never blocks.
 * With NEXT_PUBLIC_PROTOTYPE_MODE=false, any error below fails the build,
 * so a half-configured site can't be deployed by accident.
 */

import type { SiteConfig } from "@/config/site";
import type { ImageAsset, SalonData } from "@/data/types";
import { safeHttpsUrl } from "./contact";
import { configuredOrNull } from "./placeholders";
import { toInternationalIndianNumber } from "./validation";

export interface ReadinessReport {
  errors: string[];
  warnings: string[];
}

function collectImages(data: SalonData): ImageAsset[] {
  return [
    data.hero.image,
    data.hero.interior,
    ...data.serviceCategories.map((category) => category.image),
    ...data.featuredServices.map((featured) => featured.image),
    ...data.gallery.map((item) => item.image),
  ];
}

export function checkProductionReadiness(data: SalonData, config: SiteConfig): ReadinessReport {
  const errors: string[] = [];
  const warnings: string[] = [];
  const { business } = data;

  const phone = configuredOrNull(business.contact.phone);
  if (!phone || !toInternationalIndianNumber(phone)) errors.push("business.contact.phone is missing or invalid");

  const whatsapp = configuredOrNull(business.contact.whatsapp);
  if (!whatsapp || !toInternationalIndianNumber(whatsapp))
    errors.push("business.contact.whatsapp is missing or invalid");

  if (!safeHttpsUrl(business.links.googleMaps)) errors.push("business.links.googleMaps is not set");
  if (business.address.status !== "verified") errors.push("business.address has not been verified");
  if (business.serviceHighlights.status !== "verified") errors.push("business.serviceHighlights are demo content");

  const demoServices = data.serviceCategories.flatMap((c) => c.services).filter((s) => s.status !== "verified");
  if (demoServices.length) errors.push(`${demoServices.length} service(s) are not verified`);

  const demoImages = collectImages(data).filter((image) => image.status !== "verified" || image.credit);
  if (demoImages.length) errors.push(`${demoImages.length} image(s) are still stock/demo photos`);

  if (/localhost|127\.0\.0\.1/.test(config.url)) errors.push("NEXT_PUBLIC_SITE_URL is not set to the live domain");

  if (business.rating && business.rating.status !== "verified")
    warnings.push(`Google rating was last checked ${business.rating.asOf}; confirm it is current`);
  if (business.hours.length === 0) warnings.push("Opening hours are not set (the section stays hidden)");
  if (!safeHttpsUrl(business.links.instagram)) warnings.push("Instagram link is not set");
  if (!safeHttpsUrl(business.links.facebook)) warnings.push("Facebook link is not set");
  if (data.reviews.length === 0) warnings.push("No review cards added (the rating summary is shown instead)");

  return { errors, warnings };
}

export function assertProductionReady(data: SalonData, config: SiteConfig): void {
  if (config.prototypeMode) return;
  const { errors } = checkProductionReadiness(data, config);
  if (errors.length) {
    throw new Error(
      `Production data check failed (set NEXT_PUBLIC_PROTOTYPE_MODE=true to allow placeholders):\n- ${errors.join("\n- ")}`,
    );
  }
}
