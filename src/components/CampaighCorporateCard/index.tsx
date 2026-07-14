"use client";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { extractYouTubeId, getYouTubeThumbnail } from "@/lib/youtube";
import { PlayIcon } from "lucide-react";
import React from "react";
import { AspectRatio } from "../AspecRatio";

const cardVariants = cva("bg-white cursor-pointer flex-shrink-0 text-left overflow-hidden", {
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
}

const CampaignCoporateCard = React.forwardRef<HTMLButtonElement, CardProps>(
  ({ className, campaignId, cover, variant = "default", asChild = false, ...props }, ref) => {
    const router = useRouter();
    const Components = asChild ? Slot : "button";
    const youtubeId = extractYouTubeId(cover);
    const [isPlaying, setIsPlaying] = React.useState(false);

    return (
      <Components
        className={cn(cardVariants({ variant, className }))}
        ref={ref}
        onClick={() => router.push(`/campaign/${campaignId}`)}
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
      </Components>
    );
  },
);

export { CampaignCoporateCard, cardVariants };
