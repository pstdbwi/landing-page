"use client";

import { useTogglePanel } from "@/hooks/useTogglePanel";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { MurabiCampaignSection } from "./_components/murabi-campaign-section";
import { MurabiHeaderSection } from "./_components/murabi-header-section";
import LayoutMurabi from "./_components/murabi-layout";
import { MurabiSearchBar } from "./_components/murabi-search-bar";
import MurabiSorting from "./_components/murabi-sorting";

export default function LandingPage() {
  const { open, close, toggle, isOpen, isVisible } = useTogglePanel();

  const searchParams = useSearchParams();
  const searchQueryParams = searchParams.get("search") ?? "";
  const topicQueryParams = searchParams.get("topic") ?? "";

  useEffect(() => {
    if (searchQueryParams) open("search");
  }, [searchQueryParams, open]);

  useEffect(() => {
    if (topicQueryParams) open("filter");
  }, [topicQueryParams, open]);

  return (
    <LayoutMurabi footer="landing-page" header={false}>
      <MurabiHeaderSection />

      <section className="bg-transparent max-w-7xl mx-auto flex justify-between mt-5 gap-3 items-center px-3 md:px-0 ">
        <MurabiSearchBar
          isOpen={isOpen("search")}
          isVisible={isVisible("search")}
          onToggle={() => toggle("search")}
          onClose={() => close("search")}
        />

        <div className="flex items-center gap-2">
          <MurabiSorting
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
        </div>
      </section>

      <MurabiCampaignSection />
    </LayoutMurabi>
  );
}
