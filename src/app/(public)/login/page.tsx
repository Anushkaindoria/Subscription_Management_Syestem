"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginRequestSchema, LoginRequest } from "@/contracts/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Shield } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginRequest>({
    resolver: zodResolver(LoginRequestSchema),
    defaultValues: {
      email: "riya.sharma@brightloop.io",
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
        setApiError(result.error?.message || "Invalid email or password. Please verify your credentials.");
        return;
      }
      // Successful login -> route based on user role
      if (result.data?.user?.role === "customer") {
        router.push("/portal");
      } else {
        router.push("/admin");
      }
    } catch {
      setApiError("A network error occurred. Please try again.");
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[14px] border border-slate-200 dark:border-slate-800 p-8 sm:p-10 shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2 lg:hidden">
          <span className="w-2 h-2 rounded-full bg-indigo-600" />
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
            LoopOS Auth
          </span>
        </div>
        <h2 className="text-2xl sm:text-[28px] font-bold text-slate-900 dark:text-white tracking-tight">
          Welcome back
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1.5">
          Enter your credentials to access your Brightloop workspace
        </p>
      </div>

      {apiError && (
        <div className="mb-6 p-3.5 rounded-[10px] bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-600" />
          <div className="text-xs leading-relaxed">
            <span className="font-semibold block text-red-800 dark:text-red-300">
              Authentication failed
            </span>
            <span>{apiError}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <Input
          label="Work Email"
          type="email"
          placeholder="name@company.com"
          autoComplete="email"
          leftIcon={<Mail className="w-4 h-4" />}
          error={errors.email?.message}
          {...register("email")}
        />

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            autoComplete="current-password"
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
        </div>

        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              defaultChecked
              className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
            />
            <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              Keep me signed in for 30 days
            </span>
          </label>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          className="w-full"
          isLoading={isSubmitting}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Sign in
        </Button>
      </form>

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

      <button
        type="button"
        className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 border border-slate-300 dark:border-slate-700 rounded-[10px] bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition mb-5"
      >
        <Shield className="w-4 h-4 text-slate-500" />
        <span>Single Sign-On (SAML / Okta)</span>
      </button>

      <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800">
        <p className="text-xs text-slate-600 dark:text-slate-400">
          New to LoopOS?{" "}
          <Link
            href="/signup"
            className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
