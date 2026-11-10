import { splitBrandName } from "@/lib/format";
import { cn } from "@/lib/cn";

interface BrandProps {
  name: string;
  shortName: string;
  size?: "sm" | "lg";
  className?: string;
}

/** Text wordmark. Replace with the salon's logo file once supplied. */
export function Brand({ name, shortName, size = "sm", className }: BrandProps) {
  const { primary, secondary } = splitBrandName(name, shortName);
  return (
    <span className={cn("flex flex-col leading-none", className)}>
      <span className={cn("headline", size === "sm" ? "text-[1.45rem]" : "text-[2.2rem]")}>{primary}</span>
      {secondary ? (
        <span
          className={cn(
            "mt-1.5 font-semibold uppercase text-gold",
            size === "sm" ? "text-[0.55rem] tracking-[0.42em]" : "text-[0.68rem] tracking-[0.45em]",
          )}
        >
          {secondary}
        </span>
      ) : null}
    </span>
  );
}
