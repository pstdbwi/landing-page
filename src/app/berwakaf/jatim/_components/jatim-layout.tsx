"use client";

import { ICShadeBrown } from "@/app/horas/_components/ic-shade";
import Image from "next/image";
import React from "react";
import JatimTopbar from "./jatim-topbar";

import logoBI from "@/assets/bi-horizontal-white.png";
import logoBWI from "@/assets/bwi-logo.png";
// import logoPemprovJatim from "@/assets/jatim/logo-pemprov-jatim.png";
import OrnamentFooterLeft from "@/assets/jatim/ornament-footer-left.png";
import OrnamentTopLeftRight from "@/assets/jatim/ornament-top-left-right.png";
import Reog from "@/assets/jatim/reog.png";
import SiluetMasjidKhas from "@/assets/jatim/siluet-masjid-khas.png";

interface JatimLayoutProps {
  children: React.ReactNode;
  footer: "landing-page" | "detail-page";
}

const JatimLayout = ({ children, footer }: JatimLayoutProps) => {
  return (
    <div>
      <div className="inset-0 fixed bg-[radial-gradient(circle_at_center,_theme(colors.fesyar.green.100),#00484C)]" />
      <div className="flex items-center justify-center gap-4 relative z-50 pt-6">
        {/* <Image src={logoPemprovJatim} alt="Logo Pemprov Sumut" className="h-[45px] w-auto object-contain" priority /> */}
        <Image src={logoBI} alt="Logo BI" className="h-[37px] w-auto object-contain" priority />
        <Image src={logoBWI} alt="Logo BWI" className="h-[45px] w-auto object-contain" priority />
      </div>

      <div className="pt-4">
        <JatimTopbar />
      </div>

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
        src={OrnamentTopLeftRight}
        width={400}
        height={400}
        alt="ornament"
        priority
        className="fixed top-0 left-0 z-10 w-[150px] md:w-[250px] lg:w-[400px] h-auto"
      />

      {/* IKHTIAR TOP RIGHT */}
      <Image
        src={OrnamentTopLeftRight}
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
        src={SiluetMasjidKhas}
        width={300}
        height={300}
        alt="ornament"
        priority
        className="fixed bottom-6 md:bottom-10 lg:bottom-16 left-0 z-10 w-[200px] md:w-[350px] lg:w-[450px] h-auto opacity-60 mix-blend-multiply"
      />

      <Image
        src={SiluetMasjidKhas}
        width={300}
        height={300}
        alt="ornament"
        priority
        className="fixed bottom-6 md:bottom-10 lg:bottom-16 right-0 z-10 w-[200px] md:w-[350px] lg:w-[450px] h-auto scale-x-[-1] opacity-60 mix-blend-multiply"
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
        src={OrnamentFooterLeft}
        width={350}
        height={350}
        alt="ornament"
        priority
        className="fixed bottom-0 left-0 z-30 w-[150px] md:w-[250px] lg:w-[350px] h-auto"
      />

      <Image
        src={Reog}
        width={350}
        height={350}
        alt="ornament"
        priority
        className="fixed -bottom-12 lg:-bottom-36 left-6 z-20 w-[150px] md:w-[250px] lg:w-[350px] h-auto origin-bottom animate-sway"
      />

      <Image
        src={`/assets/horas/horas-footer-right.png`}
        width={350}
        height={350}
        alt="ornament"
        priority
        className="fixed bottom-0 right-0 z-20 w-[150px] md:w-[250px] lg:w-[350px] h-auto"
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

      <div className="z-30 relative max-w-7xl mx-auto mt-8 mb-8">{children}</div>
    </div>
  );
};

export default JatimLayout;
