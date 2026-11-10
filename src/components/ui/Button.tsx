"use client";

import type { MouseEvent, ReactNode } from "react";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { Icon, type IconName } from "./Icon";
import { type TrackOptions, TrackedLink } from "./TrackedLink";

type Variant = "primary" | "light" | "outline-light" | "outline-dark";
type Size = "md" | "lg";

interface CommonProps {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  icon?: IconName;
  /** Icon placement; trailing icons nudge on hover. */
  iconPosition?: "start" | "end";
  iconClassName?: string;
  fullWidth?: boolean;
  className?: string;
  track?: TrackOptions;
  /** Follows the mouse pointer slightly (see MotionEffects). */
  magnetic?: boolean;
}

interface LinkButtonProps extends CommonProps {
  href: string;
  external?: boolean;
  ariaLabel?: string;
}

interface ActionButtonProps extends CommonProps {
  href?: undefined;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

const VARIANTS: Record<Variant, string> = {
  primary: "bg-rouge text-ivory hover:bg-rouge-deep",
  light: "bg-ivory text-ink hover:bg-white",
  "outline-light": "border border-ivory/35 text-ivory hover:border-ivory hover:bg-ivory/[0.06]",
  "outline-dark": "border border-ink/25 text-ink hover:border-ink hover:bg-ink/[0.04]",
};

const SIZES: Record<Size, string> = {
  md: "h-11 px-5 text-[0.7rem]",
  lg: "h-[3.25rem] px-7 text-[0.74rem]",
};

export function Button(props: LinkButtonProps | ActionButtonProps) {
  const {
    children,
    variant = "primary",
    size = "md",
    icon,
    iconPosition = "start",
    iconClassName,
    fullWidth,
    className,
    track,
    magnetic,
  } = props;
  const magneticAttr = magnetic ? { "data-magnetic": "" } : {};

  const classes = cn(
    "group/button inline-flex items-center justify-center gap-2.5 rounded-[2px] font-semibold uppercase tracking-[0.15em] whitespace-nowrap",
    "transition-[background-color,border-color,color,transform] duration-300 ease-soft active:scale-[0.985]",
    "disabled:pointer-events-none disabled:opacity-50",
    VARIANTS[variant],
    SIZES[size],
    fullWidth && "w-full",
    className,
  );

  const iconNode = icon ? (
    <Icon
      name={icon}
      className={cn(
        "size-[1.05rem] shrink-0",
        iconPosition === "end" && "transition-transform duration-300 ease-soft group-hover/button:translate-x-0.5",
        iconClassName,
      )}
    />
  ) : null;

  const content = (
    <>
      {iconPosition === "start" && iconNode}
      <span>{children}</span>
      {iconPosition === "end" && iconNode}
    </>
  );

  if (props.href !== undefined) {
    return (
      <TrackedLink
        href={props.href}
        external={props.external}
        track={track}
        aria-label={props.ariaLabel}
        className={classes}
        {...magneticAttr}
      >
        {content}
      </TrackedLink>
    );
  }

  return (
    <button
      type={props.type ?? "button"}
      disabled={props.disabled}
      className={classes}
      {...magneticAttr}
      onClick={(event) => {
        if (track) trackEvent(track.event, track.params);
        props.onClick?.(event);
      }}
    >
      {content}
    </button>
  );
}
