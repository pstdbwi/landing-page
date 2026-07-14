"use client";

import { EmptyReport } from "@/components/Empty";
import LayoutReport from "@/components/Layout/layout-report";
import { ReportSkeleton } from "@/components/Skeleton";
import { buttonVariants } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IDisbursementCampaignPurpose } from "@/constant/pai";
import currencyFormater, { qs } from "@/lib/utils";
import { useReportCampaignDistribution } from "@/services/report/hooks";
import { ArrowLeftIcon, ArrowRight, ArrowUpRightIcon } from "lucide-react";
import Link from "next/link";

const page = () => {
  const {
    data: distribution,
    isLoading: isLoadingDistribution,
    isError: isErrorDistribution,
  } = useReportCampaignDistribution({ campaign_id: "9d52c675-2b96-499d-a94e-224fbae26817" });

  if (isLoadingDistribution) {
    return (
      <LayoutReport className="space-y-4">
        <ReportSkeleton />
      </LayoutReport>
    );
  }

  if (isErrorDistribution) {
    return (
      <LayoutReport>
        <EmptyReport description="Terjadi kesalahan coba beberapa saat lagi" linkBack="/report/campaign" />
      </LayoutReport>
    );
  }

  return (
    <LayoutReport className="space-y-4">
      <div className="flex items-center justify-between mt-4">
        <h1 className="text-lg md:text-xl font-bold">
          Laporan Penyaluran & Penerimaan Manfaat Program Wakaf ASN Kemenag
        </h1>

        <div className="flex items-center gap-2">
          <Link href="/ASNKemenag" className={buttonVariants({})}>
            Campaign <ArrowUpRightIcon className="w-4 ml-1" />
          </Link>

          <Link href="/report/asn-kemenag" className={buttonVariants({ variant: "outline" })}>
            <ArrowLeftIcon className="w-4 m4-1" /> Kembali
          </Link>
        </div>
      </div>

      <Table className="mt-1">
        <TableHeader>
          <TableRow>
            <TableHead className="bg-primary-800 text-white text-sm">Implementasi Program</TableHead>
            <TableHead className="bg-primary-800 text-white text-sm whitespace-nowrap">
              Total Nilai Disalurkan
            </TableHead>
            <TableHead className="bg-primary-800 text-white text-sm whitespace-nowrap">Total Penyaluran</TableHead>
            <TableHead className="bg-primary-800 text-white text-sm"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {distribution?.purposes?.length ? (
            distribution?.purposes?.map((item: IDisbursementCampaignPurpose, itemIdx: number) => (
              <TableRow key={item?.id} className={itemIdx % 2 == 1 ? "bg-gray-50" : ""}>
                <TableCell>
                  <span className="font-medium text-xs flex flex-col">{item?.name}</span>
                </TableCell>
                <TableCell className="text-sm">Rp. {currencyFormater(Number(item?.amount ?? 0))}</TableCell>
                <TableCell className="text-xs">{currencyFormater(Number(item?.report_count ?? 0))} Laporan</TableCell>
                <TableCell className="text-xs text-right">
                  <Link
                    href={`/report/asn-kemenag/beneficiary/report-disbursement?${qs({
                      campaign_id: distribution?.id,
                      purpose_id: String(item?.id),
                    })}`}
                    className={buttonVariants({ size: "sm", className: "text-xs" })}
                  >
                    Daftar Pelaporan <ArrowRight className="w-4 ml-1" />
                  </Link>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow className="bg-gray-50">
              <TableCell className="font-medium text-sm text-center py-4" colSpan={4}>
                Tidak ada penyaluran
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </LayoutReport>
  );
};

export default page;
