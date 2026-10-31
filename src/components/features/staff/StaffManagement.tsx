"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import {
  Users,
  ShieldCheck,
  Shield,
  Laptop,
  Search,
  Plus,
  Download,
  History,
  ChevronRight,
  UserCheck,
  Check,
  Copy,
  RefreshCw,
  KeyRound,
  MoreVertical,
  CheckCircle2,
  X,
  Lock,
  AlertTriangle,
} from "lucide-react";

interface StaffMember {
  id: string;
  name: string;
  initials: string;
  email: string;
  title: string;
  role: "admin" | "staff";
  isOwner?: boolean;
  lastActive: string;
  isOnline?: boolean;
  status: "active" | "inactive";
  twoFactorEnabled: boolean;
}

const INITIAL_STAFF: StaffMember[] = [
  {
    id: "usr-1",
    name: "Riya Sharma",
    initials: "RS",
    email: "riya.sharma@brightloop.io",
    title: "Director of Revenue Operations",
    role: "admin",
    isOwner: true,
    lastActive: "Active now (Current session)",
    isOnline: true,
    status: "active",
    twoFactorEnabled: true,
  },
  {
    id: "usr-2",
    name: "Aman Verma",
    initials: "AV",
    email: "aman.verma@brightloop.io",
    title: "Billing Operations Lead",
    role: "staff",
    lastActive: "24m ago",
    status: "active",
    twoFactorEnabled: true,
  },
  {
    id: "usr-3",
    name: "Neha Kapoor",
    initials: "NK",
    email: "neha.kapoor@brightloop.io",
    title: "Finance Analyst",
    role: "staff",
    lastActive: "3h ago",
    status: "active",
    twoFactorEnabled: true,
  },
];

export function StaffManagement() {
  const [staffList, setStaffList] = useState<StaffMember[]>(INITIAL_STAFF);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [modalOpen, setModalOpen] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);
  const [tempToken, setTempToken] = useState("lp_temp_88d92F!x");
  const [policyModalOpen, setPolicyModalOpen] = useState(false);

  // New staff form state
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newTitle, setNewTitle] = useState("Operations Associate");
  const [newRole, setNewRole] = useState<"admin" | "staff">("staff");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return staffList.filter((s) => {
      const q = search.toLowerCase();
      const matchesSearch =
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.title.toLowerCase().includes(q);
      const matchesRole = roleFilter === "ALL" || s.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [staffList, search, roleFilter]);

  const handleGenerateNewToken = () => {
    const randomStr = Math.random().toString(36).substring(2, 9);
    setTempToken(`lp_temp_${randomStr}!x`);
  };

  const handleCopyToken = () => {
    navigator.clipboard.writeText(tempToken);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const handleInviteStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) return;

    const initials = newName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    const created: StaffMember = {
      id: `usr-${Date.now()}`,
      name: newName,
      initials: initials,
      email: newEmail,
      title: newTitle,
      role: newRole,
      lastActive: "Invited (Pending setup)",
      status: "active",
      twoFactorEnabled: true,
    };

    setStaffList([...staffList, created]);
    setToastMessage(`Invitation dispatched to ${created.email}!`);
    setModalOpen(false);
    setNewName("");
    setNewEmail("");
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Staff Name,Email,Title,Role,Last Active,Status",
        ...filtered.map(
          (s) => `"${s.name}","${s.email}","${s.title}","${s.role}","${s.lastActive}","${s.status}"`
        ),
      ].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `staff_directory_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation Breadcrumb & Page Header */}
      <div className="flex flex-col gap-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span className="hover:text-slate-900 dark:hover:text-white transition">Admin</span>
              <ChevronRight className="size-3.5 text-slate-400" />
              <span className="text-slate-900 dark:text-white font-semibold">Staff</span>
            </nav>
            <div className="flex items-center gap-3 mt-1">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                Staff
              </h1>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 text-xs font-semibold shadow-sm">
                <ShieldCheck className="size-3.5" />
                <span className="uppercase text-[11px] font-semibold">Admin only</span>
              </div>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
              Manage team members, RBAC authorization boundaries, and billing administration access.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => alert("Audit log: All staff actions are signed and immutable under Ledger Section 4")}
              leftIcon={<History className="size-4" />}
            >
              Audit log
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              leftIcon={<Download className="size-4" />}
            >
              Export CSV
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setModalOpen(true)}
              leftIcon={<Plus className="size-4" />}
            >
              Add staff member
            </Button>
          </div>
        </div>

        {/* Metric Summary Cards (3 cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1 */}
          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Total Staff
              </span>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Users className="size-4" />
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-1">
              <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {staffList.length} Members
              </span>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                <span>1 Super Admin</span>
                <span className="text-slate-300 dark:text-slate-700">/</span>
                <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
                <span>{staffList.length - 1} Staff Roles</span>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Security & 2FA
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="size-4" />
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  100%
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
                  Enforced
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Hardware token & TOTP active across all users
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Active Sessions
              </span>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Laptop className="size-4" />
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  3 Concurrent
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <span>India IP Ranges (AP-South-1)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300 text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="size-4 text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Staff Table Container */}
      <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
        {/* Filters Toolbar */}
        <div className="p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800">
          <div className="relative flex-1 max-w-sm">
            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search name, email, or role... ⌘K"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="h-9 px-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="ALL">All roles</option>
              <option value="admin">Super Admin</option>
              <option value="staff">Internal staff</option>
            </select>
            <span className="text-xs text-slate-400">
              Showing {filtered.length} of {staffList.length} members
            </span>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase text-[11px] font-semibold tracking-wider border-b border-slate-200 dark:border-slate-800">
                <th className="py-3 px-4 font-semibold">Staff Member</th>
                <th className="py-3 px-4 font-semibold">Email Address</th>
                <th className="py-3 px-4 font-semibold">Role & Scope</th>
                <th className="py-3 px-4 font-semibold">Last Active</th>
                <th className="py-3 px-4 font-semibold">Account Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center shrink-0">
                        <span>{s.initials}</span>
                        {s.isOnline && (
                          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900"></span>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900 dark:text-white">{s.name}</span>
                          {s.isOwner && (
                            <span className="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] uppercase font-bold tracking-tight">
                              Owner
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-400">{s.title}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs text-slate-600 dark:text-slate-400">
                    {s.email}
                  </td>
                  <td className="py-3.5 px-4">
                    {s.role === "admin" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
                        <Shield className="size-3" />
                        Super Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold">
                        <UserCheck className="size-3" />
                        Internal staff
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    {s.isOnline ? (
                      <div className="flex items-center gap-1.5 text-xs text-slate-800 dark:text-slate-200 font-medium">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                        <span>{s.lastActive}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 font-medium">{s.lastActive}</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Active
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {s.isOwner ? (
                      <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-400 text-[11px] font-medium">
                        Protected
                      </span>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => alert(`Edit RBAC capabilities for ${s.name}`)}
                      >
                        Edit access
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Governance Matrix Explainer */}
      <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
            <Shield className="size-5" />
          </div>
          <div className="flex flex-col gap-0.5">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              RBAC Boundary Governance
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl">
              Staff permissions are globally enforced across API calls, manual ledger overrides, and batch billing runs. Only Super Admins can alter discount schemes or SAC configurations.
            </p>
          </div>
        </div>
        <div className="shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPolicyModalOpen(true)}
          >
            View RBAC Policy Specification
          </Button>
        </div>
      </div>

      {/* Invite Staff Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Staff Member"
      >
        <form onSubmit={handleInviteStaff} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Name *
              </label>
              <Input
                required
                placeholder="e.g. Rahul Mehta"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Work Email *
              </label>
              <Input
                required
                type="email"
                placeholder="name@brightloop.io"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Job Title / Designation
            </label>
            <Input
              placeholder="e.g. Finance Operations Associate"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
          </div>

          {/* Token / Temporary Password Generator */}
          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Temporary Access Token
              </label>
              <span className="text-[11px] text-slate-400">Auto-expiring in 24 hours</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-9 px-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-xs text-indigo-600 dark:text-indigo-400 flex items-center justify-between select-all">
                <span>{tempToken}</span>
                <KeyRound className="size-3.5 text-indigo-500" />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleGenerateNewToken}
                leftIcon={<RefreshCw className="size-3.5" />}
              >
                New
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopyToken}
                leftIcon={copiedToken ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
              >
                {copiedToken ? "Copied" : "Copy"}
              </Button>
            </div>
          </div>

          {/* Role Radio Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Assigned Role
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`p-3 rounded-lg border cursor-pointer flex items-start gap-3 transition ${
                  newRole === "staff"
                    ? "border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/20"
                    : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40"
                }`}
              >
                <input
                  type="radio"
                  name="staff_role"
                  value="staff"
                  checked={newRole === "staff"}
                  onChange={() => setNewRole("staff")}
                  className="mt-0.5 text-indigo-600"
                />
                <div className="flex flex-col">
                  <span className="font-semibold text-xs text-slate-900 dark:text-white">
                    Internal staff
                  </span>
                  <span className="text-[11px] text-slate-500 mt-0.5">
                    Day-to-day billing runs, subscriptions, and issue invoices.
                  </span>
                </div>
              </label>

              <label
                className={`p-3 rounded-lg border cursor-pointer flex items-start gap-3 transition ${
                  newRole === "admin"
                    ? "border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/20"
                    : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40"
                }`}
              >
                <input
                  type="radio"
                  name="staff_role"
                  value="admin"
                  checked={newRole === "admin"}
                  onChange={() => setNewRole("admin")}
                  className="mt-0.5 text-indigo-600"
                />
                <div className="flex flex-col">
                  <span className="font-semibold text-xs text-slate-900 dark:text-white">
                    Super Admin
                  </span>
                  <span className="text-[11px] text-slate-500 mt-0.5">
                    Full authority: discounts, GST/SAC tax rules, user provisioning.
                  </span>
                </div>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Send Invitation
            </Button>
          </div>
        </form>
      </Modal>

      {/* RBAC Policy Modal */}
      <Modal
        isOpen={policyModalOpen}
        onClose={() => setPolicyModalOpen(false)}
        title="RBAC Policy Specification"
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/50 rounded-lg text-indigo-900 dark:text-indigo-200">
            <strong>Internal Staff</strong> can execute billing runs, manage customer agreements, view invoices, and reconcile payments.
          </div>
          <div className="p-3 bg-purple-50 dark:bg-purple-950/50 rounded-lg text-purple-900 dark:text-purple-200">
            <strong>Super Admin</strong> retains exclusive control over Discount percentage rules, SAC codes, Dunning timelines, and team membership.
          </div>
          <div className="flex justify-end pt-2">
            <Button variant="primary" size="sm" onClick={() => setPolicyModalOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
