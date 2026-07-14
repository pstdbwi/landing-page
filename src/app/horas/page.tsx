"use client";

import ReactSelectFesyar from "@/components/fesyar/react-select-fesyar";
import { useActiveProgram } from "@/hooks/useActiveProgram";
import { useTogglePanel } from "@/hooks/useTogglePanel";
import useSearchParamsEntries from "@/lib/use-searchparams-entries";
import { qs } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { HorasCampaignSection } from "./_components/horas-campaign-section";
import { HorasHeaderSection } from "./_components/horas-header-section";
import LayoutHoras from "./_components/horas-layout";
import { HorasSearchBar } from "./_components/horas-search-bar";
import HorasSorting from "./_components/horas-sorting";

export default function LandingPage() {
  const { open, close, toggle, isOpen, isVisible } = useTogglePanel();
  const { activeProgram, programOptions } = useActiveProgram();
  const router = useRouter();
  const pathname = usePathname();
  const { search = "", topic = "", ...entriesParams } = useSearchParamsEntries();

  const handleProgramChange = useCallback(
    (option: any | null) => {
      router.push(pathname + `?${qs({ ...entriesParams, search, topic, special_section_id: option?.value || "" })}`, {
        scroll: false,
      });
    },
    [entriesParams, search, topic, pathname, router],
  );

  useEffect(() => {
    if (search) open("search");
  }, [search, open]);

  useEffect(() => {
    if (topic) open("filter");
  }, [topic, open]);

  return (
    <LayoutHoras footer="landing-page" header={false}>
      <HorasHeaderSection />

      <section className="bg-transparent max-w-7xl mx-auto flex flex-col md:flex-row justify-between mt-5 gap-3 items-stretch md:items-center px-3 md:px-0">
        <HorasSearchBar
          isOpen={isOpen("search")}
          isVisible={isVisible("search")}
          onToggle={() => toggle("search")}
          onClose={() => close("search")}
          className="order-2 md:order-1"
        />

        {programOptions.length > 0 && (
          <div className="w-full sm:max-w-xs order-1 md:order-2 md:ml-auto mr-2">
            <ReactSelectFesyar
              name="special_section_id"
              placeholder="Pilih Program"
              options={programOptions}
              value={activeProgram}
              onChange={handleProgramChange}
              isClearable
              variant="gold"
              className="text-xs text-center"
            />
          </div>
        )}

        <HorasSorting
          className="w-full sm:w-ft order-3 md:order-3"
          options={[
            {
              value: "title",
              label: "Nama Program",
            },
            {
              value: "total_donation_amount",
              label: "Donasi Terkumpul",
            },
          ]}
        />
      </section>

      <HorasCampaignSection />
    </LayoutHoras>
  );
}
