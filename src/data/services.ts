import type { FeaturedService, ServiceCategory } from "./types";

/**
 * SERVICES
 *
 * ⚠ DEMO CONTENT. These services are prototype placeholders, not the
 * salon's confirmed menu. Replace names and descriptions with what the
 * salon actually offers, then set each `status` to "verified".
 *
 * Prices are intentionally not shown. To add them later, extend the
 * `Service` type in ./types.ts.
 *
 * Images: see public/images/. Temporary stock photos carry a `credit`.
 */
export const serviceCategories: ServiceCategory[] = [
  {
    id: "hair",
    name: "Hair",
    summary: "Cuts, colour and care",
    image: {
      src: "/images/service-hair.jpg",
      alt: "Stylist blow-drying a client's shoulder-length hair with a round brush",
      position: "50% 40%",
      credit: { author: "Adam Winger", source: "Unsplash", url: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f" },
      status: "demo",
    },
    services: [
      {
        id: "haircut",
        name: "Haircut",
        description: "A cut shaped around your face, your hair type and the way you style it every day.",
        status: "demo",
      },
      {
        id: "hair-styling",
        name: "Hair Styling",
        description: "Blow-dries, curls and occasion styles that stay in place through the day.",
        status: "demo",
      },
      {
        id: "hair-colour",
        name: "Hair Colour",
        description: "From a subtle refresh to a complete change, planned around your skin tone.",
        status: "demo",
      },
      {
        id: "hair-treatments",
        name: "Hair Treatments",
        description: "Care-focused treatments for hair that feels dry, dull or damaged.",
        status: "demo",
      },
    ],
  },
  {
    id: "beauty",
    name: "Beauty",
    summary: "Skin, hands and grooming",
    image: {
      src: "/images/service-beauty.jpg",
      alt: "Therapist giving a relaxing facial massage in a softly lit room",
      position: "50% 50%",
      credit: { author: "Tima Miroshnichenko", source: "Pexels", url: "https://www.pexels.com/photo/6187305/" },
      status: "demo",
    },
    services: [
      {
        id: "facial",
        name: "Facial",
        description: "A relaxing facial chosen for your skin type and the occasion.",
        status: "demo",
      },
      {
        id: "skin-care",
        name: "Skin Care",
        description: "Treatments that leave skin looking fresh, clean and cared for.",
        status: "demo",
      },
      {
        id: "manicure",
        name: "Manicure",
        description: "Shaped, cleaned and polished nails, with care for your hands.",
        status: "demo",
      },
      {
        id: "pedicure",
        name: "Pedicure",
        description: "A soothing refresh for tired feet, finished neatly.",
        status: "demo",
      },
      {
        id: "grooming",
        name: "Grooming",
        description: "Neat, polished everyday grooming for everyone in the family.",
        status: "demo",
      },
    ],
  },
  {
    id: "bridal",
    name: "Bridal",
    summary: "For the wedding and every function",
    image: {
      src: "/images/service-bridal.jpg",
      alt: "Makeup artist applying makeup to a bride in a red and blue saree",
      position: "50% 35%",
      credit: { author: "Guru Bagul", source: "Pexels", url: "https://www.pexels.com/photo/19679199/" },
      status: "demo",
    },
    services: [
      {
        id: "bridal-makeup",
        name: "Bridal Makeup",
        description: "Makeup planned with the bride around her outfit, jewellery and ceremony.",
        status: "demo",
      },
      {
        id: "bridal-hair",
        name: "Bridal Hair Styling",
        description: "Buns, braids and styles made to hold dupattas, flowers and jewellery.",
        status: "demo",
      },
      {
        id: "wedding-grooming",
        name: "Wedding Grooming",
        description: "Looking sharp for the big day, for the groom and the wedding party.",
        status: "demo",
      },
    ],
  },
];

/**
 * FEATURED SERVICES — higher-value services promoted in the editorial section.
 * `serviceId` must match an id above.
 */
export const featuredServices: FeaturedService[] = [
  {
    id: "featured-colour",
    eyebrow: "Colour",
    title: "Colour that suits you",
    description: "Rich tones, soft highlights or a fresh change, chosen with you, not for you.",
    serviceId: "hair-colour",
    image: {
      src: "/images/featured-hair-colour.jpg",
      alt: "Colourist measuring hair colour into a mixing bowl",
      position: "50% 60%",
      credit: { author: "cottonbro studio", source: "Pexels", url: "https://www.pexels.com/photo/3993132/" },
      status: "demo",
    },
  },
  {
    id: "featured-treatment",
    eyebrow: "Care",
    title: "Hair that feels healthy again",
    description: "Treatments focused on softness, shine and hair that is easier to manage.",
    serviceId: "hair-treatments",
    image: {
      src: "/images/featured-hair-treatment.jpg",
      alt: "Client relaxing at a wash basin while her hair is rinsed",
      position: "40% 50%",
      credit: { author: "Lindsay Cash", source: "Unsplash", url: "https://images.unsplash.com/photo-1634449571010-02389ed0f9b0" },
      status: "demo",
    },
  },
  {
    id: "featured-bridal",
    eyebrow: "Bridal",
    title: "Ready for your big day",
    description: "Hair and makeup planned around your outfit, your jewellery and your ceremony.",
    serviceId: "bridal-makeup",
    image: {
      src: "/images/featured-bridal.jpg",
      alt: "Bride in a red lehenga and gold jewellery having her hair finished",
      position: "50% 30%",
      credit: { author: "Aastha Karan Singh", source: "Pexels", url: "https://www.pexels.com/photo/2218558/" },
      status: "demo",
    },
  },
];
