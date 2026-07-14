import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary-500 text-white",
        outline: "text-gray-500",
        "gradient-blue": "bg-gradient-to-r from-[#0094FF] to-[#2149ED] text-white w-fit",
        "gradient-green": "bg-gradient-to-r from-[#A8E063] to-[#56AB2F] text-white w-fit",
        "gradient-purple": "bg-gradient-to-r from-[#BC4E9C] to-[#F80759] text-white w-fit",
        "fesyar-gold": "bg-fesyar-gold text-black w-fit font-medium",
        "fesyar-burgundy": "bg-gradient-to-r from-[#951e2c] to-[#E53E3E]  text-white w-fit font-medium",
        "fesyar-green": "bg-gradient-to-r from-[#335649] to-[#4e7c69] text-white w-fit font-medium",
        waiting: "bg-gray-200 text-gray-700 border border-gray-300",
        approved: "bg-green-500 text-white border-transparent",
        rejected: "bg-red-500 text-white border-transparent",
        done: "bg-blue-500 text-white border-transparent",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0.5 text-[0.56rem]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}

export { Badge, badgeVariants };
