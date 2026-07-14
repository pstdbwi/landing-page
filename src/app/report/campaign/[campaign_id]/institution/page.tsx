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
import { useReportCampaignDetail, useReportCampaignDistribution, useReportInstitution } from "@/services/report/hooks";
import { useAutoRefetch } from "@/store/auto-refetch-context";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpRightIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

const page = () => {
  const params = useParams();
  const { isAutoRefetch } = useAutoRefetch();
  const { page = "0", size = "10", search = "" } = useSearchParamsEntries();

  const [filters, setFilters] = useState({
    date_start: "",
    date_end: "",
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
    data: distribution,
    isLoading: isLoadingDistribution,
    isError: isErrorDistribution,
  } = useReportCampaignDistribution({
    campaign_id: params?.campaign_id as string,
    start_date: filters?.date_start,
    end_date: filters?.date_end,
    refetchInterval: !isAutoRefetch ? false : SETTING_INTERVAL_REFETCH_REPORT,
  });

  const {
    data: institution,
    isLoading: isLoadingInstitution,
    isError: isErrorInstitution,
  } = useReportInstitution({
    campaign_id: (campaign?.id as string) ?? "",
    corp_id: (campaign?.corp_id as string) ?? "",
    level: "1",
    date_start: filters?.date_start,
    date_end: filters?.date_end,
    page,
    size,
    search,
    refetchInterval: !isAutoRefetch ? false : SETTING_INTERVAL_REFETCH_REPORT,
  });

  if (isLoadingCampaign || isLoadingInstitution || isLoadingDistribution) {
    return <ReportSkeleton />;
  }

  if (isErrorCampaign || isErrorInstitution || isErrorDistribution) {
    return <EmptyReport description="Terjadi kesalahan coba beberapa saat lagi" linkBack="/report/campaign" />;
  }

  const columns: ColumnDef<IReportInstitution>[] = [
    {
      accessorKey: "name",
      header: "Institusi",
      cell: ({ row }) => (
        <div className="flex gap-1">
          <span className="text-xs">{row?.original?.name}</span>
        </div>
      ),
    },
    {
      accessorKey: "province_name",
      header: "Wilayah",
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
          {row?.original?.has_national == 1 ? (
            <Link
              href={`/report/campaign/${params?.campaign_id}/institution/${row?.original?.id}/region?${qs({
                corp_unit_lvl1_id: row?.original?.id,
              })}`}
              className={buttonVariants({ size: "sm", className: "text-xs" })}
            >
              Wilayah Kerja <ArrowUpRightIcon className="w-3 ml-1" />
            </Link>
          ) : null}
          {row?.original?.has_child == 1 ? (
            <Link
              href={`/report/campaign/${params?.campaign_id}/institution/${row?.original?.id}?${qs({
                parent_name: row?.original?.name,
                level: "2",
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
                defaultValue={filters?.date_start}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setFilters((prev) => ({ ...prev, date_start: newValue }));
                }}
              />
              <span className="text-xs">Sampai</span>
              <Input
                type="date"
                className="px-2 border rounded-md"
                defaultValue={filters?.date_end}
                onChange={(e) => {
                  const newValue = e.target.value;

                  setFilters((prev) => ({ ...prev, date_end: newValue }));
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* CARD INFORMATION */}
      <div className="bg-primary-800 w-full rounded-md shadow text-white p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 items-start gap-2 md:gap-4">
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
                  Number(distribution?.total_revenue || 0) - Number(distribution?.total_amount_disbursed) || 0,
                )}
              </span>
            </div>
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
