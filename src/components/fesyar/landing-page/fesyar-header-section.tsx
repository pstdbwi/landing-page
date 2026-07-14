"use client";

import { useFeatureFlag } from "@/store/feature-flag-context";
import Image from "next/image";

export function FesyarHeaderSection() {
  const { currentDomain } = useFeatureFlag();

  return (
    <section className="flex  relative flex-col pt-5 gap-10 items-center justify-center w-full">
      <Image
        src="/assets/fesyar/logo-isef-es-fesyar-bi.png"
        height={92}
        width={300}
        alt="Logo ISEF, ES, FESyar, BI"
        priority
      />
      {currentDomain ? (
        <Image
          src={`/assets/fesyar/${currentDomain}/title.png`}
          height={100}
          width={850}
          alt="FESyar Title"
          className="mix-blend-hard-light max-h-[100px] w-auto"
          priority
        />
      ) : (
        <div
          className="w-[500px] h-[100px] bg-gray-300 rounded-md animate-pulse"
          aria-label="Loading title image"
        ></div>
      )}
    </section>
  );
}
