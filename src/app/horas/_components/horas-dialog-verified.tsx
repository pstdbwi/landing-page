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
        <DialogContent
          aria-describedby="dialog-description"
          className="sm:max-w-md bg-[radial-gradient(circle_at_center,_theme(colors.fesyar.green.300),#00484C)]"
        >
          <Image
            src={"/assets/horas/horas-top-left-right.png"}
            width={200}
            height={200}
            alt="ornament wakaf sumut"
            className="absolute top-0 left-0 z-0 opacity-80"
          />
          <Image
            src={"/assets/horas/horas-top-left-right.png"}
            width={200}
            height={200}
            alt="ornament wakaf sumut"
            className="absolute top-0 right-0 z-0 opacity-80 scale-x-[-1]"
          />
          <DialogHeader className="relative z-10">
            <DialogTitle className="text-center">
              <GradientText>Berhasil Menukar Kode</GradientText>
            </DialogTitle>
          </DialogHeader>

          {/* Header dengan gradient hijau */}

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
        <DialogContent
          aria-describedby="dialog-description"
          className="sm:max-w-md bg-[radial-gradient(circle_at_center,_theme(colors.fesyar.green.300),#00484C)]"
        >
          <Image
            src={"/assets/horas/horas-top-left-right.png"}
            width={200}
            height={200}
            alt="ornament wakaf sumut"
            className="absolute top-0 left-0 z-0 opacity-80"
          />
          <Image
            src={"/assets/horas/horas-top-left-right.png"}
            width={200}
            height={200}
            alt="ornament wakaf sumut"
            className="absolute top-0 right-0 z-0 opacity-80 scale-x-[-1]"
          />
          <DialogHeader className="z-10 relative">
            <DialogTitle className="text-center">
              <GradientText>Gagal Menukar Kode</GradientText>
            </DialogTitle>
          </DialogHeader>

          <div className="max-w-md mx-auto rounded-2xl  overflow-hidden">
            {/* Header dengan gradient merah */}
            <div className="px-6 py-8 text-white relative overflow-hidden">
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
      <DialogContent
        aria-describedby="dialog-description"
        className="sm:max-w-md bg-[radial-gradient(circle_at_center,_theme(colors.fesyar.green.300),#00484C)]"
      >
        <Image
          src={"/assets/horas/horas-top-left-right.png"}
          width={200}
          height={200}
          alt="ornament wakaf sumut"
          className="absolute top-0 left-0 z-0 opacity-80"
        />
        <Image
          src={"/assets/horas/horas-top-left-right.png"}
          width={200}
          height={200}
          alt="ornament wakaf sumut"
          className="absolute top-0 right-0 z-0 opacity-80 scale-x-[-1]"
        />
        <DialogHeader className="z-10 relative">
          <DialogTitle className="text-center">
            <GradientText>Gagal Menukar Kode</GradientText>
          </DialogTitle>
        </DialogHeader>

        <div className="w-full mx-auto rounded-2xl overflow-hidden">
          {/* Header dengan gradient abu-abu */}
          <div className="px-6 py-8 text-white relative overflow-hidden">
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
