"use client";

import { buttonVariants } from "@/components/Button";
import { EmptyReport } from "@/components/Empty";
import { ReportSkeleton } from "@/components/Skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SETTING_INTERVAL_REFETCH_REPORT } from "@/constant/config";
import useSearchParamsEntries from "@/lib/use-searchparams-entries";
import currencyFormater, { qs } from "@/lib/utils";
import { useReportPrograms } from "@/services/report/hooks";
import { useAutoRefetch } from "@/store/auto-refetch-context";
import { ArrowUpRightIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

const page = () => {
  const params = useParams();
  const { isAutoRefetch } = useAutoRefetch();
  const searchParams = useSearchParamsEntries();
  const { interval = "" } = searchParams;

  const [filters, setFilters] = useState({
    date_start: "",
    date_end: "",
  });
  const intervalSet = interval ? 1000 * Number(interval) : 0;

  const {
    data: programs,
    isLoading: isLoadingPrograms,
    isError: isErrorPrograms,
  } = useReportPrograms({
    campaign_id: params?.campaign_id as string,
    date_start: filters?.date_start,
    date_end: filters?.date_end,
    refetchInterval: !isAutoRefetch ? false : interval ? intervalSet : SETTING_INTERVAL_REFETCH_REPORT,
  });

  if (isLoadingPrograms) {
    return <ReportSkeleton />;
  }

  if (isErrorPrograms) {
    return <EmptyReport description="Terjadi kesalahan coba beberapa saat lagi" linkBack="/report/campaign" />;
  }

  const { total_donation = 0, total_donors = 0 } = programs?.data?.reduce(
    (acc: { total_donation: number; total_donors: number }, curr: any) => {
      return {
        total_donation: acc.total_donation + (+curr?.donation_net_amount || 0),
        total_donors: acc.total_donors + (+curr?.total_donors || 0),
      };
    },
    { total_donation: 0, total_donors: 0 }
  ) || { total_donation: 0, total_donors: 0 };

  return (
    <section className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-end gap-4 my-2 justify-between">
        <div></div>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-fit">
          <div className="flex-col gap-2 w-full md:w-fit">
            <Label className="text-xs">Periode</Label>
            <div className="flex items-center gap-1">
              <Input
                type="date"
                className="px-2 border rounded-md"
                defaultValue={filters?.date_start || ""}
                onChange={(e) => {
                  const newValue = e.target.value;

                  setFilters((prev) => ({ ...prev, date_start: newValue }));
                }}
              />
              <span className="text-xs">Sampai</span>
              <Input
                type="date"
                className="px-2 border rounded-md"
                defaultValue={filters?.date_end || ""}
                onChange={(e) => {
                  const newValue = e.target.value;

                  setFilters((prev) => ({ ...prev, date_end: newValue }));
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-primary-800 w-full rounded-md shadow text-white flex flex-col md:flex-row items-start gap-4 md:gap-8 p-6">
        <div className="flex flex-col gap-1">
          <h5 className="font-medium">Jumlah Penerimaan Wakaf</h5>

          <div className="flex items-baseline gap-1">
            <span className="text-xs">Rp.</span>

            <span className="text-lg font-bold">{currencyFormater(total_donation)}</span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <h5 className="font-medium">Jumlah Transaksi</h5>

          <div className="flex items-end">
            <span className="text-lg font-bold">{currencyFormater(total_donors)}</span>
          </div>
        </div>
      </div>

      <Table className="mt-1">
        <TableHeader>
          <TableRow>
            <TableHead className="bg-primary-800 text-white text-sm">Nama Program</TableHead>
            <TableHead className="bg-primary-800 text-white text-sm">Jumlah Transaksi</TableHead>
            <TableHead className="bg-primary-800 text-white text-sm">Jumlah Penerimaan Wakaf</TableHead>
            <TableHead className="bg-primary-800 text-white text-sm"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {programs?.data?.length ? (
            programs?.data?.map((item: any, itemIdx: number) => (
              <TableRow key={item?.program_name} className={itemIdx % 2 == 1 ? "bg-gray-50" : ""}>
                <TableCell className="font-medium text-xs">{item?.program_name || "-"}</TableCell>
                <TableCell className="text-xs">{currencyFormater(Number(item?.total_donors ?? 0))}</TableCell>
                <TableCell className="text-xs">{currencyFormater(Number(item?.donation_net_amount ?? 0))}</TableCell>
                <TableCell className="text-xs text-right">
                  <Link
                    href={`/report/campaign/${params?.campaign_id}/wakif?${qs({
                      program_id: item?.program_id || "",
                      program_name: item?.program_name || "",
                    })}`}
                    className={buttonVariants({ size: "sm", className: "text-xs" })}
                    prefetch
                  >
                    Wakif <ArrowUpRightIcon className="w-3 ml-1" />
                  </Link>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow className="bg-gray-50">
              <TableCell className="font-medium text-sm text-center py-4" colSpan={4}>
                Tidak ada program
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </section>
  );
};

export default page;
