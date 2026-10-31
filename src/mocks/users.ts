import { SessionUser } from "@/contracts/auth";
import { Staff } from "@/contracts/staff";

export const MOCK_ADMIN_USER: SessionUser = {
  id: "usr_admin_riya",
  name: "Riya Sharma",
  email: "riya.sharma@loopos.local",
  role: "admin",
  customerId: null,
};

export const MOCK_STAFF_MEMBERS: Staff[] = [
  {
    id: "usr_staff_aman",
    name: "Aman Verma",
    email: "aman.verma@loopos.local",
    role: "staff",
    active: true,
    department: "Customer Operations",
    createdAt: "2026-01-10T00:00:00.000Z",
  },
  {
    id: "usr_staff_neha",
    name: "Neha Kapoor",
    email: "neha.kapoor@loopos.local",
    role: "staff",
    active: true,
    department: "Billing & Collections",
    createdAt: "2026-02-01T00:00:00.000Z",
  },
];
