import fs from "fs";
import path from "path";
import { ROUTES } from "../src/contracts/routes";

const ROOT = path.resolve(__dirname, "..");
let hasErrors = false;

function error(msg: string) {
  console.error(`❌ [check-routes] ${msg}`);
  hasErrors = true;
}

function success(msg: string) {
  console.log(`✅ [check-routes] ${msg}`);
}

function getExpectedPagePath(routePath: string): string {
  if (routePath === "/login" || routePath === "/signup" || routePath === "/forgot-password" || routePath === "/reset-password") {
    return path.join(ROOT, "src", "app", "(public)", routePath.replace(/^\//, ""), "page.tsx");
  }
  if (routePath === "/admin" || routePath.startsWith("/admin/")) {
    const sub = routePath.replace(/^\/admin/, "");
    if (!sub || sub === "") {
      return path.join(ROOT, "src", "app", "(admin)", "admin", "page.tsx");
    }
    return path.join(ROOT, "src", "app", "(admin)", "admin", sub.replace(/^\//, ""), "page.tsx");
  }
  if (routePath === "/portal" || routePath.startsWith("/portal/")) {
    const sub = routePath.replace(/^\/portal/, "");
    if (!sub || sub === "") {
      return path.join(ROOT, "src", "app", "(portal)", "portal", "page.tsx");
    }
    return path.join(ROOT, "src", "app", "(portal)", "portal", sub.replace(/^\//, ""), "page.tsx");
  }
  return "";
}

// Read CODEOWNERS content
const codeownersPath = path.join(ROOT, ".github", "CODEOWNERS");
const codeownersContent = fs.existsSync(codeownersPath) ? fs.readFileSync(codeownersPath, "utf-8") : "";

console.log(`Verifying ${ROUTES.length} routes against system architecture...`);

// 1. Verify every entry in ROUTES
for (const route of ROUTES) {
  // (a) page.tsx exists
  const pageFile = getExpectedPagePath(route.path);
  if (!fs.existsSync(pageFile)) {
    error(`Missing page.tsx for route '${route.id}' at ${path.relative(ROOT, pageFile)}`);
  }

  // (b) module folder exists
  const moduleDir = path.join(ROOT, "src", "modules", route.module);
  if (!fs.existsSync(moduleDir)) {
    error(`Missing domain module folder for route '${route.id}': src/modules/${route.module}`);
  }

  // (c) CODEOWNERS entry
  const moduleOwnerPattern = `/src/modules/${route.module}/`;
  if (!codeownersContent.includes(moduleOwnerPattern)) {
    error(`CODEOWNERS is missing an entry for module '/src/modules/${route.module}/'`);
  }

  // (d) Stitch desktop folder exists
  const stitchDesktopFolder = path.join(ROOT, "design", "stitch", "desktop", route.stitchScreen);
  if (!fs.existsSync(stitchDesktopFolder)) {
    error(`Missing Stitch desktop reference directory: design/stitch/desktop/${route.stitchScreen}`);
  }
}

// 2. Verify no stray unlisted page.tsx exists
function findPages(dir: string, fileList: string[] = []): string[] {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      findPages(fullPath, fileList);
    } else if (file === "page.tsx") {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

const allPages = findPages(path.join(ROOT, "src", "app"));
const knownPagePaths = new Set(
  ROUTES.map((r) => path.normalize(getExpectedPagePath(r.path))),
);
// Allow root gateway page /
knownPagePaths.add(path.normalize(path.join(ROOT, "src", "app", "page.tsx")));

for (const page of allPages) {
  const normalized = path.normalize(page);
  if (!knownPagePaths.has(normalized)) {
    error(`Found unlisted page.tsx not tracked in ROUTES manifest: ${path.relative(ROOT, page)}`);
  }
}

if (hasErrors) {
  console.error("❌ [check-routes] Route verification FAILED with errors above.");
  process.exit(1);
} else {
  success(`All ${ROUTES.length} routes, modules, CODEOWNERS, and Stitch mappings verified cleanly!`);
}
