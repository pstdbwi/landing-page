import { redirect } from "next/navigation";

export default function CampaignIdPage({ params }: { params: { campaign_id: string } }) {
  redirect(`/campaign/${params.campaign_id}/detail/about`);
}
