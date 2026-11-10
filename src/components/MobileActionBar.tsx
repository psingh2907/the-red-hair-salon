import type { ResolvedContact } from "@/lib/contact";
import { cn } from "@/lib/cn";
import { buildWhatsAppUrl, createGeneralEnquiryMessage } from "@/lib/whatsapp";
import { Icon } from "./ui/Icon";
import { TrackedLink } from "./ui/TrackedLink";

interface MobileActionBarProps {
  businessName: string;
  contact: ResolvedContact;
}

const itemClass =
  "flex h-16 flex-col items-center justify-center gap-1 text-[0.64rem] font-semibold uppercase tracking-[0.16em] transition-colors active:bg-ivory/10";

/**
 * Fixed bottom actions on phones and tablets. Hidden from 1024px up.
 * If the salon has no phone number yet, "Call" becomes "Directions";
 * without WhatsApp, the WhatsApp action opens the booking form instead.
 */
export function MobileActionBar({ businessName, contact }: MobileActionBarProps) {
  const whatsappHref = contact.whatsapp
    ? buildWhatsAppUrl(contact.whatsapp.international, createGeneralEnquiryMessage(businessName))
    : "#book";

  return (
    <nav
      aria-label="Quick actions"
      data-tone="dark"
      className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-ivory/10 bg-ink/95 text-ivory backdrop-blur-md lg:hidden"
    >
      <ul className="grid grid-cols-3">
        <li>
          <TrackedLink
            href={whatsappHref}
            external={Boolean(contact.whatsapp)}
            track={{ event: "whatsapp_click", params: { location: "action_bar" } }}
            className={itemClass}
          >
            <Icon name="whatsapp" className="size-5 text-whatsapp" />
            WhatsApp
          </TrackedLink>
        </li>
        <li className="border-x border-ivory/10">
          {contact.phone ? (
            <TrackedLink
              href={contact.phone.href}
              track={{ event: "call_click", params: { location: "action_bar" } }}
              className={itemClass}
            >
              <Icon name="phone" className="size-5 text-gold" />
              Call
            </TrackedLink>
          ) : (
            <TrackedLink
              href={contact.directionsUrl}
              external
              track={{ event: "directions_click", params: { location: "action_bar" } }}
              className={itemClass}
            >
              <Icon name="navigation" className="size-5 text-gold" />
              Directions
            </TrackedLink>
          )}
        </li>
        <li>
          <a href="#book" className={cn(itemClass, "bg-rouge active:bg-rouge-deep")}>
            <Icon name="calendar" className="size-5" />
            Book
          </a>
        </li>
      </ul>
    </nav>
  );
}
