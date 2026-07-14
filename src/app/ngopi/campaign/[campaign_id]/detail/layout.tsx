"use client";

import CampaignBanner from "@/app/fesyar/campaign/[campaign_id]/detail/_components/campaign-banner";
import DesktopSideCard from "@/app/fesyar/campaign/[campaign_id]/detail/_components/desktop-side-card";
import MobileBottomCta from "@/app/fesyar/campaign/[campaign_id]/detail/_components/mobile-bottom-cta";
import MobileCampaignInfo from "@/app/fesyar/campaign/[campaign_id]/detail/_components/mobile-campaign-info";
import NgopiAuthDonation from "@/components/ngopi/ngopi-auth-donation";
import LayoutNgopi from "@/components/ngopi/ngopi-layout";
import { NgopiQRCodeShareDialog, NgopiShareDialog } from "@/components/ngopi/ngopi-share-dialog";
import { calculateDonationPercent, cn, sanitizeTitle } from "@/lib/utils";
import { useGetCampaignDetail } from "@/services/campaign/hooks";
import { useGetDonorListByCampaignId } from "@/services/donation/hooks";
import { useDonationStore } from "@/store/useDonationStore";
import { AlertTriangle, Loader2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

const LINKS = [
  {
    href: "/about",
    label: "Tentang Program",
  },
  {
    href: "/news",
    label: "Kabar Terbaru",
  },
  {
    href: "/donor",
    label: "Wakif",
  },
  {
    href: "/prays",
    label: "Doa & Harapan",
  },
  {
    href: "/disbursement",
    label: "Penyaluran Dana",
  },
];

interface CampaignNavigationProps {
  campaignId: string;
  donorCount: number;
}

const CampaignNavigation = ({ campaignId, donorCount }: CampaignNavigationProps) => {
  const pathname = usePathname();

  return (
    <div className="mt-5 md:shadow-[inset_0_-4px_0_0_rgba(249,250,251,0.2)] sticky top-14 pt-5 bg-fesyar-green-700/20 backdrop-blur-xl z-30 w-full">
      <div className="mx-auto w-full max-w-7xl overflow-x-auto">
        <nav className="flex min-w-max gap-0">
          {LINKS.map((link) => {
            const currentSegment = pathname.split("/").filter(Boolean).pop();
            const targetSegment = link.href.split("/").filter(Boolean).pop();
            const isActive = currentSegment === targetSegment;

            return (
              <Link
                key={link.href}
                href={`/campaign/${campaignId}/detail${link.href}`}
                className={cn(
                  "pb-3 transition-colors hover:border-b-4 hover:border-fesyar-yellow-600/50 border-b-4 border-transparent font-semibold text-center px-3 text-sm sm:text-base text-white flex items-center gap-1 whitespace-nowrap max-md:border-gray-500/50",
                  isActive && "border-b-4 md:border-fesyar-yellow-600 max-md:border-fesyar-yellow-600",
                )}
              >
                {link.label}{" "}
                {link.label === "Wakif" && (
                  <p className="text-sm px-2 py-1 bg-[#BF4157] text-white rounded-md">{donorCount}</p>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

const Layout = ({ children, params }: { children: React.ReactNode; params: { campaign_id: string } }) => {
  const { resetDonationAnonymous } = useDonationStore();
  const [authModal, setAuthModal] = useState(false);
  const [openShare, setOpenShare] = useState(false);
  const [openQrCodeShare, setOpenQrCodeShare] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const campaignId = params?.campaign_id;

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const {
    data: campaign,
    isLoading: isCampaignLoading,
    isError: isErrorCampaign,
  } = useGetCampaignDetail({ campaignId });

  const { data: donationList } = useGetDonorListByCampaignId({ campaignId });

  const percent = Number(
    calculateDonationPercent(campaign?.total_donation_amount, campaign?.donation_target).toFixed(2),
  );

  const donorCount = donationList ? campaign?.total_donation : 0;

  const handleDonate = () => {
    resetDonationAnonymous();
    setAuthModal(true);
  };

  const handleShareClick = () => {
    setOpenShare(true);
    setOpenQrCodeShare(false);
  };

  const handleQrCodeClick = () => {
    setOpenQrCodeShare(true);
    setOpenShare(false);
  };

  return (
    <LayoutNgopi footer="detail-page">
      <DesktopSideCard
        campaign={campaign}
        isCampaignLoading={isCampaignLoading}
        isErrorCampaign={isErrorCampaign}
        percent={percent}
        donorCount={donorCount}
        scrollY={scrollY}
        onDonate={handleDonate}
      />

      <div className="mx-auto w-full max-w-7xl px-2 pt-20 md:pt-32">
        <div className="flex max-md:flex-col justify-center w-full items-start md:gap-2 lg:gap-5">
          {isCampaignLoading ? (
            <div className="w-full md:w-[60%] h-[400px] rounded-2xl border-2 border-white bg-white/10 animate-pulse" />
          ) : (
            <>
              <CampaignBanner
                bannerUrl={campaign?.banner_url ?? ""}
                onQrCodeClick={handleQrCodeClick}
                onShareClick={handleShareClick}
              />
              <MobileCampaignInfo campaign={campaign} percent={percent} donorCount={donorCount} />
            </>
          )}
          <div className="w-[0%] md:w-[40%]" />
        </div>
      </div>

      <CampaignNavigation campaignId={campaignId} donorCount={donorCount} />

      <div className="pt-5 mx-auto w-full max-w-7xl px-2 z-50">
        <div className="flex w-full md:gap-2 lg:gap-5">
          <div className="w-full md:w-[60%] pb-28 md:pb-10 pt-5">
            {isCampaignLoading ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="animate-spin h-6 w-6 text-white" />
                <span className="ml-2 text-white">Memuat data campaign...</span>
              </div>
            ) : isErrorCampaign ? (
              <div className="flex flex-col items-center justify-center h-40 text-red-400">
                <AlertTriangle className="h-6 w-6 mb-2" />
                <p>Gagal memuat data campaign. Silakan coba lagi nanti.</p>
              </div>
            ) : (
              children
            )}
          </div>
          <div className="w-[0%] md:w-[40%]" />
        </div>
      </div>

      <MobileBottomCta campaignType={campaign?.type} onDonate={handleDonate} />

      <NgopiAuthDonation authModal={authModal} setAuthModal={setAuthModal} campaign={campaign} />

      <NgopiShareDialog
        open={openShare}
        onOpenChange={setOpenShare}
        url={
          typeof window !== "undefined" ? window.location.href + `?share=1&title=${sanitizeTitle(campaign?.title)}` : ""
        }
      />

      <NgopiQRCodeShareDialog
        open={openQrCodeShare}
        onOpenChange={setOpenQrCodeShare}
        url={campaign?.shortlink}
        nameDownload={campaign?.title}
      />
    </LayoutNgopi>
  );
};

export default Layout;
