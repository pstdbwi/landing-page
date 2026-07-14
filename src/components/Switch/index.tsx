"use client";

import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

type Variant = "default" | "fesyar";

interface SwitchProps extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> {
  variant?: Variant;
}

const variantStyles: Record<Variant, string> = {
  default: "data-[state=checked]:bg-[#F2F2F7] data-[state=unchecked]:bg-[#F2F2F7]",
  fesyar: "data-[state=checked]:bg-[#F2F2F7] data-[state=unchecked]:bg-[#F2F2F7]",
};

const thumbStyles: Record<Variant, string> = {
  default: "bg-primary-500 data-[state=unchecked]:bg-white",
  fesyar: "bg-fesyar-yellow-600 data-[state=unchecked]:bg-white",
};

const Switch = React.forwardRef<React.ElementRef<typeof SwitchPrimitives.Root>, SwitchProps>(
  ({ className, variant = "default", type = "button", ...props }, ref) => (
    <SwitchPrimitives.Root
      ref={ref}
      type={type}
      className={cn(
        "peer inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
          thumbStyles[variant]
        )}
      />
    </SwitchPrimitives.Root>
  )
);

Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
