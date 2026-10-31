import React from "react";
import { ROUTES } from "@/contracts/routes";

interface PagePlaceholderProps {
  routeId: string;
}

export function PagePlaceholder({ routeId }: PagePlaceholderProps) {
  const route = ROUTES.find((r) => r.id === routeId);

  if (!route) {
    return (
      <div style={{ padding: "2rem", color: "#ef4444" }}>
        <h3>Error: Route ID &apos;{routeId}&apos; not found in ROUTES manifest!</h3>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "2.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        maxWidth: "960px",
        margin: "0 auto",
      }}
    >
      <div
        className="glass-panel"
        style={{
          padding: "2rem",
          background: "var(--surface, #182030)",
          border: "1px solid var(--border, #242e42)",
          borderRadius: "16px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
          <div>
            <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--accent-purple, #8b5cf6)", fontWeight: 700, letterSpacing: "0.05em" }}>
              Google Stitch Design Screen: {route.stitchScreen}
            </div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: "700", marginTop: "0.25rem", color: "var(--text-main, #f1f5f9)" }}>
              {route.id.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
            </h1>
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <span
              style={{
                fontSize: "0.75rem",
                padding: "4px 8px",
                borderRadius: "6px",
                background: route.mvp ? "rgba(16, 185, 129, 0.2)" : "rgba(148, 163, 184, 0.2)",
                color: route.mvp ? "#34d399" : "#94a3b8",
                fontWeight: 600,
              }}
            >
              {route.mvp ? "MVP CORE" : "EXTENDED"}
            </span>
            <span
              style={{
                fontSize: "0.75rem",
                padding: "4px 8px",
                borderRadius: "6px",
                background: "rgba(59, 130, 246, 0.2)",
                color: "#60a5fa",
                fontWeight: 600,
              }}
            >
              Role: {route.role}
            </span>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
            marginTop: "1.5rem",
            paddingTop: "1.5rem",
            borderTop: "1px solid var(--border-subtle, #242e42)",
            fontSize: "0.875rem",
          }}
        >
          <div>
            <div style={{ color: "var(--text-dim, #64748b)", fontSize: "0.75rem" }}>ROUTE PATH</div>
            <code style={{ color: "#38bdf8", fontWeight: 600 }}>{route.path}</code>
          </div>
          <div>
            <div style={{ color: "var(--text-dim, #64748b)", fontSize: "0.75rem" }}>API PREFIX</div>
            <code style={{ color: "#a78bfa" }}>{route.apiPrefix}</code>
          </div>
          <div>
            <div style={{ color: "var(--text-dim, #64748b)", fontSize: "0.75rem" }}>DOMAIN MODULE</div>
            <span style={{ fontWeight: 600 }}>{route.module}</span>
          </div>
          <div>
            <div style={{ color: "var(--text-dim, #64748b)", fontSize: "0.75rem" }}>OWNERSHIP</div>
            <span>
              UI: <strong>Dev {route.uiOwner}</strong> · Backend: <strong>Dev {route.backendOwner}</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
