import Link from "next/link";
import React from "react";
import { PORTAL_NAV_ITEMS } from "@/config/navigation";

export default function CustomerPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-primary, #0a0d14)", paddingBottom: "4rem" }}>
      {/* Top Navigation Bar (Desktop) */}
      <header
        style={{
          background: "var(--surface, #121722)",
          borderBottom: "1px solid var(--border, #242e42)",
          padding: "1rem 2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "sticky",
          top: 0,
          zIndex: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          <Link href="/portal" style={{ fontSize: "1.25rem", fontWeight: "800", color: "#10b981", letterSpacing: "-0.02em" }}>
            LoopOS <span style={{ fontSize: "0.7rem", padding: "2px 6px", borderRadius: "4px", background: "rgba(16, 185, 129, 0.2)", color: "#34d399", fontWeight: 700 }}>PORTAL</span>
          </Link>

          <nav className="hidden md:flex" style={{ display: "flex", gap: "1.25rem", fontSize: "0.875rem" }}>
            {PORTAL_NAV_ITEMS.map((item) => (
              <Link key={item.id} href={item.path} style={{ color: "var(--text-muted, #94a3b8)", transition: "color 0.15s ease" }}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div style={{ fontSize: "0.875rem", color: "var(--text-muted, #94a3b8)" }}>
          Customer: <strong style={{ color: "var(--text-main, #f1f5f9)" }}>Acme Retail Pvt Ltd</strong>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: "2rem", maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
        {children}
      </main>

      {/* Bottom Tab Bar (Mobile) */}
      <nav
        className="md:hidden"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: "60px",
          background: "var(--surface, #121722)",
          borderTop: "1px solid var(--border, #242e42)",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          zIndex: 30,
        }}
      >
        {PORTAL_NAV_ITEMS.map((item) => (
          <Link
            key={item.id}
            href={item.path}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              fontSize: "0.7rem",
              color: "var(--text-muted, #94a3b8)",
              padding: "4px",
            }}
          >
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
