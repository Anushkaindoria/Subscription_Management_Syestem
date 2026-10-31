"use client";
import React from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{ padding: "2rem", color: "#ef4444" }}>
      <h2>Something went wrong!</h2>
      <p style={{ color: "var(--text-muted)", margin: "0.5rem 0 1rem" }}>{error.message || "An unexpected error occurred."}</p>
      <button onClick={() => reset()} style={{ padding: "6px 12px", background: "var(--primary)", color: "#fff", borderRadius: "6px" }}>
        Try again
      </button>
    </div>
  );
}
