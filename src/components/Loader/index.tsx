import { TwinCircle } from "@/components/Icon/svg";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const ScreenLoader = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/30 w-full flex flex-col items-center justify-center z-[9999]">
      <div className="bg-white rounded-lg p-5 flex flex-col justify-center items-center gap-2">
        <TwinCircle />
        <span>Mohon tunggu</span>
      </div>
    </div>,
    document.body
  );
};

export { ScreenLoader };
