"use client";

import ReactSelect2 from "@/components/Select/react-select";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import clsx from "clsx";
import { Filter } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useRef, useState } from "react";

type Props = {
  isOpen: boolean;
  isVisible: boolean;
  topics: string[];
  onClose: () => void;
  onToggle: () => void;
};

export function EposFilterBar({ isOpen, isVisible, topics, onClose, onToggle }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const currentTopic = searchParams.get("topic") || "";
  const [selectedTopic, setSelectedTopic] = useState<string>(currentTopic);
  const router = useRouter();
  const pathname = usePathname();
  const topicQueryParams = searchParams.get("topic") || "";
  const isTopicEmpty = useMemo(() => !selectedTopic && !topicQueryParams, [selectedTopic, topicQueryParams]);

  const topicOptions = useMemo(() => {
    return topics.map((t) => ({
      label: t.charAt(0).toUpperCase() + t.slice(1), // kapitalisasi huruf pertama
      value: t.toLowerCase(),
    }));
  }, [topics]);

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams?.toString());
    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    return params.toString();
  };

  const handleClose = () => {
    if (isTopicEmpty) {
      onClose();
    }
  };

  const handleTopicChange = (option: { label: string; value: string } | null) => {
    const topic = option?.value || "";
    setSelectedTopic(topic);

    const queryString = createQueryString("topic", topic);
    router.push(pathname + (queryString ? `?${queryString}` : ""), { scroll: false });
  };

  useClickOutside(wrapperRef, handleClose, isOpen);
  useEscapeKey(handleClose, isOpen);

  return (
    <div className="flex items-center gap-2">
      {/* Tombol Filter (hanya muncul kalau dropdown tertutup) */}
      {!isOpen && (
        <button
          type="button"
          aria-label="Open filter"
          aria-expanded={isOpen}
          onClick={onToggle}
          className={clsx(
            "text-xs lg:text-base flex items-center gap-1 py-1.5 px-3 font-medium rounded-lg bg-fesyar-gold hover:opacity-90 tracking-wide text-fesyar-green-500 transition-all duration-200",
          )}
        >
          <Filter className="w-4 h-4" /> Filter
        </button>
      )}

      {/* Dropdown Filter (muncul menggantikan tombol) */}
      {isOpen && (
        <div ref={wrapperRef} className="w-[200px] transition-all duration-300 ease-in-out">
          <ReactSelect2
            name="topic"
            placeholder="Pilih Topik"
            className="h-9 w-full text-xs"
            value={topicOptions.find((t) => t.value === selectedTopic) || null}
            options={topicOptions}
            onChange={handleTopicChange}
            isClearable
          />
        </div>
      )}
    </div>
  );
}
