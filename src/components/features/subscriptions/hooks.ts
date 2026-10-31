import { apiClient } from "@/lib/api-client";
import { Subscription } from "@/contracts/subscription";
import { PaginatedResult } from "@/contracts/common";

export async function fetchSubscriptions(page = 1, pageSize = 25): Promise<PaginatedResult<Subscription>> {
  return await apiClient<PaginatedResult<Subscription>>(`/api/subscriptions?page=${page}&pageSize=${pageSize}`);
}

export async function fetchSubscriptionById(id: string): Promise<Subscription> {
  return await apiClient<Subscription>(`/api/subscriptions/${id}`);
}
