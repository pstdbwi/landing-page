"use client";

import SharedCampaignDetailLayout from "@/app/berwakaf/_components/shared-campaign-detail-layout";
import React from "react";
import JatimAuthDonation from "../../../_components/jatim-auth-donation";
import JatimLayout from "../../../_components/jatim-layout";

const Layout = ({ children, params }: { children: React.ReactNode; params: { campaign_id: string } }) => {
  return (
    <SharedCampaignDetailLayout
      campaignId={params?.campaign_id}
      basePath=""
      layoutWrapper={JatimLayout}
      authDialogSlot={({ authModal, setAuthModal, campaign }) => (
        <JatimAuthDonation authModal={authModal} setAuthModal={setAuthModal} campaign={campaign} />
      )}
    >
      {children}
    </SharedCampaignDetailLayout>
  );
};

export default Layout;
