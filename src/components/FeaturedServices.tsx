import type { FeaturedService } from "@/data/types";
import { cn } from "@/lib/cn";
import { EnquireButton } from "./ui/EnquireButton";
import { SalonImage } from "./ui/SalonImage";
import { SectionHeading } from "./ui/SectionHeading";

interface FeaturedServicesProps {
  items: FeaturedService[];
  businessName: string;
  whatsappNumber: string | null;
}

export function FeaturedServices({ items, businessName, whatsappNumber }: FeaturedServicesProps) {
  if (items.length === 0) return null;

  return (
    <section
      id="featured"
      data-tone="dark"
      aria-labelledby="featured-title"
      className="overflow-hidden bg-ink py-24 text-ivory lg:py-36"
    >
      <div className="container-page">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            id="featured-title"
            tone="dark"
            eyebrow="Signature services"
            title={
              <>
                Transform <em>your look</em>
              </>
            }
          />
          <p className="max-w-sm text-[0.95rem] leading-relaxed text-mist lg:pb-2">
            Some changes deserve more than a quick visit. Tell us what you have in mind and plan it with us.
          </p>
        </div>

        <ul className="no-scrollbar -mx-5 mt-12 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-2 md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 lg:mt-20 lg:gap-10">
          {items.map((item, index) => (
            <li
              key={item.id}
              data-speed={[6, -4, 8][index % 3]}
              className={cn("w-[84%] shrink-0 snap-start sm:w-[60%] md:w-auto", index === 1 && "md:mt-24")}
            >
              <article data-anim="rise" className="group">
                <div data-anim="curtain" className="relative aspect-[3/4] overflow-hidden bg-ink-soft">
                  <SalonImage
                    image={item.image}
                    sizes="(min-width: 768px) 32vw, 84vw"
                    className="transition-transform duration-[1.4s] ease-soft group-hover:scale-[1.045]"
                  />
                  <span className="absolute left-4 top-4 bg-ink/70 px-2.5 py-1.5 text-[0.66rem] font-semibold tracking-[0.2em] text-ivory backdrop-blur-sm">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <p className="eyebrow mt-7 text-gold">{item.eyebrow}</p>
                <h3 className="headline mt-3 text-[2.05rem]">{item.title}</h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-mist">{item.description}</p>
                <EnquireButton
                  serviceId={item.serviceId}
                  serviceName={item.eyebrow}
                  businessName={businessName}
                  whatsappNumber={whatsappNumber}
                  tone="dark"
                  className="mt-4"
                />
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
