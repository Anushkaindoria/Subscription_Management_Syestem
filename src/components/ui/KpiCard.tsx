import React from "react";
import { cn } from "@/lib/utils";

export interface KpiCardProps {
  label: string;
  value: string;
  subtext?: string;
  badge?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  icon?: React.ReactNode;
  className?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  label,
  value,
  subtext,
  badge,
  trend,
  icon,
  className,
}) => {
  return (
    <div
      className={cn(
        "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[14px] p-5 shadow-sm hover:shadow-md transition-shadow duration-200",
        className
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
          {label}
        </span>
        {icon && <div className="text-slate-400 dark:text-slate-500">{icon}</div>}
        {badge && (
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
            {badge}
          </span>
        )}
      </div>

      <div className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums my-1">
        {value}
      </div>

      {(subtext || trend) && (
        <div className="flex items-center gap-2 mt-2 text-xs">
          {trend && (
            <span
              className={cn(
                "font-semibold inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded",
                trend.isPositive !== false
                  ? "text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/30"
                  : "text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-950/30"
              )}
            >
              {trend.value}
            </span>
          )}
          {subtext && (
            <span className="text-slate-500 dark:text-slate-400">{subtext}</span>
          )}
        </div>
      )}
    </div>
  );
};
