"use client";
import { buttonVariants } from "@/components/Button";
import { Input } from "@/components/Input";
import { Label } from "@/components/Label";
import LayoutReport from "@/components/Layout/layout-report";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Select";
import { Skeleton } from "@/components/Skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import currencyFormater, { qs } from "@/lib/utils";
import { useGetProvinceList } from "@/services/location/hooks";
import { useGetReportCorpUnit } from "@/services/report/hooks";
import { ArrowUpRightIcon } from "lucide-react";
import "moment/locale/id";
import Link from "next/link";
import { useState } from "react";

const ReportDanaAbadiMasjid = () => {
  const [filters, setFilters] = useState({
    province_id: "",
    date_start: "",
    date_end: "",
  });

  const { data, isLoading } = useGetReportCorpUnit({
    queryString: qs({ ...filters, corp_id: "BKM310120250000003" }),
  });
  const { data: provinsi, isFetched: isProvinceFetched, isLoading: isLoadingProvince } = useGetProvinceList({});

  if (isLoading || isLoadingProvince) {
    return (
      <LayoutReport>
        <Skeleton className="w-4/6 h-7 rounded-md mb-2" />
        <Skeleton className="mt-4 h-12 w-full rounded-md mb-2" />
        <Skeleton className="mt-4 h-24 w-full rounded-md mb-2" />
        <Skeleton className="w-full h-7 rounded-md mb-2" />
        <Skeleton className="w-full h-7 rounded-md mb-2" />
        <Skeleton className="w-full h-7 rounded-md mb-2" />
        <Skeleton className="w-full h-7 rounded-md mb-2" />
        <Skeleton className="w-full h-7 rounded-md mb-2" />
      </LayoutReport>
    );
  }

  const { total_donation = 0, total_donors = 0 } = data?.data?.reduce(
    (acc: { total_donation: number; total_donors: number }, curr: any) => {
      return {
        total_donation: acc.total_donation + (+curr?.donation_net_amount || 0),
        total_donors: acc.total_donors + (+curr?.total_donors || 0),
      };
    },
    { total_donation: 0, total_donors: 0 }
  ) || { total_donation: 0, total_donors: 0 };

  return (
    <LayoutReport>
      <div className="py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg md:text-xl font-bold">Rekap dan Detil Program Wakaf Dana Abadi Untuk Masjid</h1>

          <Link href="/danaabadimasjid" className={buttonVariants({})}>
            Campaign <ArrowUpRightIcon className="w-4 ml-1" />
          </Link>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex flex-col md:flex-row md:items-end gap-4 my-2 justify-between">
            <div></div>
            <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-fit">
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
                          <SelectItem key={index} value={item.id}>
                            {item.name}
                          </SelectItem>
                        );
                      })}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-col gap-2 w-full md:w-fit">
                <Label className="text-xs">Periode</Label>
                <div className="flex items-center gap-1">
                  <Input
                    type="date"
                    className="px-2 border rounded-md"
                    defaultValue={filters?.date_start || ""}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      if (newValue !== filters?.date_start) {
                        setFilters((prev) => ({ ...prev, date_start: newValue }));
                      }
                    }}
                  />
                  <span className="text-xs">Sampai</span>
                  <Input
                    type="date"
                    className="px-2 border rounded-md"
                    defaultValue={filters?.date_end || ""}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      if (newValue !== filters?.date_end) {
                        setFilters((prev) => ({ ...prev, date_end: newValue }));
                      }
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
        </div>

        <div>
          <Table className="mt-1">
            <TableHeader>
              <TableRow>
                <TableHead className="bg-primary-800 text-white text-sm">Masjid</TableHead>
                <TableHead className="bg-primary-800 text-white text-sm">Jumlah Transaksi</TableHead>
                <TableHead className="bg-primary-800 text-white text-sm">Jumlah Penerimaan Wakaf</TableHead>
                <TableHead className="bg-primary-800 text-white text-sm"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data?.length ? (
                data?.data?.map((item: IReportCorp, itemIdx: number) => (
                  <TableRow key={item?.id} className={itemIdx % 2 == 1 ? "bg-gray-50" : ""}>
                    <TableCell>
                      <div className="font-medium text-xs flex flex-col">
                        <span>{item?.name}</span>
                        <span className="text-[0.625rem] text-gray-500">{item?.id_simas}</span>
                        <span className="text-[0.675rem]">{item?.province_name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">{currencyFormater(Number(item?.total_donors ?? 0))}</TableCell>
                    <TableCell className="text-xs">
                      {currencyFormater(Number(item?.donation_net_amount ?? 0))}
                    </TableCell>
                    <TableCell className="text-xs text-right">
                      <Link
                        href={`/report/dana-abadi-masjid/${item?.id}/wakif?corp_unit_name=${item?.name}`}
                        className={buttonVariants({ size: "sm", className: "text-xs" })}
                      >
                        Wakif <ArrowUpRightIcon className="w-3 ml-1" />
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow className="bg-gray-50">
                  <TableCell className="font-medium text-sm text-center py-4" colSpan={4}>
                    Tidak ada Masjid
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </LayoutReport>
  );
};

export default ReportDanaAbadiMasjid;

export interface IReportCorp {
  id: string;
  corp_id: string;
  name: string;
  code: null;
  group: string;
  region_id: number;
  region_name: string;
  level: number;
  level_parent: null;
  level_nomenclature: null;
  level_parent_name: null;
  donation_net_amount: number;
  total_donors: string;
  corp_unit_lvl2: any[];
  id_simas: string;
  province_id: string;
  province_name: string;
}
