"use client";

import { useFeatureFlag } from "@/store/feature-flag-context";
import Image from "next/image";

import { Fragment } from "react";

export const OrnamentSpecialFesyar = () => {
  const { isSubdomainFesyar, currentDomain } = useFeatureFlag();

  if (!isSubdomainFesyar) return null;

  return (
    <div className="z-0 relative">
      <div className="inset-0 fixed bg-fesyar-green-700 z-0" />
      {currentDomain ? (
        <Fragment>
          {/* pattern */}
          <div>
            <Image
              src={`/assets/fesyar/${currentDomain}/pattern.png`}
              width={1250}
              height={1250}
              alt="ornament"
              className="fixed top-0 right-0 z-0 "
            />
            <Image
              src={`/assets/fesyar/${currentDomain}/pattern.png`}
              width={1250}
              height={1250}
              alt="ornament"
              className="scale-x-[-1] fixed top-0 left-0 z-0"
            />
          </div>

          {/* brush */}
          <div>
            <Image
              src={`/assets/fesyar/${currentDomain}/brush.png`}
              width={350}
              height={350}
              alt="ornament"
              className="fixed right-0 bottom-0 z-10 mix-blend-hard-light"
            />

            <Image
              src={`/assets/fesyar/${currentDomain}/brush.png`}
              width={350}
              height={350}
              alt="ornament"
              className="fixed left-0 scale-x-[-1] bottom-0 z-10  mix-blend-hard-light"
            />
          </div>
        </Fragment>
      ) : null}

      {/* BOTTOM */}
      <div>
        <div>
          <Image
            src={"/assets/fesyar/logo-isef-middle.png"}
            width={350}
            height={350}
            alt="ornament"
            className="fixed  bottom-40 right-0 z-0 mix-blend-screen"
          />
          <Image
            src={"/assets/fesyar/logo-isef-middle.png"}
            width={350}
            height={350}
            alt="ornament"
            className="scale-x-[-1]  bottom-40  fixed  left-0 z-0 mix-blend-screen"
          />
        </div>
        <Image
          src={`/assets/fesyar/ornament/shade-bottom.png`}
          width={300}
          height={900}
          alt="ornament"
          className="fixed bottom-0 z-0 left-1/2 -translate-x-1/2 blur-md flex-shrink-0 "
        />
        <Image
          src={`/assets/fesyar/ornament/burgundy.png`}
          width={0}
          height={0}
          alt="ornament"
          className="fixed bottom-0 w-full h-auto right-0 left-0 z-1"
        />
        <Image
          src={"/assets/fesyar/logo-isef-bottom.png"}
          width={350}
          height={350}
          alt="ornament"
          className=" bottom-0  fixed  left-1/2 -translate-x-1/2  z-0 mix-blend-screen"
        />
        {/* ribbon */}
        <div>
          <Image
            src={`/assets/fesyar/ornament/ribbon.png`}
            width={600}
            height={600}
            alt="ornament"
            className="fixed right-0 bottom-0 z-3 mix-blend-screen opacity-50"
          />
          <Image
            src={`/assets/fesyar/ornament/ribbon.png`}
            width={600}
            height={600}
            alt="ornament"
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
            className="fixed right-0 bottom-0 z-4"
          />
          <Image
            src={`/assets/fesyar/ornament/shade-red.png`}
            width={500}
            height={500}
            alt="ornament"
            className="fixed left-0 scale-x-[-1] bottom-0 z-4 "
          />
        </div>
      </div>
    </div>
  );
};

export const OrnamentSpecialFesyarInnerMobile = () => {
  const { isSubdomain, currentDomain } = useFeatureFlag();

  if (!isSubdomain) return null;
  return (
    <Fragment>
      {currentDomain ? (
        <Fragment>
          {/* Background pattern kanan */}
          {currentDomain && (
            <div
              className="absolute inset-0 z-0 bg-repeat bg-right pointer-events-none select-none invert"
              style={{
                backgroundImage: `url('/assets/fesyar/${currentDomain}/pattern-mobile.png')`,
                backgroundSize: "250px 250px",
              }}
            />
          )}

          {/* Background pattern kiri (dibalik) */}
          {currentDomain && (
            <div
              className="absolute inset-0 z-0 bg-repeat bg-left pointer-events-none select-none scale-x-[-1] invert"
              style={{
                backgroundImage: `url('/assets/fesyar/${currentDomain}/pattern-mobile.png')`,
                backgroundSize: "250px 250px",
              }}
            />
          )}

          <Image
            src={`/assets/fesyar/${currentDomain}/brush.png`}
            width={250}
            height={250}
            alt="ornament"
            className="absolute right-0 -bottom-5 z-0 mix-blend-hard-light"
          />

          <Image
            src={`/assets/fesyar/${currentDomain}/brush.png`}
            width={250}
            height={250}
            alt="ornament"
            className="absolute left-0 scale-x-[-1] -bottom-5 z-0  mix-blend-hard-light"
          />
        </Fragment>
      ) : null}
    </Fragment>
  );
};
