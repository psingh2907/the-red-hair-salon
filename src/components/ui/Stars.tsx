import { cn } from "@/lib/cn";
import { Icon } from "./Icon";

interface StarsProps {
  value: number;
  className?: string;
  starClassName?: string;
}

/** Five stars filled proportionally to `value` (e.g. 4.9 fills 98%). */
export function Stars({ value, className, starClassName = "size-4" }: StarsProps) {
  const safeValue = Number.isFinite(value) ? Math.min(5, Math.max(0, value)) : 0;
  const percent = (safeValue / 5) * 100;
  const row = (
    <>
      {Array.from({ length: 5 }, (_, index) => (
        <Icon key={index} name="star" className={cn("shrink-0", starClassName)} />
      ))}
    </>
  );

  return (
    <span
      data-stars
      role="img"
      aria-label={`Rated ${safeValue.toFixed(1)} out of 5`}
      className={cn("relative inline-flex", className)}
    >
      <span className="flex gap-0.5 opacity-25">{row}</span>
      <span className="absolute inset-y-0 left-0 flex gap-0.5 overflow-hidden" style={{ width: `${percent}%` }}>
        {row}
      </span>
    </span>
  );
}
