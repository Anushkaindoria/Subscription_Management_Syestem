/**
 * Shared Formatting Helpers
 * OWNER: Dev C (@devC) & Dev A (@devA)
 */

/**
 * Formats integer minor units (paise) into INR currency display
 * with standard Indian number grouping (e.g. ₹24,56,300.00).
 */
export function formatINR(paiseMinor: number): string {
  const rupees = paiseMinor / 100;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(rupees);
}

/**
 * Formats Date or ISO string into readable human format e.g. "14 Nov 2026".
 */
export function formatDate(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return "—";
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

/**
 * Formats structured document sequence numbers e.g. ("INV-2026-", 42) -> "INV-2026-0042".
 */
export function formatDocNumber(prefix: string, sequence: number, padding = 4): string {
  return `${prefix}${String(sequence).padStart(padding, "0")}`;
}
