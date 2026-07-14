"use client";

import { NgopiCampaignSection } from "@/components/ngopi/ngopi-campaign-section";
import { NgopiFilterBar } from "@/components/ngopi/ngopi-filter-bar";
import { NgopiHeaderSection } from "@/components/ngopi/ngopi-header-section";
import LayoutNgopi from "@/components/ngopi/ngopi-layout";
import { NgopiSearchBar } from "@/components/ngopi/ngopi-search-bar";
import NgopiSorting from "@/components/ngopi/ngopi-sorting";
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
    <LayoutNgopi footer="landing-page" header={false}>
      <NgopiHeaderSection />

      <section className="bg-transparent max-w-7xl mx-auto flex justify-between mt-5 gap-3 items-center px-3 md:px-0 ">
        <NgopiSearchBar
          isOpen={isOpen("search")}
          isVisible={isVisible("search")}
          onToggle={() => toggle("search")}
          onClose={() => close("search")}
        />

        <div className="flex items-center gap-2">
          <NgopiSorting
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
          <NgopiFilterBar
            isOpen={isOpen("filter")}
            isVisible={isVisible("filter")}
            onToggle={() => toggle("filter")}
            onClose={() => close("filter")}
            topics={topics}
          />
        </div>
      </section>

      <NgopiCampaignSection onGetTopics={setTopics} />
    </LayoutNgopi>
  );
}
