"use client";

import SharedDisbursementPage from "@/components/shared-program/shared-disbursement-page";

const DisbursementPage = ({ params }: { params: { campaign_id: string } }) => {
  return <SharedDisbursementPage campaignId={params.campaign_id} />;
};

export default DisbursementPage;
