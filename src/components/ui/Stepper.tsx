import React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface StepperProps {
  steps: string[];
  currentStep: number; // 0-indexed
  className?: string;
}

export const Stepper: React.FC<StepperProps> = ({ steps, currentStep, className }) => {
  return (
    <div className={cn("w-full flex items-center justify-between", className)}>
      {steps.map((step, idx) => {
        const isCompleted = idx < currentStep;
        const isCurrent = idx === currentStep;

        return (
          <React.Fragment key={step}>
            <div className="flex items-center gap-2.5">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                  isCompleted && "bg-emerald-600 text-white",
                  isCurrent && "bg-indigo-600 text-white ring-4 ring-indigo-100 dark:ring-indigo-950/50",
                  !isCompleted && !isCurrent && "bg-slate-100 dark:bg-slate-800 text-slate-400"
                )}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : idx + 1}
              </div>
              <span
                className={cn(
                  "text-xs font-semibold tracking-tight hidden sm:inline",
                  isCurrent ? "text-slate-900 dark:text-white" : "text-slate-400 dark:text-slate-500"
                )}
              >
                {step}
              </span>
            </div>

            {idx < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-3",
                  idx < currentStep ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-800"
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
