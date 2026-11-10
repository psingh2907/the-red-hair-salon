import type { Service } from "@/data/types";
import { EnquireButton } from "./ui/EnquireButton";

interface ServiceCardProps {
  service: Service;
  index: number;
  businessName: string;
  whatsappNumber: string | null;
}

export function ServiceCard({ service, index, businessName, whatsappNumber }: ServiceCardProps) {
  return (
    <article className="group grid grid-cols-[2.25rem_1fr] gap-x-4 border-b border-ink/10 py-6 sm:grid-cols-[3rem_1fr_auto] sm:items-center sm:gap-x-6 lg:py-7">
      <span aria-hidden className="pt-1.5 text-[0.7rem] font-semibold tracking-[0.2em] text-muted sm:pt-0">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div>
        <h4 className="headline text-[1.7rem] transition-colors duration-300 group-hover:text-rouge">
          {service.name}
        </h4>
        <p className="mt-1.5 max-w-md text-[0.94rem] leading-relaxed text-muted">{service.description}</p>
      </div>
      <EnquireButton
        serviceId={service.id}
        serviceName={service.name}
        businessName={businessName}
        whatsappNumber={whatsappNumber}
        className="col-start-2 mt-3 justify-self-start sm:col-start-3 sm:mt-0"
      />
    </article>
  );
}
