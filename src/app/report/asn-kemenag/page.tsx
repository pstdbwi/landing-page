"use client";
import { Input } from "@/components/Input";
import { Label } from "@/components/Label";
import LayoutReport from "@/components/Layout/layout-report";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Select";
import { Skeleton } from "@/components/Skeleton";
import { qs } from "@/lib/utils";
import { useGetProvinceList } from "@/services/location/hooks";
import { useGetReportCorpUnit } from "@/services/report/hooks";
import "moment/locale/id";
import { useState } from "react";
import Kanwil, { KanwilWakif } from "./_kanwil";
import PerguruanTinggi, { PerguruanTinggiWakif, TCorpFilter } from "./_perguruan_tinggi";

const ReportASNKemenag = () => {
  const [showListWakif, setShowListWakif] = useState(false);
  const [corpFilter, setCorpFilter] = useState<TCorpFilter>({
    corp_code: "Kw",
    corp_unit_lvl1_id: "",
    list_corp_lvl2: [],
    corp_unit_lvl2_id: "",
    corp_unit_lvl2_name: "",
  });

  const [filters, setFilters] = useState({
    province_id: "",
    payment_date_start: "",
    payment_date_end: "",
  });

  const RenderSummary = () => {
    const { data: corpUnits, isLoading: isLoadingCorpUnit } = useGetReportCorpUnit({
      queryString: qs({
        corp_id: "KMAG111120240000002",
        show_app: "1",
        date_start: filters?.payment_date_start,
        date_end: filters?.payment_date_end,
      }),
    });

    const { data: provinsi, isFetched: isProvinceFetched, isLoading: isLoadingProvince } = useGetProvinceList({});

    if (isLoadingCorpUnit || isLoadingProvince) {
      return (
        <div>
          <Skeleton className="w-4/6 h-7 rounded-md mb-2" />
          <Skeleton className="mt-4 h-12 w-full rounded-md mb-2" />
          <Skeleton className="mt-4 h-24 w-full rounded-md mb-2" />
          <Skeleton className="w-full h-7 rounded-md mb-2" />
          <Skeleton className="w-full h-7 rounded-md mb-2" />
          <Skeleton className="w-full h-7 rounded-md mb-2" />
          <Skeleton className="w-full h-7 rounded-md mb-2" />
          <Skeleton className="w-full h-7 rounded-md mb-2" />
        </div>
      );
    }

    return (
      <div>
        <div className="flex flex-col md:flex-row md:items-end gap-4 my-2 justify-between">
          <div className="flex-col gap-1 w-full md:w-fit">
            <Label className="text-xs">Asal Satuan Kerja</Label>
            <Select
              disabled={isLoadingCorpUnit}
              onValueChange={(value) => {
                const findCorp = corpUnits?.data?.find((item: any) => item?.code == value);

                setCorpFilter((prev) => ({
                  ...prev,
                  corp_code: value,
                  corp_unit_lvl1_id: findCorp?.id,
                  corp_unit_lvl2_id: "",
                  list_corp_lvl2: findCorp?.corp_unit_lvl2 || [],
                }));

                setFilters({
                  province_id: "",
                  payment_date_end: "",
                  payment_date_start: "",
                });

                setShowListWakif(false);
              }}
              defaultValue={corpFilter?.corp_code}
            >
              <SelectTrigger className="min-w-[200px]">
                <SelectValue placeholder="Pilih Asal Satuan Kerja" />
              </SelectTrigger>

              <SelectContent className="overflow-y-auto max-h-[10rem]">
                {corpUnits?.data?.map((item: any, index: number) => {
                  return (
                    <SelectItem key={index} value={item?.code}>
                      {item.name}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-fit">
            {/* Filter Provinsi */}
            {corpFilter.corp_code == "Kw" && (
              <div className="flex-col gap-1 w-full md:w-fit">
                <Label className="text-xs">Provinsi</Label>
                <Select
                  disabled={!isProvinceFetched}
                  onValueChange={(value) => {
                    setFilters((prev) => ({ ...prev, province_id: value }));
                  }}
                  defaultValue={filters.province_id}
                >
                  <SelectTrigger className="min-w-[200px]">
                    <SelectValue placeholder="Semua Provinsi" />
                  </SelectTrigger>

                  <SelectContent className="overflow-y-auto max-h-[10rem]">
                    {provinsi
                      ?.filter((item: any) => item?.code !== "00")
                      ?.map((item: Record<string, any>, index: number) => {
                        return (
                          <SelectItem key={index} value={String(item.id)}>
                            {item.name}
                          </SelectItem>
                        );
                      })}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Filter Perguruan Tinggi */}
            {corpFilter.corp_code == "Pt" && (
              <div className="flex-col gap-1 w-full md:w-fit">
                <Label className="text-xs">Perguruan Tinggi</Label>
                <Select
                  disabled={isLoadingCorpUnit}
                  onValueChange={(value) => {
                    setCorpFilter((prev) => ({ ...prev, corp_unit_lvl2_id: value }));
                  }}
                  defaultValue={corpFilter?.corp_unit_lvl2_id}
                >
                  <SelectTrigger className="min-w-[200px]">
                    <SelectValue placeholder="Semua Perguruan Tinggi" />
                  </SelectTrigger>

                  <SelectContent className="overflow-y-auto max-h-[10rem]">
                    {corpFilter?.list_corp_lvl2?.map((item: Record<string, any>, index: number) => {
                      return (
                        <SelectItem key={index} value={item.id}>
                          {item.name}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            )}

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
                      setFilters((prev) => ({ ...prev, payment_date_start: newValue }));
                    }
                  }}
                />
                <span className="text-xs">Sampai</span>
                <Input
                  type="date"
                  className="px-2 border rounded-md"
                  defaultValue={filters?.payment_date_end || ""}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    if (newValue !== filters?.payment_date_end) {
                      setFilters((prev) => ({ ...prev, payment_date_end: newValue }));
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {corpFilter?.corp_code == "Kw" ? (
          <Kanwil
            showListWakif={showListWakif}
            setShowListWakif={setShowListWakif}
            filters={filters}
            setFilters={setFilters}
          />
        ) : corpFilter?.corp_code == "Pt" ? (
          <PerguruanTinggi
            corpUnits={corpUnits?.data?.find((item: any) => item?.code == corpFilter?.corp_code)?.corp_unit_lvl2}
            corpFilter={corpFilter}
            setCorpFilter={setCorpFilter}
            showListWakif={showListWakif}
            setShowListWakif={setShowListWakif}
          />
        ) : null}
      </div>
    );
  };

  const RenderListWakif = () => {
    if (!showListWakif) return null;

    if (corpFilter?.corp_code == "Kw") {
      return (
        <KanwilWakif
          showListWakif={showListWakif}
          setShowListWakif={setShowListWakif}
          filters={filters}
          setFilters={setFilters}
        />
      );
    }

    if (corpFilter?.corp_code == "Pt") {
      return (
        <PerguruanTinggiWakif
          showListWakif={showListWakif}
          setShowListWakif={setShowListWakif}
          filters={filters}
          setFilters={setFilters}
          corpFilter={corpFilter}
          setCorpFilter={setCorpFilter}
        />
      );
    }

    return null;
  };

  return (
    <LayoutReport>
      <RenderSummary />
      <RenderListWakif />
    </LayoutReport>
  );
};

export default ReportASNKemenag;
