# Data Required Before Production

Collect these from the salon owner. Each item lists the file to update.
When everything in **Critical** is done, set `NEXT_PUBLIC_PROTOTYPE_MODE=false`
and run `pnpm build`. The build lists anything still missing.

## Critical (the production build fails without these)

- [ ] **Phone number** → `src/data/business.ts → contact.phone`
- [ ] **Confirm WhatsApp number**: +91 90692 54035 has been added; confirm with the owner that it receives enquiries → `contact.whatsapp`
- [ ] **Google Maps link** (Google Maps → the salon's listing → Share → Copy link) → `links.googleMaps`
- [ ] **Confirm the address**: landmark, area and PIN code → `address`, then set `status: "verified"`
- [ ] **Verified service list**: what the salon really offers → `src/data/services.ts`, each `status: "verified"`
- [ ] **Hero service words** (e.g. Hair • Beauty • Bridal) → `serviceHighlights`, `status: "verified"`
- [ ] **Salon photographs** replacing every stock image → `public/images/` (see below)
- [ ] **Live domain** → `NEXT_PUBLIC_SITE_URL`

## Important

- [ ] **Opening hours** for each day, including closed days → `business.hours`
- [ ] **Current Google rating and review count** → `business.rating` (update `asOf`)
- [ ] **Google reviews link** (optional; falls back to the Maps link) → `links.googleReviews`
- [ ] **Instagram URL** → `links.instagram`
- [ ] **Facebook URL** → `links.facebook`
- [ ] **Logo file** (SVG or high-resolution PNG) → replace the text wordmark in `src/components/Brand.tsx`
- [ ] **Brand colours** from signage or logo → `src/app/globals.css` (`--color-rouge`, `--color-gold`)
- [ ] **Appointment process**: Who replies on WhatsApp? How fast? Are walk-ins welcome? Is advance booking needed for bridal? → update steps in `src/components/AppointmentSection.tsx`
- [ ] **Unisex / family positioning**: does the salon serve men, women and children? → `src/data/highlights.ts`
- [ ] **Tagline and description** approved by the owner → `business.tagline`, `business.description`

## Nice to have

- [ ] **Real customer reviews** the salon has permission to display, copied exactly → `src/data/reviews.ts`
- [ ] **Service descriptions in the owner's words**
- [ ] **Featured services** the owner most wants to promote → `featuredServices`
- [ ] **Hindi copy** for key sections, if the owner wants a bilingual site
- [ ] **Short name** the salon uses for itself (currently "The Red Hair") → `business.shortName`
- [ ] **Email address** → `contact.email`
- [ ] **Prices** (only if the owner wants them public; needs a small UI addition)

## Photographs needed

Ask for recent photos taken in good daylight, in landscape and portrait.
Get client consent for any photo showing a customer's face.

| Photo | Replaces | Notes |
| --- | --- | --- |
| Storefront / signage | — | Useful for the location section and Google |
| Salon interior (wide) | `salon-interior.jpg` | Shows the space, clean and bright |
| Stylist at work | `hero.jpg` | Portrait orientation works best |
| Hair service | `service-hair.jpg` | |
| Beauty / skin / nails | `service-beauty.jpg` | |
| Bridal work | `service-bridal.jpg`, `featured-bridal.jpg` | Only if bridal is offered |
| Colour work | `featured-hair-colour.jpg` | |
| Hair treatment / wash area | `featured-hair-treatment.jpg` | |
| 6–12 gallery photos | `gallery-01.jpg` … | The layout adapts to any number |

After replacing a photo, also update its `alt` text, remove its `credit`, and set
`status: "verified"` in the data file.

## Permissions

- [ ] Owner's approval to publish the website
- [ ] Consent from any customer shown in photos
- [ ] Permission to display any reviews added as cards
