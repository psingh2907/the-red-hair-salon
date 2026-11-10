import type { Rating, Review } from "@/data/types";
import { formatMonthYear } from "@/lib/format";
import { Button } from "./ui/Button";
import { Stars } from "./ui/Stars";

interface ReviewsProps {
  rating: Rating | null;
  reviews: Review[];
  reviewsUrl: string;
}

export function Reviews({ rating, reviews, reviewsUrl }: ReviewsProps) {
  if (!rating && reviews.length === 0) return null;
  const asOf = rating ? formatMonthYear(rating.asOf) : "";

  return (
    <section
      id="reviews"
      data-tone="dark"
      aria-labelledby="reviews-title"
      className="relative isolate overflow-hidden bg-rouge-deep py-24 text-ivory lg:py-36"
    >
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 -z-10 size-[44rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/15"
      />
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 -z-10 size-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/10"
      />

      <div className="container-page text-center">
        <div data-anim="heading">
        <p className="eyebrow flex items-center justify-center gap-3 text-gold">
          <span aria-hidden className="h-px w-7 bg-current opacity-70" />
          Reviews
          <span aria-hidden className="h-px w-7 bg-current opacity-70" />
        </p>
        <h2 id="reviews-title" className="headline mt-5 text-[2.75rem] sm:text-6xl lg:text-7xl">
          Loved by <em className="italic text-gold">Satna</em>
        </h2>
        </div>

        {rating ? (
          <div data-anim="fade" className="mt-12 flex flex-col items-center">
            <p className="headline text-[6.5rem] leading-[0.9] sm:text-[9rem]">
              <span data-count={rating.value.toFixed(1)}>{rating.value.toFixed(1)}</span>
              <span className="ml-3 font-sans text-2xl font-medium text-ivory/70 sm:text-3xl">/ 5</span>
            </p>
            <Stars value={rating.value} className="mt-6 text-gold" starClassName="size-6" />
            <p className="mt-5 text-[0.8rem] font-semibold uppercase tracking-[0.24em]">
              {rating.count}+ Google Reviews
            </p>
            {asOf ? <p className="mt-2 text-xs text-ivory/70">As shown on Google, {asOf}</p> : null}
          </div>
        ) : null}

        {reviews.length > 0 ? (
          <ul className="mt-16 grid gap-4 text-left md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => (
              <li key={`${review.author}-${review.date}`}>
                <figure className="flex h-full flex-col border border-ivory/15 bg-ink/20 p-7">
                  <Stars value={review.rating} className="text-gold" starClassName="size-3.5" />
                  <blockquote className="mt-5 flex-1 text-[0.98rem] leading-relaxed text-ivory/90">
                    “{review.text}”
                  </blockquote>
                  <figcaption className="mt-6 text-sm">
                    <span className="font-semibold">{review.author}</span>
                    <span className="text-ivory/70">
                      {" "}
                      · {review.source} · {review.date}
                    </span>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        ) : null}

        <Button
          href={reviewsUrl}
          external
          variant="light"
          size="lg"
          icon="arrow-up-right"
          iconPosition="end"
          className="mt-12"
          track={{ event: "google_reviews_click", params: { location: "reviews" } }}
        >
          See Reviews on Google
        </Button>
      </div>
    </section>
  );
}
