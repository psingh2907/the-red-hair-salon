/** "THE RED HAIR FAMILY SALON" + "The Red Hair" → { primary: "The Red Hair", secondary: "FAMILY SALON" } */
export function splitBrandName(name: string, shortName: string): { primary: string; secondary: string } {
  if (shortName && name.toLowerCase().startsWith(shortName.toLowerCase())) {
    return { primary: shortName, secondary: name.slice(shortName.length).trim() };
  }
  return { primary: name, secondary: "" };
}

/** "Your Style. Your Confidence." → ["Your Style.", "Your Confidence."] */
export function splitTagline(tagline: string): [string, string] {
  const parts = tagline.trim().split(/(?<=[.!?])\s+/);
  if (parts.length < 2) return [tagline.trim(), ""];
  return [parts.slice(0, -1).join(" "), parts[parts.length - 1]];
}

/** "2026-09" → "September 2026" */
export function formatMonthYear(yearMonth: string): string {
  const match = /^(\d{4})-(\d{2})$/.exec(yearMonth);
  if (!match) return "";
  return new Date(Number(match[1]), Number(match[2]) - 1, 1).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
}
