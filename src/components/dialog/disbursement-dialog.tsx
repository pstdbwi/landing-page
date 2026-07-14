"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IDisbursementCampaign, IDisbursementCampaignPurpose } from "@/constant/pai";
import currencyFormater, { qs } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Dispatch, Fragment, SetStateAction } from "react";
import { buttonVariants } from "../Button";

interface Props {
  disbursementModal: boolean;
  setDisbursementModal: Dispatch<SetStateAction<boolean>>;
  disbursement: IDisbursementCampaign;
}
``;

const DisbursementDialog = ({ disbursementModal, setDisbursementModal, disbursement }: Props) => {
  return (
    <Fragment>
      <Dialog open={disbursementModal} onOpenChange={setDisbursementModal}>
        <DialogContent className="max-w-5xl sm:max-w-5xl w-full">
          <DialogHeader className="border-b pb-2">
            <DialogTitle className="text-lg">Detail Penyaluran</DialogTitle>
          </DialogHeader>

          <div>
            <Table className="mt-1">
              <TableHeader>
                <TableRow>
                  <TableHead className="bg-primary-800 text-white text-sm">Implementasi Program</TableHead>
                  <TableHead className="bg-primary-800 text-white text-sm whitespace-nowrap">
                    Total Nilai Disalurkan
                  </TableHead>
                  <TableHead className="bg-primary-800 text-white text-sm whitespace-nowrap">
                    Total Penyaluran
                  </TableHead>
                  <TableHead className="bg-primary-800 text-white text-sm"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {disbursement?.purposes?.length ? (
                  disbursement?.purposes?.map((item: IDisbursementCampaignPurpose, itemIdx: number) => (
                    <TableRow key={item?.id} className={itemIdx % 2 == 1 ? "bg-gray-50" : ""}>
                      <TableCell>
                        <div className="font-medium text-xs flex flex-col">
                          <span>{item?.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs">{currencyFormater(Number(item?.amount ?? 0))}</TableCell>
                      <TableCell className="text-xs">{currencyFormater(Number(item?.report_count))}</TableCell>
                      <TableCell className="text-xs text-right">
                        {/* <Link
                          href={`/report/dana-abadi-pai/report-disbursement?${qs({
                            campaign_id: disbursement?.id,
                            purpose_id: String(item?.id),
                          })}`}
                          className={buttonVariants({ size: "sm", className: "text-xs" })}
                        >
                          Detail <ArrowRight className="w-4 ml-2" />
                        </Link> */}
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
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};

export default DisbursementDialog;
