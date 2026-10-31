import Link from "next/link";
import React from "react";
import { ADMIN_NAV_GROUPS } from "@/config/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-primary, #0a0d14)" }}>
      {/* Sidebar 264px */}
      <aside
        style={{
          width: "264px",
          minWidth: "264px",
          background: "var(--surface, #121722)",
          borderRight: "1px solid var(--border, #242e42)",
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          position: "sticky",
          top: 0,
        }}
      >
        <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border, #242e42)" }}>
          <Link href="/admin" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--primary, #4f46e5)", letterSpacing: "-0.02em" }}>
              LoopOS
            </span>
            <span style={{ fontSize: "0.65rem", padding: "2px 6px", borderRadius: "4px", background: "rgba(79, 70, 229, 0.2)", color: "#818cf8", fontWeight: 700 }}>
              CONSOLE
            </span>
          </Link>
        </div>

        {/* Grouped Navigation */}
        <div style={{ flex: 1, overflowY: "auto", padding: "1rem" }}>
          {ADMIN_NAV_GROUPS.map((group) => (
            <div key={group.groupName} style={{ marginBottom: "1.25rem" }}>
              <div
                style={{
                  fontSize: "0.7rem",
                  textTransform: "uppercase",
                  color: "var(--text-dim, #64748b)",
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                  padding: "0 0.5rem 0.5rem",
                }}
              >
                {group.groupName}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                {group.items.map((item) => (
                  <Link
                    key={item.id}
                    href={item.path}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0.5rem 0.75rem",
                      borderRadius: "8px",
                      fontSize: "0.85rem",
                      color: "var(--text-muted, #94a3b8)",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <span>{item.label}</span>
                    {item.role === "admin" && (
                      <span style={{ fontSize: "0.6rem", color: "#f59e0b", background: "rgba(245, 158, 11, 0.1)", padding: "1px 4px", borderRadius: "3px" }}>
                        ADMIN
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding: "1rem", borderTop: "1px solid var(--border, #242e42)", fontSize: "0.75rem", color: "var(--text-dim, #64748b)" }}>
          Demo Status: <span style={{ color: "#10b981", fontWeight: 600 }}>MOCK_API Active</span>
        </div>
      </aside>

      {/* Main Column */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Top bar 64px */}
        <header
          style={{
            height: "64px",
            minHeight: "64px",
            background: "var(--surface, #121722)",
            borderBottom: "1px solid var(--border, #242e42)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 2rem",
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          <div style={{ fontSize: "0.875rem", color: "var(--text-muted, #94a3b8)" }}>
            Operations & Financial Ledger
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ fontSize: "0.75rem", padding: "4px 8px", borderRadius: "9999px", background: "rgba(16, 185, 129, 0.15)", color: "#10b981", fontWeight: 600 }}>
              Live Clock: 2026-10-31
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#4f46e5", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#fff" }}>
                RS
              </div>
              <span>Riya Sharma (Admin)</span>
            </div>
          </div>
        </header>

        {/* Screen Content */}
        <main style={{ flex: 1, padding: "2rem", overflowY: "auto" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
