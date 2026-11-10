import type { Highlight, ImageAsset, Rating } from "@/data/types";
import { Icon, type IconName } from "./ui/Icon";
import { SalonImage } from "./ui/SalonImage";
import { SectionHeading } from "./ui/SectionHeading";
import { Stars } from "./ui/Stars";

interface WhyChooseUsProps {
  highlights: Highlight[];
  image: ImageAsset;
  rating: Rating | null;
}

const ICONS: Record<Highlight["icon"], IconName> = {
  star: "star",
  family: "family",
  sparkle: "sparkle",
  pin: "pin",
};

export function WhyChooseUs({ highlights, image, rating }: WhyChooseUsProps) {
  if (highlights.length === 0) return null;

  return (
    <section id="why" aria-labelledby="why-title" className="bg-sand/55 py-24 lg:py-36">
      <div className="container-page grid gap-16 lg:grid-cols-12 lg:items-center lg:gap-20">
        <div className="relative mr-6 sm:mr-12 lg:col-span-5 lg:mr-0">
          <div data-anim="curtain" className="relative aspect-[4/5] overflow-hidden bg-ink-soft">
            <SalonImage image={image} sizes="(min-width: 1024px) 38vw, 90vw" />
          </div>
          {rating ? (
            <div
              data-tone="dark"
              className="absolute -bottom-8 -right-6 bg-ink px-6 py-5 text-ivory shadow-2xl sm:-right-12 lg:-right-10"
            >
              <p className="headline text-5xl leading-none">
                <span data-count={rating.value.toFixed(1)}>{rating.value.toFixed(1)}</span>
              </p>
              <Stars value={rating.value} className="mt-3 text-gold" starClassName="size-3.5" />
              <p className="mt-2 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-mist">
                Google rating
              </p>
            </div>
          ) : null}
        </div>

        <div className="lg:col-span-7">
          <SectionHeading
            id="why-title"
            eyebrow="Why visit us"
            title={
              <>
                Made for you, <em>and your whole family</em>
              </>
            }
          />
          <ul className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2">
            {highlights.map((highlight) => (
              <li key={highlight.title} data-anim="rise" className="border-t border-ink/15 pt-6">
                <Icon name={ICONS[highlight.icon]} className="size-6 text-rouge" />
                <h3 className="headline mt-4 text-[1.65rem]">{highlight.title}</h3>
                <p className="mt-2 text-[0.94rem] leading-relaxed text-muted">{highlight.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
