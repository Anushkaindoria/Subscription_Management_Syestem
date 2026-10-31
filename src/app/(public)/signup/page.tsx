"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupRequestSchema, SignupRequest } from "@/contracts/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PasswordStrengthMeter } from "@/components/ui/PasswordStrengthMeter";
import { User, Mail, Building2, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupRequest>({
    resolver: zodResolver(SignupRequestSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      companyName: "",
    },
  });

  const pwd = watch("password") || "";

  const onSubmit = async (data: SignupRequest) => {
    setApiError(null);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok || result.error) {
        setApiError(result.error?.message || "Failed to create account. Please check your information and try again.");
        return;
      }
      router.push("/admin");
    } catch {
      setApiError("A network error occurred while creating your account. Please try again.");
    }
  };

  return (
    <div className="w-full">
      <div className="bg-white dark:bg-slate-900 rounded-[14px] border border-slate-200 dark:border-slate-800 p-8 sm:p-10 shadow-sm hover:shadow-md transition-shadow">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2 lg:hidden">
            <span className="size-2 rounded-full bg-indigo-600" />
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              LoopOS Register
            </span>
          </div>
          <h2 className="text-2xl sm:text-[28px] font-bold text-slate-900 dark:text-white tracking-tight">
            Create an account
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Start automating recurring billing and tax compliance
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
                Registration failed
              </span>
              <span>{apiError}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <Input
            label="Full Name"
            placeholder="Riya Sharma"
            autoComplete="name"
            leftIcon={<User className="size-4" />}
            error={errors.name?.message}
            {...register("name")}
          />

          <Input
            label="Work Email"
            type="email"
            placeholder="name@company.com"
            autoComplete="email"
            leftIcon={<Mail className="size-4" />}
            error={errors.email?.message}
            {...register("email")}
          />

          <Input
            label="Company Name"
            placeholder="Acme Retail Pvt Ltd"
            autoComplete="organization"
            leftIcon={<Building2 className="size-4" />}
            error={errors.companyName?.message}
            {...register("companyName")}
          />

          <div className="space-y-3">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
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
              error={errors.password?.message}
              {...register("password")}
            />

            {/* Live Password Strength Bar & Checklist */}
            <PasswordStrengthMeter password={pwd} showChecklist={true} />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full mt-2"
            isLoading={isSubmitting}
            rightIcon={<ArrowRight className="size-4" />}
          >
            Create account
          </Button>
        </form>

        <div className="text-center pt-5 mt-6 border-t border-slate-100 dark:border-slate-800">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
