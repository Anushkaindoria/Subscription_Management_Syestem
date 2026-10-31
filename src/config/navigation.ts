import { ROUTES, AppRole } from "@/contracts/routes";

export interface NavItem {
  id: string;
  label: string;
  path: string;
  iconName: string;
  role: AppRole;
  mvp: boolean;
}

export interface NavGroup {
  groupName: string;
  items: NavItem[];
}

export const ADMIN_NAV_GROUPS: NavGroup[] = [
  {
    groupName: "Overview",
    items: [
      { id: "dashboard", label: "Dashboard", path: "/admin", iconName: "LayoutDashboard", role: "staff_or_admin", mvp: true },
    ],
  },
  {
    groupName: "Sales & Agreements",
    items: [
      { id: "subscriptions-list", label: "Subscriptions", path: "/admin/subscriptions", iconName: "Repeat", role: "staff_or_admin", mvp: true },
      { id: "customers-list", label: "Customers", path: "/admin/customers", iconName: "Users", role: "staff_or_admin", mvp: false },
      { id: "quotation-templates", label: "Templates", path: "/admin/templates", iconName: "FileSpreadsheet", role: "staff_or_admin", mvp: true },
    ],
  },
  {
    groupName: "Billing & Collections",
    items: [
      { id: "invoices-list", label: "Invoices", path: "/admin/invoices", iconName: "Receipt", role: "staff_or_admin", mvp: true },
      { id: "billing-run", label: "Billing Runs", path: "/admin/billing", iconName: "Zap", role: "staff_or_admin", mvp: true },
      { id: "payments", label: "Payments", path: "/admin/payments", iconName: "CreditCard", role: "staff_or_admin", mvp: true },
    ],
  },
  {
    groupName: "Catalog & Pricing",
    items: [
      { id: "products-list", label: "Products", path: "/admin/products", iconName: "Package", role: "staff_or_admin", mvp: true },
      { id: "plans-list", label: "Plans", path: "/admin/plans", iconName: "CalendarRange", role: "staff_or_admin", mvp: true },
    ],
  },
  {
    groupName: "Rules & Compliance",
    items: [
      { id: "discounts", label: "Discounts", path: "/admin/discounts", iconName: "Tag", role: "admin", mvp: true },
      { id: "tax-rules", label: "Tax Rules (GST)", path: "/admin/taxes", iconName: "Percent", role: "admin", mvp: true },
    ],
  },
  {
    groupName: "Insights",
    items: [
      { id: "reports", label: "Financial Reports", path: "/admin/reports", iconName: "BarChart3", role: "staff_or_admin", mvp: true },
      { id: "ask-your-data", label: "Ask Your Data", path: "/admin/ask", iconName: "Sparkles", role: "staff_or_admin", mvp: false },
    ],
  },
  {
    groupName: "Administration",
    items: [
      { id: "staff", label: "Staff Team", path: "/admin/staff", iconName: "ShieldAlert", role: "admin", mvp: true },
      { id: "settings", label: "Settings", path: "/admin/settings", iconName: "Settings", role: "admin", mvp: false },
    ],
  },
];

export const PORTAL_NAV_ITEMS: NavItem[] = [
  { id: "portal-home", label: "Home", path: "/portal", iconName: "Home", role: "customer", mvp: true },
  { id: "portal-subscriptions", label: "My Subscriptions", path: "/portal/subscriptions", iconName: "RefreshCw", role: "customer", mvp: true },
  { id: "portal-invoices", label: "Invoices & Receipts", path: "/portal/invoices", iconName: "FileText", role: "customer", mvp: true },
  { id: "portal-profile", label: "Company Profile", path: "/portal/profile", iconName: "User", role: "customer", mvp: false },
];

/**
 * Filters admin sidebar groups based on user's active role.
 * Staff users are blocked from admin-only routes.
 */
export function getAdminNavForRole(role: "admin" | "staff"): NavGroup[] {
  return ADMIN_NAV_GROUPS.map((group) => ({
    groupName: group.groupName,
    items: group.items.filter((item) => {
      if (item.role === "admin" && role !== "admin") {
        return false;
      }
      return true;
    }),
  })).filter((group) => group.items.length > 0);
}
