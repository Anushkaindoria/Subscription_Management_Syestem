import fs from "fs";
import path from "path";
import { ROUTES } from "../src/contracts/routes";

const ROOT = path.resolve(__dirname, "..");
const STITCH_DIR = path.join(ROOT, "design", "stitch");

fs.mkdirSync(path.join(STITCH_DIR, "desktop"), { recursive: true });
fs.mkdirSync(path.join(STITCH_DIR, "mobile"), { recursive: true });
fs.mkdirSync(path.join(STITCH_DIR, "design-system"), { recursive: true });

// 1. Desktop & Mobile folders
for (const route of ROUTES) {
  const dFolder = path.join(STITCH_DIR, "desktop", route.stitchScreen);
  const mFolder = path.join(STITCH_DIR, "mobile", route.stitchScreen);
  fs.mkdirSync(dFolder, { recursive: true });
  fs.mkdirSync(mFolder, { recursive: true });
  fs.writeFileSync(path.join(dFolder, ".gitkeep"), "");
  fs.writeFileSync(path.join(mFolder, ".gitkeep"), "");
}

// 2. design-system/tokens.json & components.md
fs.writeFileSync(
  path.join(STITCH_DIR, "design-system", "tokens.json"),
  JSON.stringify(
    {
      colors: {
        primary: "#4F46E5",
        accent: "#8B5CF6",
        background: "#0A0D14",
        surface: "#121722",
        border: "#242E42",
      },
      radii: { sm: 10, md: 14, lg: 16 },
      font: "Inter",
    },
    null,
    2,
  ) + "\n",
);

fs.writeFileSync(
  path.join(STITCH_DIR, "design-system", "components-states.md"),
  "# Google Stitch UI Components & States Sheet\n\nReference states for Button, Input, StatusPills, and Modals.\n",
);

// 3. README.md
const readmeContent = `# Google Stitch Design Asset Directory

This directory stores exported screen designs, layout frames, and component sheets exported from Google Stitch.

## Naming & Folder Convention
All exported screen assets must be saved under \`desktop/<stitchScreen>\` and \`mobile/<stitchScreen>\` using the exact kebab-case identifier defined in \`src/contracts/routes.ts\`:
- Format: \`<two-digit-number>-<kebab-screen-name>\`
- Examples: \`01-login\`, \`05-dashboard\`, \`11-subscriptions-list\`, \`25-portal-home\`.

## ⚠️ Architectural Invariant
Design files are **reference-only artifacts**.
Application code (\`src/\`) must **NEVER** import from \`design/\`. This is strictly enforced via \`tsconfig.json\` and \`.eslintrc.json\`.
`;
fs.writeFileSync(path.join(STITCH_DIR, "README.md"), readmeContent);

// 4. CONVERSION_LOG.md
let conversionTable = `# Stitch UI to Next.js Conversion Log

| Screen ID | Source File | Converted Page Path | Status | Notes on Unmapped Elements |
|---|---|---|---|---|
`;

for (const route of ROUTES) {
  conversionTable += `| \`${route.stitchScreen}\` | \`${route.stitchScreen}/screen.png\` | \`${route.path}\` | \`todo\` | Scaffolded placeholder with loading.tsx and error.tsx |\n`;
}

fs.writeFileSync(path.join(STITCH_DIR, "CONVERSION_LOG.md"), conversionTable);
console.log("Stitch directory structure and conversion log successfully created!");
