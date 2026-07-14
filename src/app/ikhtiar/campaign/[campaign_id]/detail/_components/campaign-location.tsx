import { MapPinIcon } from "lucide-react";

interface CampaignLocationProps {
  campaign: any;
}

const CampaignLocation = ({ campaign }: CampaignLocationProps) => {
  return (
    <div className="flex items-center gap-2 my-1 lg:my-2 text-sm">
      <MapPinIcon className="h-4 w-4 stroke-[1.5] text-fesyar-yellow-500" />
      <span className="text-white text-xs lg:text-sm font-light">{`${campaign?.location?.city} , ${campaign?.location?.province}`}</span>
    </div>
  );
};

export default CampaignLocation;
