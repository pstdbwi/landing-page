"use client";

import Lucide from "@/components/Icon/lucide";
import useSearchParamsEntries from "@/lib/use-searchparams-entries";
import { toMoney } from "@/lib/utils";
import { useGetSpecialSectionById } from "@/services/campaign/hooks";
import { useFeatureFlag } from "@/store/feature-flag-context";
import clsx from "clsx";
import Image from "next/image";
import { Fragment, useEffect, useMemo, useState } from "react";
import { GradientText } from "../fesyar/gradient-text";
import { NgopiCampaignCard } from "./ngopi-campaign-card";
import { NgopiCardSkeleton } from "./ngopi-card-skeleton";

type Props = {
  onGetTopics?: (topics: string[]) => void;
};

function shuffleArray<T>(arr: T[]): T[] {
  const array = [...arr];

  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

export function NgopiCampaignSection({ onGetTopics }: Props) {
  const { currentDomain, specialSectionId: providerSpecialSectionId, corpIdSpecialSection } = useFeatureFlag();
  const { search = "", topic = "", order_by = "", order_type = "" } = useSearchParamsEntries();
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  const { data: specialSection, isLoading: isLoadingSpecialSection } = useGetSpecialSectionById({
    id: providerSpecialSectionId,
    corp_id: corpIdSpecialSection,
  });

  const specialSectionCampaigns = specialSection?.[0]?.special_section_details;

  const filteredCampaigns = useMemo(() => {
    const filtered = specialSectionCampaigns?.filter((item: any) => {
      const titleMatch = item.campaign.title.toLowerCase().includes(search.toLowerCase());
      const topicMatch = topic ? item.campaign.topic?.toLowerCase() === topic.toLowerCase() : true;

      return titleMatch && topicMatch;
    });

    if (!Array.isArray(filtered)) {
      return filtered;
    }

    if (!order_by) {
      return shuffleArray(filtered);
    }

    return [...filtered].sort((a: any, b: any) => {
      const aVal = order_by === "title" ? a.campaign.title.toLowerCase() : a.campaign.total_donation_amount;

      const bVal = order_by === "title" ? b.campaign.title.toLowerCase() : b.campaign.total_donation_amount;

      if (aVal < bVal) return order_type === "asc" ? -1 : 1;
      if (aVal > bVal) return order_type === "asc" ? 1 : -1;
      return 0;
    });
  }, [specialSectionCampaigns, search, topic, order_by, order_type]);

  const totalDonation = useMemo(() => {
    return specialSectionCampaigns?.reduce(
      (sum: any, item: any) => sum + (item?.campaign?.total_donation_amount || 0),
      0,
    );
  }, [specialSectionCampaigns]);

  const noDataFromAPI = !isLoadingSpecialSection && !specialSectionCampaigns;

  const noFilteredResults =
    !isLoadingSpecialSection && specialSectionCampaigns?.length > 0 && filteredCampaigns?.length === 0;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const topics = useMemo(() => {
    return Array.from(
      new Set(specialSectionCampaigns?.map((item: any) => item.campaign.topic).filter((topic: string) => !!topic)),
    ) as string[];
  }, [specialSectionCampaigns]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollToTop(true);
      } else {
        setShowScrollToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (topics.length && onGetTopics) {
      onGetTopics(topics);
    }
  }, [topics, onGetTopics]);

  return (
    <section className="bg-transparent z-20 pb-10 mt-5 max-w-7xl mx-auto px-3 md:px-0">
      {isLoadingSpecialSection ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-start">
          {Array.from({ length: 6 }).map((_, index) => (
            <NgopiCardSkeleton key={index} />
          ))}
        </div>
      ) : filteredCampaigns?.length > 0 ? (
        <Fragment>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-5">
            {filteredCampaigns?.map((item: any) => {
              return (
                <NgopiCampaignCard
                  key={item.campaign.id}
                  campaignId={item.campaign.id}
                  title={item.campaign.title}
                  campaigner={item.campaign.lembaga}
                  cover={item.campaign.banner_url}
                  donationTarget={item.campaign.donation_target}
                  expired={item.campaign.expired}
                  donationAmount={item.campaign.total_donation_amount}
                  campaignType={item.campaign.type}
                  isPermanent={item.campaign.is_permanent}
                  topic={item.campaign.topic}
                  voucher={item?.campaign?.has_voucher}
                  variant="vertical"
                  className="z-20"
                  location={item.campaign.location}
                />
              );
            })}
          </div>
          <div className="flex flex-col md:flex-row items-center mt-6 justify-between">
            <GradientText className="text-lg" style={{ textShadow: "2px 4px 6px rgba(0,0,0,0.3)" }}>
              Total Wakaf Terkumpul : Rp. {toMoney(totalDonation)}
            </GradientText>
          </div>
        </Fragment>
      ) : noFilteredResults ? (
        <div className="flex mt-5 z-50 flex-col !w-full items-center justify-center gap-3">
          <Image src="/assets/fesyar/file-search.svg" height={300} width={300} alt="Not Found" className="z-50" />
          <p className="text-white text-sm tracking-wider z-50">
            Tidak ada program sesuai kata kunci atau topik yang dipilih.
          </p>
        </div>
      ) : noDataFromAPI ? (
        <div className="flex mt-20 z-50 flex-col !w-full items-center justify-center gap-3">
          <Image src="/assets/fesyar/file-search.svg" height={300} width={300} alt="No Campaigns" className="z-50" />
          <p className="text-white text-sm tracking-wider z-50">{`Belum ada program di ${currentDomain}`}</p>
        </div>
      ) : (
        <div className="flex mt-20 z-50 flex-col !w-full items-center justify-center gap-3">
          <Image src="/assets/fesyar/file-search.svg" height={300} width={300} alt="Not Found" className="z-50" />
          <p className="text-white text-sm tracking-wider z-50">Tidak ada data.</p>
        </div>
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
