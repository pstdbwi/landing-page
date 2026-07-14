"use client";

import Image from "next/image";

interface Props {
  size?: "small" | "default";
  logoUrl?: string;
  titleImageUrl?: string;
  titleText?: string;
}

export function NgopiHeaderSection({
  size = "default",
  logoUrl = "/assets/wakafein/logo-topbar.png",
  titleImageUrl = "/assets/wakafein/wakafein-fesyar-sumatera-2.png",
  titleText = "WAKAFein FESyar Sumatera 2026",
}: Props) {
  if (size == "small") {
    return (
      <section className="flex relative flex-col pt-5 gap-10 items-center justify-center w-full px-3 md:px-0">
        <Image src={logoUrl} height={92} width={300} alt="Logo" priority />
        {titleImageUrl ? (
          <Image
            src={titleImageUrl}
            height={100}
            width={300}
            alt={titleText}
            className="mix-blend-hard-light max-h-[100px] w-auto"
            priority
          />
        ) : (
          <h1 className="max-w-3xl text-center text-3xl font-bold text-[#DAB95A]">{titleText}</h1>
        )}
      </section>
    );
  }

  return (
    <section className="flex  relative flex-col pt-5 gap-10 items-center justify-center w-full">
      <Image src={logoUrl} height={92} width={636} alt="Logo" priority />
      {titleImageUrl ? (
        <Image
          src={titleImageUrl}
          height={100}
          width={850}
          alt={titleText}
          className="mix-blend-hard-light max-h-[100px] w-auto"
          priority
        />
      ) : (
        <h1 className="max-w-5xl text-center text-5xl font-bold text-[#DAB95A]">{titleText}</h1>
      )}
    </section>
  );
}
