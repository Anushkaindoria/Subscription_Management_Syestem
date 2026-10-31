/**
 * Typed API Client
 * OWNER: Dev C (@devC)
 *
 * Automatically unwraps the { data, error } standardized JSON envelope.
 */

import { ApiResponse } from "@/contracts/common";

export class ApiClientError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number,
    public readonly fields?: Record<string, string>,
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = endpoint.startsWith("http") ? endpoint : endpoint;
  const headers = new Headers(options.headers || {});

  if (!headers.has("Content-Type") && options.body && typeof options.body === "string") {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const json: ApiResponse<T> = await response.json().catch(() => ({
    data: null,
    error: {
      code: "PARSE_ERROR",
      message: "Failed to parse response JSON",
    },
  }));

  if (!response.ok || json.error) {
    const err = json.error || { code: "HTTP_ERROR", message: response.statusText };
    throw new ApiClientError(err.code, err.message, response.status, err.fields);
  }

  return json.data as T;
}
