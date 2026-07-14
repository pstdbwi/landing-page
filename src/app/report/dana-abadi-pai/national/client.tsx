"use client";

import { buttonVariants } from "@/components/Button";
import DisbursementDialog from "@/components/dialog/disbursement-dialog";
import { Input } from "@/components/Input";
import InputSearch from "@/components/Input/input-search";
import { Label } from "@/components/Label";
import ReactSelect2 from "@/components/Select/react-select";
import { DataTable } from "@/components/table/data-table";
import { IDisbursementCampaign, IReportProvince } from "@/constant/pai";
import useMappedList from "@/lib/use-mapped-list";
import useSearchParamsEntries from "@/lib/use-searchparams-entries";
import currencyFormater, { qs } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpRightIcon } from "lucide-react";
import "moment/locale/id";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  table: any;
  typesWakif: { name: string }[];
  distribution: IDisbursementCampaign;
}

const ReportDanaAbadiProvinceClient = ({ table, typesWakif, distribution }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParamsEntries();
  const [disbursementModal, setDisbursementModal] = useState(false);

  const listTypeWakif = useMappedList(typesWakif, (type) => ({
    ...type,
    value: type?.name,
    label: type?.name,
  }));

  const columns: ColumnDef<IReportProvince>[] = [
    {
      accessorKey: "name",
      header: "Provinsi",
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
          <Link
            href={`/report/dana-abadi-pai/national/city?province_id=${row?.original?.id}&province_code=${row?.original?.code}&province_name=${row?.original?.name}`}
            className={buttonVariants({ size: "sm", className: "text-xs" })}
          >
            Daftar Kota <ArrowUpRightIcon className="w-3 ml-1" />
          </Link>

          <Link
            href={`/report/dana-abadi-pai/wakif?wakif_province_id=${row?.original?.id}&wakif_province_code=${row?.original?.code}`}
            className={buttonVariants({ size: "sm", className: "text-xs" })}
          >
            Wakif <ArrowUpRightIcon className="w-3 ml-1" />
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* FILTER */}
      <div className="flex flex-col md:flex-row md:items-end gap-4 my-2 justify-between w-full">
        <div className="w-full flex items-center">
          <div className="flex flex-col gap-1 w-full">
            <Label className="text-xs">Tipe Wakif</Label>
            <ReactSelect2
              name="corp_unit_profession"
              placeholder="Pilih Tipe Wakif"
              className="w-full"
              options={listTypeWakif}
              onChange={(val) => {
                router.push(`?` + qs({ ...searchParams, corp_unit_profession: val?.value }));
              }}
            />
          </div>
        </div>
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
      <div className="bg-primary-800 w-full rounded-md shadow text-white grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 items-start gap-2 md:gap-4 p-6">
        <div className="flex flex-col gap-1">
          <h5 className="font-medium">Jumlah Transaksi</h5>

          <div className="flex items-end">
            <span className="text-lg font-bold">{currencyFormater(table?.total?.total_donors)}</span>
          </div>
        </div>

        <div className="flex flex-col gap-1 xl:col-span-2">
          <h5 className="font-medium">Jumlah Penerimaan Wakaf</h5>

          <div className="flex items-baseline gap-1">
            <span className="text-xs">Rp.</span>

            <span className="text-lg font-bold">{currencyFormater(table?.total?.donation_net_amount)}</span>
          </div>
        </div>

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

            <div className="flex items-baseline gap-4 w-full">
              <span className="text-lg font-bold">
                {currencyFormater(Number(distribution?.total_amount_disbursed) || 0)}
              </span>
            </div>
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

      <InputSearch />
      <DataTable columns={columns} data={table?.items} attribute={table} />

      <DisbursementDialog
        disbursement={distribution}
        disbursementModal={disbursementModal}
        setDisbursementModal={setDisbursementModal}
      />
    </div>
  );
};

export default ReportDanaAbadiProvinceClient;
