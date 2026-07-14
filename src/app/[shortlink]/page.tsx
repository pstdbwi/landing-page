import { siteConfig } from "@/constant/config";
import axios from "axios";
import { ArrowLeftIcon } from "lucide-react";
import { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

interface PageProps {
  params: { shortlink: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

const BASE_URL = "https://api.satuwakafindonesia.id";

async function getShortlinkData(shortlink: string) {
  try {
    // 1. FETCH CAMPAIGN
    try {
      const res = await axios.get(`${BASE_URL}/campaigns?shortlink=${shortlink}`);
      if (res.data?.data?.[0]?.id) {
        return { type: "campaign", item: res.data.data[0] };
      }
    } catch (e) {}

    // 2. FETCH SECTION
    try {
      const resSection = await axios.get(`${BASE_URL}/special-sections?shortlink=${shortlink}`);
      const section = resSection.data?.data?.[0]?.special_sections?.[0];
      if (section?.id) {
        return { type: "section", item: section };
      }
    } catch (e) {}

    // 3. FETCH CAMPAIGN REPORT
    try {
      const resCampaignReport = await axios.get(`${BASE_URL}/campaigns?shortlink_report=${shortlink}`);
      if (resCampaignReport.data?.data?.[0]?.id) {
        return { type: "report", item: resCampaignReport.data.data[0] };
      }
    } catch (e) {}
  } catch (error) {
    console.error("Shortlink fetch error:", error);
  }
  return null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const shortlink = params.shortlink;
  const data = await getShortlinkData(shortlink);
  const host = headers().get("host");

  if (!data) {
    return {
      title: siteConfig.title,
      description: siteConfig.description,
    };
  }

  const { type, item } = data;

  if (type === "campaign" || type === "report") {
    const targetPath = type === "campaign" ? `/campaign/${item.id}` : `/report/campaign/${item.id}/national`;

    return {
      title: {
        default: item.title || siteConfig.title,
        template: `%s | ${item.title || siteConfig.title}`,
      },
      description: item.short_description || siteConfig.description,
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
        canonical: `https://${host}${targetPath}`,
      },
      openGraph: {
        title: item.title || siteConfig.title,
        description: item.short_description || siteConfig.description,
        images: item.image || item.banner_url || "/fallback-og.png",
        url: `https://${host}${targetPath}`,
      },
      twitter: {
        card: "summary_large_image",
        title: item.title,
        description: item.short_description,
        images: item.image ? [item.image] : item.banner_url ? [item.banner_url] : ["/fallback-og.png"],
      },
    };
  }

  if (type === "section") {
    const targetPath = `/special-section/${item.id}`;
    return {
      title: item.title || "Special Section",
      openGraph: {
        images: ["/fallback-og.png"],
        url: `https://${host}${targetPath}`,
      },
    };
  }

  return {
    title: siteConfig.title,
  };
}

export default async function ShortlinkPage({ params }: PageProps) {
  const shortlink = params.shortlink;
  const data = await getShortlinkData(shortlink);

  if (!data) {
    return (
      <div className="layout bg-white h-screen grid place-items-center">
        <div className="flex items-center justify-center flex-col gap-2">
          <h1 className="mt-4 text-xl font-bold">Shortlink tidak ditemukan</h1>
          <Link href="/" className="underline flex gap-2">
            <ArrowLeftIcon className="w-4" /> Kembali ke home
          </Link>
        </div>
      </div>
    );
  }

  const { type, item } = data;

  if (type === "campaign") {
    redirect(`/campaign/${item.id}`);
  }

  if (type === "section") {
    redirect(`/special-section/${item.id}`);
  }

  if (type === "report") {
    redirect(`/report/campaign/${item.id}/national`);
  }

  return null;
}
