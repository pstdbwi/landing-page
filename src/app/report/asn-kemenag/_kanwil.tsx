"use client";
import { Button, buttonVariants } from "@/components/Button";
import { Skeleton } from "@/components/Skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import currencyFormater, { NameOfPayment, qs } from "@/lib/utils";
import { useGetProvinceList } from "@/services/location/hooks";
import {
  useGetReportKemenagKanwil,
  useGetReportKemenagKanwilDonation,
  useReportCampaignDistribution,
} from "@/services/report/hooks";
import { ArrowLeftIcon, ArrowUpRightIcon } from "lucide-react";
import moment from "moment";
import "moment/locale/id";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";

export type TFilters = {
  province_id: string;
  payment_date_start: string;
  payment_date_end: string;
};

const Kanwil = ({
  showListWakif,
  setShowListWakif,
  filters,
  setFilters,
}: {
  showListWakif: boolean;
  setShowListWakif: any;
  filters: TFilters;
  setFilters: Dispatch<SetStateAction<TFilters>>;
}) => {
  const { data: reportKemenag, isLoading } = useGetReportKemenagKanwil({
    queryString: qs(filters),
  });

  const { data: provinsi, isFetched: isProvinceFetched, isLoading: isLoadingProvince } = useGetProvinceList({});
  const { data: distribution, isLoading: isLoadingDistribution } = useReportCampaignDistribution({
    campaign_id: "9d52c675-2b96-499d-a94e-224fbae26817",
    start_date: filters?.payment_date_start,
    end_date: filters?.payment_date_end,
  });

  if (showListWakif) return null;

  if (isLoading || isLoadingProvince || isLoadingDistribution) {
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

  const headQuarter = reportKemenag?.data?.head_quarter;
  const { total_donation = 0, total_donors = 0 } = reportKemenag?.data?.provinces?.reduce(
    (acc: { total_donation: number; total_donors: number }, curr: any) => {
      return {
        total_donation: acc.total_donation + (+curr?.donation_net_amount || 0),
        total_donors: acc.total_donors + (+curr?.total_donors || 0),
      };
    },
    { total_donation: 0, total_donors: 0 }
  ) || { total_donation: 0, total_donors: 0 };

  return (
    <div className="py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg md:text-xl font-bold">Rekap dan Detil Program Wakaf ASN Kemenag</h1>

        <div className="flex items-center gap-2">
          <Link href="/ASNKemenag" className={buttonVariants({})}>
            Campaign <ArrowUpRightIcon className="w-4 ml-1" />
          </Link>

          <Link href="/report/asn-kemenag/beneficiary" className={buttonVariants({})}>
            Laporan Penyaluran & Penerimaan Manfaat <ArrowUpRightIcon className="w-4 ml-1" />
          </Link>
        </div>
      </div>

      <div className="space-y-4 mt-4">
        <div className="bg-primary-800 w-full rounded-md shadow text-white grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 items-start gap-2 md:gap-4 p-6">
          <div className="flex flex-col gap-1 col-span-full md:col-span-1">
            <h5 className="font-medium">Provinsi</h5>

            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold">
                {filters?.province_id
                  ? provinsi?.find((item: any) => item?.id == filters?.province_id)?.name || ""
                  : "Semua Provinsi"}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <h5 className="font-medium">Jumlah Penerimaan Wakaf</h5>

            <div className="flex items-baseline gap-1">
              <span className="text-xs">Rp.</span>

              <span className="text-lg font-bold">
                {currencyFormater(total_donation + Number(filters?.province_id ? 0 : headQuarter?.donation_net_amount))}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <h5 className="font-medium">Jumlah Transaksi</h5>

            <div className="flex items-end">
              <span className="text-lg font-bold">
                {currencyFormater(total_donors + Number(filters?.province_id ? 0 : headQuarter?.total_donors))}
              </span>
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

        <div>
          <h2 className="font-semibold">Provinsi</h2>
          <Table className="mt-1">
            <TableHeader>
              <TableRow>
                <TableHead className="bg-primary-800 text-white text-sm">Provinsi</TableHead>
                <TableHead className="bg-primary-800 text-white text-sm">Jumlah Transaksi</TableHead>
                <TableHead className="bg-primary-800 text-white text-sm">Jumlah Penerimaan Wakaf</TableHead>
                <TableHead className="bg-primary-800 text-white text-sm"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!filters?.province_id ? (
                <TableRow className={"bg-gray-50"}>
                  <TableCell className="font-medium text-xs">KANTOR PUSAT</TableCell>
                  <TableCell className="text-xs">{currencyFormater(headQuarter?.total_donors)}</TableCell>
                  <TableCell className="text-xs">Rp. {currencyFormater(headQuarter?.donation_net_amount)}</TableCell>
                  <TableCell className="text-xs text-right">
                    {/* <Button size="sm" className="text-xs" disabled>
                      Wakif <ArrowUpRightIcon className="w-3 ml-1" />
                    </Button> */}
                  </TableCell>
                </TableRow>
              ) : null}

              {reportKemenag?.data?.provinces?.map((provi: any, proviIdx: number) => (
                <TableRow key={provi?.name} className={proviIdx % 2 == 1 ? "bg-gray-50" : ""}>
                  <TableCell className="font-medium text-xs">{provi?.name}</TableCell>
                  <TableCell className="text-xs">{currencyFormater(provi?.total_donors)}</TableCell>
                  <TableCell className="text-xs">Rp. {currencyFormater(provi?.donation_net_amount)}</TableCell>
                  <TableCell className="text-xs text-right">
                    <Button
                      size="sm"
                      className="text-xs"
                      onClick={() => {
                        setShowListWakif(true);
                        setFilters((prev) => ({ ...prev, province_id: provi?.id }));
                      }}
                    >
                      Wakif <ArrowUpRightIcon className="w-3 ml-1" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Kanwil;

export const KanwilWakif = ({
  showListWakif,
  setShowListWakif,
  filters,
  setFilters,
}: {
  showListWakif: boolean;
  setShowListWakif: any;
  filters: TFilters;
  setFilters: Dispatch<SetStateAction<TFilters>>;
}) => {
  const {
    data: donations,
    isLoading,
    isFetched,
  } = useGetReportKemenagKanwilDonation({
    queryString: qs({ ...filters, order_by: "payment_verified_at", order_type: "DESC" }),
  });
  const { data: provinsi, isFetched: isProvinceFetched, isLoading: isLoadingProvince } = useGetProvinceList({});

  if (!showListWakif) return null;

  if (isLoading || isLoadingProvince) {
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

  const { total_donation = 0 } = donations?.data?.items?.reduce(
    (acc: { total_donation: number; total_donors: number }, curr: any) => {
      return {
        total_donation: +acc.total_donation + (+curr?.donation_net_amount || 0),
      };
    },
    { total_donation: 0 }
  ) || { total_donation: 0 };

  return (
    <section className="space-y-4 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg md:text-xl font-bold">Rekap dan Detil Program Wakaf ASN Kemenag Kanwil</h1>

        <div className="flex items-center gap-2">
          <Link href="/ASNKemenag" className={buttonVariants({})}>
            Campaign <ArrowUpRightIcon className="w-4 ml-1" />
          </Link>

          <Link href="/report/asn-kemenag/beneficiary" className={buttonVariants({})}>
            Laporan <ArrowUpRightIcon className="w-4 ml-1" />
          </Link>
        </div>
      </div>
      <div>
        <div className="bg-primary-800 w-full rounded-md shadow text-white grid grid-cols-2 md:grid-cols-4 gap-8 p-6">
          <div className="flex flex-col gap-1 col-span-full md:col-span-1">
            <h5 className="font-medium">Provinsi</h5>

            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold">
                {filters?.province_id
                  ? provinsi?.find((item: any) => item?.id == filters?.province_id)?.name || ""
                  : "Semua Provinsi"}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <h5 className="font-medium">Total Penerimaan Wakif</h5>

            <div className="flex items-baseline gap-1">
              <span className="text-xs">Rp.</span>

              <span className="text-lg font-bold">{currencyFormater(total_donation)}</span>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <h5 className="font-medium">Jumlah Transaksi</h5>

            <div className="flex items-end">
              <span className="text-lg font-bold">{currencyFormater(donations?.data?.items?.length)}</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Daftar Donatur</h2>

          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setShowListWakif(false);
              setFilters({
                province_id: "",
                payment_date_start: "",
                payment_date_end: "",
              });
            }}
          >
            <ArrowLeftIcon className="w-4 mr-1" /> Kembali
          </Button>
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
            {donations?.data?.items?.map((item: any, itemIdx: number) => (
              <TableRow key={item?.id} className={itemIdx % 2 == 1 ? "bg-gray-50" : ""}>
                <TableCell className="font-medium text-xs">{itemIdx + 1}</TableCell>
                <TableCell className="font-medium text-xs">
                  {moment(item?.payment_verified_at).format("DD/MM/YYYY hh:mm")}
                </TableCell>
                <TableCell className="text-xs">
                  <div className="flex flex-col gap-1 whitespace-nowrap">
                    <span>
                      {NameOfPayment({
                        payment: item?.payment,
                        excludeText: "wakaf uang asn kemenag",
                        paymentMethodType: item?.payment_method_type,
                      })}
                    </span>
                    <span className="text-[0.65rem]">{moment(item.payment_verified_at).format("DD/MM/yy hh:mm")}</span>
                    <span className="font-bold">Rp. {Number(+item.donation_net_amount).toLocaleString()}</span>
                  </div>
                </TableCell>
                <TableCell className="text-xs">{item?.wakif_name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
};
