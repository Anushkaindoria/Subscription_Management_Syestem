"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PasswordPolicySchema } from "@/contracts/auth.contract";
import { MOCK_CUSTOMERS } from "@/mocks";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Building2,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Check,
  Eye,
  EyeOff,
  User,
  Save,
} from "lucide-react";

const ProfileDetailsSchema = z.object({
  name: z.string().min(2, "Company name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  taxId: z.string().min(15, "GSTIN must be 15 alphanumeric characters"),
  address: z.string().min(5, "Address is required"),
});
type ProfileDetails = z.infer<typeof ProfileDetailsSchema>;

const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: PasswordPolicySchema,
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
type ChangePassword = z.infer<typeof ChangePasswordSchema>;

export function PortalProfile() {
  const currentCustomer = MOCK_CUSTOMERS[0];

  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

  // Profile Form
  const {
    register: regProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors, isSubmitting: isProfileSubmitting },
  } = useForm<ProfileDetails>({
    resolver: zodResolver(ProfileDetailsSchema),
    defaultValues: {
      name: currentCustomer.name,
      email: currentCustomer.email,
      phone: currentCustomer.phone || "",
      taxId: currentCustomer.taxId || "",
      address: currentCustomer.address || "",
    },
  });

  // Password Form
  const {
    register: regPw,
    handleSubmit: handlePwSubmit,
    watch: watchPw,
    reset: resetPw,
    formState: { errors: pwErrors, isSubmitting: isPwSubmitting },
  } = useForm<ChangePassword>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPasswordValue = watchPw("newPassword") || "";

  // Password strength checklist
  const rules = [
    { label: "More than 8 characters", met: newPasswordValue.length > 8 },
    { label: "At least one uppercase letter (A-Z)", met: /[A-Z]/.test(newPasswordValue) },
    { label: "At least one lowercase letter (a-z)", met: /[a-z]/.test(newPasswordValue) },
    { label: "At least one special character (!@#$%...)", met: /[^A-Za-z0-9]/.test(newPasswordValue) },
  ];

  const onSaveProfile = async (data: ProfileDetails) => {
    await new Promise((res) => setTimeout(res, 600));
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 3500);
  };

  const onSavePassword = async (data: ChangePassword) => {
    await new Promise((res) => setTimeout(res, 600));
    setPasswordSuccess(true);
    resetPw();
    setTimeout(() => setPasswordSuccess(false), 3500);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Company Profile & Security
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your organization details, GSTIN tax credentials, and portal authentication credentials.
        </p>
      </div>

      {/* Section 1: Company Profile */}
      <div className="bg-white dark:bg-[#121722] rounded-[16px] border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Organization & Billing Identity
              </h2>
              <p className="text-xs text-slate-500">
                Primary contact details reflected on invoices and statements.
              </p>
            </div>
          </div>

          {profileSuccess && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Profile updated</span>
            </div>
          )}
        </div>

        <form onSubmit={handleProfileSubmit(onSaveProfile)} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <Input
                label="Company Legal Name *"
                {...regProfile("name")}
                error={profileErrors.name?.message}
              />
            </div>

            <div>
              <Input
                label="GSTIN / Tax ID *"
                {...regProfile("taxId")}
                error={profileErrors.taxId?.message}
              />
            </div>

            <div>
              <Input
                label="Billing Email Address *"
                type="email"
                leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
                {...regProfile("email")}
                error={profileErrors.email?.message}
              />
            </div>

            <div>
              <Input
                label="Primary Phone Number *"
                leftIcon={<Phone className="w-4 h-4 text-slate-400" />}
                {...regProfile("phone")}
                error={profileErrors.phone?.message}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Registered Billing Address *
              </label>
              <textarea
                rows={2}
                className="w-full px-3.5 py-2.5 rounded-[10px] text-sm bg-slate-50 dark:bg-[#0A0D14] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                {...regProfile("address")}
              />
              {profileErrors.address && (
                <p className="text-xs text-red-500 mt-1">
                  {profileErrors.address.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              variant="primary"
              isLoading={isProfileSubmitting}
              className="bg-emerald-600 hover:bg-emerald-500 text-white"
            >
              <Save className="w-4 h-4 mr-1.5" />
              Save Profile
            </Button>
          </div>
        </form>
      </div>

      {/* Section 2: Password & Security */}
      <div className="bg-white dark:bg-[#121722] rounded-[16px] border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Change Password & Security
              </h2>
              <p className="text-xs text-slate-500">
                Update credentials for accessing your customer self-service portal.
              </p>
            </div>
          </div>

          {passwordSuccess && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Password updated</span>
            </div>
          )}
        </div>

        <form onSubmit={handlePwSubmit(onSavePassword)} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2 max-w-md">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Current Password *
              </label>
              <div className="relative">
                <input
                  type={showCurrentPw ? "text" : "password"}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 rounded-[10px] text-sm bg-slate-50 dark:bg-[#0A0D14] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  {...regPw("currentPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPw(!showCurrentPw)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {pwErrors.currentPassword && (
                <p className="text-xs text-red-500 mt-1">{pwErrors.currentPassword.message}</p>
              )}
            </div>

            <div className="max-w-md">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                New Password *
              </label>
              <div className="relative">
                <input
                  type={showNewPw ? "text" : "password"}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 rounded-[10px] text-sm bg-slate-50 dark:bg-[#0A0D14] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  {...regPw("newPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPw(!showNewPw)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {pwErrors.newPassword && (
                <p className="text-xs text-red-500 mt-1">{pwErrors.newPassword.message}</p>
              )}
            </div>

            <div className="max-w-md">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Confirm New Password *
              </label>
              <input
                type="password"
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 rounded-[10px] text-sm bg-slate-50 dark:bg-[#0A0D14] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                {...regPw("confirmPassword")}
              />
              {pwErrors.confirmPassword && (
                <p className="text-xs text-red-500 mt-1">{pwErrors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          {/* Password Checklist */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0A0D14] border border-slate-200/80 dark:border-slate-800 space-y-2 max-w-md">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Password Security Rules
            </span>
            <div className="space-y-1.5">
              {rules.map((rule, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs">
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                      rule.met
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-200 dark:bg-slate-800 text-slate-400"
                    }`}
                  >
                    {rule.met ? <Check className="w-2.5 h-2.5" /> : "•"}
                  </div>
                  <span
                    className={
                      rule.met
                        ? "text-slate-900 dark:text-slate-200 font-medium"
                        : "text-slate-500 dark:text-slate-400"
                    }
                  >
                    {rule.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              variant="primary"
              isLoading={isPwSubmitting}
              className="bg-emerald-600 hover:bg-emerald-500 text-white"
            >
              <ShieldCheck className="w-4 h-4 mr-1.5" />
              Update Password
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
