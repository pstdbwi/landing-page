"use client";

import TabsComponent from "@/components/Tab/tabs";
import { CoinsIcon, FilesIcon, Globe2Icon, HandIcon, HandMetalIcon, HelpingHandIcon, Users2Icon } from "lucide-react";
import { useParams } from "next/navigation";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  const params = useParams();

  const tabs = [
    {
      name: "Penyaluran",
      icon: HelpingHandIcon,
      href: `/report/campaign/${params?.campaign_id}/beneficiary/distribution`,
      hrefs: [
        `/report/campaign/${params?.campaign_id}/beneficiary/distribution`,
        `/report/campaign/${params?.campaign_id}/beneficiary/distribution/report-disbursement`,
      ],
    },
    // {
    //   name: "Penerimaan Nilai Manfaat",
    //   icon: CoinsIcon,
    //   href: `/report/campaign/${params?.campaign_id}/beneficiary/benefit`,
    //   hrefs: [`/report/campaign/${params?.campaign_id}/beneficiary/benefit`],
    // },
  ];

  return (
    <div className="space-y-4">
      {/* <div className="flex gap-2 overflow-x-scroll">
        <TabsComponent tabs={tabs} variant="yellow" />
      </div> */}
      {children}
    </div>
  );
};

export default layout;
