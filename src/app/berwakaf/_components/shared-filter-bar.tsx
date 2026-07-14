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

export function SharedFilterBar({ isOpen, isVisible, topics, onClose, onToggle }: Props) {
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
        <Filter className="w-4 lg:w-5" /> Filter
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
              placeholder="Pilih Topik"
              className="h-9 w-full text-xs max-w-xs"
              value={topicOptions.find((t) => t.value === selectedTopic) || null}
              options={topicOptions}
              onChange={handleTopicChange}
              isClearable
            />
          </div>
        </div>
      </div>
    </div>
  );
}
