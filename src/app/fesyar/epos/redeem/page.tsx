"use client";

import horasSubtitle from "@/assets/sumut/horas-subtitle.png";
import horasTitle from "@/assets/sumut/horas-title.png";
import { GradientText } from "@/components/fesyar/gradient-text";
import ReactSelectFesyar from "@/components/fesyar/react-select-fesyar";
import { Label } from "@/components/Label";
import {
  EposDialogInvalidCode,
  EposDialogUsedCode,
  EposDialogValidCode,
} from "@/components/shared-program/epos/epos-dialog-verified";
import LayoutEpos from "@/components/shared-program/epos/epos-layout";
import { Switch } from "@/components/Switch";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { env } from "@/lib/env";
import axios from "axios";
import { GiftIcon, XIcon } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

export interface IResponseReedem {
  campaign_id: string;
  campaign_title: string;
  campaign_banner_url: string;
  donation_net_amount: string;
  donor_name: string;
  donor_corp_name: string;
  donor_unit_name: string;
  wakif_name: string;
  redeem_code: string;
  redeem_on: Date;
}

// const Menu = ... (removed hardcoded list)

interface IResponseRedeem {
  rewards: { id: string; qty: number; name: string }[];
  redeem_code: string;
  reward_wanted: number;
  reward_id: string;
  reward_name: string;
}

const RedeemCodeInput = () => {
  const [code, setCode] = useState(["", "", "", "", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [openValidCode, setOpenValidCode] = useState(false);
  const [openInvalidCode, setOpenInvalidCode] = useState(false);
  const [openUsedCode, setOpenUsedCode] = useState(false);
  const [responseCodeCheck, setResponseCodeCheck] = useState<IResponseRedeem>();
  const [responseCode, setResponseCode] = useState<any>();

  const [openGiftModal, setOpenGiftModal] = useState(false);
  const [wantsGift, setWantsGift] = useState<boolean>(false);
  const [selectedGift, setSelectedGift] = useState<string>("");

  const rewardOptions = React.useMemo(() => {
    return responseCodeCheck?.rewards?.map((item) => ({ value: item.id, label: item.name })) || [];
  }, [responseCodeCheck?.rewards]);

  // Focus pertama input saat component mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleInputChange = (index: number, value: string) => {
    // Hanya terima alfanumerik dan convert ke uppercase
    const sanitizedValue = value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

    if (sanitizedValue.length <= 1) {
      const newCode = [...code];
      newCode[index] = sanitizedValue;
      setCode(newCode);
      setError("");

      // Auto focus ke input selanjutnya jika ada karakter
      if (sanitizedValue && index < 9) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (code[index] === "" && index > 0) {
        // Jika input kosong dan backspace, focus ke input sebelumnya
        inputRefs.current[index - 1]?.focus();
      } else {
        // Clear current input
        const newCode = [...code];
        newCode[index] = "";
        setCode(newCode);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData
      .getData("text")
      .replace(/[^a-zA-Z0-9]/g, "")
      .toUpperCase();

    if (pastedText.length >= 9) {
      const newCode = pastedText.slice(0, 9).split("");
      setCode(newCode);
      setError("");
      // Focus ke input terakhir
      inputRefs.current[8]?.focus();
    }
  };

  const handleSubmit = async () => {
    const fullCode = code.join("");

    if (fullCode.length !== 9) {
      setError("Masukkan kode redeem 9 karakter");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const payload = {
        redeem_code: code?.join(""),
        redeem_check: 1,
      };

      // Assume backend has a /redeem/check endpoint to validate before actually redeeming
      // If it's still /redeem/approval, and clicking Redeem completes the UI, we adjust if necessary.
      const response = await axios.post(env.NEXT_PUBLIC_BASE_URL2 + `/redeem/approval`, payload);
      const data = response?.data?.data;

      setResponseCodeCheck(data);
      setWantsGift(data?.reward_wanted === 1);
      setSelectedGift(data?.reward_id || "");
      setOpenGiftModal(true);
    } catch (error: any) {
      const error_message = error?.response?.data?.error_message || "";

      if (error_message?.toLowerCase()?.includes("tidak ditemukan")) {
        setOpenInvalidCode(true);
        setResponseCode(error_message);
      } else if (error_message?.toLowerCase()?.includes("sudah digunakan")) {
        setOpenUsedCode(true);
        setResponseCode(error_message);
      } else {
        setOpenInvalidCode(true);
        setResponseCode(error_message);
        // Fallback if /redeem/check doesn't exist and we must hit /redeem/approval
        // Temporarily, we will set Error if API check fails not matched to specific error
        setError(error_message || "Gagal memeriksa kode voucher");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinalRedeem = async () => {
    if (wantsGift && !selectedGift) {
      setError("Pilih Menu terlebih dahulu");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const payload = {
        redeem_code: code?.join(""),
        reward_wanted: wantsGift ? 1 : 0,
        reward_id: wantsGift ? selectedGift : null,
        reward_name: wantsGift ? rewardOptions.find((item) => item.value === selectedGift)?.label : null,
      };

      const response = await axios.post(env.NEXT_PUBLIC_BASE_URL2 + `/redeem/approval`, payload);

      setOpenValidCode(true);
      setResponseCode(response?.data?.data);
      setCode(["", "", "", "", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      setOpenGiftModal(false);
      setWantsGift(false);
      setSelectedGift("");
    } catch (error: any) {
      const error_message = error?.response?.data?.error_message || "";

      if (error_message?.toLowerCase()?.includes("tidak ditemukan")) {
        setOpenInvalidCode(true);
        setResponseCode(error_message);
      } else if (error_message?.toLowerCase()?.includes("sudah digunakan")) {
        setOpenUsedCode(true);
        setResponseCode(error_message);
      } else {
        setError(error_message || "Gagal melakukan redeem voucher");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setCode(["", "", "", "", "", "", "", "", ""]);
    setError("");
    setIsSuccess(false);
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="bg-glass-gradient rounded-2xl shadow-xl p-4 md:p-8">
      {/* Header */}
      <div className="text-center mb-4 md:mb-8">
        <div className="w-10 h-10 md:w-16 md:h-16 bg-fesyar-gold rounded-full flex items-center justify-center mx-auto mb-4">
          <GiftIcon className="text-gray-700 w-8 h-8" />
        </div>
        <GradientText className="text-base lg:text-xl">Redeem Kode Voucher</GradientText>
      </div>

      {/* Kode Input */}
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-gray-100 text-xs md:text-sm font-semibold mt-2 text-center">Masukkan kode voucher</p>
          <div>
            <div className="flex justify-center space-x-1 md:space-x-3 mb-4">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="text"
                  pattern="[A-Za-z0-9]*"
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className={`w-8 h-9 text-sm md:w-12 md:h-14 text-center md:text-xl font-bold border-2 rounded-lg focus:outline-none transition-all duration-200 ${
                    error
                      ? "border-red-300 focus:border-red-500 bg-red-50"
                      : isSuccess
                        ? "border-green-300 bg-green-50"
                        : "border-gray-300 focus:border-blue-500 hover:border-gray-400"
                  }`}
                  maxLength={1}
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  disabled={isLoading || isSuccess}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <Button
        disabled={isLoading || code.join("").length !== 9 || isSuccess}
        className="w-full bg-fesyar-gold text-fesyar-green-700"
        onClick={handleSubmit}
      >
        Tukar Kode
      </Button>
      <Button variant="link" className="text-white w-full mt-3" onClick={handleClear}>
        Ulangi
      </Button>

      {/* Footer */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <p className="text-xs text-gray-100 text-center">Pastikan kode redeem Anda benar dan belum pernah digunakan</p>
      </div>

      {openValidCode && (
        <EposDialogValidCode isValid={openValidCode} setIsValid={setOpenValidCode} data={responseCode} />
      )}
      {openUsedCode && <EposDialogUsedCode isValid={openUsedCode} setIsValid={setOpenUsedCode} data={responseCode} />}
      {openInvalidCode && (
        <EposDialogInvalidCode isValid={openInvalidCode} setIsValid={setOpenInvalidCode} data={responseCode} />
      )}

      {/* Gift Selection Modal */}
      <Dialog
        open={openGiftModal}
        onOpenChange={(val) => {
          setOpenGiftModal(val);
          if (!val) {
            setWantsGift(false);
            setSelectedGift("");
          }
        }}
      >
        <DialogContent
          className="bg-[#071c3d] bg-[radial-gradient(circle_at_top,_#205398_0%,_#071c3d_70%)] border-none rounded-xl w-full max-w-lg [&_[data-slot=dialog-close]]:text-white [&_[data-slot=dialog-close]]:opacity-100"
          showCloseButton={false}
        >
          <DialogClose className="absolute top-4 right-4 z-20 text-white opacity-70 hover:opacity-100 transition-opacity">
            <XIcon className="w-6 h-6" />
          </DialogClose>
          <Image
            src="/assets/wakafein/flower.png"
            width={1200}
            height={600}
            alt="wastra"
            className="pointer-events-none absolute left-0 top-0 h-auto w-[35%] max-w-[360px] opacity-65 scale-y-[-1]"
          />
          <Image
            src="/assets/wakafein/flower.png"
            width={1200}
            height={600}
            alt="wastra"
            className="pointer-events-none absolute right-0 top-0 h-auto w-[35%] max-w-[360px] scale-x-[-1] scale-y-[-1] opacity-65"
          />

          <DialogHeader className="relative z-10 pt-2">
            <DialogTitle className="text-center text-2xl font-bold">
              <GradientText>Penukaran Menu</GradientText>
            </DialogTitle>
            <DialogDescription />
          </DialogHeader>

          <div className="relative z-10 bg-fesyar-green-700/10 backdrop-blur-xl rounded-xl p-2 shadow-xl flex flex-col gap-4 max-w-sm mx-auto w-full mt-2">
            <div className="text-center">
              <p className="text-xs text-white mt-1">
                Konfirmasi apakah ingin menukarkan bonus Menu yang dipilih wakif saat berwakaf.
              </p>
            </div>

            <div className="flex flex-col gap-4 mt-2 px-2">
              <div className="flex items-center w-full gap-2">
                <Switch
                  checked={wantsGift}
                  onCheckedChange={(checked) => {
                    setWantsGift(checked);
                    if (!checked) {
                      setSelectedGift("");
                    }
                  }}
                  type="button"
                />
                <Label className="text-[0.65rem] text-gray-200 italic">Tukarkan Menu (Pilihan Wakif)</Label>
              </div>
            </div>

            {wantsGift && (
              <div className="animate-in fade-in zoom-in duration-200 mt-1 px-2 space-y-2">
                <Label className="text-white text-xs">Pilih Menu</Label>
                <ReactSelectFesyar
                  name="gift"
                  placeholder="Pilih Menu..."
                  options={rewardOptions}
                  getOptionLabel={(option: any) => option.label}
                  getOptionValue={(option: any) => option.value}
                  value={rewardOptions.find((item) => item.value === selectedGift)}
                  onChange={(option: any) => setSelectedGift(option?.value || "")}
                  className="text-xs"
                  maxMenuHeight={300}
                />
              </div>
            )}

            <Button
              className="w-full bg-fesyar-gold hover:bg-fesyar-yellow-600 text-fesyar-green-700 font-bold  mt-2 shadow-lg transition-all"
              onClick={handleFinalRedeem}
              disabled={isLoading || (wantsGift && !selectedGift)}
            >
              {isLoading ? "Memproses..." : "Redeem Sekarang"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const page = () => {
  return (
    <LayoutEpos footer="detail-page">
      <div className="flex flex-col items-center pt-8 sm:pt-16 md:pt-24">
        <Image
          src={"https://storage.googleapis.com/ziswaf-asset-prod/assets/upload/vBfovP2k9VsyT3Hmbjpn.jpg"}
          alt="WAKAFEIN FESYAR"
          className="mix-blend-hard-light max-h-[100px] w-auto"
          width={900}
          height={430}
          priority
        />
      </div>

      <section className="max-w-7xl grid place-items-center mx-auto mt-8 md:mt-16">
        <RedeemCodeInput />
      </section>
    </LayoutEpos>
  );
};

export default page;
