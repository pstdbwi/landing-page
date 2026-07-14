"use client";

import { useFeatureFlag } from "@/store/feature-flag-context";
import Image from "next/image";

interface Props {
  size?: "small" | "default";
}

export function IkhtiarHeaderSection({ size = "default" }: Props) {
  const { currentDomain } = useFeatureFlag();

  if (size == "small") {
    return (
      <section className="flex relative flex-col pt-5 gap-10 items-center justify-center w-full px-3 md:px-0">
        <div className="flex items-center gap-4">
          <div className="relative h-[50px] w-[140px] md:h-[80px] md:w-[200px]">
            <Image src="/assets/bi-horizontal-white.png" fill className="object-contain" alt="Logo BI" priority />
          </div>
          <div className="relative h-[40px] w-[40px] md:h-[65px] md:w-[65px]">
            <Image src="/assets/bi-religi.png" fill className="object-contain" alt="Logo BI Religi" priority />
          </div>
          <div className="relative h-[35px] w-[35px] md:h-[60px] md:w-[60px]">
            <Image src="/assets/rabbani-1447.png" fill className="object-contain" alt="Logo Rabbani 1447H" priority />
          </div>
        </div>

        {currentDomain ? (
          <Image
            src={`/assets/ikhtiar-1447h.png`}
            height={100}
            width={300}
            alt="Ikhtiar Ramadhan 1447H"
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

  return (
    <section className="flex relative flex-col pt-5 gap-10 items-center justify-center w-full">
      <div className="flex items-center gap-4">
        <div className="relative h-[50px] w-[140px] md:h-[80px] md:w-[200px]">
          <Image src="/assets/bi-horizontal-white.png" fill className="object-contain" alt="Logo BI" priority />
        </div>
        <div className="relative h-[40px] w-[40px] md:h-[65px] md:w-[65px]">
          <Image src="/assets/bi-religi.png" fill className="object-contain" alt="Logo BI Religi" priority />
        </div>
        <div className="relative h-[35px] w-[35px] md:h-[60px] md:w-[60px]">
          <Image src="/assets/rabbani-1447.png" fill className="object-contain" alt="Logo Rabbani 1447H" priority />
        </div>
      </div>

      {currentDomain ? (
        <Image
          src={`/assets/ikhtiar-1447h.png`}
          height={100}
          width={600}
          alt="Ikhtiar Ramadhan 1447H"
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
