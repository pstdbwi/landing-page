"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

export const NGOPI_ASSET_PATH = "/assets/wakafein";

export const ngopiDialogContentClassName =
  "border-none bg-[#071c3d] bg-[radial-gradient(circle_at_top,_#205398_0%,_#071c3d_70%)] [&_[data-slot=dialog-close]]:text-white [&_[data-slot=dialog-close]]:opacity-100";

export const ngopiPrimaryButtonClassName =
  "bg-[#DAB95A] text-[#071c3d] font-bold hover:bg-[#FFE7A1] hover:text-[#071c3d]";

export const ngopiGlassPanelClassName =
  "border border-white/20 bg-white/[0.075] shadow-2xl shadow-black/20 backdrop-blur-2xl backdrop-saturate-150";

export const ngopiGlassCardClassName = cn(
  ngopiGlassPanelClassName,
  "relative rounded-2xl bg-[radial-gradient(circle_at_top_left,_rgba(32,83,152,0.28),_rgba(255,255,255,0.055)_42%,_rgba(7,28,61,0.16)_100%)] p-8 transition-all duration-300 hover:-translate-y-1 hover:border-[#DAB95A]/45 hover:bg-white/[0.105]",
);

export const ngopiCardGlowClassName =
  "absolute inset-0 rounded-2xl bg-gradient-to-r from-[#205398]/45 via-[#DAB95A]/20 to-[#071c3d]/35 blur-2xl opacity-35 transition-opacity duration-500 group-hover:opacity-55";

export const ngopiIconPanelClassName =
  "rounded-2xl border border-[#DAB95A]/35 bg-white/[0.12] p-4 shadow-lg backdrop-blur-xl ring-1 ring-white/10";

type NgopiGradientTextProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

export function NgopiGradientText({ children, className, style }: NgopiGradientTextProps) {
  return (
    <p
      className={cn("bg-clip-text text-2xl font-bold text-transparent", className)}
      style={{
        background:
          "linear-gradient(90deg, #FFE7A1 0%, #DAB95A 19.47%, #F0D398 38.94%, #DAB95A 59%, #FFE7A1 79%, rgba(218, 185, 90, 0.85) 100%)",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        WebkitTextFillColor: "transparent",
        ...style,
      }}
    >
      {children}
    </p>
  );
}

type NgopiWastraCornersProps = {
  className?: string;
  imageClassName?: string;
  priority?: boolean;
};

export function NgopiWastraCorners({
  className,
  imageClassName = "h-auto w-[70%] max-w-[360px] opacity-65",
  priority,
}: NgopiWastraCornersProps) {
  return (
    <div className={cn("pointer-events-none absolute inset-x-0 top-0 z-0", className)} aria-hidden="true">
      <Image
        src={`${NGOPI_ASSET_PATH}/flower.png`}
        width={1200}
        height={600}
        alt=""
        priority={priority}
        className={cn("absolute left-0 top-0", imageClassName)}
      />
      <Image
        src={`${NGOPI_ASSET_PATH}/flower.png`}
        width={1200}
        height={600}
        alt=""
        priority={priority}
        className={cn("absolute right-0 top-0 scale-x-[-1]", imageClassName)}
      />
    </div>
  );
}
