import { siteConfig } from "@/constant/config";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

type CampaignMetadata = {
  title?: string;
  short_description?: string;
  banner_url?: string;
};

async function getCampaignMetadata(campaignId: string): Promise<CampaignMetadata | null> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://api.satuwakafindonesia.id";

  try {
    const response = await fetch(`${baseUrl}/campaigns/${campaignId}`, {
      cache: "no-store",
    });

    if (!response.ok) return null;

    const json = await response.json();
    return json?.data?.[0] || null;
  } catch {
    return null;
  }
}

export const generateMetadata = async ({ params }: { params: { campaignId: string } }) => {
  const host = headers().get("host");
  const campaign = await getCampaignMetadata(params.campaignId);
  const title = campaign?.title || siteConfig.title;
  const description = campaign?.short_description || siteConfig.description;
  const canonicalUrl = `https://${host}/campaign/${params.campaignId}`;
  const images = campaign?.banner_url ? [campaign.banner_url] : [];

  return {
    title: {
      default: title,
      template: `%s | ${title}`,
    },
    description,
    robots: {
      index: true,
      follow: true,
    },
    icons: {
      icon: "/favicon/favicon.ico",
      shortcut: "/favicon/favicon-16x16.png",
      apple: "/favicon/apple-touch-icon.png",
    },
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      images,
      url: canonicalUrl,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images,
    },
  };
};

export default function CampaignLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section className="relative">{children}</section>;
}
