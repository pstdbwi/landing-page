"use client";

import { EmptyReport } from "@/components/Empty";
import { ReportSkeleton } from "@/components/Skeleton";
import { buttonVariants } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SETTING_INTERVAL_REFETCH_REPORT } from "@/constant/config";
import { IDisbursementCampaignPurpose } from "@/constant/pai";
import currencyFormater, { qs } from "@/lib/utils";
import { useReportCampaignDistribution } from "@/services/report/hooks";
import { useAutoRefetch } from "@/store/auto-refetch-context";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

const page = () => {
  const params = useParams();
  const { isAutoRefetch } = useAutoRefetch();
  const {
    data: distribution,
    isLoading: isLoadingDistribution,
    isError: isErrorDistribution,
  } = useReportCampaignDistribution({
    campaign_id: params?.campaign_id as string,
    refetchInterval: !isAutoRefetch ? false : SETTING_INTERVAL_REFETCH_REPORT,
  });

  if (isLoadingDistribution) {
    return <ReportSkeleton />;
  }

  if (isErrorDistribution) {
    return <EmptyReport description="Terjadi kesalahan coba beberapa saat lagi" linkBack="/report/campaign" />;
  }

  return (
    <section>
      {/* <div className="bg-primary-800 w-full rounded-md shadow text-white p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 items-start gap-2 md:gap-4">
          <div className="flex flex-col gap-1">
            <h5 className="font-medium">Total Nilai Manfaat</h5>

            <div className="flex items-baseline gap-1">
              <span className="text-xs">Rp.</span>

              <span className="text-lg font-bold">{currencyFormater(Number(distribution?.total_revenue || 0))}</span>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <h5 className="font-medium">Sudah Disalurkan</h5>

            <div className="flex items-baseline gap-1">
              <span className="text-xs">Rp.</span>

              <span className="text-lg font-bold">
                {currencyFormater(Number(distribution?.total_amount_disbursed) || 0)}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <h5 className="font-medium">Saldo yang Belum Disalurkan</h5>

            <div className="flex items-baseline gap-1">
              <span className="text-xs">Rp.</span>

              <span className="text-lg font-bold">
                {currencyFormater(
                  Number(distribution?.total_revenue || 0) - Number(distribution?.total_amount_disbursed) || 0
                )}
              </span>
            </div>
          </div>
        </div>
      </div> */}

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
                <TableCell className="text-xs">Rp. {currencyFormater(Number(item?.amount ?? 0))}</TableCell>
                <TableCell className="text-xs">{currencyFormater(Number(item?.report_count ?? 0))} Laporan</TableCell>
                <TableCell className="text-xs text-right">
                  <Link
                    href={`/report/campaign/${params?.campaign_id}/beneficiary/distribution/report-disbursement?${qs({
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
    </section>
  );
};

export default page;
