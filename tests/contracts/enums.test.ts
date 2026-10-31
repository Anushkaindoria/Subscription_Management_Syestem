import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import {
  RoleValues,
  SubscriptionStatusValues,
  InvoiceStatusValues,
} from "@/contracts/enums";

function extractPrismaEnum(schemaContent: string, enumName: string): string[] {
  const regex = new RegExp(`enum\\s+${enumName}\\s+\\{([^}]+)\\}`, "m");
  const match = schemaContent.match(regex);
  if (!match) throw new Error(`Enum ${enumName} not found in schema.prisma`);
  return match[1]
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith("//"))
    .map((val) => val.toLowerCase());
}

describe("Contract Guardrail: Prisma vs. src/contracts/enums.ts", () => {
  const schemaPath = path.resolve(__dirname, "../../prisma/schema.prisma");
  const schemaContent = fs.readFileSync(schemaPath, "utf-8");

  it("verifies Role enum matches exactly", () => {
    const prismaRoles = extractPrismaEnum(schemaContent, "Role");
    expect([...prismaRoles].sort()).toEqual([...RoleValues].sort());
  });

  it("verifies SubscriptionStatus enum matches exactly", () => {
    const prismaStatuses = extractPrismaEnum(schemaContent, "SubscriptionStatus");
    expect([...prismaStatuses].sort()).toEqual([...SubscriptionStatusValues].sort());
  });

  it("verifies InvoiceStatus enum matches exactly", () => {
    const prismaStatuses = extractPrismaEnum(schemaContent, "InvoiceStatus");
    expect([...prismaStatuses].sort()).toEqual([...InvoiceStatusValues].sort());
  });
});
