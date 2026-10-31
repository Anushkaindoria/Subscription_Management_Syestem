import { PortalSubscriptionsList } from "@/components/features/portal/PortalSubscriptionsList";

export const metadata = {
  title: "My Subscriptions | LoopOS Portal",
  description: "View and manage all active subscription agreements.",
};

export default function PortalSubscriptionsPage() {
  return <PortalSubscriptionsList />;
}
