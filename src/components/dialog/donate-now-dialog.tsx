"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/Accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  CampaignTypeKeys,
  TCampaignType,
  wordingAttentionByCampaignType,
  wordingByCampaignType,
} from "@/lib/typeCampaign";
import { Campaign } from "@/types";
import { decode } from "js-base64";
import { useRouter as useNavigation } from "next/navigation";
import QRCode from "qrcode";
import { Dispatch, Fragment, SetStateAction, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import Balancer from "react-wrap-balancer";
import { ScreenLoader } from "../Loader";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

interface Props {
  donateNowModal: boolean;
  setDonateNowModal: Dispatch<SetStateAction<boolean>>;
  campaign: Campaign;
}

const DonateNowDialog = ({ donateNowModal, setDonateNowModal, campaign }: Props) => {
  const navigation = useNavigation();
  const [screenLoading, setScreenLoading] = useState(false);
  const [qr, setQr] = useState("");

  const campaignType = TCampaignType[campaign?.type as CampaignTypeKeys];
  const wordingCampaign = wordingByCampaignType[campaign?.type as CampaignTypeKeys];

  useEffect(() => {
    if (!campaign || !campaign?.qris_nonlogin?.[0]?.mstring_encoded) {
      console.log("Detail is undefined or QR string is missing");
      return;
    }

    QRCode?.toDataURL(
      decode(campaign?.qris_nonlogin?.[0]?.mstring_encoded),
      {
        width: 800,
        margin: 3,
      },
      (err, url) => {
        if (err) {
          console.error(err);
          return;
        }
        setQr(url);
      }
    );
  }, [campaign]);

  return (
    <Fragment>
      <Dialog open={donateNowModal} onOpenChange={setDonateNowModal}>
        <DialogContent className="layout max-w-sm max-h-[98vh] overflow-auto gap-2">
          <DialogHeader className="border-b pb-2">
            <DialogTitle className="text-sm capitalize">Ber{campaignType} Tanpa Data Lengkap</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-2">
            <div className="border rounded-md p-3">
              <p className="text-sm font-bold text-center !leading-3">QRIS - {campaign?.qris_nonlogin?.[0]?.name}</p>
              <div className="w-full inline-flex justify-center">
                <a
                  href={qr}
                  download="qrcode.png"
                  className="text-xs font-semibold text-center text-[#1C8AE5]"
                  style={{ lineHeight: "0.8" }}
                >
                  Simpan QRIS
                </a>
              </div>

              <div className="rounded-md w-full flex flex-col items-center justify-center">
                <img src={qr} alt="qrcode" width={275} height={275} className="rounded-md" />
              </div>

              <Separator />

              <div className="flex flex-col items-center justify-center w-full my-2">
                <h1 className="text-xs font-bold text-center">{wordingCampaign}</h1>
                <img src="/assets/bismillah.svg" width={75} height={50} alt="decoration" />
                <p className="text-[0.725rem] text-gray-500 text-center">
                  {wordingAttentionByCampaignType({
                    type: campaign?.type as CampaignTypeKeys,
                    lembaga: campaign?.lembaga?.name,
                    program: campaign?.title,
                    amount: null,
                  })}
                </p>
              </div>

              <div className="border rounded-md px-4 mt-1">
                <Accordion type="single" collapsible>
                  <AccordionItem value="item-1" defaultChecked>
                    <AccordionTrigger className="text-xs border-none py-2">Panduan Pembayaran</AccordionTrigger>

                    <AccordionContent>
                      <ul className="space-y-2 text-gray-500 text-xs">
                        <li>
                          <Balancer>1. Scan/simpan/screenshot QR code</Balancer>
                        </li>
                        <li>
                          <Balancer>2. Buka aplikasi bank/dompet digital (Gojek, OVO, Dana, QRIS Bank, dll).</Balancer>
                        </li>
                        <li>
                          <Balancer>3. Pilih ‘Pay’ atau ‘Scan’</Balancer>
                        </li>
                        <li>
                          <Balancer>4. Upload tangkapan layar (hasil screenshot) QR Code.</Balancer>
                        </li>
                        <li>
                          <Balancer>5. Masukkan kode PIN dompet digitalmu.</Balancer>
                        </li>
                        <li>
                          <Balancer>
                            6. Jika pembayaran telah selesai dan berhasil, kamu akan mendapat notifikasi.
                          </Balancer>
                        </li>
                        <li>
                          <Balancer>
                            7. Anda dapat{" "}
                            <span onClick={() => setDonateNowModal(false)} className="underline hover:cursor-pointer">
                              menutup
                            </span>{" "}
                            jendela pop-up ini.
                          </Balancer>
                        </li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>

            <p className="text-center text-xs">atau</p>
            <Button onClick={() => navigation.push(`/campaign/${campaign?.id}/anonymous`)}>
              Berwakaf Dengan Data Diri Lengkap
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Toaster position="bottom-center" />

      {screenLoading ? <ScreenLoader /> : null}
    </Fragment>
  );
};

export default DonateNowDialog;
