import type { SalonData } from "@/data/types";
import type { ResolvedContact } from "@/lib/contact";
import { AppointmentSection } from "./AppointmentSection";
import { FeaturedServices } from "./FeaturedServices";
import { Footer } from "./Footer";
import { Gallery } from "./Gallery";
import { Hero } from "./Hero";
import { LocationSection } from "./LocationSection";
import { MobileActionBar } from "./MobileActionBar";
import { MotionEffects } from "./motion/MotionEffects";
import { type NavLink, Navbar } from "./Navbar";
import { Reviews } from "./Reviews";
import { Services } from "./Services";
import { WhyChooseUs } from "./WhyChooseUs";

interface SalonTemplateProps {
  data: SalonData;
  contact: ResolvedContact;
  prototypeMode: boolean;
}

/**
 * The complete one-page salon website. It knows nothing about a specific
 * business: everything comes from `data` and `contact`.
 *
 * Story order: who we are → why people trust us → what we offer →
 * what it looks like → proof → book → find us.
 */
export function SalonTemplate({ data, contact, prototypeMode }: SalonTemplateProps) {
  const { business } = data;
  const whatsappNumber = contact.whatsapp?.international ?? null;
  const hasReviews = Boolean(business.rating) || data.reviews.length > 0;

  const links: NavLink[] = [
    { href: "#top", label: "Home" },
    ...(data.serviceCategories.length ? [{ href: "#services", label: "Services" }] : []),
    ...(data.gallery.length ? [{ href: "#gallery", label: "Gallery" }] : []),
    ...(hasReviews ? [{ href: "#reviews", label: "Reviews" }] : []),
    { href: "#location", label: "Contact" },
  ];

  const allImages = [
    data.hero.image,
    data.hero.interior,
    ...data.serviceCategories.map((category) => category.image),
    ...data.featuredServices.map((item) => item.image),
    ...data.gallery.map((item) => item.image),
  ];
  const usesStockPhotos = allImages.some((image) => Boolean(image.credit));
  const galleryIsSample = data.gallery.some((item) => item.image.status !== "verified");

  return (
    <>
      <Navbar name={business.name} shortName={business.shortName} links={links} contact={contact} />
      <main id="main">
        <Hero business={business} media={data.hero} contact={contact} />
        <Services
          categories={data.serviceCategories}
          businessName={business.name}
          whatsappNumber={whatsappNumber}
        />
        <FeaturedServices
          items={data.featuredServices}
          businessName={business.name}
          whatsappNumber={whatsappNumber}
        />
        <Gallery items={data.gallery} showSampleNote={prototypeMode && galleryIsSample} />
        <WhyChooseUs highlights={data.highlights} image={data.hero.interior} rating={business.rating} />
        <Reviews rating={business.rating} reviews={data.reviews} reviewsUrl={contact.reviewsUrl} />
        <AppointmentSection
          categories={data.serviceCategories}
          businessName={business.name}
          contact={contact}
          prototypeMode={prototypeMode}
        />
        <LocationSection business={business} contact={contact} />
      </main>
      <Footer business={business} contact={contact} links={links} showPhotoCredit={usesStockPhotos} />
      <MobileActionBar businessName={business.name} contact={contact} />
      <MotionEffects />
    </>
  );
}
