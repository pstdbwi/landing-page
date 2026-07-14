import React, { Dispatch, Fragment, SetStateAction } from "react";
import { Button } from "../Button";
import { XIcon } from "lucide-react";
import { CampaignTypeKeys, wordingAttentionByCampaignType, wordingByCampaignType } from "@/lib/typeCampaign";
import { Campaign } from "@/types";

interface Props {
  campaign: Campaign;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  amount: string | number;
  onDonate: () => void;
}

const IkrarDialog = ({ campaign, open, setOpen, amount, onDonate }: Props) => {
  const wordingCampaign = wordingByCampaignType[campaign?.type as CampaignTypeKeys];

  if (!open) return null;

  return (
    <Fragment>
      <div className="fixed bottom-0 inset-x-0 w-full rounded-t-2xl bg-white px-5 pb-4 layout z-40">
        <div className="w-full relative mb-8">
          <button
            onClick={(e) => {
              e.preventDefault();
              setOpen(false);
            }}
          >
            <XIcon size={20} className="absolute left-2 bottom-0" />
          </button>
          <h1 className="text-base font-bold text-center">{wordingCampaign}</h1>
        </div>
        <div className="flex flex-col items-center justify-center w-full mb-5 gap-2">
          <img src="/assets/bismillah.svg" width={150} height={100} alt="decoration" />
          <p className="text-sm text-gray-500 text-center">
            {wordingAttentionByCampaignType({
              type: campaign?.type as CampaignTypeKeys,
              lembaga: campaign?.lembaga?.name,
              program: campaign?.title,
              amount: amount,
            })}
          </p>
        </div>
        <Button variant="default" size="full" type="button" onClick={onDonate}>
          Saya sudah baca {wordingCampaign} dan lanjutkan
        </Button>
      </div>

      <div aria-hidden className="h-full bg-black/20 w-full absolute top-0"></div>
    </Fragment>
  );
};

export default IkrarDialog;
