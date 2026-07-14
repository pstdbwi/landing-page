import { Empty } from "@/components/Empty";
import { SharedCampaignCard } from "@/components/shared-program/shared-campaign-card";
import { Skeleton } from "@/components/Skeleton";
import { useGetSpecialSectionById } from "@/services/campaign/hooks";
import { useFeatureFlag } from "@/store/feature-flag-context";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useRef } from "react";

interface Props {
  selectedYear: string;
}

const SharedCarouselCampaignPriority = ({ selectedYear }: Props) => {
  const { specialSectionId, corpIdSpecialSection } = useFeatureFlag();
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: specialSection, isLoading: isLoadingSpecialSection } = useGetSpecialSectionById({
    id: specialSectionId,
    corp_id: corpIdSpecialSection,
    priority: "1",
    date_start: selectedYear ? `${selectedYear}-01-01` : undefined,
    date_end: selectedYear ? `${selectedYear}-12-31` : undefined,
  });

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -500, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 500, behavior: "smooth" });
  };

  if (isLoadingSpecialSection) {
    return (
      <section className="mt-6">
        <div className="mb-4">
          <Skeleton className="w-[200px] h-[25px] rounded-md" />
        </div>
        <div className="inline-flex gap-5 overflow-x-auto w-full pb-5">
          {Array.from({ length: 3 }, (_, index) => index).map((_, index) => (
            <Skeleton className="w-[250px] h-[250px] lg:w-[450px] lg:h-[450px] rounded-md flex-shrink-0" key={index} />
          ))}
        </div>
      </section>
    );
  }

  const campaignsPriority = specialSection?.[0].special_section_details || [];

  return (
    <section className="max-w-7xl mx-auto space-y-4 my-4">
      <div className="flex items-center justify-between">
        <h1 className="text-white font-bold text-lg lg:text-2xl">Program Unggulan</h1>

        <div className="flex items-center gap-2">
          <button
            onClick={scrollLeft}
            className="group bg-white p-2 hover:bg-fesyar-red-500 rounded-full shadow transition"
          >
            <ChevronLeftIcon className="w-3 h-3 lg:w-5 lg:h-5 text-fesyar-red-500 group-hover:text-white" />
          </button>

          {/* Tombol kanan */}
          <button
            onClick={scrollRight}
            className="group z-20 bg-white hover:bg-fesyar-red-500 p-2 rounded-full shadow transition"
          >
            <ChevronRightIcon className="w-3 h-3 lg:w-5 lg:h-5 text-fesyar-red-500 group-hover:text-white" />
          </button>
        </div>
      </div>

      <div className="relative">
        {/* Left fog */}
        <div className="z-10 rounded-lg pointer-events-none absolute top-0 left-0 h-full w-12 bg-gradient-to-r from-white/30 to-transparent" />
        {/* Right fog */}
        <div className="z-10 rounded-lg pointer-events-none absolute top-0 right-0 h-full w-12 bg-gradient-to-l from-white/30 to-transparent" />

        <div ref={scrollRef} className="inline-flex gap-5 overflow-x-auto w-full scrollbar-hide rounded-lg">
          {campaignsPriority?.length <= 0 || campaignsPriority === null ? (
            <Empty type="campaign" />
          ) : (
            campaignsPriority.map((campaigns: Record<string, any>, index: number) => {
              const { campaign } = campaigns;
              return (
                <SharedCampaignCard
                  link={`/campaign/${campaign?.id}/detail/about`}
                  key={index}
                  campaignId={campaign.id}
                  title={campaign.title}
                  className="w-[250px] lg:w-[500px]"
                  campaigner={campaign.lembaga}
                  cover={campaign.banner_url}
                  variant="vertical"
                  expired={campaign.expired}
                  donationTarget={campaign.donation_target}
                  location={campaign.location}
                  donationAmount={campaign.total_donation_amount}
                  campaignType={campaign?.type}
                  isPermanent={campaign?.is_permanent}
                />
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

export default SharedCarouselCampaignPriority;
