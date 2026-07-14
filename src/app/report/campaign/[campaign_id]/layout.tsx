"use client";

import { EmptyReport } from "@/components/Empty";
import LayoutReport from "@/components/Layout/layout-report";
import { Skeleton } from "@/components/Skeleton";
import { Switch } from "@/components/Switch";
import TabsComponent from "@/components/Tab/tabs";
import { buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { SETTING_INTERVAL_REFETCH_REPORT } from "@/constant/config";
import { useReportCampaignDetail } from "@/services/report/hooks";
import { AutoRefetchContext } from "@/store/auto-refetch-context";
import {
  ArrowUpRightIcon,
  Building2Icon,
  ChevronLeftIcon,
  FilesIcon,
  Globe2Icon,
  Grid2x2Icon,
  InfoIcon,
  Users2Icon,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useState } from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  const params = useParams();
  const [isAutoRefetch, setIsAutoRefetch] = useState(false);
  const refetchIntervalMinutes = SETTING_INTERVAL_REFETCH_REPORT / 1000 / 60;

  const {
    data: campaign,
    isLoading,
    isError,
  } = useReportCampaignDetail({
    campaign_id: params?.campaign_id as string,
    refetchInterval: !isAutoRefetch ? false : SETTING_INTERVAL_REFETCH_REPORT,
  });

  if (isLoading) {
    return (
      <LayoutReport>
        <Skeleton className="w-4/6 h-7 rounded-md mb-2" />
        <Skeleton className="mt-4 h-12 w-full rounded-md mb-2" />
        <Skeleton className="mt-4 h-24 w-full rounded-md mb-2" />
        <Skeleton className="w-full h-7 rounded-md mb-2" />
        <Skeleton className="w-full h-7 rounded-md mb-2" />
        <Skeleton className="w-full h-7 rounded-md mb-2" />
        <Skeleton className="w-full h-7 rounded-md mb-2" />
        <Skeleton className="w-full h-7 rounded-md mb-2" />
      </LayoutReport>
    );
  }

  if (isError) {
    return <EmptyReport description="Terjadi kesalahan coba beberapa saat lagi" linkBack="/report/campaign" />;
  }

  const isHaveCorpUnit = campaign?.wakif_types?.length
    ? campaign?.wakif_types?.some((item: any) => item?.has_corp_unit == 1)
    : false;
  // REQUIREMENT TO SHOW FILTER INSTITUSI
  const showInputCorpsDefault = campaign?.wakif_types?.length
    ? !campaign?.wakif_types?.some((item: any) => item?.has_corp_unit == 1)
    : true;

  const tabs = [
    {
      name: "Nasional",
      icon: Globe2Icon,
      href: `/report/campaign/${params?.campaign_id}/national`,
      hrefs: [
        `/report/campaign/${params?.campaign_id}/national`,
        `/report/campaign/${params?.campaign_id}/national/city`,
      ],
    },
    ...(campaign?.rakornas_kemenag == 1 && (isHaveCorpUnit || showInputCorpsDefault)
      ? [
          {
            name: "Institusi",
            icon: Building2Icon,
            href: `/report/campaign/${params?.campaign_id}/institution`,
            hrefs: [
              `/report/campaign/${params?.campaign_id}/institution`,
              `/report/campaign/${params?.campaign_id}/institution/${params?.parent_id}`,
              `/report/campaign/${params?.campaign_id}/institution/${params?.parent_id}/region`,
            ],
          },
        ]
      : []),
    ...(campaign?.sub_campaigns?.length
      ? [
          {
            name: "Program",
            icon: Grid2x2Icon,
            href: `/report/campaign/${params?.campaign_id}/program`,
            hrefs: [`/report/campaign/${params?.campaign_id}/program`],
          },
        ]
      : []),
    {
      name: "Wakif",
      icon: Users2Icon,
      href: `/report/campaign/${params?.campaign_id}/wakif`,
      hrefs: [`/report/campaign/${params?.campaign_id}/wakif`],
    },
    {
      name: "Laporan Penyaluran & Penerima Manfaat",
      icon: FilesIcon,
      href: `/report/campaign/${params?.campaign_id}/beneficiary/distribution`,
      hrefs: [
        `/report/campaign/${params?.campaign_id}/beneficiary`,
        `/report/campaign/${params?.campaign_id}/beneficiary/benefit`,
        `/report/campaign/${params?.campaign_id}/beneficiary/distribution`,
        `/report/campaign/${params?.campaign_id}/beneficiary/distribution/report-disbursement`,
        `/report/campaign/${params?.campaign_id}/beneficiary/distribution/report-disbursement/${params?.disbursement_id}/detail`,
      ],
    },
  ];

  return (
    <AutoRefetchContext.Provider value={{ isAutoRefetch, setIsAutoRefetch }}>
      <LayoutReport>
        <div className="flex flex-col-reverse  items-end sm:items-center justify-end sm:justify-between mt-4 sm:flex-row">
          <div className="flex items-start sm:items-center gap-1">
            <Link href={`/report/campaign`}>
              <ChevronLeftIcon className="w-6" />
            </Link>
            <h1 className="text-base md:text-xl font-bold">{campaign?.title}</h1>
          </div>

          <Link href={`/campaign/${campaign?.id}`} className={buttonVariants({})}>
            Campaign <ArrowUpRightIcon className="w-4 ml-1" />
          </Link>
        </div>

        <div className="flex gap-2 overflow-x-scroll justify-between">
          <TabsComponent tabs={tabs} className="mt-4 md:px-0" variant="yellow" />

          <div className="flex items-center gap-2">
            <Switch id="auto-update" checked={isAutoRefetch} onCheckedChange={setIsAutoRefetch} />
            <Label htmlFor="auto-update" className="text-xs">
              Auto Update ({isAutoRefetch ? "On" : "Off"})
            </Label>
            <Dialog>
              <DialogTrigger>
                <InfoIcon className="w-3 text-gray-600" />
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Informasi</DialogTitle>
                  <DialogDescription>
                    Halaman akan terupdate secara otomatis setiap {refetchIntervalMinutes} menit.
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="mt-4">{children}</div>
      </LayoutReport>
    </AutoRefetchContext.Provider>
  );
};

export default layout;
