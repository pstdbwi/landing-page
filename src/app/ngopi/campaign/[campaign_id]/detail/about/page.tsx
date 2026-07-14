"use client";

import SharedAboutPage from "@/components/shared-program/shared-about-page";

const AboutPage = ({ params }: { params: { campaign_id: string } }) => {
  return <SharedAboutPage campaignId={params.campaign_id} />;
};

export default AboutPage;
