"use client";

import SharedDonorPage from "@/components/shared-program/shared-donor-page";

const WakifType = ({ params }: { params: { campaign_id: string } }) => {
  return <SharedDonorPage campaignId={params.campaign_id} />;
};

export default WakifType;
