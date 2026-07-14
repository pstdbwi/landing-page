"use client";

import { buttonVariants } from "@/components/Button";
import { Input } from "@/components/Input";
import InputSearch from "@/components/Input/input-search";
import { Label } from "@/components/Label";
import ReactSelect2 from "@/components/Select/react-select";
import { DataTable } from "@/components/table/data-table";
import { IReportProvince, IReportSchool, SCHOOL_REQUIRED } from "@/constant/pai";
import useMappedList from "@/lib/use-mapped-list";
import useSearchParamsEntries from "@/lib/use-searchparams-entries";
import currencyFormater, { qs } from "@/lib/utils";
import { useGetCityList, useGetProvinceList } from "@/services/location/hooks";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpRightIcon } from "lucide-react";
import "moment/locale/id";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

interface Props {
  table: any;
  typesWakif: { name: string }[];
}

const ReportDanaAbadiSchoolClient = ({ table, typesWakif }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParamsEntries();

  const { data: provinsi, isLoading: isLoadingProvince } = useGetProvinceList({});
  const { data: kota, isLoading: isLoadingCity } = useGetCityList({
    provinceId: searchParams?.province_code,
    enabled: !!searchParams?.province_code,
  });

  const listProvinces = useMemo(() => {
    return provinsi?.map((item: any) => ({ ...item, value: item?.code, label: item?.name }));
  }, [provinsi]);

  const listCities = useMemo(() => {
    return kota?.map((item: any) => ({ ...item, value: item?.code, label: item?.name }));
  }, [kota]);

  const listTypeWakif = useMappedList(typesWakif, (type) => ({
    ...type,
    value: type?.name,
    label: type?.name,
  }));

  const columns: ColumnDef<IReportSchool>[] = [
    {
      accessorKey: "name",
      header: "Sekolah",
      cell: ({ row }) => (
        <div className="flex gap-1">
          <span className="text-xs">{row?.original?.name}</span>
        </div>
      ),
    },
    {
      accessorKey: "province_name",
      header: "Provinsi",
      cell: ({ row }) => (
        <div className="flex gap-1">
          <span className="text-xs">{row?.original?.province_name || "-"}</span>
        </div>
      ),
    },
    {
      accessorKey: "city_name",
      header: "Kota",
      cell: ({ row }) => (
        <div className="flex gap-1">
          <span className="text-xs">{row?.original?.city_name || "-"}</span>
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
        <div>
          <Link
            href={`/report/dana-abadi-pai/wakif?${qs({
              corp_unit_lvl1_id: row?.original?.id || "",
              corp_unit_lvl1_code: row?.original?.code || "",
              corp_unit_lvl1_name: row?.original?.name || "",
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
    <div className="space-y-4">
      {/* FILTER */}
      <div className="flex flex-col md:flex-row md:items-end gap-4 my-2 justify-between w-full">
        <div className="w-full flex items-center gap-2">
          <div className="flex flex-col gap-1 w-full">
            <Label className="text-xs">Tipe Wakif</Label>
            <ReactSelect2
              name="corp_unit_profession"
              placeholder="Pilih Tipe Wakif"
              className="w-full"
              options={listTypeWakif?.filter((item: any) => SCHOOL_REQUIRED?.includes(item?.value?.toLowerCase()))}
              onChange={(val) => {
                router.push(`?` + qs({ ...searchParams, corp_unit_profession: val?.value || "" }));
              }}
              isClearable
            />
          </div>
          <div className="flex flex-col gap-1 w-full">
            <Label className="text-xs">Provinsi</Label>
            <ReactSelect2
              name="province_code"
              placeholder="Pilih Provinsi"
              className="w-full"
              options={listProvinces}
              onChange={(val) => {
                router.push(`?` + qs({ ...searchParams, province_code: val?.value || "", city_code: "" }));
              }}
              isDisabled={isLoadingProvince}
              value={listProvinces?.find((item: any) => item?.code == searchParams?.province_code) || null}
              isClearable
            />
          </div>
          <div className="flex flex-col gap-1 w-full">
            <Label className="text-xs">Kota</Label>
            <ReactSelect2
              name="city_code"
              placeholder="Pilih Kota"
              className="w-full"
              options={listCities}
              onChange={(val) => {
                router.push(`?` + qs({ ...searchParams, city_code: val?.value || "" }));
              }}
              isDisabled={isLoadingCity}
              value={listCities?.find((item: any) => item?.code == searchParams?.city_code) || null}
              isClearable
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
                defaultValue={searchParams.date_start || ""}
                onChange={(e) => {
                  const newValue = e.target.value;
                  if (newValue !== searchParams.date_start) {
                    router.push(`?` + qs({ ...searchParams, date_start: newValue || "" }));
                  }
                }}
              />
              <span className="text-xs">Sampai</span>
              <Input
                type="date"
                className="px-2 border rounded-md"
                defaultValue={searchParams?.date_end || ""}
                onChange={(e) => {
                  const newValue = e.target.value;
                  if (newValue !== searchParams?.date_end) {
                    router.push(`?` + qs({ ...searchParams, date_end: newValue || "" }));
                  }
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

        <div className="flex flex-col gap-1">
          <h5 className="font-medium">Jumlah Penerimaan Wakaf</h5>

          <div className="flex items-baseline gap-1">
            <span className="text-xs">Rp.</span>

            <span className="text-lg font-bold">{currencyFormater(table?.total?.donation_net_amount)}</span>
          </div>
        </div>
      </div>

      <InputSearch />
      <DataTable columns={columns} data={table?.items} attribute={table} />
    </div>
  );
};

export default ReportDanaAbadiSchoolClient;
