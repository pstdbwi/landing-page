"use client";

import { EmptyReport } from "@/components/Empty";
import InputSearch from "@/components/Input/input-search";
import { ReportSkeleton } from "@/components/Skeleton";
import { DataTable } from "@/components/table/data-table";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SETTING_INTERVAL_REFETCH_REPORT } from "@/constant/config";
import { IReportInstitution } from "@/constant/report";
import useSearchParamsEntries from "@/lib/use-searchparams-entries";
import currencyFormater, { qs } from "@/lib/utils";
import { useReportCampaignDetail, useReportInstitution } from "@/services/report/hooks";
import { useAutoRefetch } from "@/store/auto-refetch-context";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpRightIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

const page = () => {
  const params = useParams();
  const { isAutoRefetch } = useAutoRefetch();
  const { page = "0", size = "10", parent_name = "", level = "2" } = useSearchParamsEntries();

  const [filters, setFilters] = useState({
    payment_date_start: "",
    payment_date_end: "",
  });

  const {
    data: campaign,
    isLoading: isLoadingCampaign,
    isError: isErrorCampaign,
  } = useReportCampaignDetail({
    campaign_id: params?.campaign_id as string,
    refetchInterval: !isAutoRefetch ? false : SETTING_INTERVAL_REFETCH_REPORT,
  });

  const {
    data: institution,
    isLoading: isLoadingInstitution,
    isError: isErrorInstitution,
  } = useReportInstitution({
    campaign_id: (campaign?.id as string) ?? "",
    corp_id: (campaign?.corp_id as string) ?? "",
    level_parent: (params?.parent_id as string) ?? "",
    level,
    page,
    size,
    refetchInterval: !isAutoRefetch ? false : SETTING_INTERVAL_REFETCH_REPORT,
  });

  if (isLoadingCampaign || isLoadingInstitution) {
    return <ReportSkeleton />;
  }

  if (isErrorCampaign || isErrorInstitution) {
    return <EmptyReport description="Terjadi kesalahan coba beberapa saat lagi" linkBack="/report/campaign" />;
  }

  const columns: ColumnDef<IReportInstitution>[] = [
    {
      accessorKey: "name",
      header: "Sub Institusi",
      cell: ({ row }) => (
        <div className="flex gap-1">
          <span className="text-xs">{row?.original?.name}</span>
        </div>
      ),
    },
    {
      accessorKey: "province_name",
      header: "Provinsi/Kota",
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <span className="text-xs">{row?.original?.province_name || "-"}</span>
          <span className="text-xs font-semibold">{row?.original?.city_name || "-"}</span>
        </div>
      ),
    },
    {
      accessorKey: "total_donors",
      header: "Jumlah Transaksi",
      cell: ({ row }) => (
        <div className="flex gap-1">
          <span className="text-xs">{currencyFormater(Number(row?.original?.total_donors || 0))}</span>
        </div>
      ),
    },
    {
      accessorKey: "donation_net_amount",
      header: "Jumlah Penerimaan Wakaf",
      cell: ({ row }) => (
        <div className="flex gap-1">
          <span className="text-xs">Rp. {currencyFormater(Number(row?.original?.donation_net_amount || 0))}</span>
        </div>
      ),
    },
    {
      accessorKey: "aksi",
      header: "",
      cell: ({ row }) => (
        <div>
          {row?.original?.has_child == 1 ? (
            <Link
              href={`/report/campaign/${params?.campaign_id}/institution/${row?.original?.id}?${qs({
                parent_name: `${parent_name} -  ${row?.original?.name}`,
                level: "3",
              })}`}
              className={buttonVariants({ size: "sm", className: "text-xs" })}
            >
              Sub Institusi <ArrowUpRightIcon className="w-3 ml-1" />
            </Link>
          ) : null}
        </div>
      ),
    },
  ];

  return (
    <section className="space-y-4">
      {/* FILTER */}
      <div className="flex flex-col md:flex-row md:items-end gap-4 my-2 justify-between w-full">
        <div></div>

        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-fit">
          <div className="flex-col gap-2 w-full md:w-fit">
            <Label className="text-xs">Periode</Label>
            <div className="flex items-center gap-1">
              <Input
                type="date"
                className="px-2 border rounded-md"
                defaultValue={filters?.payment_date_start}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setFilters((prev) => ({ ...prev, payment_date_start: newValue }));
                }}
              />
              <span className="text-xs">Sampai</span>
              <Input
                type="date"
                className="px-2 border rounded-md"
                defaultValue={filters?.payment_date_end}
                onChange={(e) => {
                  const newValue = e.target.value;

                  setFilters((prev) => ({ ...prev, payment_date_end: newValue }));
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* CARD INFORMATION */}
      <div className="bg-primary-800 w-full rounded-md shadow text-white grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 items-start gap-2 md:gap-4 p-6">
        <div className="flex flex-col gap-1">
          <h5 className="font-medium">Institusi</h5>

          <div className="flex items-end">
            <span className="text-lg font-bold">{parent_name || "-"}</span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <h5 className="font-medium">Jumlah Transaksi</h5>

          <div className="flex items-end">
            <span className="text-lg font-bold">{currencyFormater(institution?.total?.total_donors)}</span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <h5 className="font-medium">Jumlah Penerimaan Wakaf</h5>

          <div className="flex items-baseline gap-1">
            <span className="text-xs">Rp.</span>

            <span className="text-lg font-bold">{currencyFormater(institution?.total?.donation_net_amount)}</span>
          </div>
        </div>
      </div>

      <InputSearch />
      <DataTable
        columns={columns}
        data={institution?.items}
        attribute={{
          ...institution,
          page,
          size,
        }}
      />
    </section>
  );
};

export default page;
