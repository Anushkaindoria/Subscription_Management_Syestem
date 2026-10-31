/**
 * Subscriptions Module Service
 * OWNER: Dev B (@devB)
 *
 * Implements strict lifecycle state machine:
 * DRAFT -> QUOTATION -> CONFIRMED -> ACTIVE -> CLOSED
 */

import {
  SubscriptionDTO,
  CreateSubscriptionDTO,
  SubscriptionStatusType,
} from "@/contracts";
import { config } from "@/lib/config";
import { clock } from "@/lib/clock";
import { BusinessRuleError, NotFoundError } from "@/lib/errors";
import { subscriptionRepo } from "./repo";

const ALLOWED_TRANSITIONS: Record<SubscriptionStatusType, SubscriptionStatusType[]> = {
  DRAFT: ["QUOTATION", "CLOSED"],
  QUOTATION: ["CONFIRMED", "CLOSED"],
  CONFIRMED: ["ACTIVE", "CLOSED"],
  ACTIVE: ["CLOSED"],
  CLOSED: [], // Terminal state
};

const MOCK_SUBSCRIPTIONS: SubscriptionDTO[] = [
  {
    id: "sub_mock_001",
    customerId: "cust_acme_corp",
    customerName: "Acme Industrial Corp",
    status: "ACTIVE",
    startDate: "2026-01-01T00:00:00.000Z",
    endDate: "2026-12-31T23:59:59.000Z",
    nextBillingDate: "2026-11-01T00:00:00.000Z",
    renewalInterval: "MONTHLY",
    autoRenew: true,
    lines: [
      {
        id: "sub_line_1",
        productId: "prod_crm",
        productName: "LoopCRM Enterprise",
        variantId: "var_crm_starter",
        variantName: "Standard 10 Seats",
        planId: "plan_monthly",
        planName: "Monthly Pro",
        quantity: 1,
        unitPrice: 9900,
      },
    ],
    totalRecurringMinor: 9900,
  },
  {
    id: "sub_mock_002",
    customerId: "cust_globex",
    customerName: "Globex Global Logistics",
    status: "QUOTATION",
    startDate: "2026-11-01T00:00:00.000Z",
    endDate: "2027-10-31T23:59:59.000Z",
    nextBillingDate: null,
    renewalInterval: "ANNUALLY",
    autoRenew: true,
    lines: [
      {
        id: "sub_line_2",
        productId: "prod_crm",
        productName: "LoopCRM Enterprise",
        variantId: "var_crm_unlimited",
        variantName: "Enterprise Unlimited",
        planId: "plan_annual",
        planName: "Annual Enterprise",
        quantity: 2,
        unitPrice: 114000,
      },
    ],
    totalRecurringMinor: 228000,
  },
];

export class SubscriptionService {
  async listSubscriptions(customerId?: string): Promise<SubscriptionDTO[]> {
    if (config.isMockApi) {
      if (customerId) {
        return MOCK_SUBSCRIPTIONS.filter((s) => s.customerId === customerId);
      }
      return MOCK_SUBSCRIPTIONS;
    }
    // Real implementation calls repo
    return MOCK_SUBSCRIPTIONS;
  }

  async getSubscriptionById(id: string): Promise<SubscriptionDTO> {
    if (config.isMockApi) {
      const found = MOCK_SUBSCRIPTIONS.find((s) => s.id === id);
      if (!found) throw new NotFoundError("Subscription", id);
      return found;
    }
    const sub = await subscriptionRepo.findById(id);
    if (!sub) throw new NotFoundError("Subscription", id);
    // Real repo mapping
    return MOCK_SUBSCRIPTIONS[0];
  }

  async createSubscription(dto: CreateSubscriptionDTO): Promise<SubscriptionDTO> {
    if (config.isMockApi) {
      const newSub: SubscriptionDTO = {
        id: `sub_mock_${Date.now()}`,
        customerId: dto.customerId,
        customerName: "Demo Customer",
        status: "DRAFT",
        startDate: dto.startDate,
        renewalInterval: dto.renewalInterval,
        lines: dto.lines,
        totalRecurringMinor: (dto.lines || []).reduce((acc: number, l: any) => acc + (l.unitPrice || 0) * (l.quantity || 1), 0),
      };
      return newSub;
    }
    // Dev B: create in DB
    return MOCK_SUBSCRIPTIONS[0];
  }

  async transitionStatus(
    subscriptionId: string,
    targetStatus: SubscriptionStatusType,
  ): Promise<SubscriptionDTO> {
    const sub = await this.getSubscriptionById(subscriptionId);

    const allowed = ALLOWED_TRANSITIONS[sub.status] || [];
    if (!allowed.includes(targetStatus)) {
      throw new BusinessRuleError(
        `Invalid lifecycle transition from '${sub.status}' to '${targetStatus}'. Allowed: [${allowed.join(", ")}]`,
      );
    }

    if (config.isMockApi) {
      sub.status = targetStatus;
      if (targetStatus === "ACTIVE" && !sub.nextBillingDate) {
        sub.nextBillingDate = clock.now().toISOString();
      }
      return sub;
    }

    // Dev B: update status in repo
    return sub;
  }
}

export const subscriptionService = new SubscriptionService();
