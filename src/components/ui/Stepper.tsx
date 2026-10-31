import React from "react";

export interface StepperProps {
  steps: string[];
  currentStep: number;
}

export const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
  return (
    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
      {steps.map((s, idx) => (
        <div key={s} style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: idx <= currentStep ? "#4F46E5" : "#64748B" }}>
          <span>{idx + 1}.</span>
          <span>{s}</span>
        </div>
      ))}
    </div>
  );
};
