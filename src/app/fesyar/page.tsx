"use client";

import { FesyarCampaignSection } from "@/components/fesyar/landing-page/fesyar-campaign-section";
import { FesyarFilterBar } from "@/components/fesyar/landing-page/fesyar-filter-bar";
import { FesyarHeaderSection } from "@/components/fesyar/landing-page/fesyar-header-section";
import { FesyarSearchBar } from "@/components/fesyar/landing-page/fesyar-search-bar";
import FesyarSorting from "@/components/fesyar/landing-page/fesyar-sorting";
import LayoutFesyar from "@/components/fesyar/layout-fesyar";
import { useTogglePanel } from "@/hooks/useTogglePanel";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const [topics, setTopics] = useState<string[]>([]);

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
    <LayoutFesyar footer="landing-page" header={false}>
      <FesyarHeaderSection />

      <section className="bg-transparent max-w-7xl mx-auto flex justify-between mt-5 gap-3 items-center ">
        <FesyarSearchBar
          isOpen={isOpen("search")}
          isVisible={isVisible("search")}
          onToggle={() => toggle("search")}
          onClose={() => close("search")}
        />

        {/* <FesyarNavButton /> */}

        <div className="flex items-center gap-2">
          <FesyarSorting
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
          <FesyarFilterBar
            isOpen={isOpen("filter")}
            isVisible={isVisible("filter")}
            onToggle={() => toggle("filter")}
            onClose={() => close("filter")}
            topics={topics}
          />
        </div>
      </section>

      <FesyarCampaignSection onGetTopics={setTopics} />
    </LayoutFesyar>
  );
}
