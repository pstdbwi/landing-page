import { siteConfig } from "@/constant/config";
import axios from "axios";
import { Metadata } from "next";

export type CampaignMetadataConfig = {
  defaultHost: string;
  defaultTitle: string;
  canonicalPath: string;
  fallbackImage?: string;
};

export type Campaign = {
  id?: string | number;
  title?: string;
  short_description?: string;
  image?: string;
  banner_url?: string;
};

const BASE_URL = "https://api.satuwakafindonesia.id";
const DEFAULT_FALLBACK_IMAGE = "/assets/logo.png";

export async function getCampaignByShortlink(shortlink: string): Promise<Campaign | null> {
  try {
    const res = await axios.get(`${BASE_URL}/campaigns?shortlink=${encodeURIComponent(shortlink)}`);
    return res.data?.data?.[0] || null;
  } catch (error) {
    console.error("Shortlink fetch error:", error);
    return null;
  }
}

export async function getCampaignById(campaignId: string): Promise<Campaign | null> {
  try {
    const res = await axios.get(`${BASE_URL}/campaigns/${encodeURIComponent(campaignId)}`);
    return res.data?.data?.[0] || null;
  } catch (error) {
    console.error("Campaign metadata fetch error:", error);
    return null;
  }
}

function getAbsoluteUrl(url: string | undefined, host: string, fallbackImage: string) {
  if (url?.startsWith("http")) return url;

  const path = url || fallbackImage;
  return `https://${host}${path.startsWith("/") ? path : `/${path}`}`;
}

export function buildCampaignMetadata(
  campaign: Campaign | null,
  host: string | null,
  config: CampaignMetadataConfig,
): Metadata {
  if (!campaign?.id) {
    return {
      title: config.defaultTitle,
      description: config.defaultTitle,
    };
  }

  const resolvedHost = host || config.defaultHost;
  const title = campaign.title || siteConfig.title;
  const description = campaign.short_description || siteConfig.description;
  const image = getAbsoluteUrl(
    campaign.image || campaign.banner_url,
    resolvedHost,
    config.fallbackImage || DEFAULT_FALLBACK_IMAGE,
  );
  const url = `https://${resolvedHost}${config.canonicalPath}`;

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
      canonical: url,
    },
    openGraph: {
      title,
      description,
      images: [image],
      url,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
