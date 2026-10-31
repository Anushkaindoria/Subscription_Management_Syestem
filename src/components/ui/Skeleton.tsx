import React from "react";

export interface SkeletonProps {
  width?: string;
  height?: string;
  style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({ width = "100%", height = "20px", style }) => {
  return (
    <div
      style={{
        width,
        height,
        background: "rgba(255,255,255,0.06)",
        borderRadius: "6px",
        animation: "pulse 1.5s ease-in-out infinite",
        ...style,
      }}
    />
  );
};
