"use client";

import { useTogglePanel } from "@/hooks/useTogglePanel";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { IkhtiarCampaignSection } from "./_components/ikhtiar-campaign-section";
import { IkhtiarHeaderSection } from "./_components/ikhtiar-header-section";
import LayoutIkhtiar from "./_components/ikhtiar-layout";
import { IkhtiarSearchBar } from "./_components/ikhtiar-search-bar";
import IkhtiarSorting from "./_components/ikhtiar-sorting";

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
    <LayoutIkhtiar footer="landing-page" header={false}>
      <IkhtiarHeaderSection />

      <section className="bg-transparent max-w-7xl mx-auto flex justify-between mt-5 gap-3 items-center px-3 md:px-0 ">
        <IkhtiarSearchBar
          isOpen={isOpen("search")}
          isVisible={isVisible("search")}
          onToggle={() => toggle("search")}
          onClose={() => close("search")}
        />

        <div className="flex items-center gap-2">
          <IkhtiarSorting
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

      <IkhtiarCampaignSection />
    </LayoutIkhtiar>
  );
}
