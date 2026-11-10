"use client";

import { trackEvent } from "@/lib/analytics";
import { requestBooking } from "@/lib/booking";
import { cn } from "@/lib/cn";
import { buildWhatsAppUrl, createServiceEnquiryMessage } from "@/lib/whatsapp";
import { Icon } from "./Icon";
import { TrackedLink } from "./TrackedLink";

interface EnquireButtonProps {
  serviceId: string;
  serviceName: string;
  businessName: string;
  /** International digits, or null when WhatsApp isn't configured. */
  whatsappNumber: string | null;
  tone?: "light" | "dark";
  className?: string;
}

/**
 * Opens a pre-written WhatsApp enquiry for a service. Without a WhatsApp
 * number it pre-selects the service in the booking form instead.
 */
export function EnquireButton({
  serviceId,
  serviceName,
  businessName,
  whatsappNumber,
  tone = "light",
  className,
}: EnquireButtonProps) {
  const classes = cn(
    "group/enquire inline-flex items-center gap-2 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.15em] transition-colors duration-300",
    tone === "dark" ? "text-gold hover:text-ivory" : "text-rouge hover:text-rouge-deep",
    className,
  );

  if (whatsappNumber) {
    return (
      <TrackedLink
        href={buildWhatsAppUrl(whatsappNumber, createServiceEnquiryMessage(serviceName, businessName))}
        external
        aria-label={`Enquire about ${serviceName} on WhatsApp`}
        onClick={() => trackEvent("whatsapp_click", { location: "service", service: serviceId })}
        track={{ event: "service_enquiry", params: { service: serviceId, channel: "whatsapp" } }}
        className={classes}
      >
        <Icon name="whatsapp" className="size-4" />
        Enquire on WhatsApp
        <Icon
          name="arrow-up-right"
          className="size-3.5 transition-transform duration-300 group-hover/enquire:-translate-y-0.5 group-hover/enquire:translate-x-0.5"
        />
      </TrackedLink>
    );
  }

  return (
    <button
      type="button"
      aria-label={`Enquire about ${serviceName}`}
      onClick={() => {
        trackEvent("service_enquiry", { service: serviceId, channel: "form" });
        requestBooking(serviceId);
      }}
      className={classes}
    >
      Enquire about this service
      <Icon
        name="arrow-right"
        className="size-3.5 transition-transform duration-300 group-hover/enquire:translate-x-0.5"
      />
    </button>
  );
}
