"use client";

import Lucide from "@/components/Icon/lucide";
import useSearchParamsEntries from "@/lib/use-searchparams-entries";
import { toMoney } from "@/lib/utils";
import { useFeatureFlag } from "@/store/feature-flag-context";
import clsx from "clsx";
import Image from "next/image";
import { Fragment, useEffect, useMemo, useState } from "react";
import { GradientText } from "../fesyar/gradient-text";
import { NgopiCampaignCard } from "./ngopi-campaign-card";
import { NgopiCardSkeleton } from "./ngopi-card-skeleton";

type Props = {
  onGetTopics?: (topics: string[]) => void;
  campaignIds?: string[];
};

const PUBLIC_API_BASE_URL = "https://api.satuwakafindonesia.id";

const defaultCampaignIds = [
  "9d52c675-2b96-499d-a94e-224fbae26817", // Gerakan Wakaf Uang Kementerian Agama 1446 H
  "2384e557-cc9a-46b3-a809-e7d377901ebd", // Dana Abadi Pendidikan Tinggi Keagamaan Islam Berbasis Wakaf
  "ce7fcf60-7b55-4ee7-9531-9f0d599c7e60", // Dana Abadi Pendidikan Agama Islam di Sekolah Berbasis Wakaf
  "b157547a-1d68-4d73-9f18-14b41edddeee", // Wakaf Untuk Kemaslahatan Umat
  "03cdb367-4943-4bb3-9d26-23faf7e4b910", // Dana Abadi Guru Tenaga Kependidikan Madrasah Berbasis Wakaf
  "ad099c6d-96b7-4dd7-a747-f3e1b2073e66", // Wakaf Untuk Hutan
  "bd581f2b-d7e0-4582-a1e6-584b960f56d3", // Wakaf Uang Untuk Palestina
  "a87b0611-0f2e-48dc-bbb0-ca2b678688ee", // #GenWakaf : Dana Abadi Pendidikan Murid Madrasah
  "92dda4bf-e178-4510-ac0e-c3fa8ebe28ca", // Wakaf Mushaf Al-Qur'an
  "c3cca415-aba6-45f2-b535-88ace48c7b26", // #Q-TRen : Dana Abadi untuk Pesantren Berdaya
];

type CampaignSectionItem = {
  campaign: any;
};

export function NgopiCampaignSection({ onGetTopics, campaignIds }: Props) {
  const { currentDomain } = useFeatureFlag();
  const { search = "", topic = "", order_by = "", order_type = "" } = useSearchParamsEntries();
  const [campaigns, setCampaigns] = useState<CampaignSectionItem[]>([]);
  const [isLoadingCampaigns, setIsLoadingCampaigns] = useState(true);
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchCuratedCampaigns() {
      setIsLoadingCampaigns(true);

      try {
        const responses = await Promise.all(
          (campaignIds?.length ? campaignIds : defaultCampaignIds).map(async (campaignId) => {
            const response = await fetch(`${PUBLIC_API_BASE_URL}/campaigns/${campaignId}`, {
              signal: controller.signal,
            });

            if (!response.ok) return null;

            const result = await response.json();
            const campaign = result?.data?.[0];

            return campaign ? { campaign } : null;
          }),
        );

        setCampaigns(responses.filter(Boolean) as CampaignSectionItem[]);
      } catch (error: any) {
        if (error?.name !== "AbortError") {
          console.error("Error cannot GET curated Ngopi campaigns...", error);
          setCampaigns([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingCampaigns(false);
        }
      }
    }

    fetchCuratedCampaigns();

    return () => controller.abort();
  }, [campaignIds]);

  const specialSectionCampaigns = campaigns;

  const filteredCampaigns = useMemo(() => {
    const filtered = specialSectionCampaigns?.filter((item: any) => {
      const titleMatch = item.campaign.title.toLowerCase().includes(search.toLowerCase());
      const topicMatch = topic ? item.campaign.topic?.toLowerCase() === topic.toLowerCase() : true;

      return titleMatch && topicMatch;
    });

    if (!Array.isArray(filtered)) {
      return filtered;
    }

    if (!order_by) return filtered;

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

  const noDataFromAPI = !isLoadingCampaigns && !specialSectionCampaigns?.length;

  const noFilteredResults =
    !isLoadingCampaigns && specialSectionCampaigns?.length > 0 && filteredCampaigns?.length === 0;

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
      {isLoadingCampaigns ? (
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
          <p className="text-white text-sm tracking-wider z-50">{`Belum ada program dari API untuk ${currentDomain}`}</p>
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
