"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetPasswordRequestSchema, ResetPasswordRequest } from "@/contracts/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Lock, Eye, EyeOff, ArrowRight, CheckCircle, CheckCircle2, AlertCircle } from "lucide-react";

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
  const passwordChecks = [
    { label: "At least 9 characters", passed: pwd.length > 8 },
    { label: "One uppercase letter", passed: /[A-Z]/.test(pwd) },
    { label: "One lowercase letter", passed: /[a-z]/.test(pwd) },
    { label: "One special character (!@#$%^&*)", passed: /[^A-Za-z0-9]/.test(pwd) },
  ];

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
        setApiError(result.error?.message || "Failed to reset password. The link may have expired.");
        return;
      }
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch {
      setApiError("A network error occurred. Please try again.");
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[14px] border border-slate-200 dark:border-slate-800 p-8 sm:p-10 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          Create new password
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Choose a secure password to protect your LoopOS workspace.
        </p>
      </div>

      {apiError && (
        <div className="mb-6 p-3.5 rounded-[10px] bg-red-50 dark:bg-red-950/30 border border-red-200 text-red-700 dark:text-red-400 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-600" />
          <span className="text-xs">{apiError}</span>
        </div>
      )}

      {isSuccess ? (
        <div className="text-center py-6">
          <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2">
            Password updated successfully
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
            Redirecting you to the sign-in page...
          </p>
          <Link href="/login">
            <Button variant="primary" size="md" className="w-full">
              Proceed to Sign In
            </Button>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <input type="hidden" {...register("token")} />

          <div>
            <Input
              label="New Password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              autoComplete="new-password"
              leftIcon={<Lock className="w-4 h-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              error={errors.newPassword?.message}
              {...register("newPassword")}
            />

            {/* Real-time Password Rules Checklist */}
            <div className="mt-2.5 p-3 rounded-[8px] bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Security Constraints
              </span>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                {passwordChecks.map((req, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <CheckCircle
                      className={`w-3.5 h-3.5 ${
                        req.passed ? "text-emerald-500" : "text-slate-300 dark:text-slate-600"
                      }`}
                    />
                    <span
                      className={
                        req.passed ? "text-slate-700 dark:text-slate-200" : "text-slate-400"
                      }
                    >
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full"
            isLoading={isSubmitting}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Update password
          </Button>
        </form>
      )}
    </div>
  );
}
