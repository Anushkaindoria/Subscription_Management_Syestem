/**
 * Shared Infrastructure: Time-Travel Injectable Clock
 * OWNER: Dev A (@devA)
 *
 * CRITICAL RULE: Business logic and modules must NEVER call naked `new Date()`.
 * Always call `clock.now()` or `clock.today()`.
 * This enables deterministic testing and the hackathon judge time-travel demo.
 */

class SystemClock {
  private mockTimestamp: number | null = null;

  constructor() {
    // Check if initial mock date is provided via environment variable
    if (process.env.CLOCK_MOCK_DATE) {
      const parsed = Date.parse(process.env.CLOCK_MOCK_DATE);
      if (!isNaN(parsed)) {
        this.mockTimestamp = parsed;
      }
    }
  }

  /**
   * Returns current Date object (either simulated time-travel time or actual system time).
   */
  public now(): Date {
    return this.mockTimestamp !== null ? new Date(this.mockTimestamp) : new Date();
  }

  /**
   * Returns today's date formatted at UTC midnight (00:00:00.000Z).
   */
  public today(): Date {
    const current = this.now();
    return new Date(Date.UTC(current.getUTCFullYear(), current.getUTCMonth(), current.getUTCDate()));
  }

  /**
   * Returns current Unix epoch timestamp in milliseconds.
   */
  public epochMs(): number {
    return this.mockTimestamp !== null ? this.mockTimestamp : Date.now();
  }

  /**
   * Overrides system time with a target ISO string or Date (for demos and tests).
   */
  public setMockTime(target: string | Date | number): void {
    if (typeof target === "string") {
      this.mockTimestamp = Date.parse(target);
    } else if (target instanceof Date) {
      this.mockTimestamp = target.getTime();
    } else {
      this.mockTimestamp = target;
    }
  }

  /**
   * Fast-forwards the clock by a given number of days.
   */
  public advanceDays(days: number): Date {
    const base = this.epochMs();
    this.mockTimestamp = base + days * 24 * 60 * 60 * 1000;
    return this.now();
  }

  /**
   * Resets mock date to actual system wall-clock time.
   */
  public reset(): void {
    this.mockTimestamp = null;
  }

  /**
   * Indicates whether the clock is currently overridden.
   */
  public isMocked(): boolean {
    return this.mockTimestamp !== null;
  }
}

export const clock = new SystemClock();
