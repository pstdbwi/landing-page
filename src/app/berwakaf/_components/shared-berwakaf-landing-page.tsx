"use client";

import SharedCarouselCampaignPriority from "@/app/berwakaf/_components/shared-carousel-campaign-priority";
import { SharedFilterBar } from "@/app/berwakaf/_components/shared-filter-bar";
import SharedNewsSection from "@/app/berwakaf/_components/shared-news-section";
import { SharedSearchBar } from "@/app/berwakaf/_components/shared-search-bar";
import { Skeleton } from "@/components/Skeleton";
import { FesyarCardSkeleton } from "@/components/fesyar/landing-page/fesyar-card-skeleton";
import ReactSelectFesyar from "@/components/fesyar/react-select-fesyar";
import { SharedCampaignCard } from "@/components/shared-program/shared-campaign-card";
import useWindowWidth from "@/hooks/use-window-width";
import { useTogglePanel } from "@/hooks/useTogglePanel";
import useSearchParamsEntries from "@/lib/use-searchparams-entries";
import { cn, toMoney } from "@/lib/utils";
import { useGetSpecialSectionById } from "@/services/campaign/hooks";
import { useFeatureFlag } from "@/store/feature-flag-context";
import { ArrowUpIcon, CalendarIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface CityOption {
  id: number;
  name: string;
  code: string;
  value: string;
  label: string;
}

interface SharedBerwakafLandingPageProps {
  title: string;
  cities: CityOption[];
}

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

function EmptyState({ message }: { message: string }) {
  return (
    <div className="bg-glass-gradient p-8 rounded-lg flex mt-5 z-50 flex-col !w-full items-center justify-center gap-3">
      <Image src="/assets/fesyar/file-search.svg" height={200} width={200} alt="Not Found" className="z-50" />
      <p className="text-white text-sm tracking-wider font-semibold">{message}</p>
    </div>
  );
}

function FilterBarSkeleton() {
  return (
    <div className="flex items-center justify-between">
      <Skeleton className="w-[100px] h-[45px] rounded-md flex-shrink-0" />
      <div className="flex items-center gap-2">
        <Skeleton className="w-[100px] h-[45px] rounded-md flex-shrink-0" />
        <Skeleton className="w-[100px] h-[45px] rounded-md flex-shrink-0" />
      </div>
    </div>
  );
}

function CityFilterSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }, (_, index) => (
        <Skeleton className="w-[50px] lg:w-[100px] h-[25px] lg:h-[45px] rounded-md flex-shrink-0" key={index} />
      ))}
    </>
  );
}

function CampaignGridSkeleton() {
  return (
    <div className="bg-glass-gradient p-5 rounded-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-start">
      {Array.from({ length: 3 }, (_, index) => (
        <FesyarCardSkeleton key={index} />
      ))}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function SharedBerwakafLandingPage({ title, cities }: SharedBerwakafLandingPageProps) {
  const width = useWindowWidth();
  const { specialSectionId, corpIdSpecialSection } = useFeatureFlag();
  const { search = "", topic = "" } = useSearchParamsEntries();
  const { show: showScrollToTop, scrollToTop } = useScrollToTop();
  const { close, toggle, isOpen, isVisible } = useTogglePanel();
  const [cityActive, setCityActive] = useState("Semua Kota");
  const [showAllCities, setShowAllCities] = useState(false);
  const [selectedYear, setSelectedYear] = useState("");

  const yearOptions = useMemo(() => {
    const current = new Date().getFullYear();
    return ["", ...Array.from({ length: 5 }, (_, i) => String(current - i))];
  }, []);

  const { data: specialSection, isLoading: isLoadingSpecialSection } = useGetSpecialSectionById({
    id: specialSectionId,
    corp_id: corpIdSpecialSection,
    date_start: selectedYear ? `${selectedYear}-01-01` : undefined,
    date_end: selectedYear ? `${selectedYear}-12-31` : undefined,
  });

  const specialSectionCampaigns = specialSection?.[0]?.special_section_details;
  const noDataFromAPI = !isLoadingSpecialSection && !specialSectionCampaigns;

  // Derive unique topics from campaign data so SharedFilterBar actually works
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

  const topics = useMemo(() => {
    if (!specialSectionCampaigns) return [];
    const set = new Set<string>();
    specialSectionCampaigns.forEach((item: any) => {
      if (item.campaign.topic) set.add(item.campaign.topic);
    });
    return Array.from(set);
  }, [specialSectionCampaigns]);

  const filteredCampaigns = useMemo(() => {
    if (!specialSectionCampaigns) return [];
    return specialSectionCampaigns.filter((item: any) => {
      const titleMatch = item.campaign.title.toLowerCase().includes(search.toLowerCase());
      const topicMatch = topic ? item.campaign.topic?.toLowerCase() === topic.toLowerCase() : true;
      const cityMatch =
        cityActive && cityActive.toLowerCase() !== "semua kota"
          ? item.campaign.location?.city?.toLowerCase() === cityActive.toLowerCase()
          : true;
      return titleMatch && topicMatch && cityMatch;
    });
  }, [specialSectionCampaigns, search, topic, cityActive]);

  const noFilteredResults =
    !isLoadingSpecialSection && specialSectionCampaigns?.length > 0 && filteredCampaigns.length === 0;

  return (
    <div className="space-y-6 lg:space-y-12 px-4">
      <SharedCarouselCampaignPriority selectedYear={selectedYear} />

      {/* CAMPAIGNS NON PRIORITY ON CITIES */}
      <section className="space-y-3">
        {/* FILTER */}
        {isLoadingSpecialSection ? (
          <FilterBarSkeleton />
        ) : (
          <div className="flex flex-col lg:flex-row lg:items-center justify-between">
            <h1 className="text-white font-bold text-lg lg:text-2xl">{title}</h1>

            <div className="flex items-center gap-2">
              <label className="relative shrink-0 flex items-center gap-2 bg-white text-fesyar-green-700 font-semibold text-sm rounded-lg px-3 py-2 border-2 border-fesyar-yellow-600 cursor-pointer">
                <CalendarIcon size={16} className="flex-shrink-0" />
                {selectedYear ? (
                  <span className="hidden lg:inline whitespace-nowrap">Pengumpulan Tahun</span>
                ) : (
                  <span className="whitespace-nowrap">Pengumpulan</span>
                )}
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="absolute inset-0 opacity-0 w-full cursor-pointer"
                >
                  <option value="">Semua Tahun</option>
                  {yearOptions.filter(Boolean).map((year) => (
                    <option key={year} value={year}>
                      Pengumpulan Tahun {year}
                    </option>
                  ))}
                </select>
                <span>{selectedYear ? selectedYear : "Semua Tahun"}</span>
              </label>

              <SharedSearchBar
                isOpen={isOpen("search")}
                isVisible={isVisible("search")}
                onToggle={() => toggle("search")}
                onClose={() => close("search")}
              />
            </div>
          </div>
        )}

        {/* FILTER KOTA */}
        <section className="flex flex-wrap gap-2 items-center">
          {isLoadingSpecialSection ? (
            <CityFilterSkeleton />
          ) : (
            <div className="w-full">
              <div className="hidden lg:grid lg:grid-cols-8 gap-2 items-center">
                {(showAllCities ? cities : cities?.slice(0, 15))?.map((item) => (
                  <button
                    key={item?.code}
                    type="button"
                    className={cn(
                      "px-3 py-2 rounded-lg border-2 border-fesyar-yellow-600 font-medium hover:bg-fesyar-gold hover:cursor-pointer text-xs truncate",
                      item?.name?.toLowerCase() === cityActive?.toLowerCase()
                        ? "bg-fesyar-gold"
                        : "bg-white text-fesyar-green-700",
                    )}
                    onClick={() => setCityActive(item?.name)}
                    title={item?.name}
                  >
                    {item?.name}
                  </button>
                ))}

                {cities?.length > 15 && !showAllCities && (
                  <button
                    type="button"
                    onClick={() => setShowAllCities(true)}
                    className="px-3 py-2 rounded-lg border-2 border-dashed border-gray-200 text-gray-100 font-medium hover:bg-fesyar-gold hover:text-fesyar-green-700 hover:cursor-pointer text-xs truncate"
                  >
                    + {cities.length - 15} Kota Lainnya
                  </button>
                )}
              </div>

              <div className="block lg:hidden w-full">
                <ReactSelectFesyar
                  name="city"
                  options={cities}
                  className="w-full max-w-full"
                  placeholder="Semua Kota"
                  isClearable
                  value={cities?.find((item) => item?.name === cityActive) || null}
                  onChange={(val) => setCityActive(val?.name)}
                />
              </div>
            </div>
          )}
        </section>

        {/* LIST CAMPAIGNS */}
        <section>
          {isLoadingSpecialSection ? (
            <CampaignGridSkeleton />
          ) : filteredCampaigns.length > 0 ? (
            <>
              <div className="rounded-lg grid grid-cols-1 lg:grid-cols-3 gap-2 lg:gap-5">
                {filteredCampaigns.map((item: any) => (
                  <SharedCampaignCard
                    key={item.campaign.id}
                    link={`/campaign/${item?.campaign?.id}/detail/about`}
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
                    variant={width && width < 640 ? "default" : "vertical"}
                    className="z-20"
                    location={item.campaign.location}
                  />
                ))}
              </div>
              <div className="flex flex-col md:flex-row items-center mt-6 gap-4 md:gap-12 bg-white border rounded-lg p-3">
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
            </>
          ) : noFilteredResults ? (
            <EmptyState message="Tidak ada program sesuai kata kunci atau topik yang dipilih." />
          ) : noDataFromAPI ? (
            <EmptyState message="Belum ada program" />
          ) : (
            <EmptyState message="Tidak ada data." />
          )}

          <button
            onClick={scrollToTop}
            className={cn(
              "fixed bottom-44 right-5 z-50 w-10 h-10 flex items-center justify-center rounded-full hover:scale-105 shadow-lg transition-all duration-300",
              showScrollToTop
                ? "opacity-100 scale-100 pointer-events-auto bg-white text-black"
                : "opacity-0 scale-95 pointer-events-none",
            )}
            aria-label="Scroll to top"
          >
            <ArrowUpIcon size={25} className="transition-opacity duration-300 font-bold" />
          </button>
        </section>
      </section>

      {/* NEWS */}
      <SharedNewsSection />
    </div>
  );
}
