"use client";

import React, { useMemo } from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PasswordRule {
  id: string;
  label: string;
  test: (pwd: string) => boolean;
}

export const DEFAULT_PASSWORD_RULES: PasswordRule[] = [
  { id: "length", label: "At least 8 characters", test: (p) => p.length >= 8 },
  { id: "uppercase", label: "One uppercase letter (A-Z)", test: (p) => /[A-Z]/.test(p) },
  { id: "lowercase", label: "One lowercase letter (a-z)", test: (p) => /[a-z]/.test(p) },
  {
    id: "special_or_digit",
    label: "One number or symbol (0-9, !@#$%)",
    test: (p) => /[0-9]|[^A-Za-z0-9]/.test(p),
  },
];

export interface PasswordStrengthMeterProps {
  password?: string;
  rules?: PasswordRule[];
  showChecklist?: boolean;
  className?: string;
}

export function PasswordStrengthMeter({
  password = "",
  rules = DEFAULT_PASSWORD_RULES,
  showChecklist = true,
  className,
}: PasswordStrengthMeterProps) {
  const { passedCount, strengthLevel, strengthLabel, strengthColor } = useMemo(() => {
    if (!password) {
      return {
        passedCount: 0,
        strengthLevel: 0,
        strengthLabel: "None",
        strengthColor: "bg-slate-200 dark:bg-slate-700",
      };
    }

    const passed = rules.filter((r) => r.test(password)).length;
    let level = 1;
    let label = "Weak";
    let color = "bg-red-500";

    if (passed >= 4 && password.length >= 10) {
      level = 4;
      label = "Strong";
      color = "bg-emerald-500";
    } else if (passed >= 3) {
      level = 3;
      label = "Good";
      color = "bg-indigo-600";
    } else if (passed >= 2) {
      level = 2;
      label = "Fair";
      color = "bg-amber-500";
    } else {
      level = 1;
      label = "Weak";
      color = "bg-red-500";
    }

    return {
      passedCount: passed,
      strengthLevel: level,
      strengthLabel: label,
      strengthColor: color,
    };
  }, [password, rules]);

  return (
    <div className={cn("space-y-2.5", className)}>
      {/* Strength Bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 dark:text-slate-400">
          <span>Password strength</span>
          <span
            className={cn(
              "font-semibold transition-colors",
              strengthLevel === 4 && "text-emerald-600 dark:text-emerald-400",
              strengthLevel === 3 && "text-indigo-600 dark:text-indigo-400",
              strengthLevel === 2 && "text-amber-600 dark:text-amber-400",
              strengthLevel === 1 && "text-red-600 dark:text-red-400"
            )}
          >
            {password ? strengthLabel : "—"}
          </span>
        </div>
        <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full">
          {[1, 2, 3, 4].map((step) => {
            const isFilled = password.length > 0 && strengthLevel >= step;
            return (
              <div
                key={step}
                className={cn(
                  "h-full rounded-full transition-all duration-200",
                  isFilled ? strengthColor : "bg-slate-200 dark:bg-slate-700"
                )}
              />
            );
          })}
        </div>
      </div>

      {/* Live Checklist */}
      {showChecklist && (
        <div className="p-3 rounded-[10px] bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-2">
          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Security Requirements</span>
            <span className="font-mono text-[10px]">
              {passedCount}/{rules.length}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
            {rules.map((rule) => {
              const isPassed = rule.test(password);
              return (
                <div
                  key={rule.id}
                  className="flex items-center gap-1.5 transition-colors"
                >
                  {isPassed ? (
                    <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                  ) : (
                    <Circle className="size-4 text-slate-300 dark:text-slate-600 shrink-0" />
                  )}
                  <span
                    className={cn(
                      "text-xs transition-colors",
                      isPassed
                        ? "text-slate-700 dark:text-slate-200 font-medium"
                        : "text-slate-400 dark:text-slate-500"
                    )}
                  >
                    {rule.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
