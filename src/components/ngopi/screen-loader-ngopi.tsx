"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { GradientText } from "../fesyar/gradient-text";

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

const ScreenLoaderNgopi = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/50 w-full flex flex-col items-center justify-center z-[9999999]">
      <div className="bg-[#071c3d] rounded-lg p-5 flex flex-col justify-center items-center gap-2 relative overflow-hidden">
        <Image
          src="/assets/wakafein/flower.png"
          width={1200}
          height={600}
          alt="wastra"
          className="pointer-events-none absolute left-0 top-0 h-auto w-[50%] max-w-[220px] opacity-65 scale-y-[-1]"
        />
        <Image
          src="/assets/wakafein/flower.png"
          width={1200}
          height={600}
          alt="wastra"
          className="pointer-events-none absolute right-0 top-0 h-auto w-[50%] max-w-[220px] scale-x-[-1] opacity-65 scale-y-[-1]"
        />
        <TwinCircleFesyar />
        <GradientText className="text-lg">Mohon tunggu</GradientText>
      </div>
    </div>,
    document.body,
  );
};

export { ScreenLoaderNgopi };
