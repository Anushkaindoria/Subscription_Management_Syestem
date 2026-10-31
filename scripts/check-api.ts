import fs from "fs";
import path from "path";

const ROOT = path.resolve(__dirname, "..");
const API_DIR = path.join(ROOT, "src", "app", "api");
let hasErrors = false;

function error(msg: string) {
  console.error(`❌ [check-api] ${msg}`);
  hasErrors = true;
}

function success(msg: string) {
  console.log(`✅ [check-api] ${msg}`);
}

const REQUIRED_ENDPOINTS = [
  // Auth
  "auth/signup/route.ts",
  "auth/login/route.ts",
  "auth/logout/route.ts",
  "auth/forgot/route.ts",
  "auth/reset/route.ts",
  "auth/me/route.ts",

  // Catalog
  "products/route.ts",
  "products/[id]/route.ts",
  "plans/route.ts",
  "plans/[id]/route.ts",
  "templates/route.ts",
  "templates/[id]/route.ts",
  "templates/[id]/quote/route.ts",

  // Subscriptions
  "subscriptions/route.ts",
  "subscriptions/[id]/route.ts",
  "subscriptions/[id]/transition/route.ts",

  // Customers
  "customers/route.ts",
  "customers/[id]/route.ts",
  "customers/[id]/portal-invite/route.ts",

  // Invoices
  "invoices/route.ts",
  "invoices/[id]/route.ts",
  "invoices/[id]/confirm/route.ts",
  "invoices/[id]/cancel/route.ts",
  "invoices/[id]/send/route.ts",
  "invoices/[id]/pdf/route.ts",
  "invoices/[id]/explain/route.ts",

  // Billing
  "billing/preview/route.ts",
  "billing/run/route.ts",
  "billing/runs/route.ts",
  "billing/runs/[id]/retry-failed/route.ts",

  // Payments
  "payments/route.ts",

  // Discounts
  "discounts/route.ts",
  "discounts/[id]/route.ts",

  // Taxes
  "taxes/route.ts",
  "taxes/[id]/route.ts",

  // Staff
  "staff/route.ts",
  "staff/[id]/route.ts",

  // Reports
  "reports/summary/route.ts",
  "reports/revenue/route.ts",
  "reports/subscriptions/route.ts",
  "reports/payments/route.ts",
  "reports/overdue/route.ts",

  // Ask
  "ask/route.ts",

  // Settings
  "settings/route.ts",

  // Portal
  "portal/summary/route.ts",
  "portal/subscriptions/route.ts",
  "portal/subscriptions/[id]/route.ts",
  "portal/subscriptions/[id]/transition/route.ts",
  "portal/invoices/route.ts",
  "portal/invoices/[id]/route.ts",
  "portal/invoices/[id]/pdf/route.ts",
  "portal/invoices/[id]/pay/route.ts",
  "portal/profile/route.ts",
];

console.log(`Checking ${REQUIRED_ENDPOINTS.length} required API endpoints...`);

// 1. Check all required endpoints exist
for (const relPath of REQUIRED_ENDPOINTS) {
  const fullPath = path.join(API_DIR, relPath);
  if (!fs.existsSync(fullPath)) {
    error(`Missing API route handler: src/app/api/${relPath}`);
  }
}

// 2. Scan all route.ts files for architectural boundary leaks
function findRouteFiles(dir: string, fileList: string[] = []): string[] {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      findRouteFiles(fullPath, fileList);
    } else if (file === "route.ts") {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

const allRouteFiles = findRouteFiles(API_DIR);
const FORBIDDEN_IMPORT_PATTERNS = [
  /@prisma\/client/,
  /from ["']prisma["']/,
  /@\/lib\/db/,
  /\/repo["']/,
  /\/repo\./,
];

for (const routeFile of allRouteFiles) {
  const content = fs.readFileSync(routeFile, "utf-8");
  for (const pattern of FORBIDDEN_IMPORT_PATTERNS) {
    if (pattern.test(content)) {
      error(
        `Architectural violation in ${path.relative(ROOT, routeFile)}: route handlers must NEVER import prisma or repos directly! (matched ${pattern})`,
      );
    }
  }
}

if (hasErrors) {
  console.error("❌ [check-api] API verification FAILED with errors above.");
  process.exit(1);
} else {
  success(
    `All ${REQUIRED_ENDPOINTS.length} endpoints present and zero boundary leaks detected across ${allRouteFiles.length} route handlers!`,
  );
}
