import { Button, buttonVariants } from "@/components/Button";
import { Skeleton } from "@/components/Skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import currencyFormater, { NameOfPayment, qs } from "@/lib/utils";
import { useGetListReportWakifCorpUnit, useReportCampaignDistribution } from "@/services/report/hooks";
import { ArrowLeftIcon, ArrowUpRightIcon } from "lucide-react";
import moment from "moment";
import "moment/locale/id";
import Link from "next/link";
import { Dispatch, SetStateAction, useMemo } from "react";
import { TFilters } from "./_kanwil";

export interface ICorpUnit {
  id: string;
  corp_id: string;
  name: string;
  code: string;
  group: string;
  region_id: null;
  region_name: null;
  level: number;
  level_parent: string;
  level_nomenclature: string;
  level_parent_name: string;
  id_simas: null;
  province_id: null;
  province_name: null;
  city_id: null;
  city_name: null;
  district_id: null;
  district_name: null;
  show_app: number;
  donation_net_amount: number;
  total_donors: string;
  corp_unit_lvl3: any[];
}

export interface TCorpFilter {
  corp_code: string;
  corp_unit_lvl1_id: string;
  list_corp_lvl2: ICorpUnit[];
  corp_unit_lvl2_id: string;
  corp_unit_lvl2_name: string;
}

interface Props {
  corpUnits: any[];
  corpFilter: TCorpFilter;
  setCorpFilter: Dispatch<SetStateAction<TCorpFilter>>;
  setShowListWakif: any;
  showListWakif: boolean;
}

const PerguruanTinggi = ({ corpUnits, corpFilter, setCorpFilter, setShowListWakif, showListWakif }: Props) => {
  if (showListWakif) return null;

  const totalSummary = useMemo(() => {
    return corpUnits?.reduce(
      (acc, unit) => {
        acc.total_donors += Number(unit.total_donors) || 0;
        acc.total_donation += unit.donation_net_amount || 0;
        return acc;
      },
      { total_donors: 0, total_donation: 0 }
    );
  }, [corpFilter?.list_corp_lvl2]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mt-4">
        <h1 className="text-lg md:text-xl font-bold">Rekap dan Detil Program Wakaf ASN Kemenag</h1>

        <div className="flex items-center gap-2">
          <Link href="/ASNKemenag" className={buttonVariants({})}>
            Campaign <ArrowUpRightIcon className="w-4 ml-1" />
          </Link>

          <Link href="/report/asn-kemenag/beneficiary" className={buttonVariants({})}>
            Laporan <ArrowUpRightIcon className="w-4 ml-1" />
          </Link>
        </div>
      </div>
      <div className="bg-primary-800 w-full rounded-md shadow text-white flex flex-col md:flex-row items-start gap-4 md:gap-8 p-6">
        <div className="flex flex-col gap-1">
          <h5 className="font-medium">Perguruan Tinggi</h5>

          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold">
              {corpUnits?.length
                ? corpUnits?.find((item: any) => item?.id == corpFilter?.corp_unit_lvl2_id)?.name ||
                  "Semua Perguruan Tinggi"
                : "Semua Perguruan Tinggi"}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <h5 className="font-medium">Jumlah Penerimaan Wakaf</h5>

          <div className="flex items-baseline gap-1">
            <span className="text-xs">Rp.</span>

            <span className="text-lg font-bold">{currencyFormater(totalSummary?.total_donation)}</span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <h5 className="font-medium">Jumlah Transaksi</h5>

          <div className="flex items-end">
            <span className="text-lg font-bold">{currencyFormater(totalSummary?.total_donors)}</span>
          </div>
        </div>
      </div>

      <div>
        <h2 className="font-semibold">Perguruan Tinggi</h2>
        <Table className="mt-1">
          <TableHeader>
            <TableRow>
              <TableHead className="bg-primary-800 text-white text-sm">Perguruan Tinggi</TableHead>
              <TableHead className="bg-primary-800 text-white text-sm">Jumlah Transaksi</TableHead>
              <TableHead className="bg-primary-800 text-white text-sm">Jumlah Penerimaan Wakaf</TableHead>
              <TableHead className="bg-primary-800 text-white text-sm"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {corpUnits?.map((item: any, itemIdx: number) => (
              <TableRow key={item?.name} className={itemIdx % 2 == 1 ? "bg-gray-50" : ""}>
                <TableCell className="font-medium text-xs">{item?.name}</TableCell>
                <TableCell className="text-xs">{currencyFormater(item?.total_donors)}</TableCell>
                <TableCell className="text-xs">Rp. {currencyFormater(item?.donation_net_amount)}</TableCell>
                <TableCell className="text-xs text-right">
                  <Button
                    size="sm"
                    className="text-xs"
                    onClick={() => {
                      setShowListWakif(true);
                      setCorpFilter((prev) => ({
                        ...prev,
                        corp_unit_lvl2_id: item?.id,
                        corp_unit_lvl2_name: item?.name,
                      }));
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
  );
};

export default PerguruanTinggi;

interface PerguruanTinggiWakifProps {
  filters: TFilters;
  setFilters: Dispatch<SetStateAction<TFilters>>;
  corpFilter: TCorpFilter;
  setCorpFilter: Dispatch<SetStateAction<TCorpFilter>>;
  showListWakif: boolean;
  setShowListWakif: any;
}

export const PerguruanTinggiWakif = ({
  corpFilter,
  setCorpFilter,
  filters,
  setFilters,
  showListWakif,
  setShowListWakif,
}: PerguruanTinggiWakifProps) => {
  const { data: donations, isLoading } = useGetListReportWakifCorpUnit({
    queryString: qs({
      payment_date_start: filters?.payment_date_start,
      payment_date_end: filters?.payment_date_end,
      corp_unit_lvl1_id: corpFilter?.corp_unit_lvl1_id,
      corp_unit_lvl2_id: corpFilter?.corp_unit_lvl2_id,
      order_by: "payment_verified_at",
      order_type: "DESC",
    }),
  });
  const { data: distribution, isLoading: isLoadingDistribution } = useReportCampaignDistribution({
    campaign_id: "9d52c675-2b96-499d-a94e-224fbae26817",
  });

  if (isLoading || isLoadingDistribution) {
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
        total_donation: acc.total_donation + (+curr?.donation_net_amount || 0),
      };
    },
    { total_donation: 0 }
  ) || { total_donation: 0 };

  return (
    <section className="space-y-4 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg md:text-xl font-bold">Rekap dan Detil Program Wakaf ASN Kemenag</h1>

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
        <div className="bg-primary-800 w-full rounded-md shadow text-white grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 items-start gap-2 md:gap-4 p-6">
          <div className="flex flex-col gap-1 col-span-full md:col-span-1">
            <h5 className="font-medium">Perguruan Tinggi</h5>

            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold">{corpFilter?.corp_unit_lvl2_name}</span>
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
