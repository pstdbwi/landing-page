"use client";
import { AspectRatio } from "@/components/AspecRatio";
import { Badge } from "@/components/Badge";
import { IcOrg2, Verified } from "@/components/Icon/svg";
import { Progress } from "@/components/ProgressBar";
import { getRemainingDays } from "@/lib/countRemainingDays";
import { CampaignTypeKeys, TCampaignType } from "@/lib/typeCampaign";
import currencyFormater, { calculateDonationPercent, cn } from "@/lib/utils";
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
  cover: string;
  campaignId: string;
  title: string;
  campaigner: {
    name: string;
    is_verified: boolean;
    type: string;
  };
  donationAmount: number;
  donationTarget: number;
  expired: number;
  location?: {
    city: string;
  };
  campaignType?: CampaignTypeKeys;
  isPermanent?: "1" | "0";
  topic?: string;
}

const FesyarCampaignCard = React.forwardRef<HTMLButtonElement, CardProps>(
  (
    {
      className,
      title,
      campaignId,
      cover,
      campaigner,
      donationAmount = 0,
      variant = "default",
      asChild = false,
      location,
      donationTarget = 0,
      expired,
      campaignType,
      isPermanent,
      topic,
      ...props
    },
    ref
  ) => {
    const router = useRouter();
    const Components = asChild ? Slot : "button";
    const percent = Number(calculateDonationPercent(donationAmount, donationTarget).toFixed(2));

    return (
      <Components
        className={cn("group", cardVariants({ variant, className }))}
        ref={ref}
        onClick={() => router.push(`/fesyar/campaign/${campaignId}/detail/about`)}
        {...props}
      >
        <AspectRatio ratio={16 / 9} className="overflow-hidden">
          <Image
            src={cover}
            fill
            alt="banner"
            priority
            className={cn(
              "object-cover transition-transform duration-300 ease-in-out group-hover:scale-105",
              variant === "vertical" ? "rounded-t-lg" : "rounded-lg"
            )}
          />
        </AspectRatio>

        <div className={cn("space-y-1 ", variant === "vertical" ? "p-2" : "w-full")}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-[1px]">
              {campaignType ? <Badge variant="fesyar-gold">{TCampaignType[campaignType]}</Badge> : "-"}

              {campaignType == "3" && (
                <Badge variant={isPermanent ? "gradient-blue" : "gradient-purple"}>
                  {isPermanent ? "Abadi" : "Temporer"}
                </Badge>
              )}

              {topic ? (
                <Badge variant={"fesyar-green"} className="whitespace-nowrap">
                  {topic
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </Badge>
              ) : null}
            </div>

            <div className="flex items-center gap-[1px]">
              <MapPinIcon size={14} className="text-fesyar-green-500 shrink-0" />
              <span className="text-fesyar-green-500 text-xs line-clamp-1">{location?.city}</span>
            </div>
          </div>

          <p className="text-base font-bold group-hover:underline line-clamp-1 text-fesyar-green-500">{title}</p>

          <div className="flex items-center gap-0.5">
            <h2 className="text-sm text-fesyar-green-500 line-clamp-1">{campaigner.name}</h2>
            <Verified />
            <IcOrg2 />
          </div>

          <Progress value={percent} variant="fesyar" />

          <div className="space-y-1">
            <p className="text-xl font-bold text-[#335649]">Rp {currencyFormater(donationAmount)}</p>
          </div>

          {!expired ? (
            <div className="inline-flex justify-between items-center w-full">
              <p className="text-xs text-fesyar-green-500">Wakaf terkumpul</p>
              <div className="inline-flex items-center gap-1">
                <InfinityIcon size={14} className="text-fesyar-green-500" />
              </div>
            </div>
          ) : (
            <div className="inline-flex justify-between items-center w-full">
              <p className="text-xs text-fesyar-green-500">Wakaf terkumpul</p>
              <div className="inline-flex items-center gap-1">
                <TimerIcon size={14} className="text-fesyar-green-500" />
                <span className="text-xs text-fesyar-green-500">{getRemainingDays(expired)} hari lagi`</span>
              </div>
            </div>
          )}
        </div>
      </Components>
    );
  }
);

export { FesyarCampaignCard, cardVariants };
