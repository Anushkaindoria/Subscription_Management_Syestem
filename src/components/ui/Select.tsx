import React from "react";
import { cn } from "@/lib/utils";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options?: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options = [], children, className, id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            "w-full text-sm font-sans transition-all duration-150 ease-out",
            "bg-white dark:bg-slate-900",
            "text-slate-900 dark:text-slate-100",
            "border rounded-[10px] py-2.5 px-3.5",
            error
              ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
              : "border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600",
            "outline-none",
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-white dark:bg-slate-900">
              {opt.label}
            </option>
          ))}
          {children}
        </select>
        {error && <span className="text-xs text-red-600 dark:text-red-400">{error}</span>}
      </div>
    );
  }
);

Select.displayName = "Select";
