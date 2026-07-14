"use client";

import { GradientText } from "@/components/fesyar/gradient-text";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const TwinCircleMurabi = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="18" viewBox="0 0 30 18" fill="none">
      <g className="animate-left">
        <circle cx="9" cy="9" r="9" fill="#0C4C55" />
      </g>
      <g className="animate-right">
        <circle cx="21" cy="9" r="9" fill="#DAB95A" />
      </g>
    </svg>
  );
};

const murabiLoaderStyle = {
  background: "radial-gradient(circle at center, #0C4C55 0%, #001F2D 100%)",
};

const MurabiScreenLoading = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999999] flex w-full flex-col items-center justify-center bg-black/50">
      <div
        className="relative flex w-[200px] flex-col items-center justify-center gap-2 overflow-hidden rounded-lg p-5 text-white shadow-xl"
        style={murabiLoaderStyle}
      >
        <Image
          src="/assets/murobbi/ornament-bottom-left-right.png"
          width={113}
          height={627}
          alt="ornament"
          className="pointer-events-none absolute bottom-0 left-0 z-0 h-[80%] max-h-[627px] w-auto"
        />
        <Image
          src="/assets/murobbi/ornament-bottom-left-right.png"
          width={113}
          height={627}
          alt="ornament"
          className="pointer-events-none absolute bottom-0 right-0 z-0 h-[80%] max-h-[627px] w-auto scale-x-[-1]"
        />
        <div className="relative z-10 flex flex-col items-center gap-2">
          <TwinCircleMurabi />
          <GradientText className="text-lg">Mohon tunggu</GradientText>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export { MurabiScreenLoading };
