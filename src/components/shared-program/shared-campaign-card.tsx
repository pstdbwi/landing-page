"use client";
import { AspectRatio } from "@/components/AspecRatio";
import { Badge } from "@/components/Badge";
import { IcOrg2, Verified } from "@/components/Icon/svg";
import { Progress } from "@/components/ProgressBar";
import { getRemainingDays } from "@/lib/countRemainingDays";
import { CampaignTypeKeys, TCampaignType } from "@/lib/typeCampaign";
import currencyFormater, { calculateDonationPercent, cn } from "@/lib/utils";
import { extractYouTubeId, getYouTubeThumbnail } from "@/lib/youtube";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { InfinityIcon, MapPinIcon, PlayIcon, TimerIcon } from "lucide-react";
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
  link: string;
}

const SharedCampaignCard = React.forwardRef<HTMLButtonElement, CardProps>(
  (
    {
      link,
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
    ref,
  ) => {
    const router = useRouter();
    const Components = asChild ? Slot : "button";
    const percent = Number(calculateDonationPercent(donationAmount, donationTarget).toFixed(2));
    const youtubeId = extractYouTubeId(cover);
    const [isPlaying, setIsPlaying] = React.useState(false);

    return (
      <Components
        className={cn("group rounded-lg", cardVariants({ variant, className }))}
        ref={ref}
        onClick={() => router.push(link)}
        {...props}
      >
        <AspectRatio ratio={variant == "default" ? 16 / 12 : 16 / 9} className="overflow-hidden relative">
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

        <div className={cn("lg:space-y-2 ", variant === "vertical" ? "p-2" : "w-full")}>
          <div className="flex flex-col-reverse lg:flex-row lg:items-center justify-between">
            <div className="flex items-center gap-[1px]">
              {campaignType ? (
                <Badge size="sm" variant="fesyar-gold">
                  {TCampaignType[campaignType]}
                </Badge>
              ) : null}

              {campaignType == "3" && (
                <Badge size="sm" variant={isPermanent ? "gradient-blue" : "gradient-purple"}>
                  {isPermanent ? "Abadi" : "Temporer"}
                </Badge>
              )}

              {topic ? (
                <Badge size="sm" variant={"fesyar-green"} className="whitespace-nowrap">
                  {topic
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </Badge>
              ) : null}
            </div>

            <div className="flex items-center gap-1">
              <MapPinIcon size={14} className="text-fesyar-green-500 shrink-0" />
              <span className="text-fesyar-green-500 text-[0.65rem] line-clamp-1">{location?.city}</span>
            </div>
          </div>

          <p className="text-xs lg:text-sm font-bold group-hover:underline line-clamp-1 text-fesyar-green-500">
            {title}
          </p>

          <div className="flex items-center gap-0.5">
            <h2 className="text-[0.675rem] lg:text-xs text-fesyar-green-500 line-clamp-1">{campaigner.name}</h2>
            <Verified />
            <IcOrg2 />
          </div>

          <Progress value={percent} variant="fesyar" />

          <div className="space-y-1">
            <p className="text-sm lg:text-xl font-bold text-[#335649]">Rp {currencyFormater(donationAmount)}</p>
          </div>

          {!expired ? (
            <div className="inline-flex justify-between items-center w-full">
              <p className="text-[0.65rem] lg:text-xs text-fesyar-green-500">Wakaf terkumpul</p>
              <div className="inline-flex items-center gap-1">
                <InfinityIcon className="w-3 lg:w-4 text-fesyar-green-500" />
              </div>
            </div>
          ) : (
            <div className="inline-flex justify-between items-center w-full">
              <p className="text-[0.65rem] lg:text-xs text-fesyar-green-500">Wakaf terkumpul</p>
              <div className="inline-flex items-center gap-1">
                <TimerIcon className="w-3 lg:w-4 text-fesyar-green-500" />
                <span className="text-[0.65rem] lg:text-xs text-fesyar-green-500">
                  {getRemainingDays(expired)} hari lagi`
                </span>
              </div>
            </div>
          )}
        </div>
      </Components>
    );
  },
);

export { SharedCampaignCard, cardVariants };
