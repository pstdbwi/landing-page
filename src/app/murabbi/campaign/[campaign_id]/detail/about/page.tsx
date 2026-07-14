import SharedAboutPage from "@/components/shared-program/shared-about-page";
import { buildCampaignMetadata, getCampaignById } from "@/lib/campaign-metadata";
import { Metadata } from "next";
import { headers } from "next/headers";

type PageProps = {
  params: { campaign_id: string };
};

const CAMPAIGN_META = {
  defaultHost: "murabbi.satuwakaf.id",
  defaultTitle: "Gebyar Muharram 1448H",
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const campaign = await getCampaignById(params.campaign_id);

  return buildCampaignMetadata(campaign, headers().get("host"), {
    ...CAMPAIGN_META,
    canonicalPath: `/campaign/${params.campaign_id}/detail/about`,
  });
}

const AboutPage = ({ params }: PageProps) => {
  return <SharedAboutPage campaignId={params.campaign_id} />;
};

export default AboutPage;
