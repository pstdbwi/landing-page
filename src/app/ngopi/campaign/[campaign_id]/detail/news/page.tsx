"use client";

import SharedCampaignNewsPage from "@/components/shared-program/shared-campaign-news-page";

const NewsPage = ({ params }: { params: { campaign_id: string } }) => {
  return <SharedCampaignNewsPage campaignId={params.campaign_id} />;
};

export default NewsPage;
