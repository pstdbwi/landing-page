"use client";

import Image from "next/image";
import React from "react";
import { ICShadeBrown } from "./ic-shade";
import IkhtiarHeader from "./ikhtiar-header";

interface LayoutIkhtiarProps {
  children: React.ReactNode;
  header?: boolean;
  footer: "landing-page" | "detail-page";
  params?: any;
  tnc?: boolean;
}

const LayoutIkhtiar = ({ children, header = true, footer, params, tnc = true }: LayoutIkhtiarProps) => {
  return (
    <div>
      <div className="inset-0 fixed bg-[radial-gradient(circle_at_center,_theme(colors.fesyar.green.50),#00484C)]" />

      {header ? <IkhtiarHeader /> : null}

      {/* ORNAMENT LAMPION SMALL TOP LEFT */}
      <Image
        src={`/assets/ikhtiar/ikhtiar-lampion-small-left-top.png`}
        width={400}
        height={400}
        alt="ornament"
        priority
        className="fixed top-0 left-0 z-20 w-[100px] md:w-[200px] lg:w-[400px] h-auto"
      />

      {/* ORNAMENT LAMPION BIG TOP LEFT */}
      <Image
        src={`/assets/ikhtiar/ikhtiar-lampion-big-left-top.png`}
        width={50}
        height={50}
        alt="ornament"
        priority
        className="fixed top-0 left-10 z-20 w-[20px] md:w-[35px] lg:w-[50px] h-auto"
      />

      {/* ORNAMENT LAMPION SMALL TOP RIGHT */}
      <Image
        src={`/assets/ikhtiar/ikhtiar-lampion-small-right-top.png`}
        width={400}
        height={400}
        alt="ornament"
        priority
        className="fixed top-0 right-0 z-20 w-[100px] md:w-[200px] lg:w-[400px] h-auto"
      />

      {/* ORNAMENT LAMPION BIG TOP RIGHT */}
      <Image
        src={`/assets/ikhtiar/ikhtiar-lampion-big-right-top.png`}
        width={50}
        height={50}
        alt="ornament"
        priority
        className="fixed top-0 right-10 z-20 w-[20px] md:w-[35px] lg:w-[50px] h-auto"
      />

      {/* IKHTIAR TOP LEFT */}
      <Image
        src={`/assets/ikhtiar/ikhtiar-left-top.png`}
        width={400}
        height={400}
        alt="ornament"
        priority
        className="fixed top-0 left-0 z-10 w-[150px] md:w-[250px] lg:w-[400px] h-auto"
      />

      {/* IKHTIAR TOP RIGHT */}
      <Image
        src={`/assets/ikhtiar/ikhtiar-right-top.png`}
        width={400}
        height={400}
        alt="ornament"
        priority
        className="fixed top-0 right-0 z-10 w-[150px] md:w-[250px] lg:w-[400px] h-auto"
      />

      {/* SILUET MASJID */}
      <Image
        src={`/assets/ikhtiar/ikhtiar-siluet-masjid.png`}
        width={1900}
        height={400}
        alt="ornament"
        priority
        className="fixed w-full bottom-16 left-0 z-10 object-cover"
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
        src={`/assets/ikhtiar/ikhtiar-lampion-bottom-left.png`}
        width={300}
        height={300}
        alt="ornament"
        priority
        className="fixed bottom-0 left-0 z-20 w-[100px] md:w-[200px] lg:w-[300px] h-auto"
      />

      {/* IKHTIAR ORNAMET FOOTER RIGHT */}
      <Image
        src={`/assets/ikhtiar/ikhtiar-lampion-bottom-right.png`}
        width={150}
        height={150}
        alt="ornament"
        priority
        className="fixed bottom-0 right-0 z-20 w-[50px] md:w-[100px] lg:w-[150px] h-auto"
      />

      {/* BEDUG RIGHT BOTTOM */}
      <Image
        src={`/assets/ikhtiar/ikhtiar-bedug.png`}
        width={250}
        height={250}
        alt="ornament"
        priority
        className="fixed bottom-0 right-8 z-20 w-[80px] md:w-[150px] lg:w-[250px] h-auto"
      />

      {/* MUSHAF LEFT BOTTOM */}
      <Image
        src={`/assets/ikhtiar/ikhtiar-mushaf.png`}
        width={220}
        height={220}
        alt="ornament"
        priority
        className="fixed bottom-4 left-20 z-10 w-[70px] md:w-[140px] lg:w-[220px] h-auto"
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
          <Image
            src="/assets/bank-indonesia-logo-white.svg"
            width={150}
            height={150}
            alt="Bank Indonesia"
            className="object-contain"
          />
          <Image src="/assets/bwi-logo.png" width={50} height={50} alt="BWI" className="object-contain" />
        </div>
      ) : null}
    </div>
  );
};

export default LayoutIkhtiar;
