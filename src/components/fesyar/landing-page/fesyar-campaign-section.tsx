"use client";

import Lucide from "@/components/Icon/lucide";
import { useGetSpecialSectionById } from "@/services/campaign/hooks";
import { useFeatureFlag } from "@/store/feature-flag-context";
import clsx from "clsx";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { FesyarCampaignCard } from "./fesyar-campaign-card";
import { FesyarCardSkeleton } from "./fesyar-card-skeleton";
import useSearchParamsEntries from "@/lib/use-searchparams-entries";

// ─── Types ───────────────────────────────────────────────────────────────────

type Props = {
  onGetTopics?: (topics: string[]) => void;
};

// ─── Custom Hooks ────────────────────────────────────────────────────────────

function useScrollToTop(threshold = 300) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = () => setShow(window.scrollY > threshold);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, [threshold]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return { show, scrollToTop };
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function EmptyState({ message, className }: { message: string; className?: string }) {
  return (
    <div className={clsx("flex z-50 flex-col !w-full items-center justify-center gap-3", className)}>
      <Image src="/assets/fesyar/file-search.svg" height={300} width={300} alt={message} className="z-50" />
      <p className="text-white text-sm tracking-wider z-50">{message}</p>
    </div>
  );
}

function CampaignGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-start">
      {Array.from({ length: 6 }).map((_, index) => (
        <FesyarCardSkeleton key={index} />
      ))}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function FesyarCampaignSection({ onGetTopics }: Props) {
  const { currentDomain, specialSectionId, corpIdSpecialSection } = useFeatureFlag();
  const { search = "", topic = "", order_by = "", order_type = "" } = useSearchParamsEntries();
  const { show: showScrollToTop, scrollToTop } = useScrollToTop();

  const { data: specialSection, isLoading: isLoadingSpecialSection } = useGetSpecialSectionById({
    id: specialSectionId,
    corp_id: corpIdSpecialSection,
  });

  const specialSectionCampaigns = specialSection?.[0]?.special_section_details;

  const topics = useMemo(() => {
    if (!specialSectionCampaigns) return [];
    return Array.from(
      new Set(specialSectionCampaigns.map((item: any) => item.campaign.topic).filter(Boolean)),
    ) as string[];
  }, [specialSectionCampaigns]);

  const filteredCampaigns = useMemo(() => {
    if (!specialSectionCampaigns) return [];

    let result = [...specialSectionCampaigns];

    result = result.filter((item: any) => {
      const titleMatch = item.campaign.title.toLowerCase().includes(search.toLowerCase());
      const topicMatch = topic ? item.campaign.topic?.toLowerCase() === topic.toLowerCase() : true;
      return titleMatch && topicMatch;
    });

    result.sort((a: any, b: any) => {
      const aVal = order_by === "title" ? a.campaign.title.toLowerCase() : a.campaign.total_donation_amount;
      const bVal = order_by === "title" ? b.campaign.title.toLowerCase() : b.campaign.total_donation_amount;

      if (aVal < bVal) return order_type === "asc" ? -1 : 1;
      if (aVal > bVal) return order_type === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [specialSectionCampaigns, search, topic, order_by, order_type]);

  const noDataFromAPI = !isLoadingSpecialSection && !specialSectionCampaigns;
  const noFilteredResults =
    !isLoadingSpecialSection && specialSectionCampaigns?.length > 0 && filteredCampaigns.length === 0;

  useEffect(() => {
    if (topics.length && onGetTopics) {
      onGetTopics(topics);
    }
  }, [topics, onGetTopics]);

  return (
    <section className="bg-transparent z-20 pb-10 mt-5 max-w-7xl mx-auto">
      {isLoadingSpecialSection ? (
        <CampaignGridSkeleton />
      ) : filteredCampaigns.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-5">
          {filteredCampaigns.map(({ campaign }) => (
            <FesyarCampaignCard
              key={campaign.id}
              campaignId={campaign.id}
              title={campaign.title}
              campaigner={campaign.lembaga}
              cover={campaign.banner_url}
              donationTarget={campaign.donation_target}
              expired={campaign.expired}
              donationAmount={campaign.total_donation_amount}
              campaignType={campaign.type}
              isPermanent={campaign.is_permanent}
              topic={campaign.topic}
              variant="vertical"
              className="z-20"
              location={campaign.location}
            />
          ))}
        </div>
      ) : noFilteredResults ? (
        <EmptyState className="mt-5" message="Tidak ada program sesuai kata kunci atau topik yang dipilih." />
      ) : noDataFromAPI ? (
        <EmptyState className="mt-20" message={`Belum ada program di ${currentDomain}`} />
      ) : (
        <EmptyState className="mt-20" message="Tidak ada data." />
      )}

      <button
        onClick={scrollToTop}
        className={clsx(
          "fixed bottom-44 right-5 z-50 w-10 h-10 flex items-center justify-center rounded-full hover:scale-105 shadow-lg transition-all duration-300",
          showScrollToTop
            ? "opacity-100 scale-100 pointer-events-auto bg-white text-black"
            : "opacity-0 scale-95 pointer-events-none",
        )}
        aria-label="Scroll to top"
      >
        <Lucide name="arrow-up" size={25} className="transition-opacity duration-300 font-bold" />
      </button>
    </section>
  );
}
