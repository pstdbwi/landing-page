"use client";

import Image from "next/image";

interface Props {
  size?: "small" | "default";
}

export function NgopiHeaderSection({ size = "default" }: Props) {
  if (size == "small") {
    return (
      <section className="flex relative flex-col pt-5 gap-10 items-center justify-center w-full px-3 md:px-0">
        <Image
          src="/assets/fesyar/logo-isef-es-fesyar-bi.png"
          height={92}
          width={300}
          alt="Logo ISEF, ES, FESyar, BI"
          priority
        />
        <Image
          src="/assets/wakafein/wakafein-fesyar-sumatera-2.png"
          height={100}
          width={300}
          alt="Wakafein fesyar sumatera 2026"
          className="mix-blend-hard-light max-h-[100px] w-auto"
          priority
        />
      </section>
    );
  }

  return (
    <section className="flex  relative flex-col pt-5 gap-10 items-center justify-center w-full">
      <Image src="/assets/wakafein/logo-topbar.png" height={92} width={636} alt="Logo ISEF, ES, FESyar, BI" priority />
      <Image
        src="/assets/wakafein/wakafein-fesyar-sumatera-2.png"
        height={100}
        width={850}
        alt="Ngopi Title"
        className="mix-blend-hard-light max-h-[100px] w-auto"
        priority
      />
    </section>
  );
}
