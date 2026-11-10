"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/cn";
import type { ResolvedContact } from "@/lib/contact";
import { buildWhatsAppUrl, createGeneralEnquiryMessage } from "@/lib/whatsapp";
import { Brand } from "./Brand";
import { Button } from "./ui/Button";
import { Icon } from "./ui/Icon";

export interface NavLink {
  href: string;
  label: string;
}

interface NavbarProps {
  name: string;
  shortName: string;
  links: NavLink[];
  contact: ResolvedContact;
}

function subscribeToScroll(callback: () => void) {
  window.addEventListener("scroll", callback, { passive: true });
  return () => window.removeEventListener("scroll", callback);
}

export function Navbar({ name, shortName, links, contact }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const scrolled = useSyncExternalStore(
    subscribeToScroll,
    () => window.scrollY > 24,
    () => false,
  );

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    firstLinkRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onResize = () => {
      if (window.matchMedia("(min-width: 1024px)").matches) setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
    return () => {
      root.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  const whatsappHref = contact.whatsapp
    ? buildWhatsAppUrl(contact.whatsapp.international, createGeneralEnquiryMessage(name))
    : null;

  return (
    <header
      data-tone="dark"
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b text-ivory transition-[background-color,border-color,backdrop-filter] duration-500",
        // No backdrop-filter while the menu is open: it would become the
        // containing block for the fixed menu panel and collapse it.
        open
          ? "border-ivory/10 bg-ink"
          : scrolled
            ? "border-ivory/10 bg-ink/90 backdrop-blur-md"
            : "border-transparent bg-transparent",
      )}
    >
      <nav aria-label="Main" className="container-page flex h-16 items-center justify-between gap-6 lg:h-[4.75rem]">
        <a href="#top" aria-label={`${name}, back to top`} onClick={() => setOpen(false)} className="shrink-0">
          <Brand name={name} shortName={shortName} />
        </a>

        <ul className="hidden items-center gap-9 lg:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="relative py-2 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-ivory/75 transition-colors hover:text-ivory after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-gold after:transition-transform after:duration-300 hover:after:scale-x-100"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden lg:block">
          <Button href="#book" size="md" magnetic>
            Book Appointment
          </Button>
        </div>

        <button
          ref={toggleRef}
          type="button"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((value) => !value)}
          className="-mr-2 flex size-11 items-center justify-center lg:hidden"
        >
          <Icon name={open ? "close" : "menu"} className="size-6" title={open ? "Close menu" : "Open menu"} />
        </button>
      </nav>

      {open ? (
        <div
          id="mobile-menu"
          className="fixed inset-x-0 bottom-0 top-16 z-50 flex flex-col overflow-y-auto bg-ink px-5 pb-safe lg:hidden"
        >
          <ul className="flex flex-col pt-6">
            {links.map((link, index) => (
              <li key={link.href} className="border-b border-ivory/10">
                <a
                  ref={index === 0 ? firstLinkRef : undefined}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between py-5 headline text-[2rem]"
                >
                  {link.label}
                  <Icon name="arrow-right" className="size-5 text-gold" />
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-auto flex flex-col gap-3 py-8">
            <Button href="#book" size="lg" fullWidth track={{ event: "appointment_started", params: { location: "menu" } }}>
              Book Appointment
            </Button>
            {whatsappHref ? (
              <Button
                href={whatsappHref}
                external
                variant="outline-light"
                size="lg"
                icon="whatsapp"
                fullWidth
                track={{ event: "whatsapp_click", params: { location: "menu" } }}
              >
                WhatsApp Us
              </Button>
            ) : null}
          </div>
        </div>
      ) : null}
    </header>
  );
}
