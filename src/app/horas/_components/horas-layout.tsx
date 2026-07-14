"use client";

import logoBI from "@/assets/bi-horizontal-white.png";
import logoBWI from "@/assets/bwi-logo.png";
import logoPemprovSumut from "@/assets/sumut/logo-pemprov-sumut.png";
import Image from "next/image";
import React from "react";
import HorasHeader from "./horas-header";
import { ICShadeBrown } from "./ic-shade";

interface LayoutHorasProps {
  children: React.ReactNode;
  header?: boolean;
  footer: "landing-page" | "detail-page";
  params?: any;
  tnc?: boolean;
}

const LayoutHoras = ({ children, header = true, footer, params, tnc = true }: LayoutHorasProps) => {
  return (
    <div>
      <div className="inset-0 fixed bg-[radial-gradient(circle_at_center,_theme(colors.fesyar.green.100),#00484C)]" />

      {header ? <HorasHeader /> : null}

      {/* ORNAMENT LAMPION SMALL TOP LEFT */}
      <Image
        src={`/assets/horas/horas-lampion-top-left-right.png`}
        width={250}
        height={250}
        alt="ornament"
        priority
        className="fixed top-0 left-0 z-20 w-[100px] md:w-[200px] lg:w-[250px] h-auto"
      />

      {/* ORNAMENT LAMPION SMALL TOP RIGHT */}
      <Image
        src={`/assets/horas/horas-lampion-top-left-right.png`}
        width={250}
        height={250}
        alt="ornament"
        priority
        className="fixed top-0 right-0 z-20 w-[100px] md:w-[200px] lg:w-[250px] h-auto scale-x-[-1]"
      />

      {/* IKHTIAR TOP LEFT */}
      <Image
        src={`/assets/horas/horas-top-left-right.png`}
        width={400}
        height={400}
        alt="ornament"
        priority
        className="fixed top-0 left-0 z-10 w-[150px] md:w-[250px] lg:w-[400px] h-auto"
      />

      {/* IKHTIAR TOP RIGHT */}
      <Image
        src={`/assets/horas/horas-top-left-right.png`}
        width={400}
        height={400}
        alt="ornament"
        priority
        className="fixed top-0 right-0 z-10 w-[150px] md:w-[250px] lg:w-[400px] h-auto scale-x-[-1]"
      />

      {/* SILUET MASJID */}
      <Image
        src={`/assets/horas/horas-siluet-masjid.png`}
        width={1900}
        height={400}
        alt="ornament"
        priority
        className="fixed w-full bottom-16 left-0 z-10 object-cover"
      />

      {/* SILUET TRADISIONAL HOUSE */}
      <Image
        src={`/assets/horas/horas-siluet-traditional-house.png`}
        width={300}
        height={300}
        alt="ornament"
        priority
        className="fixed bottom-24 left-10 z-10 w-[150px] md:w-[300px] lg:w-[300px] h-auto opacity-60 mix-blend-multiply"
      />

      <Image
        src={`/assets/horas/horas-siluet-traditional-house.png`}
        width={300}
        height={300}
        alt="ornament"
        priority
        className="fixed bottom-24 right-10 z-10 w-[150px] md:w-[300px] lg:w-[300px] h-auto scale-x-[-1] opacity-60 mix-blend-multiply"
      />

      {/* IKHTIAR FLARE STAR */}

      <Image
        src={`/assets/ikhtiar/ikhtiar-flare-star.png`}
        width={1900}
        height={400}
        alt="ornament"
        priority
        className="fixed w-full top-0 right-0 left-0 z-20 object-cover mix-blend-screen"
      />

      {/* IKHTIAR FOOTER */}
      <Image
        src={`/assets/ikhtiar/ikhtiar-footer.png`}
        width={1920}
        height={400}
        alt="ornament"
        priority
        className="fixed w-full bottom-0 left-0 right-0 z-10 object-cover"
      />

      {/* IKHTIAR ORNAMET FOOTER LEFT */}
      <Image
        src={`/assets/horas/horas-footer-left.png`}
        width={350}
        height={350}
        alt="ornament"
        priority
        className="fixed bottom-0 left-0 z-20 w-[100px] md:w-[200px] lg:w-[350px] h-auto"
      />

      <Image
        src={`/assets/horas/horas-footer-right.png`}
        width={350}
        height={350}
        alt="ornament"
        priority
        className="fixed bottom-0 right-0 z-20 w-[100px] md:w-[200px] lg:w-[350px] h-auto"
      />

      {/* IKHTIAR PIECE OF STAR */}
      <Image
        src={`/assets/ikhtiar/ikhtiar-piece-of-star.png`}
        width={60}
        height={60}
        alt="ornament"
        priority
        className="fixed top-20 right-24 z-20 animate-pulse w-[20px] md:w-[40px] lg:w-[60px] h-auto"
      />
      <Image
        src={`/assets/ikhtiar/ikhtiar-piece-of-star.png`}
        width={60}
        height={60}
        alt="ornament"
        priority
        className="fixed top-20 left-24 z-20 animate-pulse w-[20px] md:w-[40px] lg:w-[60px] h-auto"
      />
      <Image
        src={`/assets/ikhtiar/ikhtiar-piece-of-star.png`}
        width={60}
        height={60}
        alt="ornament"
        priority
        className="fixed bottom-16 right-[40%] z-20 animate-pulse w-[20px] md:w-[40px] lg:w-[60px] h-auto"
      />
      <Image
        src={`/assets/ikhtiar/ikhtiar-piece-of-star.png`}
        width={60}
        height={60}
        alt="ornament"
        priority
        className="fixed bottom-16 left-[40%] z-20 animate-pulse w-[20px] md:w-[40px] lg:w-[60px] h-auto"
      />

      {/* SHADE */}
      <div className="fixed top-0 right-0 z-0 opacity-70">
        <ICShadeBrown />
      </div>

      <div className="z-20 relative ">{children}</div>

      {footer === "landing-page" ? (
        <div className="p-2 relative z-20 w-fit flex items-center gap-4 mx-auto ">
          <Image src={logoPemprovSumut} alt="Logo Pemprov Sumut" className="h-[35px] w-auto object-contain" priority />
          <Image src={logoBI} alt="Logo BI" className="h-[30px] w-auto object-contain" priority />
          <Image src={logoBWI} alt="Logo BWI" className="h-[35px] w-auto object-contain" priority />
        </div>
      ) : null}
    </div>
  );
};

export default LayoutHoras;
