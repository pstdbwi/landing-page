"use client";

import { buttonVariants } from "@/components/Button";
import LayoutReport from "@/components/Layout/layout-report";
import TabsComponent from "@/components/Tab/tabs";
import { ArrowUpRightIcon, Globe2Icon, School2Icon, TvIcon, Users2Icon } from "lucide-react";
import Link from "next/link";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const tabs = [
    {
      name: "Nasional",
      icon: Globe2Icon,
      href: `/report/dana-abadi-pai/national`,
      hrefs: [`/report/dana-abadi-pai/national`, `/report/dana-abadi-pai/national/city`],
    },
    {
      name: "Sekolah",
      icon: School2Icon,
      href: `/report/dana-abadi-pai/school`,
      hrefs: [`/report/dana-abadi-pai/school`],
    },
    {
      name: "Wakif",
      icon: Users2Icon,
      href: `/report/dana-abadi-pai/wakif`,
      hrefs: [`/report/dana-abadi-pai/wakif`],
    },
    {
      name: "Laporan Penyaluran & Penerima Manfaat",
      icon: Users2Icon,
      href: `/report/dana-abadi-pai/beneficiary`,
      hrefs: [
        `/report/dana-abadi-pai/beneficiary`,
        `/report/dana-abadi-pai/beneficiary/report-disbursement`,
        `/report/dana-abadi-pai/beneficiary/report-disbursement/detail`,
      ],
    },
  ];
  return (
    <LayoutReport>
      <div className="flex gap-2 overflow-x-scroll">
        <TabsComponent tabs={tabs} className="mt-4 md:px-0" variant="yellow" />
      </div>

      <div className="py-4">
        <div className="flex items-start justify-between">
          <h1 className="text-lg md:text-xl font-bold">
            Rekap dan Detil Program Gerakan Wakaf Uang Dana Abadi Pendidikan Agama Islam di Sekolah
          </h1>

          <Link href="/danaabadipaisekolah" className={buttonVariants({})}>
            Campaign <ArrowUpRightIcon className="w-4 ml-1" />
          </Link>
        </div>
      </div>

      {children}
    </LayoutReport>
  );
};

export default Layout;
