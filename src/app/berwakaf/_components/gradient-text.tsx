// components/GradientText.tsx
import { cn } from "@/lib/utils";
import React from "react";

type GradientTextProps = {
  children: React.ReactNode;
  className?: string;
};

export function GradientText({ children, className }: GradientTextProps) {
  return (
    <p
      className={cn(
        "bg-gradient-to-r from-[#FFE7A1] via-[#DAB95A] to-[#DAB95A] text-transparent bg-clip-text text-2xl font-bold",
        className,
      )}
      style={{
        background:
          "linear-gradient(90deg, #FFE7A1 0%, #DAB95A 19.47%, #F0D398 38.94%, #DAB95A 59%, #FFE7A1 79%, rgba(218, 185, 90, 0.85) 100%)",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
    >
      {children}
    </p>
  );
}
