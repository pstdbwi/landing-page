import EposCampaignBadges from "./epos-campaign-badges";
import EposCampaignLocation from "./epos-campaign-location";
import EposDonationProgress from "./epos-donation-progress";
import EposNazhirProfile from "./epos-nadzhir-profile";

interface EposMobileCampaignInfoProps {
  campaign: any;
  percent: number;
  donorCount: number;
}

const EposMobileCampaignInfo = ({ campaign, percent, donorCount }: EposMobileCampaignInfoProps) => {
  return (
    <div className="md:hidden px-1 pt-2 w-full">
      <div className="w-full flex items-center justify-between mb-2">
        <EposCampaignBadges campaign={campaign} />
        <EposCampaignLocation campaign={campaign} />
      </div>

      <h3 className="text-xl lg:text-3xl font-bold text-transparent bg-clip-text bg-fesyar-gold w-fit line-clamp-3 mb-2">
        {campaign?.title}
      </h3>

      <EposNazhirProfile campaign={campaign} avatarClassName="bg-white/70" className="mb-3" />

      <EposDonationProgress campaign={campaign} percent={percent} donorCount={donorCount} showTarget={false} />
    </div>
  );
};

export default EposMobileCampaignInfo;
