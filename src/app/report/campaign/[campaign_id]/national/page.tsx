"use client";

import { EmptyReport } from "@/components/Empty";
import InputSearch from "@/components/Input/input-search";
import ReactSelect2 from "@/components/Select/react-select";
import { ReportSkeleton } from "@/components/Skeleton";
import { DataTable } from "@/components/table/data-table";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IReportProvince } from "@/constant/pai";
import { SETTING_INTERVAL_REFETCH_REPORT } from "@/constant/config";
import useMappedList from "@/lib/use-mapped-list";
import useSearchParamsEntries from "@/lib/use-searchparams-entries";
import currencyFormater, { qs } from "@/lib/utils";
import {
  useReportCampaignDetail,
  useReportCampaignDistribution,
  useReportDonationNational,
} from "@/services/report/hooks";
import { useAutoRefetch } from "@/store/auto-refetch-context";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpRightIcon } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Fragment } from "react";

const page = () => {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParamsEntries();
  const { isAutoRefetch } = useAutoRefetch();

  const {
    page = "0",
    size = "10",
    payment_date_start = "",
    payment_date_end = "",
    search = "",
    type = "province",
    province_code = "",
    province_id = "",
    city_code = "",
    wakif_type_id = "",
    interval = "",
  } = searchParams;

  const intervalSet = interval ? 1000 * Number(interval) : 0;
  const isNationalProvince = type == "province";
  const isNationalCity = type == "city";

  const {
    data: campaign,
    isLoading: isLoadingCampaign,
    isError: isErrorCampaign,
  } = useReportCampaignDetail({
    campaign_id: params?.campaign_id as string,
    refetchInterval: !isAutoRefetch ? false : SETTING_INTERVAL_REFETCH_REPORT,
  });

  const {
    data: donation,
    isLoading: isLoadingDonation,
    isError: isErrorDonation,
  } = useReportDonationNational({
    campaign_id: params?.campaign_id as string,
    page: page,
    size: size,
    type: type,
    province_id,
    province_code,
    city_code,
    wakif_type_id,
    payment_date_start,
    payment_date_end,
    search,
    refetchInterval: !isAutoRefetch ? false : interval ? intervalSet : SETTING_INTERVAL_REFETCH_REPORT,
  });

  const {
    data: distribution,
    isLoading: isLoadingDistribution,
    isError: isErrorDistribution,
  } = useReportCampaignDistribution({
    campaign_id: params?.campaign_id as string,
    start_date: payment_date_start,
    end_date: payment_date_end,
    refetchInterval: !isAutoRefetch ? false : interval ? intervalSet : SETTING_INTERVAL_REFETCH_REPORT,
  });

  const listTypeWakif = useMappedList(campaign?.wakif_types || [], (type) => ({
    ...type,
    value: type?.name,
    label: type?.name,
  }));

  if (isLoadingCampaign || isLoadingDistribution || isLoadingDonation) {
    return <ReportSkeleton />;
  }

  if (isErrorCampaign || isErrorDonation || isErrorDistribution) {
    return <EmptyReport description="Terjadi kesalahan coba beberapa saat lagi" linkBack="/report/campaign" />;
  }

  const columns: ColumnDef<IReportProvince>[] = [
    {
      accessorKey: "name",
      header: "Wilayah",
      cell: ({ row }) => (
        <div className="flex gap-1">
          <span className="text-xs">{row?.original?.name}</span>
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
          <span className="text-xs">Rp. {currencyFormater(row?.original?.donation_net_amount)}</span>
        </div>
      ),
    },
    {
      accessorKey: "aksi",
      header: "",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {isNationalProvince && row?.original?.id !== "999" ? (
            <Link
              href={`/report/campaign/${params?.campaign_id}/national?${qs({
                province_id: row?.original?.id,
                province_code: row?.original?.code,
                province_name: row?.original?.name,
                type: "city",
              })}`}
              className={buttonVariants({ size: "sm", className: "text-xs" })}
            >
              Daftar Kota <ArrowUpRightIcon className="w-3 ml-1" />
            </Link>
          ) : null}

          <Link
            href={`/report/campaign/${params?.campaign_id}/wakif?${qs({
              wakif_province_id: isNationalProvince ? row?.original?.id : province_id,
              wakif_province_code: isNationalProvince ? row?.original?.code : province_code,

              ...(isNationalCity
                ? {
                    wakif_city_id: row?.original?.id || "",
                    wakif_city_code: row?.original?.code || "",
                  }
                : {}),
            })}`}
            className={buttonVariants({ size: "sm", className: "text-xs" })}
          >
            Wakif <ArrowUpRightIcon className="w-3 ml-1" />
          </Link>
        </div>
      ),
    },
  ];

  return (
    <section className="space-y-4 relative">
      {/* FILTER */}
      <div className="flex flex-col md:flex-row md:items-end gap-4 my-2 justify-between w-full">
        {listTypeWakif?.length ? (
          <div className="flex flex-col gap-1 w-full">
            <Label className="text-xs">Tipe Wakif</Label>
            <ReactSelect2
              name="wakif_type_id"
              placeholder="Pilih Tipe Wakif"
              className="w-full text-xs"
              options={listTypeWakif}
              isClearable
              value={listTypeWakif?.find((val: any) => val.id === wakif_type_id) || null}
              onChange={(val) => {
                router.push(`?` + qs({ ...searchParams, wakif_type_id: val?.id || "" }));
              }}
            />
          </div>
        ) : null}

        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-fit">
          <div className="flex-col gap-2 w-full md:w-fit">
            <Label className="text-xs">Periode</Label>
            <div className="flex items-center gap-1">
              <Input
                type="date"
                className="px-2 border rounded-md"
                defaultValue={searchParams.payment_date_start || ""}
                onChange={(e) => {
                  const newValue = e.target.value;
                  router.push(`?` + qs({ ...searchParams, payment_date_start: newValue || "" }));
                }}
              />
              <span className="text-xs">Sampai</span>
              <Input
                type="date"
                className="px-2 border rounded-md"
                defaultValue={searchParams?.payment_date_end || ""}
                onChange={(e) => {
                  const newValue = e.target.value;

                  router.push(`?` + qs({ ...searchParams, payment_date_end: newValue || "" }));
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* CARD INFORMATION */}
      <div className="bg-primary-800 w-full rounded-md shadow text-white p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 items-start gap-2 md:gap-4">
          {isNationalCity && (
            <div className="flex flex-col gap-1">
              <h5 className="font-medium">Wilayah</h5>

              <div className="flex items-end">
                <span className="text-lg font-bold">{searchParams?.province_name}</span>
              </div>
            </div>
          )}
          <div className="flex flex-col gap-1">
            <h5 className="font-medium">Jumlah Transaksi</h5>

            <div className="flex items-end">
              <span className="text-lg font-bold">{currencyFormater(donation?.total?.total_donors || 0)}</span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <h5 className="font-medium">Jumlah Penerimaan Wakaf</h5>

            <div className="flex items-baseline gap-1">
              <span className="text-xs">Rp.</span>

              <span className="text-lg font-bold">{currencyFormater(donation?.total?.donation_net_amount || 0)}</span>
            </div>
          </div>
        </div>

        {isNationalProvince && (
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
        )}
      </div>

      {/* INPUT SEARCH */}
      <InputSearch />

      {donation ? (
        <DataTable
          columns={columns}
          data={donation?.items}
          attribute={{
            ...donation,
            page,
            size,
          }}
        />
      ) : (
        <EmptyReport description="Tidak ada data donasi" />
      )}
    </section>
  );
};

export default page;
