const PLACEHOLDER = /^\{\{[A-Z0-9_]+\}\}$/;

/** True for a `{{TOKEN}}` placeholder. */
export function isPlaceholder(value: string | null | undefined): boolean {
  return typeof value === "string" && PLACEHOLDER.test(value.trim());
}

/** True when a value is present and is not a `{{TOKEN}}` placeholder. */
export function isConfigured(value: string | null | undefined): value is string {
  return typeof value === "string" && value.trim() !== "" && !isPlaceholder(value);
}

/** Returns the value when configured, otherwise `null`. Never returns a placeholder. */
export function configuredOrNull(value: string | null | undefined): string | null {
  return isConfigured(value) ? value.trim() : null;
}
