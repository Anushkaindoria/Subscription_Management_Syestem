"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ForgotPasswordRequestSchema, ForgotPasswordRequest } from "@/contracts/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Mail, ArrowLeft, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [isSent, setIsSent] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordRequest>({
    resolver: zodResolver(ForgotPasswordRequestSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordRequest) => {
    setApiError(null);
    try {
      const res = await fetch("/api/auth/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok || result.error) {
        setApiError(result.error?.message || "Failed to send reset instructions. Please check the email address.");
        return;
      }
      setIsSent(true);
    } catch {
      setApiError("A network error occurred. Please try again.");
    }
  };

  return (
    <div className="w-full">
      <div className="bg-white dark:bg-slate-900 rounded-[14px] border border-slate-200 dark:border-slate-800 p-8 sm:p-10 shadow-sm hover:shadow-md transition-shadow">
        <div className="mb-6">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 mb-4 transition-colors"
          >
            <ArrowLeft className="size-4" />
            <span>Back to sign in</span>
          </Link>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Forgot password?
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1.5">
            Enter your registered work email and we will send a password reset link.
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
                Request failed
              </span>
              <span>{apiError}</span>
            </div>
          </div>
        )}

        {isSent ? (
          <div className="text-center py-6 space-y-4">
            <div className="size-12 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="size-5" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                Reset link dispatched
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                If an account exists with that email address, you will receive password reset instructions shortly.
              </p>
            </div>
            <div className="pt-2">
              <Link href="/login" className="w-full block">
                <Button variant="secondary" size="md" className="w-full">
                  Return to Login
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <Input
              label="Work Email"
              type="email"
              placeholder="name@company.com"
              autoComplete="email"
              leftIcon={<Mail className="size-4" />}
              error={errors.email?.message}
              {...register("email")}
            />

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full"
              isLoading={isSubmitting}
              rightIcon={<ArrowRight className="size-4" />}
            >
              Send reset instructions
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
