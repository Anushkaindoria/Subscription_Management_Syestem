export type Interval = "DAILY" | "WEEKLY" | "MONTHLY" | "ANNUALLY";

function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
}

/**
 * Returns the date `n` periods after `anchor`.
 * Always compute from the ORIGINAL anchor (not the previous result),
 * so a 31 Jan monthly sub goes 31 Jan, 28 Feb, 31 Mar (not 28 Mar).
 */
export function addPeriods(anchor: Date, interval: Interval, n: number): Date {
  const d = new Date(anchor);
  if (interval === "DAILY") {
    d.setUTCDate(d.getUTCDate() + n);
    return d;
  }
  if (interval === "WEEKLY") {
    d.setUTCDate(d.getUTCDate() + 7 * n);
    return d;
  }
  const monthsToAdd = interval === "MONTHLY" ? n : 12 * n;
  const day = anchor.getUTCDate();
  const total = anchor.getUTCMonth() + monthsToAdd;
  const year = anchor.getUTCFullYear() + Math.floor(total / 12);
  const month = ((total % 12) + 12) % 12;
  const clampedDay = Math.min(day, daysInMonth(year, month));
  return new Date(
    Date.UTC(
      year,
      month,
      clampedDay,
      anchor.getUTCHours(),
      anchor.getUTCMinutes(),
      anchor.getUTCSeconds(),
    ),
  );
}
