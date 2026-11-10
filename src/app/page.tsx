import { SalonTemplate } from "@/components/SalonTemplate";
import { StructuredData } from "@/components/StructuredData";
import { siteConfig } from "@/config/site";
import { resolveContact } from "@/lib/contact";
import { loadSalon } from "@/lib/salon";

export default function Home() {
  const data = loadSalon();
  const contact = resolveContact(data.business, siteConfig);

  return (
    <>
      <StructuredData data={data} contact={contact} siteUrl={siteConfig.url} />
      <SalonTemplate data={data} contact={contact} prototypeMode={siteConfig.prototypeMode} />
    </>
  );
}
