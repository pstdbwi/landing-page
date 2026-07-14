"use client";

import Image from "next/image";
import React from "react";
import MurabiHeader from "./murabi-header";

interface LayoutMurabiProps {
  children: React.ReactNode;
  header?: boolean;
  footer: "landing-page" | "detail-page";
  params?: any;
  tnc?: boolean;
}

const LayoutMurabi = ({ children, header = true, footer, params, tnc = true }: LayoutMurabiProps) => {
  return (
    <div>
      <div
        className="inset-0 fixed"
        style={{
          background: "radial-gradient(circle at center, #0C4C55 0%, #001F2D 100%)",
        }}
      />

      {header ? <MurabiHeader /> : null}

      {/* MUROBBI LAMP ORNAMENT */}
      <Image
        src="/assets/murobbi/lamp-left-right.png"
        width={504}
        height={272}
        alt="ornament"
        priority
        className="pointer-events-none fixed left-0 top-0 z-20 h-auto w-[160px] sm:w-[220px] md:w-[300px] lg:w-[420px] xl:w-[504px]"
      />
      <Image
        src="/assets/murobbi/lamp-left-right.png"
        width={504}
        height={272}
        alt="ornament"
        priority
        className="pointer-events-none fixed right-0 top-0 z-20 h-auto w-[160px] scale-x-[-1] sm:w-[220px] md:w-[300px] lg:w-[420px] xl:w-[504px]"
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

      {/* MUROBBI BOTTOM SIDE ORNAMENT */}
      <Image
        src="/assets/murobbi/ornament-bottom-left-right.png"
        width={113}
        height={627}
        alt="ornament"
        priority
        className="pointer-events-none fixed bottom-0 left-0 z-20 h-[42vh] max-h-[627px] w-auto sm:h-[50vh] lg:h-[62vh]"
      />
      <Image
        src="/assets/murobbi/ornament-bottom-left-right.png"
        width={113}
        height={627}
        alt="ornament"
        priority
        className="pointer-events-none fixed bottom-0 right-0 z-20 h-[42vh] max-h-[627px] w-auto scale-x-[-1] sm:h-[50vh] lg:h-[62vh]"
      />
      <Image
        src="/assets/murobbi/bottom-ornament.png"
        width={671}
        height={218}
        alt="ornament"
        priority
        className="pointer-events-none fixed bottom-0 left-1/2 z-20 h-auto w-[78vw] max-w-[671px] -translate-x-1/2 sm:w-[58vw] lg:w-[42vw]"
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

export default LayoutMurabi;
