"use client";
import { AspectRatio } from "@/components/AspecRatio";
import { Badge } from "@/components/Badge";
import { IcOrg2, Verified } from "@/components/Icon/svg";
import { Progress } from "@/components/ProgressBar";
import { getRemainingDays } from "@/lib/countRemainingDays";
import { CampaignTypeKeys, TCampaignType } from "@/lib/typeCampaign";
import currencyFormater, { calculateDonationPercent, cn, formatUnixTimestamp } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { InfinityIcon, MapPinIcon, TimerIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const cardVariants = cva("backdrop-blur hover:bg-gray-50  bg-white p-2 cursor-pointer flex-shrink-0 text-left ", {
  variants: {
    variant: {
      default: "grid grid-cols-2 gap-2 pb-2 w-full mb-4 place-items-center",
      vertical: "rounded-lg",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface CardProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof cardVariants> {
  asChild?: boolean;
  id: string;
  title: string;
  thumbnail_url: string;
  short_description: string;
  created: number;
}

const FesyarNewsArticleCard = React.forwardRef<HTMLButtonElement, CardProps>(
  (
    {
      asChild = false,
      variant = "vertical",
      className,
      id,
      title,
      thumbnail_url,
      short_description,
      created,
      ...props
    },
    ref
  ) => {
    const router = useRouter();
    const Components = asChild ? Slot : "button";

    return (
      <Components
        className={cn("group", cardVariants({ variant, className }))}
        ref={ref}
        onClick={() => router.push(`/fesyar/news-article/${id}`)}
        {...props}
      >
        <AspectRatio ratio={16 / 9} className="overflow-hidden">
          <Image
            src={thumbnail_url}
            fill
            alt="thumbnail_url"
            priority
            className={cn(
              "object-cover transition-transform duration-300 ease-in-out group-hover:scale-105",
              variant === "vertical" ? "rounded-t-lg" : "rounded-lg"
            )}
          />
        </AspectRatio>

        <div className={cn("space-y-1 ", variant === "vertical" ? "p-2" : "w-full")}>
          <h1 className="text-base group-hover:underline font-bold line-clamp-1 text-fesyar-green-500">{title}</h1>
          <p className="text-sm line-clamp-1 text-fesyar-green-500">{short_description}</p>
          <p className="text-xs line-clamp-1 text-fesyar-green-500">{formatUnixTimestamp(created)}</p>
        </div>
      </Components>
    );
  }
);

export { FesyarNewsArticleCard, cardVariants };
