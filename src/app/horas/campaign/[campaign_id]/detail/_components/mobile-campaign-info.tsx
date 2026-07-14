import CampaignBadges from "./campaign-badges";
import CampaignLocation from "./campaign-location";
import NadzhirProfile from "./nadzhir-profile";
import DonationProgress from "./donation-progress";

interface MobileCampaignInfoProps {
  campaign: any;
  percent: number;
  donorCount: number;
}

const MobileCampaignInfo = ({ campaign, percent, donorCount }: MobileCampaignInfoProps) => {
  return (
    <div className="md:hidden px-1 pt-2 w-full">
      <div className="w-full flex items-center justify-between mb-2">
        <CampaignBadges campaign={campaign} />
        <CampaignLocation campaign={campaign} />
      </div>

      <h3 className="text-xl lg:text-3xl font-bold text-transparent bg-clip-text bg-fesyar-gold w-fit line-clamp-3 mb-2">
        {campaign?.title}
      </h3>

      <NadzhirProfile campaign={campaign} avatarClassName="bg-white/70" className="mb-3" />

      <DonationProgress campaign={campaign} percent={percent} donorCount={donorCount} showTarget={false} />
    </div>
  );
};

export default MobileCampaignInfo;
