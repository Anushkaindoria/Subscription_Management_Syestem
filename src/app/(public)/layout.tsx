import React from "react";
import Link from "next/link";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", width: "100%" }}>
      {/* Brand Panel (Desktop) */}
      <div
        style={{
          flex: "1 1 50%",
          background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)",
          color: "#ffffff",
          padding: "3.5rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          borderRight: "1px solid rgba(255,255,255,0.1)",
        }}
        className="hidden md:flex"
      >
        <div>
          <Link href="/" style={{ fontSize: "1.75rem", fontWeight: "800", letterSpacing: "-0.02em", color: "#ffffff" }}>
            LoopOS
          </Link>
          <div style={{ fontSize: "0.875rem", color: "#c7d2fe", marginTop: "0.25rem" }}>
            Modular Monolith Subscription Engine
          </div>
        </div>

        <div style={{ maxWidth: "440px" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: "700", lineHeight: "1.2", marginBottom: "1rem" }}>
            Recurring billing, tax compliance & agreements on autopilot.
          </h2>
          <p style={{ color: "#e0e7ff", fontSize: "1rem", lineHeight: "1.6" }}>
            Designed for parallel development across three specialized engineers with strict domain isolation and zero-float monetary precision.
          </p>
        </div>

        <div style={{ fontSize: "0.875rem", color: "#a5b4fc" }}>
          © 2026 LoopOS Cloud Technologies · Google Stitch Design Aligned
        </div>
      </div>

      {/* Auth Content Panel */}
      <div
        style={{
          flex: "1 1 50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          background: "var(--bg-primary, #0a0d14)",
        }}
      >
        <div style={{ width: "100%", maxWidth: "440px" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
