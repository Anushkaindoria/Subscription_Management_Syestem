import { FilterClause } from "./schema";

export interface NaturalLanguageParserResult {
  intent: "REVENUE" | "ACTIVE_SUBSCRIPTIONS" | "OVERDUE_INVOICES" | "UNKNOWN";
  filters: FilterClause[];
  confidence: number;
}
