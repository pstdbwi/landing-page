"use client";

import { VariantProps } from "class-variance-authority";
import { HTMLAttributes } from "react";
import { TabsLink, TabsLinkItem, tabsLinkItemVariants } from "./tabs-link";

interface Props extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof tabsLinkItemVariants> {
  tabs: {
    name: string;
    icon: any;
    href: string;
    hrefs: string[];
  }[];
}

const TabsComponent = ({ tabs, variant, ...props }: Props) => {
  return (
    <div {...props}>
      <TabsLink>
        {tabs?.map((tab) => (
          <TabsLinkItem key={tab?.name} variant={variant} {...tab}>
            <tab.icon className="mr-2 h-4 w-4" /> {tab?.name}
          </TabsLinkItem>
        ))}
      </TabsLink>
    </div>
  );
};

export default TabsComponent;
