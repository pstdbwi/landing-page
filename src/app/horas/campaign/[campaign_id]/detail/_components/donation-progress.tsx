import { Progress } from "@/components/ProgressBar";
import { getRemainingDays } from "@/lib/countRemainingDays";
import { CampaignTypeKeys, personByCampaignType, TCampaignType } from "@/lib/typeCampaign";
import currencyFormater from "@/lib/utils";
import { InfinityIcon, TimerIcon } from "lucide-react";

interface DonationProgressProps {
  campaign: any;
  percent: number;
  donorCount: number;
  showTarget?: boolean;
}

const DonationProgress = ({ campaign, percent, donorCount, showTarget = true }: DonationProgressProps) => {
  return (
    <div className="mt-1 lg:mt-2">
      <p className="text-xl lg:text-2xl font-bold text-white">
        Rp{showTarget ? " " : ""}
        {currencyFormater(campaign?.total_donation_amount)}
      </p>

      {showTarget && (
        <>
          {campaign?.donation_target ? (
            <p className="text-gray-50 text-sm">
              Terkumpul dana {TCampaignType[campaign?.type as CampaignTypeKeys]} dari Rp{" "}
              {currencyFormater(campaign?.donation_target)}
            </p>
          ) : (
            <div className="text-xs flex items-center gap-1 text-gray-50">
              <InfinityIcon size={16} /> Tanpa Target{" "}
            </div>
          )}
        </>
      )}

      <div className="my-1 lg:my-2">
        <Progress value={percent} className="h-2 lg:h-3" variant="fesyar" />
      </div>

      <div className="w-full flex justify-between mt-1">
        <p className="text-xs lg:text-sm text-gray-50">
          {donorCount} {personByCampaignType[campaign?.type as CampaignTypeKeys]}
        </p>
        <p className="text-xs lg:text-sm flex items-center gap-1">
          <TimerIcon strokeWidth={2.5} className="w-4 h-4 mb-1 text-fesyar-yellow-600" />
          <span className="text-gray-50">
            {!campaign?.expired ? "tanpa batas waktu" : `${getRemainingDays(campaign?.expired)} hari lagi`}
          </span>
        </p>
      </div>
    </div>
  );
};

export default DonationProgress;
