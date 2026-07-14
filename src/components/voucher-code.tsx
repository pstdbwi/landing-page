"use client";

import { Label } from "@/components/Label";
import { DialogInvalidCode, DialogUsedCode, DialogValidCode } from "@/components/ngopi/ngopi-dialog-verified";
import { ScreenLoaderNgopi } from "@/components/ngopi/screen-loader-ngopi";
import {
  NgopiGradientText,
  NgopiWastraCorners,
  ngopiDialogContentClassName,
  ngopiPrimaryButtonClassName,
} from "@/components/ngopi/ngopi-theme";
import { notifyError, notifySuccess } from "@/components/Toaster";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { IDonor } from "@/constant/pai";
import { env } from "@/lib/env";
import { useFeatureFlag } from "@/store/feature-flag-context";
import axios from "axios";
import { CopyIcon, QrCodeIcon, Share2Icon } from "lucide-react";
import moment from "moment";
import "moment/locale/id";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import Barcode from "react-barcode";
import CopyToClipboard from "react-copy-to-clipboard";

interface Props {
  donation: IDonor;
}

const VoucherCode = ({ donation }: Props) => {
  const { currentDomain } = useFeatureFlag();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.toString();

  const [isLoading2, setIsLoading2] = useState(false);
  const [openRedeem, setOpenRedeem] = useState(false);
  const [inputRedeemCode, setInputRedeemCode] = useState("");

  const [openValidCode, setOpenValidCode] = useState(false);
  const [openInvalidCode, setOpenInvalidCode] = useState(false);
  const [openUsedCode, setOpenUsedCode] = useState(false);
  const [responseCode, setResponseCode] = useState<any>();

  const { redeem_code = null, redeem_on = null } = donation;
  const fullURL = `https://${currentDomain}${pathname}${query ? `?${query}` : ""}`;

  if (!redeem_code) return null;

  const onRedeemCode = async () => {
    try {
      setIsLoading2(true);
      const payload = {
        redeem_code: redeem_code,
      };
      const response = await axios.post(env.NEXT_PUBLIC_BASE_URL2 + `/redeem/verifier/approval`, payload, {
        headers: {
          "x-pass-code": inputRedeemCode,
        },
      });

      setOpenValidCode(true);
      notifySuccess("Berhasil Redeem Kode");
      setInputRedeemCode("");
      setOpenRedeem(false);
    } catch (error: any) {
      const error_message = error?.response?.data?.error_message || "";

      if (error_message?.toLowerCase()?.includes("tidak ditemukan")) {
        setOpenInvalidCode(true);
        setResponseCode(error_message);
      } else if (error_message?.toLowerCase()?.includes("sudah digunakan")) {
        setOpenUsedCode(true);
        setResponseCode(error_message);
      } else if (error_message?.toLowerCase()?.includes("verifier")) {
        setOpenInvalidCode(true);
        setResponseCode(error_message);
      }

      notifyError("Gagal Redeem Kode");
    } finally {
      setIsLoading2(false);
    }
  };

  const shareToWhatsapp = () => {
    const message = `🎟️ Kode Voucher\n\nGunakan kode berikut: ${redeem_code}\n\nAtau buka link ini:\n${fullURL}`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="relative mb-6">
      {/* Voucher Card Container */}
      <div className="w-full overflow-hidden bg-gradient-to-br from-white via-gray-50 to-white border border-gray-200 shadow-lg flex flex-col items-center justify-center rounded-2xl p-4 relative">
        {/* Decorative Corner Elements */}
        <div className="absolute top-2 left-2 w-12 h-12 border-l-4 border-t-4 border-[#DAB95A] rounded-tl-2xl"></div>
        <div className="absolute top-2 right-2 w-12 h-12 border-r-4 border-t-4 border-[#DAB95A] rounded-tr-2xl"></div>
        <div className="absolute bottom-2 left-2 w-12 h-12 border-l-4 border-b-4 border-[#DAB95A] rounded-bl-2xl"></div>
        <div className="absolute bottom-2 right-2 w-12 h-12 border-r-4 border-b-4 border-[#DAB95A] rounded-br-2xl"></div>

        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-base font-semibold tracking-wide text-black">Kode Voucher</h1>
          <p className="text-gray-600 text-xs">
            Tunjukkan barcode ini untuk di scan atau screenshot untuk menyimpan ke galeri anda
          </p>
          <div className="h-0.5 w-20 bg-gradient-to-r from-[#FFE7A1] to-[#DAB95A] mx-auto mt-2 rounded-full"></div>
        </div>

        {/* Barcode Section */}
        <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 mb-4 shadow-inner">
          <Barcode
            value={redeem_code}
            format="CODE128"
            width={2}
            height={80}
            displayValue={false}
            background="#ffffff"
            lineColor="#000000"
            renderer="canvas"
            className="w-fit mx-auto"
          />
        </div>

        {/* Code Display and Copy */}
        <div className="flex items-center justify-center gap-3 bg-gray-100 px-3 py-2 rounded-xl border border-gray-200">
          <code
            className={`font-mono text-base font-bold tracking-[0.3em] select-all transition-colors duration-200 ${
              redeem_on ? "text-gray-400 line-through" : "text-gray-800 hover:text-[#071c3d]"
            }`}
          >
            {redeem_code}
          </code>

          {!redeem_on && (
            <div className="relative group">
              <CopyToClipboard
                text={String(redeem_code)} // Fixed: should copy redeemCode, not redeem_on
                onCopy={() => {
                  notifySuccess("Berhasil salin kode voucher");
                }}
              >
                <button className="p-2 hover:bg-[#FFE7A1]/20 rounded-lg transition-colors duration-200 group-hover:scale-110 transform">
                  <CopyIcon className="text-[#DAB95A] w-5 h-5" />
                </button>
              </CopyToClipboard>

              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                Salin kode
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center">
          <Button onClick={shareToWhatsapp} type="button" size="sm" variant="link" className="text-xs text-[#DAB95A]">
            <Share2Icon className="w-4 mr-2 text-[#DAB95A]" /> Bagikan Voucher
          </Button>
        </div>

        {/* Status Indicator */}
        {redeem_on && (
          <div className="flex items-center gap-2 text-sm text-[#071c3d] bg-[#DAB95A] px-3 py-2 rounded-full border mb-4">
            <span className="block text-[0.65rem]">
              Sudah digunakan pada : {moment(redeem_on).format("DD MMMM YYYY HH:mm")}
            </span>
          </div>
        )}
      </div>

      <p className="text-sm text-white text-center mx-auto py-3">atau</p>

      {/* Redeem Dialog */}
      <Dialog open={openRedeem} onOpenChange={setOpenRedeem}>
        <DialogTrigger asChild>
          <Button
            className={`w-full py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 ${ngopiPrimaryButtonClassName}`}
            disabled={!!redeem_on}
          >
            <QrCodeIcon /> Redeem Kode
          </Button>
        </DialogTrigger>

        <DialogContent
          className={`${ngopiDialogContentClassName} rounded-2xl w-full overflow-hidden max-w-lg shadow-2xl`}
        >
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold">
              <NgopiGradientText>Redeem Kode</NgopiGradientText>
            </DialogTitle>
          </DialogHeader>

          <NgopiWastraCorners />

          {/* Input Section */}
          <div className="space-y-4 relative z-10 mt-4">
            <div className="space-y-2">
              <Label className="text-white font-semibold text-base">Masukan Kode Approval Barista</Label>
              <Input
                placeholder="Masukkan kode approval..."
                className="bg-white/20 backdrop-blur-sm text-white font-medium placeholder:text-gray-300 border-white/30 focus:border-white focus:ring-2 focus:ring-white/50 rounded-xl py-3"
                onChange={(e) => setInputRedeemCode(e?.currentTarget?.value)}
              />
            </div>

            <Button
              type="button"
              className={`w-full py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 z-20 relative ${ngopiPrimaryButtonClassName}`}
              onClick={onRedeemCode}
            >
              Konfirmasi Redeem
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {isLoading2 ? <ScreenLoaderNgopi /> : null}
      {openValidCode && <DialogValidCode isValid={openValidCode} setIsValid={setOpenValidCode} data={responseCode} />}
      {openUsedCode && <DialogUsedCode isValid={openUsedCode} setIsValid={setOpenUsedCode} data={responseCode} />}
      {openInvalidCode && (
        <DialogInvalidCode isValid={openInvalidCode} setIsValid={setOpenInvalidCode} data={responseCode} />
      )}
    </div>
  );
};

export default VoucherCode;
