"use client";

import Lucide from "@/components/Icon/lucide";
import { Switch } from "@/components/Switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { SUB_DOMAIN } from "@/constant/sub-domain";
import useSearchParamsEntries from "@/lib/use-searchparams-entries";
import { toMoney } from "@/lib/utils";
import { useGetSpecialSectionById } from "@/services/campaign/hooks";
import { corporateProgram } from "@/services/corporate";
import { useFeatureFlag } from "@/store/feature-flag-context";
import clsx from "clsx";
import { InfoIcon } from "lucide-react";
import Image from "next/image";
import { Fragment, useEffect, useMemo, useState } from "react";
import { HorasCampaignCard } from "./horas-campaign-card";
import { HorasCardSkeleton } from "./horas-card-skeleton";

function shuffleArray<T>(arr: T[]): T[] {
  const array = [...arr];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function HorasCampaignSection() {
  const { currentDomain } = useFeatureFlag();
  const { search = "", topic = "", order_by = "", order_type = "", special_section_id = "" } = useSearchParamsEntries();
  const [isAutoRefetch, setIsAutoRefetch] = useState(false);

  const INTERVAL_REFETCH = 10_000; // 1 Menit
  const refetchIntervalSeconds = INTERVAL_REFETCH / 1000; // 10 Detik
  const [randomizedCampaigns, setRandomizedCampaigns] = useState<any[]>([]);

  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [specialSectionId, setSpecialSectionId] = useState("");
  const [corpId, setCorpId] = useState("");

  const { data: specialSection, isLoading: isLoadingSpecialSection } = useGetSpecialSectionById({
    id: special_section_id || specialSectionId,
    corp_id: corpId,
    refetchInterval: !isAutoRefetch ? false : INTERVAL_REFETCH,
  });

  const specialSectionCampaigns = specialSection?.[0]?.special_section_details;

  const { totalDonationAmount, totalDonation } = useMemo(() => {
    const initial = { totalDonationAmount: 0, totalDonation: 0 };
    if (!specialSectionCampaigns) return initial;
    return specialSectionCampaigns.reduce(
      (acc: any, item: any) => ({
        totalDonationAmount: acc.totalDonationAmount + (item?.campaign?.total_donation_amount || 0),
        totalDonation: acc.totalDonation + (item?.campaign?.total_donation || 0),
      }),
      initial,
    );
  }, [specialSection]);

  const noDataFromAPI = !isLoadingSpecialSection && !specialSectionCampaigns;

  const noFilteredResults =
    !isLoadingSpecialSection && specialSectionCampaigns?.length > 0 && randomizedCampaigns?.length === 0;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const topics = useMemo(() => {
    return Array.from(
      new Set(specialSectionCampaigns?.map((item: any) => item.campaign.topic).filter((topic: string) => !!topic)),
    ) as string[];
  }, [specialSectionCampaigns]);

  useEffect(() => {
    async function runGetCorporateProgram(address: string) {
      const result = await corporateProgram({ address });

      if (Array.isArray(result) && result.length > 0) {
        setSpecialSectionId(result[0].special_section);

        if (result[0].is_private) {
          setCorpId(result[0].corp_id);
        }
      } else {
        console.warn("corporateProgram returned empty result for:", address);
      }
    }

    if (currentDomain) {
      const maskingDomain = ["wakafeinisef.satuwakaf.id", "isef.satuwakaf.id"]?.includes(currentDomain)
        ? "ngopi.satuwakaf.id"
        : currentDomain;
      const isSub = SUB_DOMAIN.includes(maskingDomain);
      if (isSub) {
        void runGetCorporateProgram(maskingDomain);
      } else {
        console.warn(`Host ${currentDomain} is not a supported subdomain`);
      }
    }
  }, [currentDomain]);

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
    const filteredCampaigns = specialSectionCampaigns
      ?.filter((item: any) => {
        const titleMatch = item.campaign.title.toLowerCase().includes(search.toLowerCase());
        const topicMatch = topic ? item.campaign.topic?.toLowerCase() === topic.toLowerCase() : true;

        return titleMatch && topicMatch;
      })
      ?.sort((a: any, b: any) => {
        const aVal = order_by === "title" ? a.campaign.title.toLowerCase() : a.campaign.total_donation_amount;

        const bVal = order_by === "title" ? b.campaign.title.toLowerCase() : b.campaign.total_donation_amount;

        if (aVal < bVal) return order_type === "asc" ? -1 : 1;
        if (aVal > bVal) return order_type === "asc" ? 1 : -1;
        return 0;
      });

    // selalu set data awal
    if (Array.isArray(filteredCampaigns)) {
      setRandomizedCampaigns(shuffleArray(filteredCampaigns));
    } else {
      setRandomizedCampaigns([]);
    }

    let id: NodeJS.Timeout | undefined;

    // kalau autoRefetch aktif → shuffle periodik
    if (isAutoRefetch) {
      id = setInterval(() => {
        setRandomizedCampaigns((prev) => shuffleArray(prev));
      }, 10_000);
    }

    // cleanup
    return () => clearInterval(id);
  }, [topics, search, order_by, order_type, specialSectionCampaigns, isAutoRefetch]);

  return (
    <section className="bg-transparent z-20 pb-10 mt-5 max-w-7xl mx-auto px-3 md:px-0">
      {isLoadingSpecialSection ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-start">
          {Array.from({ length: 6 }).map((_, index) => (
            <HorasCardSkeleton key={index} />
          ))}
        </div>
      ) : randomizedCampaigns?.length > 0 ? (
        <Fragment>
          <div
            className={clsx(
              "grid grid-cols-1 gap-5 sm:grid-cols-2",
              randomizedCampaigns?.length !== 2 && "lg:grid-cols-3",
            )}
          >
            {randomizedCampaigns?.map((item: any) => {
              return (
                <HorasCampaignCard
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
          <div className="flex flex-col md:flex-row items-start md:items-center mt-6 justify-between bg-white/95 p-3 rounded-lg border gap-4 md:gap-0">
            <div className="flex flex-col md:flex-row gap-4 md:gap-12">
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="w-1 h-10 bg-gradient-to-b from-[#FFE7A1] to-[#DAB95A] rounded-full shrink-0" />
                <div className="min-w-0">
                  <span className="text-xs text-gray-400 tracking-wide">Total Wakaf Terkumpul</span>
                  <p className="text-base md:text-lg font-bold text-gray-900 truncate">
                    Rp. {toMoney(totalDonationAmount)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="w-1 h-10 bg-gradient-to-b from-[#FFE7A1] to-[#DAB95A] rounded-full shrink-0" />
                <div className="min-w-0">
                  <span className="text-xs text-gray-400 tracking-wide">Total Wakif</span>
                  <p className="text-base md:text-lg font-bold text-gray-900 truncate">
                    {toMoney(totalDonation)} Orang
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-start">
              <Switch id="auto-update" checked={isAutoRefetch} onCheckedChange={setIsAutoRefetch} variant="fesyar" />
              <Label htmlFor="auto-update" className="text-xs">
                <span className="text-sm text-gray-600">Auto Update ({isAutoRefetch ? "On" : "Off"})</span>
              </Label>
              <Dialog>
                <DialogTrigger>
                  <InfoIcon className="w-4 text-fesyar-yellow-600" />
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Informasi</DialogTitle>
                    <DialogDescription>
                      Halaman akan terupdate secara otomatis setiap {refetchIntervalSeconds} detik.
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
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
