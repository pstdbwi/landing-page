"use client";
import { getRemainingDays } from "@/lib/countRemainingDays";
import { CampaignTypeKeys, TCampaignType, colorBadgeByCampaignType } from "@/lib/typeCampaign";
import currencyFormater, { calculateDonationPercent, cn, sanitizeTitle } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { extractYouTubeId, getYouTubeThumbnail } from "@/lib/youtube";
import { PlayIcon, InfinityIcon, MapPinIcon, TimerIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { AspectRatio } from "../AspecRatio";
import { Badge } from "../Badge";
import { IcOrg, Verivied } from "../Icon/svg";
import { Progress } from "../ProgressBar";

const cardVariants = cva("backdrop-blur cursor-pointer flex-shrink-0 text-left border-2 border-[#D2AC47]", {
  variants: {
    variant: {
      default: "grid grid-cols-2 gap-2 border-b pb-2 w-full mb-4 place-items-center",
      vertical: "rounded-lg border border-x",
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
  location?: string;
  campaignType?: CampaignTypeKeys;
  isPermanent?: number;
}

const CampaignCardHighlight = React.forwardRef<HTMLButtonElement, CardProps>(
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
      ...props
    },
    ref,
  ) => {
    const router = useRouter();
    const Components = asChild ? Slot : "button";
    const percent = Number(calculateDonationPercent(donationAmount, donationTarget).toFixed(2));
    const youtubeId = extractYouTubeId(cover);
    const [isPlaying, setIsPlaying] = React.useState(false);

    const isPermanentVL = {
      variant: isPermanent == 2 ? "gradient-green" : isPermanent == 1 ? "gradient-blue" : "gradient-purple",
      label: isPermanent == 2 ? "Temporer & Abadi" : isPermanent == 1 ? "Abadi" : "Temporer",
    };

    return (
      <Components
        className={cn(cardVariants({ variant, className }))}
        ref={ref}
        onClick={() => router.push(`/campaign/${campaignId}?title=${sanitizeTitle(title)}`)}
        {...props}
      >
        <AspectRatio ratio={16 / 9} className="overflow-hidden relative">
          {youtubeId && isPlaying ? (
            <iframe
              className="absolute inset-0 w-full h-full rounded-lg"
              src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`}
              title="Campaign Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <>
              <Image
                src={youtubeId ? getYouTubeThumbnail(youtubeId) : cover}
                fill
                alt="banner"
                priority
                className={cn(
                  "object-cover transition-transform duration-300 ease-in-out group-hover:scale-105",
                  variant === "vertical" ? "rounded-t-lg" : "rounded-lg",
                )}
              />
              {youtubeId && (
                <div
                  className="absolute inset-0 flex items-center justify-center z-10 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsPlaying(true);
                  }}
                >
                  <div className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                    <PlayIcon size={18} className="text-white ml-0.5" fill="white" />
                  </div>
                </div>
              )}
            </>
          )}
        </AspectRatio>

        <div className={cn("space-y-1 p-1", variant === "vertical" ? "p-2" : "w-full")}>
          {location ? (
            <div className="inline-flex items-center space-x-2">
              <MapPinIcon size={14} className="text-gray-200" />
              <span className="text-gray-200 text-[0.625rem] line-clamp-1">
                {["Other , Other", " , "].some((item) => item?.includes(location)) ? "Seluruh Indonesia" : location}
              </span>
            </div>
          ) : null}

          <div className="flex items-center gap-1">
            {campaignType ? (
              <Badge variant={colorBadgeByCampaignType[campaignType]} size="sm" className="text-white block w-fit">
                {TCampaignType[campaignType]}
              </Badge>
            ) : null}

            {campaignType == "3" && (
              <Badge size={"sm"} variant={isPermanentVL?.variant as any} className="text-white block w-fit">
                {isPermanentVL?.label}
              </Badge>
            )}
          </div>

          <h1 className="text-sm font-bold line-clamp-1 text-white">{title}</h1>
          <div className="inline-flex space-x-1">
            <h2 className="text-xs text-gray-200 line-clamp-1">{campaigner.name}</h2>
            <Verivied />
            <IcOrg />
          </div>
          <Progress value={percent} variant="highlight" />
          <div className="space-y-1">
            <p className="text-base font-semibold text-[#f5cb5a]">Rp {currencyFormater(donationAmount)}</p>
          </div>

          {!expired ? (
            <div className="inline-flex justify-between items-center w-full">
              <p className="text-[0.625rem] text-gray-200">Wakaf terkumpul</p>
              <div className="inline-flex items-center gap-1">
                <InfinityIcon size={14} className="text-gray-200" />
              </div>
            </div>
          ) : (
            <div className="inline-flex justify-between items-center w-full">
              <p className="text-[0.625rem] text-gray-200">Wakaf terkumpul</p>
              <div className="inline-flex items-center gap-1">
                <TimerIcon size={14} className="text-gray-200" />
                <span className="text-[0.625rem] text-gray-200">{getRemainingDays(expired)} hari lagi`</span>
              </div>
            </div>
          )}
        </div>
      </Components>
    );
  },
);

export { CampaignCardHighlight, cardVariants };
