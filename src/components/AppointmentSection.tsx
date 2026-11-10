import type { ServiceCategory } from "@/data/types";
import type { ResolvedContact } from "@/lib/contact";
import { buildWhatsAppUrl, createGeneralEnquiryMessage } from "@/lib/whatsapp";
import { AppointmentForm } from "./AppointmentForm";
import { Button } from "./ui/Button";
import { SectionHeading } from "./ui/SectionHeading";

interface AppointmentSectionProps {
  categories: ServiceCategory[];
  businessName: string;
  contact: ResolvedContact;
  prototypeMode: boolean;
}

const STEPS = [
  { title: "Share your details", body: "Pick a service and a day that suits you." },
  { title: "Continue on WhatsApp", body: "Your enquiry opens in WhatsApp, ready to send." },
  { title: "Plan your visit", body: "The salon gets back to you to confirm the details." },
];

export function AppointmentSection({ categories, businessName, contact, prototypeMode }: AppointmentSectionProps) {
  const serviceGroups = categories.map((category) => ({
    label: category.name,
    options: category.services.map((service) => ({ id: service.id, name: service.name })),
  }));

  return (
    <section id="book" aria-labelledby="book-title" className="bg-ivory py-24 lg:py-36">
      <div className="container-page grid gap-14 lg:grid-cols-12 lg:gap-20">
        <div className="lg:col-span-5">
          <SectionHeading
            id="book-title"
            eyebrow="Appointments"
            title={
              <>
                Ready for your <em>next look?</em>
              </>
            }
            intro="Tell us what you're looking for and we'll help you plan your visit."
          />

          <ol className="mt-10 space-y-6">
            {STEPS.map((step, index) => (
              <li key={step.title} className="flex gap-5">
                <span aria-hidden className="headline w-8 shrink-0 text-[1.7rem] leading-none text-rouge">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="font-semibold">{step.title}</p>
                  <p className="mt-1 text-[0.92rem] text-muted">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-12 border-t border-ink/10 pt-8">
            <p className="eyebrow text-muted">Prefer to reach us directly?</p>
            <div className="mt-5 flex flex-wrap gap-3">
              {contact.whatsapp ? (
                <Button
                  href={buildWhatsAppUrl(contact.whatsapp.international, createGeneralEnquiryMessage(businessName))}
                  external
                  variant="outline-dark"
                  icon="whatsapp"
                  track={{ event: "whatsapp_click", params: { location: "booking" } }}
                >
                  WhatsApp
                </Button>
              ) : null}
              {contact.phone ? (
                <Button
                  href={contact.phone.href}
                  variant="outline-dark"
                  icon="phone"
                  track={{ event: "call_click", params: { location: "booking" } }}
                >
                  Call
                </Button>
              ) : null}
              <Button
                href={contact.directionsUrl}
                external
                variant="outline-dark"
                icon="navigation"
                track={{ event: "directions_click", params: { location: "booking" } }}
              >
                Directions
              </Button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <AppointmentForm
            serviceGroups={serviceGroups}
            businessName={businessName}
            whatsappNumber={contact.whatsapp?.international ?? null}
            phone={contact.phone ? { href: contact.phone.href, display: contact.phone.display } : null}
            prototypeMode={prototypeMode}
          />
        </div>
      </div>
    </section>
  );
}
