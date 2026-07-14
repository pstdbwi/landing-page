"use client";
import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import Image from "next/image";
import currencyFormater, { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Badge } from "../Badge";
import { AspectRatio } from "../AspecRatio";
import moment from "moment";
import { ClockIcon } from "lucide-react";
import { CampaignTypeKeys, colorBadgeByCampaignType, TCampaignType } from "@/lib/typeCampaign";

const cardVariants = cva("bg-white cursor-pointer flex-shrink-0 text-left mb-3 w-full", {
  variants: {
    variant: {
      default: "inline-flex items-center justify-start gap-2 border-b pb-2",
      vertical: "rounded-lg max-w-[250px] border-b border-x",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface CardProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof cardVariants> {
  id: string;
  asChild?: boolean;
  cover: string;
  created: number;
  status: "PENDING" | "VERIFIED" | "CANCELLED";
  donationAmount: number;
  title: string;
  category: string;
  campaignType?: CampaignTypeKeys;
}

const HistoryCard = React.forwardRef<HTMLButtonElement, CardProps>(
  (
    {
      id,
      className,
      created,
      category,
      title,
      status,
      cover,
      donationAmount,
      campaignType,
      variant = "default",
      asChild = false,
      ...props
    },
    ref
  ) => {
    const router = useRouter();
    const Components = asChild ? Slot : "button";

    const renderStatus = () => {
      switch (status) {
        case "PENDING":
          return "Belum dibayar";
        case "CANCELLED":
          return "Dibatalkan";
        case "VERIFIED":
          return "Sudah dibayar";
        default:
          return "Belum dibayar";
      }
    };

    const renderBadgeStype = () => {
      switch (status) {
        case "PENDING":
          return "border-warning-200 bg-warning-300/30 text-warning-500 text-xs font-normal";
        case "CANCELLED":
          return "border-danger-200 bg-danger-300/30 text-danger-500 text-xs font-normal";
        case "VERIFIED":
          return "border-primary-200 bg-primary-300/30 text-primary-500 text-xs font-normal";
        default:
          return "border-primary-200 bg-primary-300/30 text-primary-500 text-xs font-normal";
      }
    };

    let momentObj = moment.unix(created);
    let times = momentObj.format("LLL");
    return (
      <Components
        className={cn(cardVariants({ variant, className }))}
        ref={ref}
        onClick={() => router.push(`/history/${id}`)}
        {...props}
      >
        <div className="w-[200px] h-full">
          <AspectRatio ratio={16 / 11}>
            <Image src={cover} fill alt="cover" priority className={cn("rounded-md")} />
          </AspectRatio>
        </div>

        <div className={cn("space-y-1 p-1 w-full")}>
          <div className="w-full inline-flex items-center justify-between">
            <span className="text-xs font-medium text-primary-500">{category}</span>
            <Badge className={renderBadgeStype()}>{renderStatus()}</Badge>
          </div>
          {campaignType ? (
            <Badge variant={colorBadgeByCampaignType[campaignType]} size="sm" className="text-white block w-fit">
              {TCampaignType[campaignType]}
            </Badge>
          ) : null}
          <p className="text-sm font-medium line-clamp-1">{title}</p>
          <div className="inline-flex justify-between items-center w-full pt-2">
            <div className="inline-flex items-center gap-2">
              <ClockIcon size={10} />
              <span className="text-xs text-gray-500">{times}</span>
            </div>
            <span className="text-xs text-gray-500 font-medium">Rp {currencyFormater(donationAmount)}</span>
          </div>
        </div>
      </Components>
    );
  }
);

export { HistoryCard, cardVariants };
