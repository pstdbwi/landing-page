import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/Skeleton";
import { CampaignTypeKeys, TCampaignType } from "@/lib/typeCampaign";
import { AlertTriangle } from "lucide-react";

import CampaignBadges from "./campaign-badges";
import CampaignLocation from "./campaign-location";
import DonationProgress from "./donation-progress";
import NadzhirProfile from "./nadzhir-profile";

interface DesktopSideCardProps {
  campaign: any;
  isCampaignLoading: boolean;
  isErrorCampaign: boolean;
  percent: number;
  donorCount: number;
  scrollY: number;
  onDonate: () => void;
}

const DesktopSideCard = ({
  campaign,
  isCampaignLoading,
  isErrorCampaign,
  percent,
  donorCount,
  scrollY,
  onDonate,
}: DesktopSideCardProps) => {
  const initialTop = 128;
  const maxTop = 150;
  const factor = 0.2;

  return (
    <div
      className="fixed z-50 max-md:hidden"
      style={{
        top: `${Math.min(initialTop + scrollY * factor, maxTop)}px`,
        left: "60%",
        width: "clamp(250px, 40%, 512px)",
      }}
    >
      {isErrorCampaign ? (
        <div className="flex flex-col justify-center items-center h-full text-red-400">
          <AlertTriangle className="h-6 w-6 mb-2" />
          <p>Gagal memuat informasi campaign.</p>
        </div>
      ) : (
        <div
          className="rounded-[16px] border-2 border-white backdrop-blur-[7.5px] p-4 min-h-[300px] lg:min-h-[400px] flex flex-col justify-between"
          style={{
            background: "linear-gradient(119deg, rgba(255, 255, 255, 0.20) 2.36%, rgba(78, 78, 78, 0.15) 97.64%)",
          }}
        >
          <div>
            {isCampaignLoading ? (
              <Skeleton className="h-8 w-[80%]" />
            ) : (
              <h3 className="text-xl lg:text-2xl font-bold text-transparent bg-clip-text bg-fesyar-gold w-fit">
                {campaign?.title}
              </h3>
            )}

            {isCampaignLoading ? (
              <Skeleton className="h-4 w-[30%]" />
            ) : (
              <div className="w-full flex items-center justify-between">
                <CampaignBadges campaign={campaign} />
                <CampaignLocation campaign={campaign} />
              </div>
            )}

            {isCampaignLoading ? (
              <Skeleton className="h-4 w-[20%]" />
            ) : (
              <p className="text-xs lg:text-sm font-semibold text-white">Profil Nadzhir</p>
            )}

            <NadzhirProfile campaign={campaign} isLoading={isCampaignLoading} />

            {isCampaignLoading ? (
              <div className="mt-1 lg:mt-2">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-3 w-full my-3 rounded-md" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            ) : (
              <DonationProgress campaign={campaign} percent={percent} donorCount={donorCount} />
            )}
          </div>

          <div className="mt-1 lg:mt-4 space-y-2">
            {isCampaignLoading ? (
              <Skeleton className="h-12 w-full rounded-lg" />
            ) : (
              <Button
                size="lg"
                className="w-full lg:text-lg font-semibold h-8 lg:h-12 bg-fesyar-gold text-fesyar-green-600 border-white border"
                onClick={onDonate}
              >
                {`${TCampaignType[campaign?.type as CampaignTypeKeys]} Sekarang`}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DesktopSideCard;
