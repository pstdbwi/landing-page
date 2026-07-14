"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { GradientText } from "./gradient-text";

const TwinCircleFesyar = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="18" viewBox="0 0 30 18" fill="none">
      <g className="animate-left">
        <circle cx="9" cy="9" r="9" fill="#446365" />
      </g>
      <g className="animate-right">
        <circle cx="21" cy="9" r="9" fill="#cba852" />
      </g>
    </svg>
  );
};

const LoaderPopup = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/50 w-full flex flex-col items-center justify-center z-[9999999]">
      <div className="bg-fesyar-green-500 rounded-lg p-5 flex flex-col justify-center items-center gap-2 relative overflow-hidden">
        <Image src="/assets/fesyar/wastra.png" fill alt="wastra" className="absolute top-0 left-0" />
        <Image src="/assets/fesyar/wastra.png" fill alt="wastra" className="absolute top-0 right-0 scale-x-[-1]" />
        <TwinCircleFesyar />
        <GradientText className="text-lg">Mohon tunggu</GradientText>
      </div>
    </div>,
    document.body,
  );
};

export { LoaderPopup };
