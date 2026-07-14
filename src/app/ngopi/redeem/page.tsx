"use client";

import { GradientText } from "@/components/fesyar/gradient-text";
import { DialogInvalidCode, DialogUsedCode, DialogValidCode } from "@/components/ngopi/ngopi-dialog-verified";
import { NgopiHeaderSection } from "@/components/ngopi/ngopi-header-section";
import LayoutNgopi from "@/components/ngopi/ngopi-layout";
import { Button } from "@/components/ui/button";
import { env } from "@/lib/env";
import axios from "axios";
import { GiftIcon } from "lucide-react";
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

const RedeemCodeInput = () => {
  const [code, setCode] = useState(["", "", "", "", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [openValidCode, setOpenValidCode] = useState(false);
  const [openInvalidCode, setOpenInvalidCode] = useState(false);
  const [openUsedCode, setOpenUsedCode] = useState(false);
  const [responseCode, setResponseCode] = useState<any>();

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
      };

      const response = await axios.post(env.NEXT_PUBLIC_BASE_URL2 + `/redeem/approval`, payload);

      setOpenValidCode(true);
      setResponseCode(response?.data?.data);
      setCode(["", "", "", "", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (error: any) {
      const error_message = error?.response?.data?.error_message || "";

      if (error_message?.toLowerCase()?.includes("tidak ditemukan")) {
        setOpenInvalidCode(true);
        setResponseCode(error_message);
      } else if (error_message?.toLowerCase()?.includes("sudah digunakan")) {
        setOpenUsedCode(true);
        setResponseCode(error_message);
      }

      setError(error_message);
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

      {openValidCode && <DialogValidCode isValid={openValidCode} setIsValid={setOpenValidCode} data={responseCode} />}
      {openUsedCode && <DialogUsedCode isValid={openUsedCode} setIsValid={setOpenUsedCode} data={responseCode} />}
      {openInvalidCode && (
        <DialogInvalidCode isValid={openInvalidCode} setIsValid={setOpenInvalidCode} data={responseCode} />
      )}
    </div>
  );
};

const page = () => {
  return (
    <LayoutNgopi footer="detail-page" header={false}>
      <NgopiHeaderSection size="small" />

      <section className="max-w-7xl grid place-items-center mx-auto mt-8 md:mt-16">
        <RedeemCodeInput />
      </section>
    </LayoutNgopi>
  );
};

export default page;

const InputCodeApproval = () => {
  const [codeApproval, setCodeApproval] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const inputApprovalRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChangeApproval = (index: number, value: string) => {
    // Hanya terima alfanumerik dan convert ke uppercase
    const sanitizedValue = value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

    if (sanitizedValue.length <= 1) {
      const newCode = [...codeApproval];
      newCode[index] = sanitizedValue;
      setCodeApproval(newCode);
      setError("");

      // Auto focus ke input selanjutnya jika ada karakter
      if (sanitizedValue && index < 5) {
        inputApprovalRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleApprovalKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (codeApproval[index] === "" && index > 0) {
        // Jika input kosong dan backspace, focus ke input sebelumnya
        inputApprovalRefs.current[index - 1]?.focus();
      } else {
        // Clear current input
        const newCode = [...codeApproval];
        newCode[index] = "";
        setCodeApproval(newCode);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputApprovalRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputApprovalRefs.current[index + 1]?.focus();
    }
  };

  const handleApprovalPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData
      .getData("text")
      .replace(/[^a-zA-Z0-9]/g, "")
      .toUpperCase();

    if (pastedText.length >= 6) {
      const newCode = pastedText.slice(0, 6).split("");
      setCodeApproval(newCode);
      setError("");
      // Focus ke input terakhir
      inputApprovalRefs.current[5]?.focus();
    }
  };

  return (
    <div className="space-y-2">
      <p className="text-gray-100 text-sm font-semibold mt-2 text-center">Masukkan kode barista</p>
      <div>
        <div className="flex justify-between space-x-3 mb-4">
          {codeApproval.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputApprovalRefs.current[index] = el)}
              type="text"
              value={digit}
              onChange={(e) => handleInputChangeApproval(index, e.target.value)}
              onKeyDown={(e) => handleApprovalKeyDown(index, e)}
              onPaste={handleApprovalPaste}
              className={`w-12 h-14 text-center text-xl font-bold border-2 rounded-lg focus:outline-none transition-all duration-200 ${
                error
                  ? "border-red-300 focus:border-red-500 bg-red-50"
                  : isSuccess
                  ? "border-green-300 bg-green-50"
                  : "border-gray-300 focus:border-blue-500 hover:border-gray-400"
              }`}
              maxLength={1}
              autoComplete="off"
              disabled={isLoading || isSuccess}
            />
          ))}
        </div>

        {error && (
          <div className="text-red-500 text-sm text-center mb-4 flex items-center justify-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </div>
        )}
      </div>
    </div>
  );
};
