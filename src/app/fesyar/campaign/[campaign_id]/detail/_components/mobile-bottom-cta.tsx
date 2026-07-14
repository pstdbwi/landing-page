import { Button } from "@/components/ui/button";
import { CampaignTypeKeys, TCampaignType } from "@/lib/typeCampaign";

interface MobileBottomCtaProps {
  campaignType?: string;
  onDonate: () => void;
}

const MobileBottomCta = ({ campaignType, onDonate }: MobileBottomCtaProps) => {
  return (
    <div
      className="w-full fixed bottom-0 left-0 right-0 flex items-center mx-auto z-40 md:hidden h-[80px] p-4 backdrop-blur-lg border-t border-white/20"
      style={{
        background: "rgba(11, 64, 67, 0.35)",
      }}
    >
      <Button
        className="w-full text-lg font-semibold h-full bg-fesyar-gold text-fesyar-green-600 border-white border"
        onClick={onDonate}
      >
        {`${TCampaignType[campaignType as CampaignTypeKeys]} Sekarang`}
      </Button>
    </div>
  );
};

export default MobileBottomCta;
