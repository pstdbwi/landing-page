import CampaignBadges from "./campaign-badges";
import CampaignLocation from "./campaign-location";
import DonationProgress from "./donation-progress";
import NadzhirProfile from "./nadzhir-profile";

interface MobileCampaignInfoProps {
  campaign: any;
  percent: number;
  donorCount: number;
}

const MobileCampaignInfo = ({ campaign, percent, donorCount }: MobileCampaignInfoProps) => {
  return (
    <div className="md:hidden px-1 pt-3">
      <div className="w-full flex items-center justify-between mb-2">
        <CampaignBadges campaign={campaign} />
        <CampaignLocation campaign={campaign} className="max-w-[48%]" />
      </div>

      <h3 className="text-2xl leading-tight font-bold text-transparent bg-clip-text bg-fesyar-gold w-fit line-clamp-3 mb-3">
        {campaign?.title}
      </h3>

      <div className="mb-3">
        <NadzhirProfile campaign={campaign} compact />
      </div>

      <DonationProgress campaign={campaign} percent={percent} donorCount={donorCount} showTarget={false} />
    </div>
  );
};

export default MobileCampaignInfo;
