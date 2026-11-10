import { business } from "./business";
import type { Highlight } from "./types";

/**
 * "WHY CHOOSE US" POINTS
 *
 * Keep every point factual. Avoid unverifiable claims such as "best salon",
 * years of experience or satisfaction percentages unless the owner can prove them.
 */
const ratingHighlight: Highlight[] = business.rating
  ? [
      {
        icon: "star",
        title: `${business.rating.value.toFixed(1)}★ on Google`,
        description: `Rated ${business.rating.value.toFixed(1)} out of 5 across ${business.rating.count}+ Google reviews from local customers.`,
      },
    ]
  : [];

export const highlights: Highlight[] = [
  ...ratingHighlight,
  {
    icon: "family",
    title: "A salon for the whole family",
    description: "One welcoming place where everyone in the family can come for their look.",
  },
  {
    icon: "sparkle",
    title: "Styling around you",
    description: "Tell us about your hair, your skin and your occasion, and we'll plan the visit around it.",
  },
  {
    icon: "pin",
    title: `In the heart of ${business.address.area}`,
    description: `Easy to find: ${business.address.line1.toLowerCase()}, ${business.address.city}.`,
  },
];
