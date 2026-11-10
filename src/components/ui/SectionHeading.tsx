import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface SectionHeadingProps {
  id: string;
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  tone?: "light" | "dark";
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  intro,
  tone = "light",
  align = "left",
  className,
}: SectionHeadingProps) {
  const dark = tone === "dark";
  return (
    <div data-anim="heading" className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      <p
        className={cn(
          "eyebrow flex items-center gap-3",
          align === "center" && "justify-center",
          dark ? "text-gold" : "text-rouge",
        )}
      >
        <span aria-hidden className="h-px w-7 bg-current opacity-70" />
        {eyebrow}
      </p>
      <h2
        id={id}
        className={cn(
          "headline mt-5 text-[2.5rem] sm:text-5xl lg:text-[3.6rem] [&_em]:italic",
          dark ? "text-ivory [&_em]:text-gold" : "text-ink [&_em]:text-rouge",
        )}
      >
        {title}
      </h2>
      {intro ? (
        <p className={cn("mt-5 text-[0.95rem] leading-relaxed sm:text-base", dark ? "text-mist" : "text-muted")}>
          {intro}
        </p>
      ) : null}
    </div>
  );
}
