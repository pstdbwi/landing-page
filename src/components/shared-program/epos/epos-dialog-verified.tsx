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
export const EposDialogValidCode = ({ isValid, setIsValid, data }: ValidCodeProps) => {
  return (
    <div>
      <Dialog open={isValid} onOpenChange={setIsValid}>
        <DialogContent className="bg-[#071c3d] bg-[radial-gradient(circle_at_top,_#205398_0%,_#071c3d_70%)] border-none rounded-xl w-full max-w-lg max-h-[90vh] overflow-auto [&_[data-slot=dialog-close]]:text-white [&_[data-slot=dialog-close]]:opacity-100">
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
            <DialogClose asChild>
              <Button type="button" className="w-full bg-fesyar-gold !text-fesyar-green-700 font-bold relative z-20">
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
export const EposDialogUsedCode = ({ isValid, setIsValid, data }: UsedCodeProps) => {
  return (
    <div>
      <Dialog open={isValid} onOpenChange={setIsValid}>
        <DialogContent className="bg-[#071c3d] bg-[radial-gradient(circle_at_top,_#205398_0%,_#071c3d_70%)] border-none rounded-xl w-full max-w-lg max-h-[90vh] overflow-auto [&_[data-slot=dialog-close]]:text-white [&_[data-slot=dialog-close]]:opacity-100">
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
            <DialogClose asChild>
              <Button type="button" className="w-full bg-fesyar-gold !text-fesyar-green-700 font-bold relative z-20">
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
export const EposDialogInvalidCode = ({ isValid, setIsValid, data }: InvalidCodeProps) => {
  return (
    <Dialog open={isValid} onOpenChange={setIsValid}>
      <DialogContent className="bg-[#071c3d] bg-[radial-gradient(circle_at_top,_#205398_0%,_#071c3d_70%)] border-none rounded-xl w-full max-w-lg max-h-[90vh] overflow-auto [&_[data-slot=dialog-close]]:text-white [&_[data-slot=dialog-close]]:opacity-100">
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
          <DialogClose asChild>
            <Button type="button" className="w-full bg-fesyar-gold !text-fesyar-green-700 font-bold relative z-20">
              Tutup
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
