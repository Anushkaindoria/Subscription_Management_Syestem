"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetPasswordRequestSchema, ResetPasswordRequest } from "@/contracts/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PasswordStrengthMeter } from "@/components/ui/PasswordStrengthMeter";
import { Lock, Eye, EyeOff, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordRequest>({
    resolver: zodResolver(ResetPasswordRequestSchema),
    defaultValues: {
      token: "demo-token-xyz-123",
      newPassword: "",
    },
  });

  const pwd = watch("newPassword") || "";

  const onSubmit = async (data: ResetPasswordRequest) => {
    setApiError(null);
    try {
      const res = await fetch("/api/auth/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok || result.error) {
        setApiError(result.error?.message || "Failed to reset password. The link may have expired or is invalid.");
        return;
      }
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch {
      setApiError("A network error occurred while resetting your password. Please try again.");
    }
  };

  return (
    <div className="w-full">
      <div className="bg-white dark:bg-slate-900 rounded-[14px] border border-slate-200 dark:border-slate-800 p-8 sm:p-10 shadow-sm hover:shadow-md transition-shadow">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2 lg:hidden">
            <span className="size-2 rounded-full bg-indigo-600" />
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Security
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Create new password
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Choose a secure password to protect your LoopOS workspace.
          </p>
        </div>

        {/* Inline Error Banner */}
        {apiError && (
          <div
            role="alert"
            className="mb-6 p-3.5 rounded-[10px] bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 flex items-start gap-3 transition-all"
          >
            <AlertCircle className="size-5 shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
            <div className="text-xs leading-relaxed">
              <span className="font-semibold block text-red-800 dark:text-red-300">
                Reset failed
              </span>
              <span>{apiError}</span>
            </div>
          </div>
        )}

        {isSuccess ? (
          <div className="text-center py-6 space-y-4">
            <div className="size-12 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="size-5" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                Password updated successfully
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                Your credentials have been securely updated. Redirecting you to the sign-in page...
              </p>
            </div>
            <div className="pt-2">
              <Link href="/login" className="w-full block">
                <Button variant="primary" size="md" className="w-full">
                  Proceed to Sign In
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <input type="hidden" {...register("token")} />

            <div className="space-y-3">
              <Input
                label="New Password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                autoComplete="new-password"
                leftIcon={<Lock className="size-4" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                }
                error={errors.newPassword?.message}
                {...register("newPassword")}
              />

              {/* Live Password Strength Meter & Security Checklist */}
              <PasswordStrengthMeter password={pwd} showChecklist={true} />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full"
              isLoading={isSubmitting}
              rightIcon={<ArrowRight className="size-4" />}
            >
              Update password
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
