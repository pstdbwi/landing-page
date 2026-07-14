"use client";
import { cn, urlImageStoreGoogle } from "@/lib/utils";
import { INews } from "@/types/news";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import moment from "moment";
import Image from "next/image";
import React from "react";
import { AspectRatio } from "../AspecRatio";

const cardVariants = cva("bg-white cursor-pointer flex-shrink-0 text-left", {
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
  news: INews;
}

const NewsCard = React.forwardRef<HTMLButtonElement, CardProps>(
  ({ className, variant = "default", asChild = false, news, ...props }, ref) => {
    const Components = asChild ? Slot : "button";

    return (
      <Components className={cn(cardVariants({ variant, className }))} ref={ref} onClick={() => {}} {...props}>
        <AspectRatio ratio={16 / 9}>
          <Image
            src={urlImageStoreGoogle(news?.thumbnail_url)}
            fill
            alt="banner"
            priority
            className={cn("object-cover", variant === "vertical" ? "rounded-t-lg" : "rounded-lg")}
          />
        </AspectRatio>

        <div className={cn("space-y-1 p-1", variant === "vertical" ? "p-2" : "w-full")}>
          <h1 className="text-sm font-bold line-clamp-1">{news?.title}</h1>
          <div className="inline-flex space-x-1">
            <h2 className="text-xs text-gray-500 line-clamp-3">{news?.short_description}</h2>
          </div>
          {variant === "default" && (
            <p className="text-[0.625rem] text-gray-500 pt-3">
              {news?.author_name},{" "}
              <span className="text-[0.625rem] text-gray-500">{moment(news?.published_at).format("MMMM Do YYYY")}</span>
            </p>
          )}
        </div>

        {variant === "vertical" && (
          <div className="inline-flex justify-between items-center w-full px-2">
            <p className="text-[0.625rem] text-gray-500">{news?.author_name}</p>
            <span className="text-[0.625rem] text-gray-500">{moment(news?.published_at).format("MMMM Do YYYY")}</span>
          </div>
        )}
      </Components>
      
    );
  }
);

export { cardVariants, NewsCard };
