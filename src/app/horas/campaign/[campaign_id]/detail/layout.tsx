"use client";

import LayoutHoras from "@/app/horas/_components/horas-layout";
import { HorasQRCodeShareDialog, HorasShareDialog } from "@/app/horas/_components/horas-share-dialog";
import { calculateDonationPercent, sanitizeTitle } from "@/lib/utils";
import { useGetCampaignDetail } from "@/services/campaign/hooks";
import { useGetDonorListByCampaignId } from "@/services/donation/hooks";
import { useDonationStore } from "@/store/useDonationStore";
import { AlertTriangle, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";

import HorasAuthDonation from "@/app/horas/_components/horas-auth-donation";
import CampaignBanner from "./_components/campaign-banner";
import CampaignNavigation from "./_components/campaign-navigation";
import DesktopSideCard from "./_components/desktop-side-card";
import MobileBottomCta from "./_components/mobile-bottom-cta";
import MobileCampaignInfo from "./_components/mobile-campaign-info";

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
  const isDisabledDonation = percent >= 100;

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
    <LayoutHoras footer="detail-page">
      {/* Desktop Side Card */}
      <DesktopSideCard
        campaign={campaign}
        isCampaignLoading={isCampaignLoading}
        isErrorCampaign={isErrorCampaign}
        percent={percent}
        donorCount={donorCount}
        scrollY={scrollY}
        onDonate={handleDonate}
        isDisabledDonation={false}
      />

      {/* Banner & Mobile Info */}
      <div className="mx-auto w-full max-w-7xl px-2 pt-20 md:pt-32">
        <div className="flex max-md:flex-col justify-center w-full items-start md:gap-2 lg:gap-5">
          {isCampaignLoading ? (
            <div className="w-full md:w-[60%] h-[250px] md:h-[400px] rounded-2xl border-2 border-white bg-white/10 animate-pulse" />
          ) : (
            <>
              <CampaignBanner
                bannerUrl={campaign?.banner_url}
                onQrCodeClick={handleQrCodeClick}
                onShareClick={handleShareClick}
              />
              <MobileCampaignInfo campaign={campaign} percent={percent} donorCount={donorCount} />
            </>
          )}
          <div className="w-[0%] md:w-[40%]" />
        </div>
      </div>

      {/* Navigation Tabs */}
      <CampaignNavigation campaignId={campaignId} donorCount={donorCount} />

      {/* Content Area */}
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

      {/* Mobile Bottom CTA */}
      <MobileBottomCta campaignType={campaign?.type} onDonate={handleDonate} isDisabled={false} />

      {/* Dialogs */}
      <HorasAuthDonation authModal={authModal} setAuthModal={setAuthModal} campaign={campaign} />

      <HorasShareDialog
        open={openShare}
        onOpenChange={setOpenShare}
        url={
          typeof window !== "undefined" ? window.location.href + `?share=1&title=${sanitizeTitle(campaign?.title)}` : ""
        }
      />

      <HorasQRCodeShareDialog
        open={openQrCodeShare}
        onOpenChange={setOpenQrCodeShare}
        url={campaign?.shortlink}
        nameDownload={campaign?.title}
      />
    </LayoutHoras>
  );
};

export default Layout;
