"use client";

import { EPOS_VISUALS, EPOS_VISUALS_DEFAULT } from "@/app/fesyar/epos/epos-visuals";
import { useFeatureFlag } from "@/store/feature-flag-context";
import clsx from "clsx";
import Image from "next/image";

interface Props {
  size?: "small" | "default";
}

export function EposHeaderSection({ size = "default" }: Props) {
  const { currentDomain, specialSectionId } = useFeatureFlag();

  const attributeVisual = specialSectionId ? EPOS_VISUALS[specialSectionId] : undefined;

  const isSmall = size === "small";
  const titleMaxH = isSmall ? "max-h-[80px] md:max-h-[85px]" : "max-h-[80px]";

  return (
    <section
      className={clsx(
        "flex relative flex-col pt-5 gap-10 items-center justify-center w-full",
        isSmall && "px-3 md:px-0",
      )}
    >
      <Image src="/assets/wakafein/logo-topbar.png" height={92} width={636} alt="Logo ISEF, ES, FESyar, BI" priority />

      {currentDomain ? (
        <div className="flex flex-col items-center">
          <Image
            src={attributeVisual?.title ?? EPOS_VISUALS_DEFAULT?.title}
            alt="Wakafein"
            width={700}
            height={400}
            className={clsx("mix-blend-hard-light w-auto", titleMaxH)}
            priority
          />
        </div>
      ) : (
        <div
          className="w-[500px] h-[100px] bg-gray-300 rounded-md animate-pulse"
          aria-label="Loading title image"
        ></div>
      )}
    </section>
  );
}
