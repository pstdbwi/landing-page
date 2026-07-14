"use client";

import Image from "next/image";

interface Props {
  size?: "small" | "default";
}

export function MurabiHeaderSection({ size = "default" }: Props) {
  if (size == "small") {
    return (
      <section className="relative flex w-full flex-col items-center justify-center px-3 md:px-0">
        <div className="relative aspect-[1310/156] w-[min(92vw,640px)]">
          <Image src="/assets/murobbi/top.png" fill className="object-contain" alt="Logo Murobbi" priority />
        </div>
        <Image
          src="/assets/murobbi/gebyar.png"
          width={745}
          height={152}
          alt="Gebyar Muharram 1448"
          priority
          className="mt-2 h-auto w-[min(72vw,560px)]"
        />
      </section>
    );
  }

  return (
    <section className="relative flex w-full flex-col items-center justify-center px-3">
      <div className="relative aspect-[1310/156] w-[min(94vw,1040px)]">
        <Image src="/assets/murobbi/top.png" fill className="object-contain" alt="Logo Murobbi" priority />
      </div>
      <Image
        src="/assets/murobbi/gebyar.png"
        width={745}
        height={152}
        alt="Gebyar Muharram 1448"
        priority
        className="mt-3 h-auto w-[min(72vw,620px)] lg:w-[min(50vw,745px)]"
      />
    </section>
  );
}
