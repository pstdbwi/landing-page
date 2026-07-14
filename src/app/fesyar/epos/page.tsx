"use client";

import ReactSelectFesyar from "@/components/fesyar/react-select-fesyar";
import { EposCampaignSection } from "@/components/shared-program/epos/epos-campaign-section";
import { EposHeaderSection } from "@/components/shared-program/epos/epos-header-section";
import LayoutEpos from "@/components/shared-program/epos/epos-layout";
import { EposSearchBar } from "@/components/shared-program/epos/epos-search-bar";
import EposSorting from "@/components/shared-program/epos/epos-sorting";
import { useActiveProgram } from "@/hooks/useActiveProgram";
import { useTogglePanel } from "@/hooks/useTogglePanel";
import useSearchParamsEntries from "@/lib/use-searchparams-entries";
import { qs } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";

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
    <LayoutEpos footer="landing-page" header={false} tnc={true}>
      <EposHeaderSection />

      <section className="bg-transparent max-w-7xl mx-auto flex flex-col md:flex-row justify-between mt-5 gap-3 items-stretch md:items-center px-3 md:px-0">
        <EposSearchBar
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

        <EposSorting
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

      <EposCampaignSection />
    </LayoutEpos>
  );
}
