"use client";

import ReactSelect2 from "@/components/Select/react-select";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import useSearchParamsEntries from "@/lib/use-searchparams-entries";
import { qs } from "@/lib/utils";
import clsx from "clsx";
import { Grid2x2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef } from "react";

type Props = {
  isOpen: boolean;
  isVisible: boolean;
  onClose: () => void;
  onToggle: () => void;
};

const CATEGORY_OPTIONS = [
  { value: "3", label: "Berita" },
  { value: "4", label: "Artikel" },
  { value: "5", label: "Video" },
];

export function SharedContentCategory({ isOpen, isVisible, onClose, onToggle }: Props) {
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { content_type = "", ...params } = useSearchParamsEntries();

  const handleClose = () => {
    onClose();
  };

  useClickOutside(wrapperRef, handleClose, isOpen);
  useEscapeKey(handleClose, isOpen);

  return (
    <div className="relative flex items-center w-full max-w-xs justify-end">
      <button
        type="button"
        aria-label="Open filter"
        aria-expanded={isOpen}
        onClick={onToggle}
        className={clsx(
          "text-xs lg:text-sm flex items-center gap-1 py-1.5 px-3 font-medium rounded-lg bg-fesyar-gold hover:opacity-90 tracking-wide text-fesyar-green-500 transition-all duration-200",
          isOpen ? "opacity-0 pointer-events-none absolute" : "opacity-100 pointer-events-auto relative",
        )}
      >
        <Grid2x2Icon className="w-3 lg:w-4" /> Kategori
      </button>

      <div
        className={clsx(
          "absolute right-0 top-1/2 -translate-y-1/2 transition-all duration-300 ease-out",
          isOpen ? "opacity-100 scale-100" : "w-0 opacity-0 scale-95 pointer-events-none",
        )}
        style={{
          transformOrigin: "right center",
          zIndex: 50,
        }}
      >
        <div
          ref={wrapperRef}
          className={clsx(
            "h-9 flex items-center duration-300 ease-in-out overflow-visible",
            isVisible ? "visible" : "invisible",
          )}
        >
          <div
            className={clsx(
              "min-w-[200px] transition-all origin-right duration-300 ease-in-out",
              isVisible ? "opacity-100 scale-x-100 " : "opacity-0 scale-x-0 ",
            )}
          >
            <ReactSelect2
              name="topic"
              placeholder="Semua Kategori"
              className="h-9 w-full text-xs max-w-xs"
              value={CATEGORY_OPTIONS.find((item) => item?.value == content_type) || null}
              options={CATEGORY_OPTIONS}
              onChange={(val) => router.push("?" + qs({ ...params, content_type: val?.value || "" }))}
              isClearable
            />
          </div>
        </div>
      </div>
    </div>
  );
}
