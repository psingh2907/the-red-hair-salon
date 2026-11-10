import type { Address, Rating } from "@/data/types";
import { Icon } from "./ui/Icon";
import { Stars } from "./ui/Stars";
import { TrackedLink } from "./ui/TrackedLink";

interface SocialProofProps {
  rating: Rating | null;
  address: Address;
  reviewsUrl: string;
}

/** Rating and location strip shown in the hero's first view. */
export function SocialProof({ rating, address, reviewsUrl }: SocialProofProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-8 gap-y-5">
      {rating ? (
        <TrackedLink
          href={reviewsUrl}
          external
          track={{ event: "google_reviews_click", params: { location: "hero" } }}
          aria-label={`Rated ${rating.value.toFixed(1)} out of 5 from ${rating.count}+ Google reviews. Read reviews on Google`}
          className="group flex items-center gap-4"
        >
          <span className="headline text-[2.75rem] leading-none">
            <span data-count={rating.value.toFixed(1)}>{rating.value.toFixed(1)}</span>
            <span className="ml-1 font-sans text-sm font-medium text-ivory/60">/ 5</span>
          </span>
          <span className="flex flex-col gap-1.5">
            <Stars value={rating.value} className="text-gold" starClassName="size-3.5" />
            <span className="text-[0.78rem] font-medium text-ivory/80 underline-offset-4 group-hover:text-ivory group-hover:underline">
              {rating.count}+ Google Reviews
            </span>
          </span>
        </TrackedLink>
      ) : null}

      {rating ? <span aria-hidden className="hidden h-10 w-px bg-ivory/15 sm:block" /> : null}

      <p className="flex items-center gap-3 text-[0.78rem] font-medium text-ivory/80">
        <Icon name="pin" className="size-4 text-gold" />
        <span>
          {address.area} <span className="text-gold">•</span> {address.city}
        </span>
      </p>
    </div>
  );
}
