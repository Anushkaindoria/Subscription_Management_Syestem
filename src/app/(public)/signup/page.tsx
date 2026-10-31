"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupRequestSchema, SignupRequest } from "@/contracts/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { User, Mail, Building, Lock, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle } from "lucide-react";

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
  const passwordChecks = [
    { label: "At least 9 characters", passed: pwd.length > 8 },
    { label: "One uppercase letter", passed: /[A-Z]/.test(pwd) },
    { label: "One lowercase letter", passed: /[a-z]/.test(pwd) },
    { label: "One special character (!@#$%^&*)", passed: /[^A-Za-z0-9]/.test(pwd) },
  ];

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
        setApiError(result.error?.message || "Failed to create account. Please try again.");
        return;
      }
      router.push("/admin");
    } catch {
      setApiError("A network error occurred. Please try again.");
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[14px] border border-slate-200 dark:border-slate-800 p-8 sm:p-10 shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-6">
        <h2 className="text-2xl sm:text-[28px] font-bold text-slate-900 dark:text-white tracking-tight">
          Create an account
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Start automating recurring billing and tax compliance
        </p>
      </div>

      {apiError && (
        <div className="mb-6 p-3.5 rounded-[10px] bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-600" />
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
          leftIcon={<User className="w-4 h-4" />}
          error={errors.name?.message}
          {...register("name")}
        />

        <Input
          label="Work Email"
          type="email"
          placeholder="name@company.com"
          autoComplete="email"
          leftIcon={<Mail className="w-4 h-4" />}
          error={errors.email?.message}
          {...register("email")}
        />

        <Input
          label="Company Name"
          placeholder="Acme Retail Pvt Ltd"
          autoComplete="organization"
          leftIcon={<Building className="w-4 h-4" />}
          error={errors.companyName?.message}
          {...register("companyName")}
        />

        <div>
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a strong password"
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
            error={errors.password?.message}
            {...register("password")}
          />

          {/* Real-time Password Rules Checklist */}
          <div className="mt-2.5 p-3 rounded-[8px] bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Password Requirements
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
          className="w-full mt-2"
          isLoading={isSubmitting}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Create account
        </Button>
      </form>

      <div className="text-center pt-5 mt-6 border-t border-slate-100 dark:border-slate-800">
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
