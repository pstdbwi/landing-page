"use client";

import SharedCampaignDetailLayout from "@/app/berwakaf/_components/shared-campaign-detail-layout";
import SumutAuthDonation from "@/app/berwakaf/sumut/_components/sumut-auth-donation";
import SumutLayout from "@/app/berwakaf/sumut/_components/sumut-layout";
import React from "react";

const Layout = ({ children, params }: { children: React.ReactNode; params: { campaign_id: string } }) => {
  return (
    <SharedCampaignDetailLayout
      campaignId={params?.campaign_id}
      basePath=""
      layoutWrapper={SumutLayout}
      authDialogSlot={({ authModal, setAuthModal, campaign }) => (
        <SumutAuthDonation authModal={authModal} setAuthModal={setAuthModal} campaign={campaign} />
      )}
    >
      {children}
    </SharedCampaignDetailLayout>
  );
};

export default Layout;
