import Image from "next/image";
import type { ImageAsset } from "@/data/types";
import { cn } from "@/lib/cn";

interface SalonImageProps {
  image: ImageAsset;
  /** Responsive `sizes` hint; required because images fill their container. */
  sizes: string;
  fit?: "cover" | "contain";
  className?: string;
  eager?: boolean;
}

/**
 * Fills its (relatively positioned) parent. If the file is missing,
 * a quiet branded placeholder is rendered instead of a broken image.
 */
export function SalonImage({ image, sizes, fit = "cover", className, eager }: SalonImageProps) {
  if (!image.src) {
    return (
      <div
        role="img"
        aria-label={image.alt}
        className={cn("absolute inset-0 flex items-end bg-ink-soft p-5", className)}
      >
        <span className="eyebrow text-mist/70">Photo coming soon</span>
      </div>
    );
  }

  return (
    <Image
      src={image.src}
      alt={image.alt}
      fill
      sizes={sizes}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : "auto"}
      className={cn(fit === "cover" ? "object-cover" : "object-contain", className)}
      style={{ objectPosition: image.position ?? "center" }}
    />
  );
}
