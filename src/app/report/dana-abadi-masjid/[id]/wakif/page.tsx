"use client";
import { buttonVariants } from "@/components/Button";
import { Input } from "@/components/Input";
import { Label } from "@/components/Label";
import LayoutReport from "@/components/Layout/layout-report";
import { Skeleton } from "@/components/Skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import useSearchParamsEntries from "@/lib/use-searchparams-entries";
import currencyFormater, { NameOfPayment, qs } from "@/lib/utils";
import { useGetListReportWakifCorpUnit } from "@/services/report/hooks";
import { ArrowLeftIcon, ArrowUpRightIcon } from "lucide-react";
import moment from "moment";
import "moment/locale/id";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

const ListWakifDanaAbadiMasjid = () => {
  const { id } = useParams();
  const { corp_unit_name = "" } = useSearchParamsEntries();
  const [filters, setFilters] = useState({
    payment_date_start: "",
    payment_date_end: "",
  });

  const { data: donations, isLoading } = useGetListReportWakifCorpUnit({
    queryString: qs({
      ...filters,
      corp_id: "BKM310120250000003",
      corp_unit_lvl1_id: id as string,
      order_by: "payment_verified_at",
      order_type: "DESC",
    }),
  });

  if (isLoading) {
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

  const { total_donation = 0 } = donations?.data?.items?.reduce(
    (acc: { total_donation: number; total_donors: number }, curr: any) => {
      return {
        total_donation: acc.total_donation + (+curr?.donation_net_amount || 0),
      };
    },
    { total_donation: 0 }
  ) || { total_donation: 0 };

  return (
    <LayoutReport>
      <div className="py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg md:text-xl font-bold">Rekap dan Detil Program Wakaf Dana Abadi Untuk Masjid</h1>

          <Link href="/danaabadimasjid" className={buttonVariants({})}>
            Campaign <ArrowUpRightIcon className="w-4 ml-1" />
          </Link>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex flex-col md:flex-row md:items-end gap-4 my-2 justify-between">
              <div></div>
              <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-fit">
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

            <div className="bg-primary-800 w-full rounded-md shadow text-white flex flex-col md:flex-row items-start gap-4 md:gap-8 p-6">
              <div className="flex flex-col gap-1">
                <h5 className="font-medium">Masjid</h5>

                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-bold">{corp_unit_name}</span>
                </div>
              </div>
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
                  <span className="text-lg font-bold">{currencyFormater(donations?.data?.items?.length ?? 0)}</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Daftar Donatur</h2>

              <Link
                href={`/report/dana-abadi-masjid`}
                className={buttonVariants({ size: "sm", variant: "outline" })}
                prefetch
              >
                <ArrowLeftIcon className="w-4 mr-1" /> Kembali
              </Link>
            </div>
            <Table className="mt-1">
              <TableHeader>
                <TableRow>
                  <TableHead className="bg-primary-800 text-white text-sm">#</TableHead>
                  <TableHead className="bg-primary-800 text-white text-sm">Tanggal Ikrar</TableHead>
                  <TableHead className="bg-primary-800 text-white text-sm">Pembayaran</TableHead>
                  <TableHead className="bg-primary-800 text-white text-sm">Nama Wakif</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {donations?.data?.items?.length ? (
                  donations?.data?.items?.map((item: any, itemIdx: number) => (
                    <TableRow key={item?.id} className={itemIdx % 2 == 1 ? "bg-gray-50" : ""}>
                      <TableCell className="font-medium text-xs">{itemIdx + 1}</TableCell>
                      <TableCell className="font-medium text-xs">
                        {moment(item?.payment_verified_at).format("DD/MM/YYYY hh:mm")}
                      </TableCell>
                      <TableCell className="text-xs">
                        <div className="flex flex-col gap-1 whitespace-nowrap">
                          <span>
                            {NameOfPayment({ payment: item?.payment, paymentMethodType: item?.payment_method_type })}
                          </span>
                          <span className="text-[0.65rem]">
                            {moment(item.payment_verified_at).format("DD/MM/yy hh:mm")}
                          </span>
                          <span className="font-bold">Rp. {Number(+item.donation_net_amount).toLocaleString()}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs">{item?.wakif_name}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow className="bg-gray-50">
                    <TableCell className="font-medium text-sm text-center py-4" colSpan={4}>
                      Tidak ada donatur
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </LayoutReport>
  );
};

export default ListWakifDanaAbadiMasjid;
