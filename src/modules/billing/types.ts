export interface BillingCycleContext {
  subscriptionId: string;
  periodStart: Date;
  periodEnd: Date;
  dueDate: Date;
}
