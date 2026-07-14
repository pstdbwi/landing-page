"use client";

import SharedDonationPraysPage from "@/components/shared-program/shared-donation-prays-page";

const PraysPage = ({ params }: { params: { campaign_id: string } }) => {
  return <SharedDonationPraysPage campaignId={params.campaign_id} />;
};

export default PraysPage;
