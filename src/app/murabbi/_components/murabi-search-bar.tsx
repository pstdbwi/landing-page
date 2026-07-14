"use client";

import { Input } from "@/components/Input";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import clsx from "clsx";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  isOpen: boolean;
  isVisible: boolean;
  onToggle: () => void;
  onClose: () => void;
};

export function MurabiSearchBar({ isOpen, isVisible, onToggle, onClose }: Props) {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState("");
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchQueryParams = searchParams.get("search") || "";

  const isSearchEmpty = useMemo(() => !inputValue && !searchQueryParams, [inputValue, searchQueryParams]);

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams?.toString());
    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    return params.toString();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchQuery = e.target.value;
    setInputValue(searchQuery);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      const queryString = createQueryString("search", searchQuery);
      router.push(pathname + (queryString ? `?${queryString}` : ""), { scroll: false });
    }, 500);
  };

  const handleClose = () => {
    if (isSearchEmpty) {
      onClose();
    }
  };

  useEffect(() => {
    setInputValue(searchQueryParams);
  }, [searchQueryParams]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  useClickOutside(wrapperRef, handleClose, isOpen);
  useEscapeKey(handleClose, isOpen);

  return (
    <div ref={wrapperRef} className="relative flex items-center w-full lg:max-w-xs">
      <button
        type="button"
        aria-label="Open search"
        aria-expanded={isOpen}
        onClick={onToggle}
        className={clsx(
          "text-xs lg:text-sm flex items-center gap-1 py-1.5 px-3 font-medium rounded-lg bg-fesyar-gold hover:opacity-90 tracking-wide text-fesyar-green-500 transition-all duration-200",
          isOpen ? "invisible absolute opacity-0" : "visible static opacity-100",
        )}
      >
        <Search className="w-4 h-4" /> Pencarian
      </button>

      <div className={clsx("overflow-hidden transition-all duration-300 ease-in-out", isOpen ? "w-64" : "w-0")}>
        <div
          className={clsx(
            "origin-left transform-gpu will-change-transform transition-all duration-300 ease-in-out",
            isVisible ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0",
          )}
        >
          <Input
            ref={searchInputRef}
            placeholder="Cari Wakaf"
            aria-label="Cari Wakaf"
            value={inputValue}
            onChange={handleInputChange}
            className="w-full text-xs"
          />
        </div>
      </div>
    </div>
  );
}
