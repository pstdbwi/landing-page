"use client";

import { EmptyReport } from "@/components/Empty";
import InputSearch from "@/components/Input/input-search";
import ReactSelect2 from "@/components/Select/react-select";
import { ReportSkeleton } from "@/components/Skeleton";
import { DataTable } from "@/components/table/data-table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SETTING_INTERVAL_REFETCH_REPORT } from "@/constant/config";
import { IDonor } from "@/constant/pai";
import { loadOptionsCorpUnitLevel1, loadOptionsCorpUnitLevel2, loadOptionsCorpUnitLevel3 } from "@/lib/async-select";
import useMappedList from "@/lib/use-mapped-list";
import useSearchParamsEntries from "@/lib/use-searchparams-entries";
import currencyFormater, { NameOfPayment } from "@/lib/utils";
import { useGetCityList, useGetDistrictList, useGetProvinceList } from "@/services/location/hooks";
import { useReportCampaignDetail, useReportDonationWakif } from "@/services/report/hooks";
import { useAutoRefetch } from "@/store/auto-refetch-context";
import { CellContext, ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import { useParams } from "next/navigation";
import { Fragment, useMemo, useState } from "react";
import AsyncSelect from "react-select/async";

const page = () => {
  const params = useParams();
  const searchParams = useSearchParamsEntries();
  const { isAutoRefetch } = useAutoRefetch();
  const {
    page = "0",
    size = "10",
    search = "",
    wakif_province_id = "",
    wakif_province_code = "",
    wakif_city_id = "",
    wakif_city_code = "",
    program_id = "",
    program_name = "",
    corp_unit_lvl1_id,
    corp_unit_lvl1_code,
    corp_unit_lvl1_name,
    interval = "",
  } = searchParams;

  const [filters, setFilters] = useState({
    wakif_province_id: wakif_province_id || "",
    wakif_province_code: wakif_province_code || "",
    wakif_city_id: wakif_city_id || "",
    wakif_city_code: wakif_city_code || "",
    wakif_type_id: "",
    wakif_type_has_corp_unit: false,

    payment_date_start: "",
    payment_date_end: "",

    corp_unit_lvl1_id: corp_unit_lvl1_id || "",
    corp_unit_lvl1_name: corp_unit_lvl1_name || "",
    corp_unit_lvl1_has_child: false,
    has_national: false,

    corp_unit_lvl2_id: "",
    corp_unit_lvl2_name: "",
    corp_unit_lvl2_has_child: false,

    corp_unit_lvl3_id: "",
    corp_unit_lvl3_name: "",

    corp_unit_profession: "",

    corp_unit_province_id: "",
    corp_unit_province_code: "",
    corp_unit_city_id: "",
    corp_unit_city_code: "",
    corp_unit_district_id: "",
    corp_unit_district_code: "",

    program_id: program_id || "",
    program_name: program_name || "",
  });

  // LABELING DEPENDENCIES CORP
  const [corpLevel1Nomenclature, setCorpLevel1Nomenclature] = useState("");
  const [corpLevel2Nomenclature, setCorpLevel2Nomenclature] = useState("");
  const [corpLevel3Nomenclature, setCorpLevel3Nomenclature] = useState("");
  const [listProfession, setListProfession] = useState([]);
  const intervalSet = interval ? 1000 * Number(interval) : 0;

  const { data: provinsi, isLoading: isLoadingProvince } = useGetProvinceList({});
  const { data: kota, isLoading: isLoadingCity } = useGetCityList({
    provinceId: filters?.wakif_province_code,
    enabled: !!filters?.wakif_province_code,
  });

  const { data: corp_unit_provinces, isLoading: isLoadingUnitProvinces } = useGetProvinceList({});
  const { data: corp_unit_cities, isLoading: isLoadingUnitCities } = useGetCityList({
    provinceId: filters?.corp_unit_province_code,
    enabled: !!filters?.corp_unit_province_code,
  });
  const { data: corp_unit_districts, isLoading: isLoadingUnitDistricts } = useGetDistrictList({
    cityId: filters?.corp_unit_city_code,
    enabled: !!filters?.corp_unit_city_code,
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
    data: wakif,
    isLoading: isLoadingWakif,
    isError: isErrorWakif,
  } = useReportDonationWakif({
    campaign_id: params?.campaign_id as string,
    wakif_province_id: filters?.wakif_province_id,
    wakif_city_id: filters?.wakif_city_id,
    wakif_type_id: filters?.wakif_type_id,
    payment_date_start: filters?.payment_date_start,
    payment_date_end: filters?.payment_date_end,
    corp_unit_lvl1_id: filters?.corp_unit_lvl1_id,
    corp_unit_lvl2_id: filters?.corp_unit_lvl2_id,
    corp_unit_lvl3_id: filters?.corp_unit_lvl3_id,
    program_id: filters?.program_id,
    program_name: filters?.program_name,
    corp_unit_province_id: filters?.corp_unit_province_id,
    corp_unit_city_id: filters?.corp_unit_city_id,
    corp_unit_district_id: filters?.corp_unit_district_id,
    corp_unit_profession: filters?.corp_unit_profession,
    page,
    size,
    search,
    refetchInterval: !isAutoRefetch ? false : interval ? intervalSet : SETTING_INTERVAL_REFETCH_REPORT,
  });

  const listProvinces = useMemo(() => {
    return provinsi
      ?.map((item: any) => ({ ...item, value: item?.code, label: item?.name }))
      ?.filter((item: any) => !item?.label?.toLowerCase()?.includes("other"));
  }, [provinsi]);

  const listCities = useMemo(() => {
    return kota?.map((item: any) => ({ ...item, value: item?.code, label: item?.name }));
  }, [kota]);

  const listCorpProvinces = useMemo(() => {
    return corp_unit_provinces
      ?.map((item: any) => ({ ...item, value: item?.code, label: item?.name }))
      ?.filter((item: any) => !item?.label?.toLowerCase()?.includes("other"));
  }, [corp_unit_provinces]);

  const listCorpCities = useMemo(() => {
    return corp_unit_cities
      ?.map((item: any) => ({ ...item, value: item?.code, label: item?.name }))
      ?.filter((item: any) => !item?.label?.toLowerCase()?.includes("other"));
  }, [corp_unit_cities]);

  const listCorpDistricts = useMemo(() => {
    return corp_unit_districts
      ?.map((item: any) => ({ ...item, value: item?.code, label: item?.name }))
      ?.filter((item: any) => !item?.label?.toLowerCase()?.includes("other"));
  }, [corp_unit_districts]);

  const listTypeWakif = useMappedList(campaign?.wakif_types || [], (type) => ({
    ...type,
    value: type?.id,
    label: type?.name,
  }));

  const listSubCampaign = useMappedList(campaign?.sub_campaigns || [], (sub) => ({
    ...sub,
    value: sub?.id,
    label: sub?.name || sub?.title,
  }));

  if (isLoadingCampaign || isLoadingWakif) {
    return <ReportSkeleton />;
  }

  if (isErrorCampaign || isErrorWakif) {
    return <EmptyReport description="Terjadi kesalahan coba beberapa saat lagi" linkBack="/report/campaign" />;
  }

  const isHaveCorpUnit = campaign?.wakif_types?.length
    ? campaign?.wakif_types?.some((item: any) => item?.has_corp_unit == 1)
    : false;
  // REQUIREMENT TO SHOW FILTER INSTITUSI
  const showInputCorpsDefault = campaign?.wakif_types?.length
    ? !campaign?.wakif_types?.some((item: any) => item?.has_corp_unit == 1)
    : true;

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
    ...(campaign?.wakif_types?.length
      ? [
          {
            accessorKey: "corp_unit_profession",
            header: "Tipe Wakif",
            cell: ({ row }: CellContext<IDonor, unknown>) => (
              <div className="flex gap-1">
                <span className="text-xs">{row?.original?.wakif_type || "-"}</span>
              </div>
            ),
          },
        ]
      : []),
    ...(showInputCorpsDefault || isHaveCorpUnit
      ? [
          {
            accessorKey: "corp_unit_lvl1_name",
            header: "Institusi",
            cell: ({ row }: CellContext<IDonor, unknown>) => (
              <div className="flex gap-1 flex-col">
                {/* Unit Levels */}
                <div className="text-xs flex gap-x-1 flex-col">
                  {(() => {
                    const units = [
                      row?.original?.corp_unit_lvl1_name && (
                        <span key="lvl1" className="font-bold">
                          {row.original.corp_unit_lvl1_name}
                        </span>
                      ),
                      row?.original?.corp_unit_lvl2_name && (
                        <span key="lvl2" className="font-semibold">
                          {row.original.corp_unit_lvl2_name}
                        </span>
                      ),
                      row?.original?.corp_unit_lvl3_name && (
                        <span key="lvl3" className="font-medium">
                          {row.original.corp_unit_lvl3_name}
                        </span>
                      ),
                    ].filter(Boolean);

                    return units.length > 0 ? (
                      units.map((item, i) => <Fragment key={i}>{item}</Fragment>)
                    ) : (
                      <span>-</span>
                    );
                  })()}
                </div>

                {/* Location Info */}
                <div className="text-xs flex flex-wrap gap-x-1">
                  {(() => {
                    const locations = [
                      row?.original?.corp_unit_province_name,
                      row?.original?.corp_unit_city_name,
                      row?.original?.corp_unit_district_name,
                    ].filter(Boolean);

                    return locations.length > 0 ? (
                      locations.map((item, index) => (
                        <Fragment key={index}>
                          {item}
                          {index !== locations.length - 1 && ", "}
                        </Fragment>
                      ))
                    ) : (
                      <span>-</span>
                    );
                  })()}
                </div>
              </div>
            ),
          },
        ]
      : []),

    {
      accessorKey: "wakif_province_name",
      header: "Wilayah",
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
              <span className="text-[0.65rem]">{moment(payment_verified_at).format("DD/MM/yy HH:mm")}</span>
              <span className="font-bold text-xs">Rp. {Number(donation_net_amount).toLocaleString()}</span>
            </div>
          </div>
        );
      },
    },
  ];

  const interceptLoadOptionsCorpUnitLevel1 = async (inputValue: string) => {
    const options: any[] = await loadOptionsCorpUnitLevel1(
      campaign?.corp_id,
      showInputCorpsDefault ? "" : filters?.wakif_province_code,
      showInputCorpsDefault ? "" : filters?.wakif_city_code
    )(inputValue);

    const label = options?.[0]?.level_nomenclature;

    if (label) {
      setCorpLevel1Nomenclature(label);
    } else {
      setCorpLevel1Nomenclature("");
    }

    return options;
  };

  const interceptLoadOptionsCorpUnitLevel2 = async (inputValue: string) => {
    const options: any[] = await loadOptionsCorpUnitLevel2(
      campaign?.corp_id,
      filters?.corp_unit_lvl1_id || ""
    )(inputValue);

    const label = options?.[0]?.level_nomenclature;

    if (label) {
      setCorpLevel2Nomenclature(label);
    } else {
      setCorpLevel2Nomenclature("");
    }

    return options;
  };

  const interceptLoadOptionsCorpUnitLevel3 = async (inputValue: string) => {
    const options: any[] = await loadOptionsCorpUnitLevel3(
      campaign?.corp_id,
      filters?.corp_unit_lvl2_id || ""
    )(inputValue);

    const label = options?.[0]?.level_nomenclature;

    if (label) {
      setCorpLevel3Nomenclature(label);
    } else {
      setCorpLevel3Nomenclature("");
    }

    return options;
  };

  return (
    <section className="space-y-4 relative">
      {/* FILTER PERIODE */}
      <div className="flex w-full justify-end">
        <div className="flex-col gap-2 w-full md:w-fit">
          <Label className="text-xs">Periode</Label>
          <div className="flex items-center gap-1">
            <Input
              type="date"
              className="px-2 border rounded-md"
              defaultValue={filters?.payment_date_start || ""}
              onChange={(e) => {
                const newValue = e.target.value;
                if (newValue !== filters?.payment_date_start) {
                  setFilters((prev) => ({ ...prev, payment_date_start: newValue || "" }));
                }
              }}
            />
            <span className="text-xs">s/d</span>
            <Input
              type="date"
              className="px-2 border rounded-md"
              defaultValue={filters?.payment_date_end || ""}
              onChange={(e) => {
                const newValue = e.target.value;
                if (newValue !== filters?.payment_date_end) {
                  setFilters((prev) => ({ ...prev, payment_date_end: newValue || "" }));
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* FILTER PROGRAM PROGRAM, TIPE, WILAYAH WAKIF */}
      <div className="flex flex-col md:flex-row md:items-end gap-4 my-2 justify-between w-full">
        <div className="w-full flex-col md:flex-row flex items-center gap-2">
          {listTypeWakif?.length ? (
            <div className="flex flex-col gap-1 w-full">
              <Label className="text-xs">Tipe Wakif</Label>
              <ReactSelect2
                name="corp_unit_profession"
                placeholder="Pilih Tipe Wakif"
                className="w-full text-xs"
                options={listTypeWakif}
                onChange={(val) => {
                  setFilters((prev) => ({
                    ...prev,
                    wakif_type_id: val?.value || "",
                    wakif_type_has_corp_unit: val?.has_corp_unit == 1,
                  }));
                }}
                isClearable
                value={listTypeWakif?.find((wakif) => wakif?.id == filters?.wakif_type_id) || null}
              />
            </div>
          ) : null}

          {listSubCampaign?.length ? (
            <div className="flex flex-col gap-1 w-full">
              <Label className="text-xs">Program</Label>
              <ReactSelect2
                name="program_id"
                placeholder="Pilih Program"
                className="w-full text-xs"
                options={listSubCampaign}
                onChange={(val) => {
                  setFilters((prev) => ({
                    ...prev,
                    program_id: val?.value,
                  }));
                }}
                isClearable
                value={
                  listSubCampaign?.find(
                    (sub) => sub?.id == filters?.program_id || sub?.label == filters?.program_name
                  ) || null
                }
              />
            </div>
          ) : null}

          <div className="flex flex-col gap-1 w-full">
            <Label className="text-xs">Wilayah</Label>
            <ReactSelect2
              name="wakif_province_id"
              placeholder="Pilih Wilayah"
              className="w-full text-xs"
              options={listProvinces}
              onChange={(val) => {
                setFilters((prev) => ({
                  ...prev,
                  wakif_province_code: val?.code,
                  wakif_province_id: val?.id || "",
                  wakif_city_id: "",
                  wakif_city_code: "",
                }));
              }}
              isDisabled={isLoadingProvince}
              value={listProvinces?.find((item: any) => item?.id == filters?.wakif_province_id) || null}
              isClearable
            />
          </div>
          <div className="flex flex-col gap-1 w-full">
            <Label className="text-xs">&nbsp;</Label>
            <ReactSelect2
              name="wakif_city_id"
              placeholder="Pilih Wilayah Selanjutnya"
              className="w-full text-xs"
              options={listCities}
              onChange={(val) => {
                setFilters((prev) => ({ ...prev, wakif_city_code: val?.code, wakif_city_id: val?.id || "" }));
              }}
              isDisabled={isLoadingCity}
              value={listCities?.find((item: any) => item?.id == filters?.wakif_city_id) || null}
              isClearable
            />
          </div>
        </div>
      </div>

      {/* FILTER INSTITUSI */}
      {campaign?.rakornas_kemenag == 1 && (showInputCorpsDefault || filters?.wakif_type_has_corp_unit) ? (
        <section className="flex gap-4 w-full">
          <div className="flex flex-col gap-1 w-full">
            <AsyncSelect
              id="corp_unit_lvl1_id"
              cacheOptions
              name="corp_unit_lvl1_id"
              loadOptions={interceptLoadOptionsCorpUnitLevel1}
              defaultOptions
              placeholder={`Cari ${corpLevel1Nomenclature || "Institusi"}`}
              onChange={(val: any) => {
                // SET VALUE
                setFilters((prev) => ({
                  ...prev,
                  corp_unit_lvl1_id: val?.value,

                  corp_unit_lvl1_name: val?.name,
                  corp_unit_lvl1_has_child: val?.has_child == 1,
                  ...(val?.has_national == 1
                    ? {
                        has_national: true,
                      }
                    : {}),

                  // RESET VALUE
                  corp_unit_lvl2_id: "",
                  corp_unit_lvl2_has_child: false,
                  corp_unit_lvl3_id: "",
                  corp_unit_profession: "",
                }));

                // HAS & SET PROFESSIONS
                setListProfession(
                  val?.professions?.length
                    ? val?.professions?.map((item: any) => ({
                        ...item,
                        value: item?.name,
                        label: item?.name,
                      }))
                    : []
                );
              }}
              className="w-full text-xs font-light !text-black capitalize placeholder:text-xs"
              maxMenuHeight={150}
              value={
                filters?.corp_unit_lvl1_id
                  ? {
                      value: filters?.corp_unit_lvl1_id,
                      label: filters?.corp_unit_lvl1_name,
                    }
                  : null
              }
              noOptionsMessage={({ inputValue }) =>
                !inputValue ? `Ketikan ${corpLevel1Nomenclature}` : `${corpLevel1Nomenclature} tidak ditemukan`
              }
              styles={{
                control: (base) => ({
                  ...base,
                  borderWidth: 1,
                  borderRadius: 8,
                }),
                menu: (provided) => ({ ...provided, zIndex: 999 }),
              }}
              isClearable
            />
          </div>

          {filters?.corp_unit_lvl1_has_child ? (
            <div className="flex flex-col gap-1 w-full">
              <AsyncSelect
                id="corp_unit_lvl2_id"
                cacheOptions
                name="corp_unit_lvl2_id"
                loadOptions={interceptLoadOptionsCorpUnitLevel2}
                defaultOptions
                placeholder={`Cari ${corpLevel2Nomenclature}`}
                onChange={(val: any) => {
                  // SET VALUE
                  setFilters((prev) => ({
                    ...prev,
                    corp_unit_lvl2_id: val?.value,
                    corp_unit_lvl2_name: val?.name,
                    corp_unit_lvl2_has_child: val?.has_child == 1,
                    ...(val?.has_national == 1
                      ? {
                          has_national: true,
                        }
                      : {}),

                    // RESET VALUE
                    corp_unit_lvl3_id: "",
                    corp_unit_lvl3_name: "",
                  }));
                }}
                className="w-full text-xs font-light !text-black capitalize placeholder:text-xs"
                maxMenuHeight={150}
                value={
                  filters?.corp_unit_lvl2_id
                    ? {
                        value: filters?.corp_unit_lvl2_id,
                        label: filters?.corp_unit_lvl2_name,
                      }
                    : null
                }
                noOptionsMessage={({ inputValue }) =>
                  !inputValue ? `Ketikan ${corpLevel2Nomenclature}` : `${corpLevel2Nomenclature} tidak ditemukan`
                }
                styles={{
                  control: (base) => ({
                    ...base,
                    borderWidth: 1,
                    borderRadius: 8,
                  }),
                  menu: (provided) => ({ ...provided, zIndex: 999 }),
                }}
                isClearable
              />
            </div>
          ) : null}

          {filters?.corp_unit_lvl2_has_child ? (
            <div className="flex flex-col gap-1 w-full">
              <AsyncSelect
                id="corp_unit_lvl3_id"
                cacheOptions
                name="corp_unit_lvl3_id"
                loadOptions={interceptLoadOptionsCorpUnitLevel3}
                defaultOptions
                placeholder={`Cari ${corpLevel3Nomenclature}`}
                onChange={(val: any) => {
                  // SET VALUE
                  setFilters((prev) => ({
                    ...prev,
                    corp_unit_lvl3_id: val?.value,
                    corp_unit_lvl3_name: val?.name,
                    ...(val?.has_national == 1
                      ? {
                          has_national: true,
                        }
                      : {}),
                  }));
                }}
                className="w-full text-xs font-light !text-black capitalize placeholder:text-xs"
                maxMenuHeight={150}
                value={
                  filters?.corp_unit_lvl3_id
                    ? {
                        value: filters?.corp_unit_lvl3_id,
                        label: filters?.corp_unit_lvl3_name,
                      }
                    : null
                }
                noOptionsMessage={({ inputValue }) =>
                  !inputValue ? `Ketikan ${corpLevel3Nomenclature}` : `${corpLevel3Nomenclature} tidak ditemukan`
                }
                styles={{
                  control: (base) => ({
                    ...base,
                    borderWidth: 1,

                    borderRadius: 8,
                  }),
                  menu: (provided) => ({ ...provided, zIndex: 999 }),
                }}
                isClearable
              />
            </div>
          ) : null}

          {listProfession?.length ? (
            <ReactSelect2
              name="corp_unit_profession"
              className="text-xs"
              options={listProfession}
              placeholder="Pilih Profesi"
              onChange={(value) => {
                setFilters((prev) => ({ ...prev, corp_unit_profession: value?.value }));
              }}
              value={listProfession?.find((item: any) => item?.value == filters?.corp_unit_profession) || null}
              isClearable
            />
          ) : null}
        </section>
      ) : null}

      {/* FILTER WILAYAH KERJA */}
      {filters?.has_national ? (
        <section className="flex gap-4 w-full">
          <div className="flex flex-col gap-1 w-full">
            <ReactSelect2
              name="corp_unit_province_code"
              className="text-xs"
              placeholder="Pilih Provinsi"
              onChange={(value) => {
                setFilters((prev) => ({
                  ...prev,
                  corp_unit_province_id: value?.id,
                  corp_unit_province_code: value?.code,
                  corp_unit_city_id: "",
                  corp_unit_city_code: "",
                  corp_unit_district_id: "",
                  corp_unit_district_code: "",
                }));
              }}
              options={listCorpProvinces}
              maxMenuHeight={150}
              value={listCorpProvinces?.find((item: any) => item?.value == filters?.corp_unit_province_code) || null}
              isDisabled={isLoadingUnitProvinces}
              isClearable
            />
          </div>

          <div className="flex flex-col gap-1 w-full">
            <ReactSelect2
              name="corp_unit_city_code"
              className="text-xs"
              placeholder="Pilih Kota"
              onChange={(value) => {
                setFilters((prev) => ({
                  ...prev,
                  corp_unit_city_id: value?.id,
                  corp_unit_city_code: value?.code,
                  corp_unit_district_id: "",
                  corp_unit_district_code: "",
                }));
              }}
              options={listCorpCities}
              maxMenuHeight={150}
              value={listCorpCities?.find((item: any) => item?.value == filters?.corp_unit_city_code) || null}
              isDisabled={isLoadingUnitCities}
              isClearable
            />
          </div>

          <div className="flex flex-col gap-1 w-full">
            <ReactSelect2
              name="corp_unit_district_code"
              className="text-xs"
              placeholder="Pilih Kecamatan"
              onChange={(value) => {
                setFilters((prev) => ({
                  ...prev,
                  corp_unit_district_id: value?.id,
                  corp_unit_district_code: value?.code,
                }));
              }}
              options={listCorpDistricts}
              maxMenuHeight={150}
              value={listCorpDistricts?.find((item: any) => item?.value == filters?.corp_unit_district_code) || null}
              isDisabled={isLoadingUnitDistricts}
              isClearable
            />
          </div>
        </section>
      ) : null}

      {/* CARD INFORMATION */}
      <div className="bg-primary-800 w-full rounded-md shadow text-white grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 items-start gap-2 md:gap-4 p-6">
        <div className="flex flex-col gap-1">
          <h5 className="font-medium">Jumlah Transaksi</h5>

          <div className="flex items-end">
            <span className="text-lg font-bold">{currencyFormater(wakif?.total?.total_donors)}</span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <h5 className="font-medium">Jumlah Penerimaan Wakaf</h5>

          <div className="flex items-baseline gap-1">
            <span className="text-xs">Rp.</span>

            <span className="text-lg font-bold">{currencyFormater(wakif?.total?.donation_net_amount)}</span>
          </div>
        </div>
      </div>

      {/* INPUT SEARCH */}
      <InputSearch />

      {wakif ? (
        <DataTable
          columns={columns}
          data={wakif?.items}
          attribute={{
            ...wakif,
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
