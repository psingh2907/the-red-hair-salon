"use client";

import { type FormEvent, type ReactNode, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { trackEvent } from "@/lib/analytics";
import { SELECT_SERVICE_EVENT } from "@/lib/booking";
import { cn } from "@/lib/cn";
import { type AppointmentInput, LIMITS, todayIso, validateAppointment } from "@/lib/validation";
import { buildWhatsAppUrl, createWhatsAppMessage } from "@/lib/whatsapp";
import { Button } from "./ui/Button";
import { Icon } from "./ui/Icon";

interface ServiceGroup {
  label: string;
  options: { id: string; name: string }[];
}

interface AppointmentFormProps {
  serviceGroups: ServiceGroup[];
  businessName: string;
  whatsappNumber: string | null;
  phone: { href: string; display: string } | null;
  prototypeMode: boolean;
}

type Field = keyof AppointmentInput;
type Result = { kind: "sent" | "preview"; message: string; url: string | null };

const CONSULTATION = { id: "consultation", name: "Not sure yet – I'd like advice" };
const TIME_OPTIONS = ["Morning", "Afternoon", "Evening", "Flexible"];
const FIELD_ORDER: Field[] = ["name", "phone", "service", "date", "time", "message"];
const EMPTY: AppointmentInput = { name: "", phone: "", service: "", date: "", time: "", message: "" };

const noopSubscribe = () => () => {};

function controlClass(invalid: boolean) {
  return cn(
    "block h-12 w-full rounded-[2px] border bg-white px-4 text-base text-ink placeholder:text-ink/35",
    "transition-[border-color,box-shadow] duration-200 focus:border-ink focus:outline-none focus:ring-4 focus:ring-rouge/15 focus-visible:outline-none",
    invalid ? "border-rouge" : "border-ink/20 hover:border-ink/45",
  );
}

function FieldShell({
  id,
  label,
  error,
  optional,
  className,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  optional?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="mb-2 flex items-baseline justify-between text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-ink/80"
      >
        {label}
        {optional ? <span className="text-xs font-normal normal-case tracking-normal text-muted">Optional</span> : null}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-[0.82rem] font-medium text-rouge">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function AppointmentForm({
  serviceGroups,
  businessName,
  whatsappNumber,
  phone,
  prototypeMode,
}: AppointmentFormProps) {
  const [values, setValues] = useState<AppointmentInput>(EMPTY);
  // A field shows its error once the visitor has left it (with a value) or tried to submit.
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [attempted, setAttempted] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [copied, setCopied] = useState(false);
  const started = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  // Today's date only exists in the browser (the page itself is pre-rendered).
  const today = useSyncExternalStore(noopSubscribe, () => todayIso(), () => "");

  // Errors are derived from the current values, so they can never go stale.
  const allErrors = validateAppointment(values, today || undefined);
  const errorFor = (field: Field) => (attempted || touched[field] ? allErrors[field] : undefined);

  useEffect(() => {
    const onSelectService = (event: Event) => {
      const id = (event as CustomEvent<string>).detail;
      if (!serviceGroups.some((group) => group.options.some((option) => option.id === id))) return;
      setResult(null);
      setValues((current) => ({ ...current, service: id }));
    };
    window.addEventListener(SELECT_SERVICE_EVENT, onSelectService);
    return () => window.removeEventListener(SELECT_SERVICE_EVENT, onSelectService);
  }, [serviceGroups]);

  useEffect(() => {
    if (result) resultRef.current?.focus();
  }, [result]);

  function serviceLabel(id: string): string {
    if (id === CONSULTATION.id) return CONSULTATION.name;
    for (const group of serviceGroups) {
      const match = group.options.find((option) => option.id === id);
      if (match) return match.name;
    }
    return "";
  }

  function update(field: Field, value: string) {
    if (!started.current) {
      started.current = true;
      trackEvent("appointment_started", { location: "form" });
    }
    setValues((current) => ({ ...current, [field]: value }));
  }

  function markTouched(field: Field) {
    if (values[field]) setTouched((current) => ({ ...current, [field]: true }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAttempted(true);

    const firstInvalid = FIELD_ORDER.find((field) => allErrors[field]);
    if (firstInvalid) {
      trackEvent("appointment_validation_failed", { field: firstInvalid });
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    const message = createWhatsAppMessage(values, businessName, serviceLabel(values.service));
    trackEvent("appointment_submitted", {
      service: values.service,
      channel: whatsappNumber ? "whatsapp" : "preview",
    });

    if (whatsappNumber) {
      const url = buildWhatsAppUrl(whatsappNumber, message);
      trackEvent("whatsapp_click", { location: "form" });
      // A real link click inside the submit handler isn't treated as a pop-up.
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.click();
      setResult({ kind: "sent", message, url });
    } else {
      setResult({ kind: "preview", message, url: null });
    }
  }

  async function copyMessage(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  }

  const describedBy = (field: Field) => (errorFor(field) ? `appt-${field}-error` : undefined);

  if (result) {
    const sent = result.kind === "sent";
    return (
      <div
        ref={resultRef}
        tabIndex={-1}
        aria-live="polite"
        className="border border-ink/10 bg-paper p-6 shadow-[0_40px_90px_-50px_rgba(14,12,11,0.45)] outline-none sm:p-10"
      >
        <span className="flex size-12 items-center justify-center rounded-full bg-rouge text-ivory">
          <Icon name={sent ? "check" : "whatsapp"} className="size-6" />
        </span>
        <h3 className="headline mt-6 text-[2.1rem]">
          {sent ? "Your enquiry is ready in WhatsApp" : "Here's your enquiry"}
        </h3>
        <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">
          {sent
            ? "Tap send in WhatsApp to share it with the salon. If WhatsApp didn't open, use the button below."
            : prototypeMode
              ? "Preview mode: the salon's WhatsApp number hasn't been added yet. Once it is, this message opens directly in WhatsApp."
              : "WhatsApp enquiries aren't available right now. Copy your enquiry, or call the salon."}
        </p>

        <div className="mt-7 rounded-[2px] border-l-2 border-rouge bg-white p-5">
          <p className="eyebrow text-muted">Message</p>
          <p
            data-testid="whatsapp-message"
            className="mt-3 whitespace-pre-wrap break-words text-[0.93rem] leading-relaxed text-ink"
          >
            {result.message}
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {sent && result.url ? (
            <Button href={result.url} external icon="whatsapp" size="lg">
              Open WhatsApp
            </Button>
          ) : (
            <Button icon={copied ? "check" : "copy"} size="lg" onClick={() => copyMessage(result.message)}>
              {copied ? "Copied" : "Copy Message"}
            </Button>
          )}
          {phone ? (
            <Button
              href={phone.href}
              variant="outline-dark"
              size="lg"
              icon="phone"
              track={{ event: "call_click", params: { location: "form_result" } }}
            >
              Call {phone.display}
            </Button>
          ) : null}
          <Button variant="outline-dark" size="lg" onClick={() => setResult(null)}>
            Edit Details
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      noValidate
      onSubmit={handleSubmit}
      aria-labelledby="appointment-form-title"
      className="border border-ink/10 bg-paper p-6 shadow-[0_40px_90px_-50px_rgba(14,12,11,0.45)] sm:p-10"
    >
      <div className="flex items-start justify-between gap-4 border-b border-ink/10 pb-6">
        <div>
          <h3 id="appointment-form-title" className="headline text-[2rem]">
            Appointment enquiry
          </h3>
          <p className="mt-1 text-sm text-muted">Takes less than a minute.</p>
        </div>
        <Icon name="whatsapp" className="mt-1 size-7 shrink-0 text-whatsapp" />
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <FieldShell id="appt-name" label="Your name" error={errorFor("name")}>
          <input
            id="appt-name"
            name="name"
            type="text"
            autoComplete="name"
            maxLength={LIMITS.name}
            placeholder="Full name"
            value={values.name}
            onChange={(event) => update("name", event.target.value)}
            onBlur={() => markTouched("name")}
            aria-invalid={Boolean(errorFor("name"))}
            aria-describedby={describedBy("name")}
            className={controlClass(Boolean(errorFor("name")))}
          />
        </FieldShell>

        <FieldShell id="appt-phone" label="Phone number" error={errorFor("phone")}>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-base text-muted">
              +91
            </span>
            <input
              id="appt-phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              maxLength={16}
              placeholder="98765 43210"
              value={values.phone}
              onChange={(event) => update("phone", event.target.value.replace(/[^\d+\-\s]/g, ""))}
              onBlur={() => markTouched("phone")}
              aria-invalid={Boolean(errorFor("phone"))}
              aria-describedby={describedBy("phone")}
              className={cn(controlClass(Boolean(errorFor("phone"))), "pl-14")}
            />
          </div>
        </FieldShell>

        <FieldShell id="appt-service" label="Service" error={errorFor("service")} className="sm:col-span-2">
          <div className="relative">
            <select
              id="appt-service"
              name="service"
              value={values.service}
              onChange={(event) => update("service", event.target.value)}
              onBlur={() => markTouched("service")}
              aria-invalid={Boolean(errorFor("service"))}
              aria-describedby={describedBy("service")}
              className={cn(
                controlClass(Boolean(errorFor("service"))),
                "appearance-none pr-11",
                !values.service && "text-ink/60",
              )}
            >
              <option value="" disabled>
                Choose a service
              </option>
              {serviceGroups.map((group) => (
                <optgroup key={group.label} label={group.label}>
                  {group.options.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </optgroup>
              ))}
              <option value={CONSULTATION.id}>{CONSULTATION.name}</option>
            </select>
            <Icon
              name="chevron-down"
              className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted"
            />
          </div>
        </FieldShell>

        <FieldShell id="appt-date" label="Preferred date" error={errorFor("date")}>
          <input
            id="appt-date"
            name="date"
            type="date"
            min={today || undefined}
            value={values.date}
            onChange={(event) => update("date", event.target.value)}
            onBlur={() => markTouched("date")}
            aria-invalid={Boolean(errorFor("date"))}
            aria-describedby={describedBy("date")}
            className={cn(controlClass(Boolean(errorFor("date"))), "appearance-none", !values.date && "text-ink/60")}
          />
        </FieldShell>

        <fieldset aria-describedby={describedBy("time")}>
          <legend className="mb-2 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-ink/80">
            Preferred time
          </legend>
          <div className="grid grid-cols-2 gap-2">
            {TIME_OPTIONS.map((option) => {
              const checked = values.time === option;
              return (
                <label
                  key={option}
                  className={cn(
                    "flex h-12 cursor-pointer items-center justify-center rounded-[2px] border text-[0.9rem] font-medium transition-colors duration-200",
                    "has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-rouge/25",
                    checked
                      ? "border-ink bg-ink text-ivory"
                      : cn("bg-white text-ink", errorFor("time") ? "border-rouge" : "border-ink/20 hover:border-ink/50"),
                  )}
                >
                  <input
                    type="radio"
                    name="time"
                    value={option}
                    checked={checked}
                    onChange={() => update("time", option)}
                    className="sr-only"
                  />
                  {option}
                </label>
              );
            })}
          </div>
          {errorFor("time") ? (
            <p id="appt-time-error" className="mt-2 text-[0.82rem] font-medium text-rouge">
              {errorFor("time")}
            </p>
          ) : null}
        </fieldset>

        <FieldShell
          id="appt-message"
          label="Message"
          optional
          error={errorFor("message")}
          className="sm:col-span-2"
        >
          <textarea
            id="appt-message"
            name="message"
            rows={4}
            maxLength={LIMITS.message}
            placeholder="Anything we should know? For example, the occasion or the look you have in mind."
            value={values.message}
            onChange={(event) => update("message", event.target.value)}
            aria-invalid={Boolean(errorFor("message"))}
            aria-describedby={cn(describedBy("message"), "appt-message-count")}
            className={cn(controlClass(Boolean(errorFor("message"))), "h-auto resize-y py-3 leading-relaxed")}
          />
          <p id="appt-message-count" className="mt-1.5 text-right text-xs text-muted">
            {values.message.length}/{LIMITS.message}
          </p>
        </FieldShell>
      </div>

      <Button type="submit" size="lg" icon="whatsapp" fullWidth className="mt-6">
        Continue on WhatsApp
      </Button>
      <p className="mt-4 text-center text-xs leading-relaxed text-muted">
        {whatsappNumber
          ? "Opens WhatsApp with your details filled in. Nothing is sent until you tap send."
          : "You'll see your enquiry message before anything is sent."}
      </p>
    </form>
  );
}
