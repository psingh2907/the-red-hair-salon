# THE RED HAIR FAMILY SALON — Website Prototype

A mobile-first, one-page website prototype for THE RED HAIR FAMILY SALON,
Bharhut Nagar, Satna (Madhya Pradesh). It shows how the salon's existing
Google reputation can become a direct source of enquiries: **discover → trust →
explore → see the work → book on WhatsApp → visit**.

> **Prototype status.** Services, copy and all photographs are placeholders.
> Unknown details (phone, WhatsApp, hours, social links) are hidden, never
> invented. See [docs/data-needed.md](docs/data-needed.md) and
> [docs/business-research.md](docs/business-research.md).

Built with Next.js 16 (App Router), React 19, TypeScript and Tailwind CSS 4.
No backend, no database and no API keys.

---

## 1. Run the project

Requires Node.js 20+ and pnpm.

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

Other scripts:

```bash
pnpm lint         # ESLint
pnpm build        # production build (also runs the data check)
pnpm start        # serve the production build
```

### Environment variables

Copy `.env.example` to `.env.local`:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_PROTOTYPE_MODE` | `true` (default) allows placeholders and hides the site from search engines. `false` = production: the build fails if critical data is missing. |
| `NEXT_PUBLIC_SITE_URL` | Live URL, used for canonical links, Open Graph and structured data. |
| `NEXT_PUBLIC_DEMO_WHATSAPP` | **Prototype only.** A WhatsApp number you own, so the booking flow works live during a demo. |
| `NEXT_PUBLIC_DEMO_PHONE` | **Prototype only.** A demo number for the Call buttons. |

**Tip for the sales demo:** set `NEXT_PUBLIC_DEMO_WHATSAPP` to your own number,
restart `pnpm dev`, and have the owner fill in the booking form on their phone.
The enquiry arrives in your WhatsApp.

---

## 2. Where to change things

You never need to edit components to change business information.

| What | File |
| --- | --- |
| **Name, tagline, description** | `src/data/business.ts` |
| **Phone** | `src/data/business.ts → contact.phone` |
| **WhatsApp** | `src/data/business.ts → contact.whatsapp` |
| **Address** | `src/data/business.ts → address` |
| **Google rating** | `src/data/business.ts → rating` (set to `null` to hide) |
| **Google Maps** | `src/data/business.ts → links.googleMaps` |
| **Google reviews link** | `src/data/business.ts → links.googleReviews` |
| **Instagram / Facebook** | `src/data/business.ts → links.instagram / links.facebook` |
| **Opening hours** | `src/data/business.ts → hours` |
| **Services** | `src/data/services.ts` |
| **Featured services** | `src/data/services.ts → featuredServices` |
| **Gallery** | `src/data/gallery.ts` |
| **Hero and interior photos** | `src/data/media.ts` |
| **"Why visit us" points** | `src/data/highlights.ts` |
| **Reviews** | `src/data/reviews.ts` |
| **Image files** | `public/images/` |
| **Colours and fonts** | `src/app/globals.css`, `src/app/layout.tsx` |

Unknown values are written as placeholders like `"{{PHONE_NUMBER}}"`. Anything
still a placeholder is hidden automatically, so the site never shows
`undefined`, `null` or a broken link.

### Replace business information

Edit `src/data/business.ts`. When a fact is confirmed with the owner, change its
`status` from `"reported"` or `"demo"` to `"verified"`.

### Configure WhatsApp

```ts
contact: {
  whatsapp: "+91 98765 43210", // any format; +91 optional
}
```

- All WhatsApp buttons open `wa.me` with a pre-written message.
- The booking form builds its message with `createWhatsAppMessage()` in `src/lib/whatsapp.ts`.
- Until a number is set, WhatsApp buttons scroll to the form, and the form shows a message preview with a copy button.

### Configure phone

```ts
contact: { phone: "98765 43210" }
```

Call buttons appear automatically. Without a phone number, the mobile action bar shows **Directions** instead of **Call**.

### Configure Google Maps

1. Open the salon's listing in Google Maps.
2. Tap **Share → Copy link**.
3. Paste it into `links.googleMaps`.

Until then, **Get Directions** opens a Google Maps search for the salon's name and address. No coordinates or place ID are guessed. Only `https://` links are accepted.

### Configure social accounts

Paste full `https://` URLs into `links.instagram` and `links.facebook`. Links appear in the footer only when set.

### Update services

Edit `src/data/services.ts`. Each category has an `image` and a list of `services` (`id`, `name`, `description`, `status`). The booking form's dropdown updates automatically. If you rename or remove a service, update `serviceId` in `featuredServices` too.

### Update reviews

`src/data/reviews.ts` is empty on purpose. While it's empty, the Reviews section shows the Google rating summary. Add only real reviews, word for word, with permission. They then appear as cards automatically.

### Replace images

1. Put the new photo in `public/images/`. Keeping the same file name is easiest. Aim for at least 1600px on the long side, as JPG.
2. In the matching data file, update `alt` to describe the new photo, delete the `credit` line, and set `status: "verified"`.
3. Optionally adjust `position` (e.g. `"50% 30%"`) to control cropping.

Next.js generates responsive WebP versions automatically. If a file is missing, a neutral "Photo coming soon" panel appears instead of a broken image.

| File | Used in |
| --- | --- |
| `hero.jpg` | Hero |
| `salon-interior.jpg` | Hero inset (large screens), Why visit us |
| `service-hair.jpg`, `service-beauty.jpg`, `service-bridal.jpg` | Services tabs |
| `featured-*.jpg` | Transform your look |
| `gallery-01.jpg` … `gallery-10.jpg` | Gallery |
| `og-image.jpg` (1200×630) | Social share preview |

---

## 3. Prototype mode vs production

`NEXT_PUBLIC_PROTOTYPE_MODE=true` (default):

- placeholders and stock photos are allowed
- demo contact numbers from `.env.local` are used
- the page is `noindex` and `robots.txt` blocks crawlers
- a small "Sample imagery" note appears under the gallery

`NEXT_PUBLIC_PROTOTYPE_MODE=false`:

- demo numbers are ignored
- `pnpm build` **fails** with a list of anything missing or unverified (see `src/lib/production-check.ts`)
- the site becomes indexable, with a sitemap

---

## 4. Deploy

The easiest option is **Vercel**:

1. Push the project to GitHub.
2. Import it at vercel.com → New Project. The framework is detected automatically.
3. Add the environment variables. For a private preview, keep prototype mode on.
4. Deploy, and share the preview URL with the owner.

For production: point the salon's domain to Vercel, set `NEXT_PUBLIC_SITE_URL`, set `NEXT_PUBLIC_PROTOTYPE_MODE=false`, and redeploy. Then submit `https://<domain>/sitemap.xml` in Google Search Console and add the website link to the Google Business Profile.

Any Node.js host that runs `pnpm build && pnpm start` also works.

---

## 5. Project structure

```text
src/
  app/
    layout.tsx            fonts, metadata, Open Graph, viewport
    page.tsx              loads data → renders the template
    globals.css           design tokens (colours, fonts, motion)
    robots.ts, sitemap.ts, icon.svg
  config/site.ts          prototype mode, site URL, demo numbers (env)
  data/                   ← all business content lives here
    business.ts  services.ts  gallery.ts  media.ts
    highlights.ts  reviews.ts  types.ts  index.ts
  lib/
    whatsapp.ts           createWhatsAppMessage(), buildWhatsAppUrl()
    validation.ts         phone validation, sanitising, form rules
    contact.ts            safe links: WhatsApp, tel:, Maps, socials
    analytics.ts          trackEvent() abstraction
    production-check.ts   production data validation
    salon.ts              server loader (missing-image handling)
    booking.ts            "enquire" → pre-select service in the form
  components/
    SalonTemplate.tsx     composes the page (business-agnostic)
    Navbar  Hero  SocialProof  Services  ServiceCard  FeaturedServices
    Gallery  WhyChooseUs  Reviews  AppointmentSection  AppointmentForm
    LocationSection  Footer  MobileActionBar  StructuredData  Brand
    ui/ Button  SectionHeading  Icon  Stars  SalonImage  TrackedLink  EnquireButton
docs/
  business-research.md    known facts, sources, verification status, photo credits
  data-needed.md          checklist for the owner meeting
```

To reuse the template for another business, replace `src/data/*` and `public/images/*`. No component changes are needed.

---

## 6. Analytics

`trackEvent(name, params)` in `src/lib/analytics.ts` is called for:
`whatsapp_click`, `call_click`, `directions_click`, `appointment_started`,
`appointment_submitted`, `appointment_validation_failed`, `google_reviews_click`,
`instagram_click`, `facebook_click`, `service_enquiry`, `gallery_open`.

No analytics platform is installed. In development, events are logged to the browser console. Add Google Analytics (`gtag`) or Google Tag Manager (`dataLayer`) to the layout later, and events are forwarded automatically.

---

## 7. SEO

- Title and description generated from `business.ts`
- Canonical URL, Open Graph and Twitter card metadata
- `BeautySalon` JSON-LD with only real, configured data. Demo numbers and stock photos are excluded, and `aggregateRating` is omitted (Google does not allow self-published ratings).
- Semantic HTML: one `h1`, ordered headings, landmarks, labelled form

---

## 8. Future production features (not built)

The structure leaves room for: a booking backend, Google Analytics / Search
Console, a CMS or admin dashboard (swap `src/data/*` for fetched data),
service pricing (extend `Service`), payments, a customer database, automated
WhatsApp confirmations (WhatsApp Business API), SEO landing pages per
service, and Google Business Profile review sync via a server route.
