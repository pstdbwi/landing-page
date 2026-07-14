"use client";

import { buttonVariants } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IDisbursementCampaign, IDisbursementCampaignPurpose } from "@/constant/pai";
import currencyFormater, { qs } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface Props {
  distribution: IDisbursementCampaign;
}

const ClientBeneficiary = ({ distribution }: Props) => {
  return (
    <div>
      <Table className="mt-1">
        <TableHeader>
          <TableRow>
            <TableHead className="bg-primary-800 text-white text-sm">Implementasi Program</TableHead>
            <TableHead className="bg-primary-800 text-white text-sm whitespace-nowrap">
              Total Nilai Disalurkan
            </TableHead>
            <TableHead className="bg-primary-800 text-white text-sm whitespace-nowrap">Total Penyaluran</TableHead>
            <TableHead className="bg-primary-800 text-white text-sm"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {distribution?.purposes?.length ? (
            distribution?.purposes?.map((item: IDisbursementCampaignPurpose, itemIdx: number) => (
              <TableRow key={item?.id} className={itemIdx % 2 == 1 ? "bg-gray-50" : ""}>
                <TableCell>
                  <span className="font-medium text-xs flex flex-col">{item?.name}</span>
                </TableCell>
                <TableCell className="text-sm">Rp. {currencyFormater(Number(item?.amount ?? 0))}</TableCell>
                <TableCell className="text-xs">{currencyFormater(Number(item?.report_count ?? 0))} Laporan</TableCell>
                <TableCell className="text-xs text-right">
                  <Link
                    href={`/report/dana-abadi-pai/beneficiary/report-disbursement?${qs({
                      campaign_id: distribution?.id,
                      purpose_id: String(item?.id),
                    })}`}
                    className={buttonVariants({ size: "sm", className: "text-xs" })}
                  >
                    Daftar Pelaporan <ArrowRight className="w-4 ml-1" />
                  </Link>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow className="bg-gray-50">
              <TableCell className="font-medium text-sm text-center py-4" colSpan={4}>
                Tidak ada penyaluran
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ClientBeneficiary;
