import Link from "next/link";
import React from "react";

export default function HomePage() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div style={{ maxWidth: "800px", textAlign: "center" }}>
        <h1 style={{ fontSize: "3rem", fontWeight: "800", marginBottom: "1rem", background: "linear-gradient(to right, #60a5fa, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          LoopOS
        </h1>
        <p style={{ fontSize: "1.25rem", color: "var(--text-muted)", marginBottom: "2.5rem" }}>
          Modular Monolith Subscription Management, Billing Engine & Customer Portal
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
          <Link href="/admin" className="glass-panel" style={{ padding: "2rem", display: "block", textAlign: "left", transition: "transform 0.2s ease" }}>
            <h3 style={{ fontSize: "1.25rem", color: "#60a5fa", marginBottom: "0.5rem" }}>Admin Dashboard →</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
              Revenue analytics, subscription lifecycle, time-travel billing runs, and catalog.
            </p>
          </Link>

          <Link href="/portal" className="glass-panel" style={{ padding: "2rem", display: "block", textAlign: "left" }}>
            <h3 style={{ fontSize: "1.25rem", color: "#34d399", marginBottom: "0.5rem" }}>Customer Portal →</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
              Review active agreements, view invoices, download PDFs, and record payments.
            </p>
          </Link>

          <Link href="/login" className="glass-panel" style={{ padding: "2rem", display: "block", textAlign: "left" }}>
            <h3 style={{ fontSize: "1.25rem", color: "#a78bfa", marginBottom: "0.5rem" }}>Authentication →</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
              Secure login, password policy testing, and password recovery.
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}
