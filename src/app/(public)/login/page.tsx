"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginRequestSchema, LoginRequest } from "@/contracts/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Shield,
  ShieldCheck,
  Building2,
  Users,
  Sparkles,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginRequest>({
    resolver: zodResolver(LoginRequestSchema),
    defaultValues: {
      email: "admin@loopos.io",
      password: "Password123!",
    },
  });

  const onSubmit = async (data: LoginRequest) => {
    setApiError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok || result.error) {
        setApiError(
          result.error?.message || "Invalid email or password. Please verify your credentials and try again."
        );
        return;
      }

      // Explicitly set browser session cookies for client-side persistence
      if (typeof window !== "undefined") {
        const token = result.data?.token || "mock_jwt_token_usr_mock_admin";
        const role = result.data?.user?.role || "admin";
        document.cookie = `session_token=${token}; path=/; max-age=604800`;
        document.cookie = `session_role=${role}; path=/; max-age=604800`;
        if (result.data?.user?.customerId) {
          document.cookie = `session_customer_id=${result.data.user.customerId}; path=/; max-age=604800`;
        }
      }

      // Successful login -> route based on user role
      if (result.data?.user?.role === "customer") {
        router.push("/portal");
      } else {
        router.push("/admin");
      }
    } catch {
      setApiError("A network error occurred while connecting to the auth service. Please try again.");
    }
  };

  const handleQuickLogin = (role: "admin" | "customer" | "staff") => {
    let email = "admin@loopos.io";
    if (role === "customer") email = "portal@brightloop.io";
    if (role === "staff") email = "staff@loopos.io";

    setValue("email", email);
    setValue("password", "Password123!");
    onSubmit({ email, password: "Password123!" });
  };

  return (
    <div className="w-full">
      {/* White Form Card matching Stitch Screen 01-login */}
      <div className="bg-white dark:bg-slate-900 rounded-[14px] border border-slate-200 dark:border-slate-800 p-8 sm:p-10 shadow-sm hover:shadow-md transition-shadow">
        {/* Card Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2 lg:hidden">
            <span className="size-2 rounded-full bg-indigo-600" />
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              LoopOS Auth
            </span>
          </div>
          <h2 className="text-2xl sm:text-[28px] font-bold text-slate-900 dark:text-white tracking-tight">
            Welcome back
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1.5">
            Enter your credentials or choose a 1-click demo role below
          </p>
        </div>

        {/* 1-Click Demo Logins */}
        <div className="mb-6 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Sparkles className="size-3 text-indigo-500" />
              1-Click Mock Credentials
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-semibold border border-emerald-200 dark:border-emerald-800">
              Instant Access
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin("admin")}
              className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 hover:ring-1 hover:ring-indigo-500/20 text-left transition-all group"
            >
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <ShieldCheck className="size-3.5 text-indigo-600 dark:text-indigo-400" />
                  Admin Console
                </span>
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                  Enter →
                </span>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-mono">
                admin@loopos.io
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin("customer")}
              className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 hover:ring-1 hover:ring-emerald-500/20 text-left transition-all group"
            >
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Building2 className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                  Customer Portal
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                  Enter →
                </span>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-mono">
                portal@brightloop.io
              </span>
            </button>
          </div>
        </div>

        {/* Inline Error Banner */}
        {apiError && (
          <div
            id="inline-error-banner"
            role="alert"
            className="mb-6 p-3.5 rounded-[10px] bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 flex items-start gap-3 transition-all"
          >
            <AlertCircle className="size-5 shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
            <div className="text-xs leading-relaxed">
              <span className="font-semibold block text-red-800 dark:text-red-300">
                Authentication failed
              </span>
              <span>{apiError}</span>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          {/* Work Email */}
          <Input
            label="Work Email"
            type="email"
            placeholder="admin@loopos.io"
            autoComplete="email"
            leftIcon={<Mail className="size-4" />}
            error={errors.email?.message}
            {...register("email")}
          />

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="password"
                className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider"
              >
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              autoComplete="current-password"
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
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                defaultChecked
                className="size-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer accent-indigo-600"
              />
              <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                Keep me signed in for 30 days
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full mt-1"
            isLoading={isSubmitting}
            rightIcon={<ArrowRight className="size-4" />}
          >
            Sign in
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-7">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-800" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-3 bg-white dark:bg-slate-900 text-slate-400 uppercase tracking-wider font-medium">
              Or continue with
            </span>
          </div>
        </div>

        {/* Enterprise SSO Button */}
        <Button
          type="button"
          variant="secondary"
          size="md"
          onClick={() => handleQuickLogin("staff")}
          className="w-full mb-5 text-xs font-semibold"
          leftIcon={<Users className="size-4 text-violet-500" />}
        >
          Staff Workspace Sign-In (staff@loopos.io)
        </Button>

        {/* Sign Up Prompt */}
        <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            New to LoopOS?{" "}
            <Link
              href="/signup"
              className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>

      {/* Demo Credentials Tip for Reviewers */}
      <div className="mt-4 text-center">
        <p className="text-[11px] text-slate-400 dark:text-slate-500">
          Mock Auth active • Any password e.g. <span className="font-mono text-slate-600 dark:text-slate-300 font-semibold">Password123!</span> accepted
        </p>
      </div>
    </div>
  );
}
