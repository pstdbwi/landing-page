"use client";

import { useFeatureFlag } from "@/store/feature-flag-context";
import Image from "next/image";

import logoBI from "@/assets/bi-horizontal-white.png";
import logoBWI from "@/assets/bwi-logo.png";
import horasSubtitle from "@/assets/sumut/horas-subtitle.png";
import horasTitle from "@/assets/sumut/horas-title.png";
import logoPemprovSumut from "@/assets/sumut/logo-pemprov-sumut.png";

interface Props {
  size?: "small" | "default";
}

export function HorasHeaderSection({ size = "default" }: Props) {
  const { currentDomain } = useFeatureFlag();

  if (size == "small") {
    return (
      <section className="flex relative flex-col pt-5 gap-10 items-center justify-center w-full px-3 md:px-0">
        <div className="flex items-center gap-4">
          <Image src={logoPemprovSumut} alt="Logo Pemprov Sumut" className="h-[45px] w-auto object-contain" priority />
          <Image src={logoBI} alt="Logo BI" className="h-[40px] w-auto object-contain" priority />
          <Image src={logoBWI} alt="Logo BWI" className="h-[45px] w-auto object-contain" priority />
        </div>

        {currentDomain ? (
          <div className="flex flex-col items-center">
            <Image
              src={horasTitle}
              alt="WAKAF SUMUT BERKAH"
              className="mix-blend-hard-light max-h-[70px] md:max-h-[75px] w-auto"
              priority
            />

            <Image
              src={horasSubtitle}
              alt="Wakaf untuk Kemaslahatan Sumatera Utara"
              className="mix-blend-hard-light max-h-[50px] w-auto"
              priority
            />
          </div>
        ) : (
          <div
            className="w-[500px] h-[100px] bg-gray-300 rounded-md animate-pulse"
            aria-label="Loading title image"
          ></div>
        )}
      </section>
    );
  }

  return (
    <section className="flex relative flex-col pt-5 gap-10 items-center justify-center w-full">
      <div className="flex items-center gap-4">
        <Image src={logoPemprovSumut} alt="Logo Pemprov Sumut" className="h-[50px] w-auto object-contain" priority />
        <Image src={logoBI} alt="Logo BI" className="h-[45px] w-auto object-contain" priority />
        <Image src={logoBWI} alt="Logo BWI" className="h-[50px] w-auto object-contain" priority />
      </div>

      {currentDomain ? (
        <div className="flex flex-col items-center">
          <Image
            src={horasTitle}
            alt="WAKAF SUMUT BERKAH"
            className="mix-blend-hard-light max-h-[50px]  w-auto"
            priority
          />

          <Image
            src={horasSubtitle}
            alt="Wakaf untuk Kemaslahatan Sumatera Utara"
            className="mix-blend-hard-light max-h-[35px] w-auto"
            priority
          />
        </div>
      ) : (
        <div
          className="w-[500px] h-[100px] bg-gray-300 rounded-md animate-pulse"
          aria-label="Loading title image"
        ></div>
      )}
    </section>
  );
}
