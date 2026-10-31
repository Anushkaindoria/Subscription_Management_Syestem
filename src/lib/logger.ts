/**
 * Shared Infrastructure: Structured Application Logger
 * OWNER: Dev A (@devA)
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogPayload {
  module?: string;
  context?: Record<string, unknown>;
  [key: string]: unknown;
}

class Logger {
  private formatMessage(level: LogLevel, message: string, payload?: LogPayload): string {
    const timestamp = new Date().toISOString();
    const moduleTag = payload?.module ? `[${payload.module}] ` : "";
    return `[${timestamp}] [${level.toUpperCase()}] ${moduleTag}${message}`;
  }

  public debug(message: string, payload?: LogPayload): void {
    if (process.env.NODE_ENV !== "production") {
      console.debug(this.formatMessage("debug", message, payload), payload?.context ?? "");
    }
  }

  public info(message: string, payload?: LogPayload): void {
    console.info(this.formatMessage("info", message, payload), payload?.context ?? "");
  }

  public warn(message: string, payload?: LogPayload): void {
    console.warn(this.formatMessage("warn", message, payload), payload?.context ?? "");
  }

  public error(message: string, error?: unknown, payload?: LogPayload): void {
    console.error(this.formatMessage("error", message, payload), error ?? "", payload?.context ?? "");
  }
}

export const logger = new Logger();
