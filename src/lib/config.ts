/**
 * Shared Infrastructure: Application Configuration & Flags
 * OWNER: Dev A (@devA)
 */

export const config = {
  isMockApi: process.env.MOCK_API === "true",
  isProduction: process.env.NODE_ENV === "production",
  port: parseInt(process.env.PORT || "3000", 10),
  jwtSecret: process.env.JWT_SECRET || "default_dev_secret_change_in_production",
  databaseUrl: process.env.DATABASE_URL || "",
};
