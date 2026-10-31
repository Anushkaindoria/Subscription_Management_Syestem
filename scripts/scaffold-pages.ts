import fs from "fs";
import path from "path";
import { ROUTES } from "../src/contracts/routes";

const ROOT = path.resolve(__dirname, "..");

// Map path to folder inside src/app
function getFolderForPath(routePath: string): string {
  // Public routes: /login, /signup, /forgot-password, /reset-password
  if (routePath === "/login" || routePath === "/signup" || routePath === "/forgot-password" || routePath === "/reset-password") {
    return path.join(ROOT, "src", "app", "(public)", routePath.replace(/^\//, ""));
  }

  // Admin routes: /admin, /admin/*
  if (routePath === "/admin" || routePath.startsWith("/admin/")) {
    const sub = routePath.replace(/^\/admin/, "");
    if (!sub || sub === "") {
      return path.join(ROOT, "src", "app", "(admin)", "admin");
    }
    return path.join(ROOT, "src", "app", "(admin)", "admin", sub.replace(/^\//, ""));
  }

  // Portal routes: /portal, /portal/*
  if (routePath === "/portal" || routePath.startsWith("/portal/")) {
    const sub = routePath.replace(/^\/portal/, "");
    if (!sub || sub === "") {
      return path.join(ROOT, "src", "app", "(portal)", "portal");
    }
    return path.join(ROOT, "src", "app", "(portal)", "portal", sub.replace(/^\//, ""));
  }

  throw new Error(`Unmapped route path: ${routePath}`);
}

const pageTemplate = (routeId: string) => `import { PagePlaceholder } from "@/components/features/_shared/PagePlaceholder";

export default function Page() {
  return <PagePlaceholder routeId="${routeId}" />;
}
`;

const loadingTemplate = `export default function Loading() {
  return (
    <div style={{ padding: "2rem", display: "flex", alignItems: "center", gap: "0.75rem", color: "var(--text-muted)" }}>
      <div style={{ width: "16px", height: "16px", border: "2px solid #3b82f6", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
      <span>Loading...</span>
    </div>
  );
}
`;

const errorTemplate = `"use client";
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
`;

for (const route of ROUTES) {
  const dir = getFolderForPath(route.path);
  fs.mkdirSync(dir, { recursive: true });

  fs.writeFileSync(path.join(dir, "page.tsx"), pageTemplate(route.id));
  fs.writeFileSync(path.join(dir, "loading.tsx"), loadingTemplate);
  fs.writeFileSync(path.join(dir, "error.tsx"), errorTemplate);
  console.log(`Generated: ${route.path} -> ${path.relative(ROOT, dir)}`);
}

console.log("All 30 route pages, loading.tsx and error.tsx successfully generated!");
