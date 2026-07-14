import { Button } from "@/components/ui/button";
import { CampaignTypeKeys, TCampaignType } from "@/lib/typeCampaign";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";

interface MobileBottomCtaProps {
  campaignType: string;
  onDonate: () => void;
  isDisabled: boolean;
}

const MobileBottomCta = ({ campaignType, onDonate, isDisabled }: MobileBottomCtaProps) => {
  const baseColorButton = isDisabled ? "bg-fesyar-green text-white" : "bg-fesyar-gold text-fesyar-green-600";
  return (
    <div
      className="w-full fixed bottom-0 left-0 right-0 flex items-center mx-auto 
           z-40 md:hidden h-[80px] p-4 
           backdrop-blur-lg border-t border-white/20"
      style={{
        background: "rgba(11, 64, 67, 0.35)",
      }}
    >
      <Button
        className={cn("w-full text-lg font-semibold h-full border-white border", baseColorButton)}
        onClick={onDonate}
        disabled={isDisabled}
      >
        {isDisabled ? (
          <div className="flex items-center justify-center gap-2">
            <CheckCircle2 className="w-6 h-6" />
            Tercapai
          </div>
        ) : (
          `${TCampaignType[campaignType as CampaignTypeKeys] ?? ""} Sekarang`
        )}
      </Button>
    </div>
  );
};

export default MobileBottomCta;
