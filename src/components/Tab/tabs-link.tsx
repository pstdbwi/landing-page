"use client";

import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface TabsLinkProps {
  children: React.ReactNode;
  className?: string;
}

export const TabsLink = ({ children, className }: TabsLinkProps) => {
  return <div className={cn(`flex w-full items-center gap-x-2 overflow-x-auto rounded-md`, className)}>{children}</div>;
};

interface ITabsLinkItem extends VariantProps<typeof tabsLinkItemVariants> {
  href: string;
  className?: string;
  children?: React.ReactNode;
  hrefs: string[];
}

export const tabsLinkItemVariants = cva(
  `text-white lg:px-4 lg:py-2 py-1.5 px-3 font-medium rounded-md text-sm flex items-center transition duration-300 whitespace-nowrap`,
  {
    variants: {
      variant: {
        yellow: "border border-sycamore-600 bg-lemon-chiffon-100 text-sycamore-600  hover:bg-lemon-chiffon-200",
        green: "border border-sea-green-600 bg-surf-crest-200 text-sea-green-600 hover:bg-surf-crest-300",
        burgundy:
          "border border-2 border-fesyar-red-500 text-fesyar-red-500 hover:bg-fesyar-red-500 hover:text-white bg-white",
      },
      active: {
        yellow: "border border-primary-600 bg-primary-600 text-white hover:bg-lightning-yellow-500",
        green: "!bg-primary !text-white",
        burgundy: "border border-fesyar-red-500 text-white bg-fesyar-red-500",
        none: "",
      },
    },
  }
);

export const TabsLinkItem = ({ href, hrefs, className, children, variant }: ITabsLinkItem) => {
  const pathname = usePathname();
  return (
    <Link
      href={href}
      className={cn(
        tabsLinkItemVariants({
          variant,
          active: hrefs.includes(pathname) ? variant : "none",
        }),
        className
      )}
      scroll={false}
    >
      {children}
    </Link>
  );
};
