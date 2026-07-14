"use client";

import { useFeatureFlag } from "@/store/feature-flag-context";
import Image from "next/image";
import React from "react";
import KalbarTopbar from "./kalbar-topbar";

interface KalbarLayoutProps {
  children: React.ReactNode;
  footer: "landing-page" | "detail-page";
}

const KalbarLayout = ({ children, footer }: KalbarLayoutProps) => {
  const { currentDomain } = useFeatureFlag();

  return (
    <div>
      <div className="inset-0 fixed bg-fesyar-green-700" />

      <div className="pt-8 lg:pt-16">
        <KalbarTopbar />
      </div>

      {/* ornament */}
      <div>
        <Image
          src={`/assets/fesyar/ornament/shade-top.png`}
          width={400}
          height={400}
          alt="ornament"
          priority
          className="fixed top-0 left-1/2 -translate-x-1/2  z-0"
        />

        {currentDomain ? (
          <>
            {/* pattern */}
            <div>
              <Image
                src={`/assets/berwakaf/${currentDomain}/pattern.png`}
                width={1250}
                height={1250}
                alt="pattern right"
                className="fixed top-0 right-0 z-0 "
              />
              <Image
                src={`/assets/berwakaf/${currentDomain}/pattern.png`}
                width={1250}
                height={1250}
                alt="pattern left"
                className="scale-x-[-1] fixed top-0 left-0 z-0"
              />
            </div>

            {/* brush */}
            <div>
              <Image
                src={`/assets/berwakaf/${currentDomain}/brush.png`}
                width={350}
                height={350}
                alt="brush right"
                className="fixed right-0 bottom-0 z-10 "
              />

              <Image
                src={`/assets/berwakaf/${currentDomain}/brush.png`}
                width={350}
                height={350}
                alt="brush left"
                className="fixed left-0 scale-x-[-1] bottom-0 z-10  "
              />
            </div>
          </>
        ) : null}

        {/* shade corner */}
        <div>
          <Image
            src={`/assets/fesyar/ornament/shade-corner.png`}
            width={500}
            height={500}
            alt="shade right"
            priority
            className="fixed top-0 right-0 z-1 blur-2xl opacity-50"
          />
          <Image
            src={`/assets/fesyar/ornament/shade-corner.png`}
            width={500}
            height={500}
            alt="shade left"
            priority
            className="fixed top-0 left-0 scale-x-[-1] z-1 blur-2xl opacity-50"
          />
        </div>

        {/* shade middle */}
        <div>
          <Image
            src={"/assets/fesyar/ornament/shade-middle.png"}
            width={700}
            height={700}
            alt="shade middle"
            priority
            className="scale-x-[-1] top-1/2 -translate-y-1/2 fixed  left-0 z-0 opacity-50 blur-2xl "
          />
          <Image
            src={"/assets/fesyar/ornament/shade-middle.png"}
            width={700}
            height={700}
            alt="shade middle 2"
            priority
            className="fixed top-1/2 -translate-y-1/2 right-0 z-0 blur-2xl opacity-50"
          />
        </div>

        {/* shade bottom & burgundy */}
        {footer === "landing-page" ? (
          <div>
            <Image
              src={`/assets/fesyar/ornament/shade-bottom.png`}
              width={300}
              height={900}
              alt="shade bottom"
              priority
              className="fixed bottom-0 z-0 left-1/2 -translate-x-1/2 blur-md flex-shrink-0 "
            />
            <Image
              src={`/assets/fesyar/ornament/burgundy.png`}
              width={0}
              height={0}
              alt="sahde bottom 2"
              priority
              className="fixed bottom-0 w-full h-auto right-0 left-0 z-1"
            />
          </div>
        ) : null}

        {/* logo isef */}
        {footer === "landing-page" ? (
          <div>
            <Image
              src={"/assets/fesyar/logo-isef-middle.png"}
              width={350}
              height={350}
              alt="isef"
              priority
              className="fixed  bottom-40 right-0 z-0 mix-blend-screen"
            />
            <Image
              src={"/assets/fesyar/logo-isef-middle.png"}
              width={350}
              height={350}
              alt="isef bottom"
              priority
              className="scale-x-[-1]  bottom-40  fixed  left-0 z-0 mix-blend-screen"
            />
          </div>
        ) : footer === "detail-page" ? (
          <Image
            src={"/assets/fesyar/logo-isef-bottom.png"}
            width={350}
            height={350}
            alt="isef bottom detail page"
            className=" bottom-0  fixed  left-1/2 -translate-x-1/2  z-0 mix-blend-screen"
          />
        ) : null}

        {/* shade yellow */}
        <div>
          <Image
            src={`/assets/fesyar/ornament/shade-yellow.png`}
            width={500}
            height={500}
            alt="ornament"
            className=" fixed right-0 bottom-0 z-2 opacity-50"
          />
          <Image
            src={`/assets/fesyar/ornament/shade-yellow.png`}
            width={500}
            height={500}
            alt="ornament"
            className=" fixed left-0 scale-x-[-1] bottom-0 z-2 opacity-50"
          />
        </div>

        {/* ribbon */}
        <div>
          <Image
            src={`/assets/fesyar/ornament/ribbon.png`}
            width={600}
            height={600}
            alt="ornament"
            priority
            className="fixed right-0 bottom-0 z-3 mix-blend-screen opacity-50"
          />
          <Image
            src={`/assets/fesyar/ornament/ribbon.png`}
            width={600}
            height={600}
            alt="ornament"
            priority
            className="fixed left-0 scale-x-[-1] bottom-0 z-3 mix-blend-screen opacity-50"
          />
        </div>

        {/* shade red */}
        <div>
          <Image
            src={`/assets/fesyar/ornament/shade-red.png`}
            width={500}
            height={500}
            alt="ornament"
            priority
            className="fixed right-0 bottom-0 z-4"
          />
          <Image
            src={`/assets/fesyar/ornament/shade-red.png`}
            width={500}
            height={500}
            alt="ornament"
            priority
            className="fixed left-0 scale-x-[-1] bottom-0 z-4 "
          />
        </div>
      </div>

      <div className="z-20 relative max-w-7xl mx-auto px-3 mt-8 mb-8">{children}</div>
    </div>
  );
};

export default KalbarLayout;
