# Business Research — THE RED HAIR FAMILY SALON

_Last updated: 15 September 2026_

This document records what is known about the business, where it came from,
and how confident we are. **Nothing on the website should be more certain than
this document.**

## Status definitions

| Status | Meaning |
| --- | --- |
| **Verified** | Confirmed directly with the owner (or an authoritative source checked first-hand). |
| **Reported** | Supplied second-hand or observed publicly, not yet confirmed with the owner. |
| **Demo** | Prototype placeholder. Must be replaced before launch. |
| **Unknown** | Not available. Hidden on the website. |

> None of the facts below have been verified with the owner yet. The rating and
> address were supplied by the project brief; they were **not** independently
> re-checked on Google while building this prototype.

## Known facts

| Fact | Value | Status | Source | Where it lives |
| --- | --- | --- | --- | --- |
| Business name | THE RED HAIR FAMILY SALON | Reported | Project brief (Google listing name) | `src/data/business.ts → name` |
| Area | Bharhut Nagar | Reported | Project brief | `business.address.area` |
| City / State | Satna, Madhya Pradesh | Reported | Project brief | `business.address` |
| Landmark | Opposite Prithviraj Studio | Reported | Project brief | `business.address.line1` |
| PIN code | 485001 | Reported | Project brief. Confirm; Satna has more than one PIN code. | `business.address.postalCode` |
| Google rating | 4.9 / 5 | Reported (as of Sep 2026) | Project brief, Google Business Profile | `business.rating.value` |
| Google review count | 223 (shown as "223+") | Reported (as of Sep 2026) | Project brief, Google Business Profile | `business.rating.count` |
| Business type | Family salon (from the name) | Reported | Business name | Used in positioning copy |
| WhatsApp number | +91 90692 54035 | Reported | Shared by Praveen, 15 Sep 2026. Confirm it is the salon's enquiry number. | `business.contact.whatsapp` |

## Unknown (hidden on the site)

| Item | How the site handles it |
| --- | --- |
| Phone number | Call buttons hidden. The mobile bar shows **Directions** instead. |
| Instagram / Facebook | Not shown. |
| Exact Google Maps link | Directions use a Google Maps **search** for the name and address. No place ID or coordinates were invented. |
| Opening hours | Section hidden. |
| Logo | A text wordmark is used. |
| Owner / staff names, experience, awards | Not mentioned anywhere. |
| Prices | Not shown. |

## Demo content (on the site, must be replaced)

| Content | File |
| --- | --- |
| Tagline "Your Style. Your Confidence." | `src/data/business.ts` |
| Short description | `src/data/business.ts` |
| Hero service words (Hair • Beauty • Grooming • Bridal) | `src/data/business.ts` |
| All 12 services and descriptions | `src/data/services.ts` |
| Featured services (Colour, Care, Bridal) | `src/data/services.ts` |
| "Why visit us" copy (except the rating and location) | `src/data/highlights.ts` |
| Appointment steps copy ("The salon gets back to you…") | `src/components/AppointmentSection.tsx` |
| All photographs (stock, see credits below) | `public/images/` |

## Deliberately not claimed

- "Best salon in Satna", years of experience, customer counts, satisfaction percentages
- Customer testimonials. `src/data/reviews.ts` is empty on purpose.
- Before/after results
- Certifications, brands used, awards

## Stock photography credits

Every photo in `public/images/` is a temporary stock image, free to use under the
[Unsplash License](https://unsplash.com/license) or the [Pexels License](https://www.pexels.com/license/).
They show **other people and places, not this salon**, and must not be presented as
the salon's work. Photos credited to other named salons were intentionally excluded.

| File | Photographer | Source |
| --- | --- | --- |
| hero.jpg | Farhad Ibrahimzade | Unsplash |
| salon-interior.jpg | Benyamin Bohlouli | Unsplash |
| og-image.jpg | Benyamin Bohlouli (crop of salon-interior.jpg) | Unsplash |
| service-hair.jpg | Adam Winger | Unsplash |
| service-beauty.jpg | Tima Miroshnichenko | Pexels |
| service-bridal.jpg | Guru Bagul | Pexels |
| featured-hair-colour.jpg | cottonbro studio | Pexels |
| featured-hair-treatment.jpg | Lindsay Cash | Unsplash |
| featured-bridal.jpg | Aastha Karan Singh | Pexels |
| gallery-01.jpg | Fahad Puthawala | Pexels |
| gallery-02.jpg | Guilherme Petri | Unsplash |
| gallery-03.jpg | Gulom Nazarov | Unsplash |
| gallery-04.jpg | Gustavo Fring | Pexels |
| gallery-05.jpg | SKG Photography | Unsplash |
| gallery-06.jpg | Jonathan Borba | Pexels |
| gallery-07.jpg | Kawê Rodrigues | Unsplash |
| gallery-08.jpg | Fahad Puthawala | Pexels |
| gallery-09.jpg | Adam Winger | Unsplash |
| gallery-10.jpg | cottonbro studio | Pexels |

Exact source links are stored next to each image in the `credit` field of the data files.
