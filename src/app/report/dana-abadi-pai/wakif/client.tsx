"use client";

import { Input } from "@/components/Input";
import InputSearch from "@/components/Input/input-search";
import { Label } from "@/components/Label";
import ReactSelect2 from "@/components/Select/react-select";
import { DataTable } from "@/components/table/data-table";
import { IDonor } from "@/constant/pai";
import { loadOptionsSchools } from "@/lib/async-select";
import useMappedList from "@/lib/use-mapped-list";
import useSearchParamsEntries from "@/lib/use-searchparams-entries";
import currencyFormater, { NameOfPayment, qs } from "@/lib/utils";
import { useGetCityList, useGetProvinceList } from "@/services/location/hooks";
import { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import "moment/locale/id";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import AsyncSelect from "react-select/async";

interface Props {
  table: any;
  typesWakif: { name: string }[];
}

const ReportDanaAbadiWakifClient = ({ table, typesWakif }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParamsEntries();

  const { data: provinsi, isLoading: isLoadingProvince } = useGetProvinceList({});
  const { data: kota, isLoading: isLoadingCity } = useGetCityList({
    provinceId: searchParams?.wakif_province_code,
    enabled: !!searchParams?.wakif_province_code,
  });

  const listProvinces = useMemo(() => {
    return provinsi
      ?.map((item: any) => ({ ...item, value: item?.code, label: item?.name }))
      ?.filter((item: any) => !item?.label?.toLowerCase()?.includes("other"));
  }, [provinsi]);

  const listCities = useMemo(() => {
    return kota?.map((item: any) => ({ ...item, value: item?.code, label: item?.name }));
  }, [kota]);

  const listTypeWakif = useMappedList(typesWakif, (type) => ({
    ...type,
    value: type?.name,
    label: type?.name,
  }));

  const columns: ColumnDef<IDonor>[] = [
    {
      accessorKey: "wakif_name",
      header: "Nama Wakif",
      cell: ({ row }) => (
        <div className="flex gap-1">
          <span className="text-xs">{row?.original?.wakif_name}</span>
        </div>
      ),
    },
    {
      accessorKey: "corp_unit_profession",
      header: "Tipe Wakif",
      cell: ({ row }) => (
        <div className="flex gap-1">
          <span className="text-xs">{row?.original?.corp_unit_profession || "-"}</span>
        </div>
      ),
    },
    {
      accessorKey: "corp_unit_lvl1_name",
      header: "Sekolah",
      cell: ({ row }) => (
        <div className="flex gap-1">
          <span className="text-xs">{row?.original?.corp_unit_lvl1_name || "-"}</span>
        </div>
      ),
    },
    {
      accessorKey: "wakif_province_name",
      header: "Provinsi/Kota",
      cell: ({ row }) => (
        <div className="flex gap-1 flex-col">
          <span className="text-xs">{row?.original?.wakif_province_name || "-"}</span>
          <span className="text-xs font-semibold">{row?.original?.wakif_city_name || "-"}</span>
        </div>
      ),
    },
    {
      accessorKey: "payment_method_type",
      header: "Pembayaran",
      cell: ({ row }) => {
        const { payment, payment_method_type, payment_verified_at, donation_net_amount } = row?.original;

        return (
          <div className="flex gap-1">
            <div className="flex flex-col gap-1 whitespace-nowrap">
              <span className="text-xs">
                {NameOfPayment({ payment: payment, paymentMethodType: payment_method_type })}
              </span>
              <span className="text-[0.65rem]">{moment(payment_verified_at).format("DD/MM/yy hh:mm")}</span>
              <span className="font-bold text-xs">Rp. {Number(donation_net_amount).toLocaleString()}</span>
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      {/* FILTER */}

      <div className="flex w-full justify-end">
        <div className="flex-col gap-2 w-full md:w-fit">
          <Label className="text-xs">Periode</Label>
          <div className="flex items-center gap-1">
            <Input
              type="date"
              className="px-2 border rounded-md"
              defaultValue={searchParams.payment_date_start || ""}
              onChange={(e) => {
                const newValue = e.target.value;
                if (newValue !== searchParams.payment_date_start) {
                  router.push(`?` + qs({ ...searchParams, payment_date_start: newValue || "" }));
                }
              }}
            />
            <span className="text-xs">s/d</span>
            <Input
              type="date"
              className="px-2 border rounded-md"
              defaultValue={searchParams?.payment_date_end || ""}
              onChange={(e) => {
                const newValue = e.target.value;
                if (newValue !== searchParams?.payment_date_end) {
                  router.push(`?` + qs({ ...searchParams, payment_date_end: newValue || "" }));
                }
              }}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row md:items-end gap-4 my-2 justify-between w-full">
        <div className="w-full flex items-center gap-2">
          <div className="flex flex-col gap-1 w-full">
            <Label className="text-xs">Tipe Wakif</Label>
            <ReactSelect2
              name="corp_unit_profession"
              placeholder="Pilih Tipe Wakif"
              className="w-full"
              options={listTypeWakif}
              onChange={(val) => {
                router.push(`?` + qs({ ...searchParams, corp_unit_profession: val?.value || "" }));
              }}
              isClearable
            />
          </div>

          <div className="flex flex-col gap-1 w-full">
            <Label className="text-xs">Provinsi</Label>
            <ReactSelect2
              name="wakif_province_id"
              placeholder="Pilih Provinsi"
              className="w-full"
              options={listProvinces}
              onChange={(val) => {
                router.push(
                  `?` +
                    qs({
                      ...searchParams,
                      wakif_province_code: val?.code,
                      wakif_province_id: val?.id || "",
                      wakif_city_id: "",
                      wakif_city_code: "",
                    })
                );
              }}
              isDisabled={isLoadingProvince}
              value={listProvinces?.find((item: any) => item?.id == searchParams?.wakif_province_id) || null}
              isClearable
            />
          </div>
          <div className="flex flex-col gap-1 w-full">
            <Label className="text-xs">Kota</Label>
            <ReactSelect2
              name="wakif_city_id"
              placeholder="Pilih Kota"
              className="w-full"
              options={listCities}
              onChange={(val) => {
                router.push(`?` + qs({ ...searchParams, wakif_city_code: val?.code, wakif_city_id: val?.id || "" }));
              }}
              isDisabled={isLoadingCity}
              value={listCities?.find((item: any) => item?.id == searchParams?.wakif_city_id) || null}
              isClearable
            />
          </div>

          <div className="flex flex-col gap-1 w-full">
            <Label className="text-xs">Sekolah</Label>
            <AsyncSelect
              id="corp_unit_lvl1_id"
              cacheOptions
              name="corp_unit_lvl1_id"
              loadOptions={loadOptionsSchools(
                "SPAI070520250000004",
                searchParams?.wakif_province_code || "",
                searchParams?.wakif_city_code || ""
              )}
              defaultOptions={false}
              placeholder="Cari sekolah"
              onChange={(val: any) => {
                router.push(
                  `?` +
                    qs({
                      ...searchParams,
                      corp_unit_lvl1_id: val?.value || "",
                      corp_unit_lvl1_code: val?.code || "",
                      corp_unit_lvl1_name: val?.name || "",
                    })
                );
              }}
              className="w-full text-xs font-light !text-black capitalize placeholder:text-xs"
              maxMenuHeight={150}
              noOptionsMessage={({ inputValue }) => (!inputValue ? "Ketikan nama sekolah" : "Sekolah tidak ditemukan")}
              isClearable
              value={
                searchParams?.corp_unit_lvl1_id
                  ? {
                      value: searchParams?.corp_unit_lvl1_id,
                      label: searchParams?.corp_unit_lvl1_name,
                    }
                  : null
              }
            />
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

export default ReportDanaAbadiWakifClient;
