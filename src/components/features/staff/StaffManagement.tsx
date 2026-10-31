"use client";

import React, { useState } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { StatusPill } from "@/components/ui/StatusPill";
import { Toggle } from "@/components/ui/Toggle";
import { MOCK_USERS } from "@/mocks";
import { ShieldAlert, Plus, Check, UserCheck, Mail } from "lucide-react";

export function StaffManagement() {
  const [staffList, setStaffList] = useState(MOCK_USERS);
  const [modalOpen, setModalOpen] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    role: "staff",
  });

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    const newMember = {
      id: `usr_staff_${Date.now()}`,
      name: formState.name || "Kavita Rao",
      email: formState.email || "kavita.rao@brightloop.io",
      role: formState.role as any,
      active: true,
    };
    setStaffList([...staffList, newMember]);
    setSuccess(`Invitation sent to ${newMember.email}!`);
    setTimeout(() => {
      setSuccess(null);
      setModalOpen(false);
    }, 1200);
  };

  const toggleStaffStatus = (id: string) => {
    setStaffList(
      staffList.map((s: any) => (s.id === id ? { ...s, active: !(s as any).active } : s))
    );
  };

  const columns = [
    {
      key: "name",
      header: "Staff Member",
      render: (s: any) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 font-bold text-xs flex items-center justify-center">
            {s.name
              .split(" ")
              .map((n: string) => n[0])
              .join("")}
          </div>
          <div>
            <div className="font-semibold text-slate-900 dark:text-white">{s.name}</div>
            <div className="text-xs text-slate-400">{s.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role Assignment",
      render: (s: any) => <StatusPill status={s.role} />,
    },
    {
      key: "status",
      header: "Active Status",
      render: (s: any) => (
        <Toggle
          checked={s.active !== false}
          onChange={() => toggleStaffStatus(s.id)}
          disabled={s.role === "admin"}
        />
      ),
    },
    {
      key: "permissions",
      header: "Access Rights",
      render: (s: any) => (
        <span className="text-xs text-slate-500">
          {s.role === "admin"
            ? "Full Platform Access (Catalog, Rules, Admin)"
            : "Operations (Subscriptions, Invoices, Billing)"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Staff Team & Role Governance
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
              ADMIN ONLY
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Provision staff operators, manage roles, and enforce administrative separation of duties.
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setModalOpen(true)}
        >
          Invite Staff
        </Button>
      </div>

      <DataTable columns={columns} data={staffList} />

      {/* Invite Modal */}
      {modalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setModalOpen(false)}
          title="Invite Staff Team Member"
          description="Grant team access to manage subscriptions, invoices, and run billing batches."
        >
          {success ? (
            <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>{success}</span>
            </div>
          ) : (
            <form onSubmit={handleInvite} className="space-y-4">
              <Input
                label="Full Name"
                placeholder="Aman Verma"
                value={formState.name}
                onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                required
              />

              <Input
                label="Company Email"
                type="email"
                placeholder="aman.verma@brightloop.io"
                value={formState.email}
                onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                required
              />

              <Select
                label="Role Assignment"
                value={formState.role}
                onChange={(e) => setFormState({ ...formState, role: e.target.value })}
                options={[
                  { value: "staff", label: "Staff Operator (Restricted from Tax/Rules/Staff)" },
                  { value: "admin", label: "Administrator (Full System Control)" },
                ]}
              />

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <Button variant="secondary" size="sm" type="button" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Dispatch Invite
                </Button>
              </div>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
}
