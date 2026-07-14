import { buildCampaignMetadata, getCampaignByShortlink } from "@/lib/campaign-metadata";
import { ArrowLeftIcon } from "lucide-react";
import { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

type PageProps = {
  params: { shortlink: string };
};

const CAMPAIGN_META = {
  defaultHost: "kalbarberwakaf.id",
  defaultTitle: "KALBAR Berwakaf",
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const campaign = await getCampaignByShortlink(params.shortlink);

  return buildCampaignMetadata(campaign, headers().get("host"), {
    ...CAMPAIGN_META,
    canonicalPath: `/${params.shortlink}`,
  });
}

export default async function ShortlinkPage({ params }: PageProps) {
  const campaign = await getCampaignByShortlink(params.shortlink);

  if (campaign?.id) {
    redirect(`/campaign/${campaign.id}/detail/about`);
  }

  return (
    <div className="layout min-h-screen bg-white px-4 flex items-center justify-center">
      <div className="w-full max-w-sm text-center flex items-center justify-center flex-col gap-4">
        <div className="h-12 w-12 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center">
          <ArrowLeftIcon className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h1 className="text-xl font-semibold text-gray-900">Shortlink campaign tidak ditemukan</h1>
          <p className="text-sm leading-6 text-gray-500">Pastikan tautan yang kamu buka sudah benar.</p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white"
        >
          <ArrowLeftIcon className="w-4" /> Kembali ke home
        </Link>
      </div>
    </div>
  );
}
