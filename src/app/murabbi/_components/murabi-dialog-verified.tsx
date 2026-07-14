"use client";

import { GradientText } from "@/components/fesyar/gradient-text";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertCircle, XCircle } from "lucide-react";
import Image from "next/image";
import React, { Dispatch } from "react";

interface IResponseReedem {
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

interface ValidCodeProps {
  isValid: boolean;
  setIsValid: Dispatch<React.SetStateAction<boolean>>;
  data: IResponseReedem;
}
export const DialogValidCode = ({ isValid, setIsValid, data }: ValidCodeProps) => {
  return (
    <div>
      <Dialog open={isValid} onOpenChange={setIsValid}>
        <DialogContent className="sm:max-w-md bg-fesyar-green-500">
          <Image src={"/assets/fesyar/wastra.png"} fill alt="wastra" className="absolute top-0 left-0" />
          <Image src="/assets/fesyar/wastra.png" fill alt="wastra" className="absolute top-0 right-0 scale-x-[-1]" />
          <DialogHeader>
            <DialogTitle className="text-center">
              <GradientText>Berhasil Menukar Kode</GradientText>
            </DialogTitle>
          </DialogHeader>

          {/* Header dengan gradient hijau */}

          <Image
            alt="success"
            src="/assets/wakafein/ILSuccess.svg"
            width={200}
            height={0}
            className="w-[50%] h-auto mx-auto"
          />

          <GradientText className="text-base md:text-xl font-bold text-center">Code Ditemukan!</GradientText>
          <GradientText className="text-xs md:text-base text-center mt-2">
            Selamat {data?.wakif_name}, kode valid untuk ditukar
          </GradientText>

          <DialogFooter className="relative z-20">
            <DialogClose asChild className="w-full">
              <Button type="button" variant="secondary">
                Tutup
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface UsedCodeProps {
  isValid: boolean;
  setIsValid: Dispatch<React.SetStateAction<boolean>>;
  data: any;
}
export const DialogUsedCode = ({ isValid, setIsValid, data }: UsedCodeProps) => {
  return (
    <div>
      <Dialog open={isValid} onOpenChange={setIsValid}>
        <DialogContent className="sm:max-w-md bg-fesyar-green-500">
          <Image src={"/assets/fesyar/wastra.png"} fill alt="wastra" className="absolute top-0 left-0" />
          <Image src="/assets/fesyar/wastra.png" fill alt="wastra" className="absolute top-0 right-0 scale-x-[-1]" />
          <DialogHeader>
            <DialogTitle className="text-center">
              <GradientText>Gagal Menukar Kode</GradientText>
            </DialogTitle>
          </DialogHeader>

          <div className="max-w-md mx-auto rounded-2xl shadow-xl overflow-hidden">
            {/* Header dengan gradient merah */}
            <div className="bg-gradient-to-r from-red-500 to-pink-600 px-6 py-8 text-white relative overflow-hidden">
              <div className="absolute top-2 right-2 opacity-20">
                <XCircle className="w-24" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mx-auto mb-4">
                  <XCircle className="text-white w-12" />
                </div>
                <h2 className="text-base md:text-xl font-bold text-center">Code Sudah Terpakai</h2>
                <p className="text-red-100 text-xs md:text-base text-center mt-2">{data}</p>
              </div>
            </div>
          </div>

          <DialogFooter className="relative z-20">
            <DialogClose asChild className="w-full">
              <Button type="button" variant="secondary">
                Tutup
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface InvalidCodeProps {
  isValid: boolean;
  setIsValid: Dispatch<React.SetStateAction<boolean>>;
  data: any;
}
export const DialogInvalidCode = ({ isValid, setIsValid, data }: InvalidCodeProps) => {
  return (
    <Dialog open={isValid} onOpenChange={setIsValid}>
      <DialogContent className="sm:max-w-md bg-fesyar-green-500">
        <Image src={"/assets/fesyar/wastra.png"} fill alt="wastra" className="absolute top-0 left-0" />
        <Image src="/assets/fesyar/wastra.png" fill alt="wastra" className="absolute top-0 right-0 scale-x-[-1]" />
        <DialogHeader>
          <DialogTitle className="text-center">
            <GradientText>Gagal Menukar Kode</GradientText>
          </DialogTitle>
        </DialogHeader>

        <div className="w-full mx-auto rounded-2xl shadow-xl overflow-hidden">
          {/* Header dengan gradient abu-abu */}
          <div className="bg-gradient-to-r from-gray-500 to-gray-600 px-6 py-8 text-white relative overflow-hidden">
            <div className="absolute top-2 right-2 opacity-20">
              <AlertCircle className="w-24" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mx-auto mb-4">
                <AlertCircle className="text-white w-12" />
              </div>
              <h2 className="text-base md:text-xl font-bold text-center">Code Tidak Ditemukan</h2>
              <p className="text-gray-200 text-xs md:text-base text-center mt-2">{data}</p>
            </div>
          </div>
        </div>

        <DialogFooter className="relative z-20">
          <DialogClose asChild className="w-full">
            <Button type="button" variant="secondary">
              Tutup
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
