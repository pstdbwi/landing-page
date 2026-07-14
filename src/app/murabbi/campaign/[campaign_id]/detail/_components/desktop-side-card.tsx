import { Skeleton } from "@/components/Skeleton";
import { Button } from "@/components/ui/button";
import { CampaignTypeKeys, TCampaignType } from "@/lib/typeCampaign";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import CampaignBadges from "./campaign-badges";
import CampaignLocation from "./campaign-location";
import NadzhirProfile from "./nadzhir-profile";
import DonationProgress from "./donation-progress";
import { cn } from "@/lib/utils";

interface DesktopSideCardProps {
  campaign: any;
  isCampaignLoading: boolean;
  isErrorCampaign: boolean;
  percent: number;
  donorCount: number;
  scrollY: number;
  onDonate: () => void;
  isDisabledDonation: boolean;
}

const INITIAL_TOP = 128;
const MAX_TOP = 150;
const SCROLL_FACTOR = 0.2;

const DesktopSideCard = ({
  campaign,
  isCampaignLoading,
  isErrorCampaign,
  percent,
  donorCount,
  scrollY,
  onDonate,
  isDisabledDonation,
}: DesktopSideCardProps) => {
  const baseColorButton = isDisabledDonation ? "bg-fesyar-green text-white" : "bg-fesyar-gold text-fesyar-green-600";

  return (
    <div
      className="fixed z-50 max-md:hidden w-full"
      style={{
        top: `${Math.min(INITIAL_TOP + scrollY * SCROLL_FACTOR, MAX_TOP)}px`,
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
          {/* TOP */}
          <div>
            {/* TITLE */}
            {isCampaignLoading ? (
              <Skeleton className="h-8 w-[80%]" />
            ) : (
              <h3 className="text-xl lg:text-2xl font-bold text-transparent bg-clip-text bg-fesyar-gold w-fit ">
                {campaign?.title}
              </h3>
            )}

            {/* BADGES & LOCATION */}
            <div>
              {isCampaignLoading ? (
                <Skeleton className="h-4 w-[30%]" />
              ) : (
                <div className="w-full flex items-center justify-between">
                  <CampaignBadges campaign={campaign} />
                  <CampaignLocation campaign={campaign} />
                </div>
              )}
            </div>

            {/* NADZHIR LABEL */}
            {isCampaignLoading ? (
              <Skeleton className="h-4 w-[20%]" />
            ) : (
              <p className="text-xs lg:text-sm font-semibold text-white">Profil Nadzhir</p>
            )}

            {/* PROFILE */}
            {isCampaignLoading ? (
              <div className="my-1 lg:my-2 flex items-center space-x-2 lg:space-x-4">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full md:w-40" />
                  <Skeleton className="h-3 w-full md:w-28" />
                </div>
              </div>
            ) : (
              <NadzhirProfile campaign={campaign} />
            )}

            {/* PROGRESS */}
            {isCampaignLoading ? (
              <div className="mt-1 lg:mt-2">
                <Skeleton className="h-6 w-full md:w-40" />
                <Skeleton className="h-3 w-full my-3 rounded-md" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-full md:w-24" />
                  <Skeleton className="h-4 w-full md:w-20" />
                </div>
              </div>
            ) : (
              <DonationProgress campaign={campaign} percent={percent} donorCount={donorCount} showTarget={true} />
            )}
          </div>

          {/* ACTION */}
          <div className="mt-1 lg:mt-4 space-y-2">
            {isCampaignLoading ? (
              <Skeleton className="h-12 w-full rounded-lg" />
            ) : (
              <Button
                size={"lg"}
                className={cn("w-full lg:text-lg font-semibold h-8 lg:h-12 border-white border", baseColorButton)}
                onClick={onDonate}
                disabled={isDisabledDonation}
              >
                {isDisabledDonation ? (
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-5 h-5 lg:w-6 lg:h-6" />
                    Tercapai
                  </div>
                ) : (
                  `${TCampaignType[campaign?.type as CampaignTypeKeys]} Sekarang`
                )}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DesktopSideCard;
