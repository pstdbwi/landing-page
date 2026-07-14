"use client";

import SharedCampaignDetailLayout from "@/app/berwakaf/_components/shared-campaign-detail-layout";
import KalbarAuthDonation from "@/app/berwakaf/kalbar/_components/kalbar-auth-donation";
import React from "react";
import KalbarLayout from "../../../_components/kalbar-layout";

const Layout = ({ children, params }: { children: React.ReactNode; params: { campaign_id: string } }) => {
  return (
    <SharedCampaignDetailLayout
      campaignId={params?.campaign_id}
      basePath=""
      layoutWrapper={KalbarLayout}
      authDialogSlot={({ authModal, setAuthModal, campaign }) => (
        <KalbarAuthDonation authModal={authModal} setAuthModal={setAuthModal} campaign={campaign} />
      )}
    >
      {children}
    </SharedCampaignDetailLayout>
  );
};

export default Layout;
