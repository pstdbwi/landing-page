import { Badge } from "@/components/Badge";
import { CampaignTypeKeys, TCampaignType } from "@/lib/typeCampaign";

interface CampaignBadgesProps {
  campaign: any;
}

const CampaignBadges = ({ campaign }: CampaignBadgesProps) => {
  return (
    <div className="flex items-center gap-1">
      {campaign?.type ? <Badge variant="fesyar-gold">{TCampaignType[campaign?.type as CampaignTypeKeys]}</Badge> : "-"}
      {campaign?.type == "3" && (
        <Badge variant={campaign.is_permanent ? "gradient-blue" : "gradient-purple"}>
          {campaign.is_permanent ? "Abadi" : "Temporer"}
        </Badge>
      )}
      {campaign?.topic ? (
        <Badge variant={"fesyar-green"} className="whitespace-nowrap">
          {campaign?.topic
            .split(" ")
            .map((word: any) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")}
        </Badge>
      ) : null}
    </div>
  );
};

export default CampaignBadges;
