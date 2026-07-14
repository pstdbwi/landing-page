"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/Avatar";
import { Badge } from "@/components/Badge";
import { IcOrg, Verivied } from "@/components/Icon/svg";
import { Progress } from "@/components/ProgressBar";
import { SharedCampaignQRCodeShareDialog, SharedCampaignShareDialog } from "@/app/berwakaf/_components/shared-share-dialog";
import SharedBannerContent from "@/components/shared-program/shared-banner-content";
import { Skeleton } from "@/components/Skeleton";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";
import { getRemainingDays } from "@/lib/countRemainingDays";
import { CampaignTypeKeys, personByCampaignType, TCampaignType } from "@/lib/typeCampaign";
import currencyFormater, { calculateDonationPercent, cn } from "@/lib/utils";
import { useGetCampaignDetail } from "@/services/campaign/hooks";
import { useGetDonorListByCampaignId } from "@/services/donation/hooks";
import { useDonationStore } from "@/store/useDonationStore";
import { AlertTriangle, InfinityIcon, Loader2, MapPinIcon, QrCodeIcon, Share2Icon, TimerIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { href: "/about", label: "Tentang Program" },
  { href: "/news", label: "Kabar Terbaru" },
  { href: "/donor", label: "Wakif" },
  {
    href: "/prays",
    label: "Doa & Harapan",
  },
  { href: "/disbursement", label: "Penyaluran Dana" },
] as const;

const GLASSMORPHISM_BG = "linear-gradient(119deg, rgba(255, 255, 255, 0.20) 2.36%, rgba(78, 78, 78, 0.15) 97.64%)";

const MOBILE_CTA_BG = "rgba(11, 64, 67, 0.35)";

const SCROLL_FACTOR = 0.2;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const capitalizeWords = (text: string) =>
  text
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

// ─── Sub-components ───────────────────────────────────────────────────────────

interface CampaignBadgesProps {
  type?: string;
  isPermanent?: boolean;
  topic?: string;
}

const CampaignBadges = ({ type, isPermanent, topic }: CampaignBadgesProps) => (
  <div className="flex items-center gap-1">
    {type ? <Badge variant="fesyar-gold">{TCampaignType[type as CampaignTypeKeys]}</Badge> : "-"}
    {type === "3" && (
      <Badge variant={isPermanent ? "gradient-blue" : "gradient-purple"}>{isPermanent ? "Abadi" : "Temporer"}</Badge>
    )}
    {topic && (
      <Badge variant="fesyar-green" className="whitespace-nowrap">
        {capitalizeWords(topic)}
      </Badge>
    )}
  </div>
);

interface CampaignLocationProps {
  city?: string;
  province?: string;
}

const CampaignLocation = ({ city, province }: CampaignLocationProps) => (
  <div className="flex items-center gap-2 my-1 lg:my-2 text-sm">
    <MapPinIcon className="h-4 w-4 stroke-[1.5] text-fesyar-yellow-500" />
    <span className="text-white text-xs lg:text-sm font-light">{`${city} , ${province}`}</span>
  </div>
);

interface NadzhirProfileProps {
  image?: string;
  name?: string;
  compact?: boolean;
}

const NadzhirProfile = ({ image, name, compact = false }: NadzhirProfileProps) => (
  <div className={cn("flex items-center space-x-2 lg:space-x-4", compact && "mb-3")}>
    <Avatar className={cn("lg:w-10 lg:h-10 w-8 h-8 rounded-full", compact && "bg-white/70")}>
      <AvatarImage src={image} className="object-center object-cover bg-gray-100" />
      <AvatarFallback>{name?.substring(0, 1)}</AvatarFallback>
    </Avatar>
    <div className="lg:space-y-1">
      <div className="inline-flex space-x-1">
        <h2 className={cn("text-xs lg:text-sm font-semibold text-white", compact && "line-clamp-1")}>{name}</h2>
        <Verivied />
        <IcOrg />
      </div>
      <p className="text-[10px] lg:text-xs text-gray-100">Nadzhir Terverifikasi</p>
    </div>
  </div>
);

interface DonationProgressProps {
  totalAmount?: number;
  donationTarget?: number;
  type?: string;
  percent: number;
  totalDonation?: number;
  donorCount?: number;
  expired?: string;
}

const DonationProgress = ({
  totalAmount,
  donationTarget,
  type,
  percent,
  totalDonation,
  donorCount,
  expired,
}: DonationProgressProps) => (
  <div className="mt-1 lg:mt-2">
    <p className="text-xl lg:text-2xl font-bold text-white">Rp{currencyFormater(totalAmount ?? 0)}</p>

    {donationTarget ? (
      <p className="text-gray-100 text-sm">
        Terkumpul dana {TCampaignType[type as CampaignTypeKeys]} dari Rp {currencyFormater(donationTarget)}
      </p>
    ) : (
      <div className="text-xs flex items-center gap-1 text-gray-100">
        <InfinityIcon size={16} className="text-gray-100" /> Tanpa Target
      </div>
    )}

    <div className="my-1 lg:my-2">
      <Progress value={percent} className="h-2 lg:h-3" variant="fesyar" />
    </div>

    <div className="w-full flex justify-between mt-1">
      <p className="text-xs lg:text-sm text-gray-100">
        {donorCount ?? 0} {personByCampaignType[type as CampaignTypeKeys]}
      </p>
      <p className="text-xs lg:text-sm flex items-center gap-1">
        <TimerIcon strokeWidth={2.5} className="w-4 h-4 mb-1 text-fesyar-yellow-600" />
        <span className="text-gray-100">
          {!expired ? "tanpa batas waktu" : `${getRemainingDays(expired as any)} hari lagi`}
        </span>
      </p>
    </div>
  </div>
);

const DonationProgressSkeleton = () => (
  <>
    <Skeleton className="h-6 w-40" />
    <Skeleton className="h-3 w-full my-3 rounded-md" />
    <div className="flex justify-between">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-20" />
    </div>
  </>
);

const NadzhirProfileSkeleton = () => (
  <>
    <Skeleton className="w-10 h-10 rounded-full" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-3 w-28" />
    </div>
  </>
);

// ─── Sidebar Card (Desktop) ──────────────────────────────────────────────────

interface SidebarCardProps {
  campaign: any;
  isCampaignLoading: boolean;
  isErrorCampaign: boolean;
  percent: number;
  donorCount: number;
  onDonate: () => void;
  scrollY: number;
  isLgUp: boolean;
}

const SidebarCard = ({
  campaign,
  isCampaignLoading,
  isErrorCampaign,
  percent,
  donorCount,
  onDonate,
  scrollY,
  isLgUp,
}: SidebarCardProps) => {
  const initialTop = isLgUp ? 188 : 155;
  const minTop = isLgUp ? 85 : 120;

  return (
    <div
      className="fixed z-50 max-md:hidden"
      style={{
        top: `${Math.max(initialTop - scrollY * SCROLL_FACTOR, minTop)}px`,
        left: "60%",
        width: "clamp(250px, 40%, 448px)",
      }}
    >
      {isErrorCampaign ? (
        <div className="flex flex-col justify-center items-center h-full text-red-400">
          <AlertTriangle className="h-6 w-6 mb-2" />
          <p>Gagal memuat informasi campaign.</p>
        </div>
      ) : (
        <div
          className="rounded-[16px] border-2 border-white backdrop-blur-[7.5px] p-4 min-h-[300px] lg:min-h-[400px] flex flex-col justify-between"
          style={{ background: GLASSMORPHISM_BG }}
        >
          {/* Top section */}
          <div>
            {/* Title */}
            {isCampaignLoading ? (
              <Skeleton className="h-8 w-[80%]" />
            ) : (
              <h3 className="text-xl lg:text-3xl font-bold text-transparent bg-clip-text bg-fesyar-gold w-fit">
                {campaign?.title}
              </h3>
            )}

            {/* Badges & Location */}
            {isCampaignLoading ? (
              <Skeleton className="h-4 w-[30%]" />
            ) : (
              <div className="w-full flex items-center justify-between">
                <CampaignBadges type={campaign?.type} isPermanent={campaign?.is_permanent} topic={campaign?.topic} />
                <CampaignLocation city={campaign?.location?.city} province={campaign?.location?.province} />
              </div>
            )}

            {/* Nadzhir label */}
            {isCampaignLoading ? (
              <Skeleton className="h-4 w-[20%]" />
            ) : (
              <p className="text-xs lg:text-sm font-semibold text-white">Profil Nadzhir</p>
            )}

            {/* Nadzhir profile */}
            <div className="my-1 lg:my-2">
              {isCampaignLoading ? (
                <NadzhirProfileSkeleton />
              ) : (
                <NadzhirProfile image={campaign?.lembaga?.image} name={campaign?.lembaga?.name} />
              )}
            </div>

            {/* Progress */}
            <div className="mt-1 lg:mt-2">
              {isCampaignLoading ? (
                <DonationProgressSkeleton />
              ) : (
                <DonationProgress
                  totalAmount={campaign?.total_donation_amount}
                  donationTarget={campaign?.donation_target}
                  type={campaign?.type}
                  percent={percent}
                  totalDonation={campaign?.total_donation}
                  donorCount={donorCount}
                  expired={campaign?.expired}
                />
              )}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-1 lg:mt-4 space-y-2">
            {isCampaignLoading ? (
              <Skeleton className="h-12 w-full rounded-lg" />
            ) : (
              <Button
                size="lg"
                className="w-full lg:text-lg font-semibold h-8 lg:h-12 bg-fesyar-gold text-fesyar-green-600 border-white border"
                onClick={onDonate}
              >
                {`${TCampaignType[campaign?.type as CampaignTypeKeys]} Sekarang`}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Mobile Hero Section ──────────────────────────────────────────────────────

interface MobileHeroProps {
  campaign: any;
  percent: number;
  donorCount: number;
}

const MobileHero = ({ campaign, percent, donorCount }: MobileHeroProps) => (
  <div className="md:hidden px-1 pt-2 w-full">
    <div className="w-full flex items-center justify-between mb-2">
      <CampaignBadges type={campaign?.type} isPermanent={campaign?.is_permanent} topic={campaign?.topic} />
      <CampaignLocation city={campaign?.location?.city} province={campaign?.location?.province} />
    </div>

    <h3 className="text-xl lg:text-3xl font-bold text-transparent bg-clip-text bg-fesyar-gold w-fit line-clamp-3 mb-2">
      {campaign?.title}
    </h3>

    <div className="my-1 lg:my-2">
      <NadzhirProfile image={campaign?.lembaga?.image} name={campaign?.lembaga?.name} compact />
    </div>

    <DonationProgress
      totalAmount={campaign?.total_donation_amount}
      donationTarget={campaign?.donation_target}
      type={campaign?.type}
      percent={percent}
      totalDonation={campaign?.total_donation}
      donorCount={donorCount}
      expired={campaign?.expired}
    />
  </div>
);

// ─── Navigation Tabs ──────────────────────────────────────────────────────────

interface CampaignNavProps {
  basePath: string;
  campaignId: string;
  totalDonation?: number;
  donorCount?: number;
}

const CampaignNav = ({ basePath, campaignId, totalDonation, donorCount }: CampaignNavProps) => {
  const pathname = usePathname();
  const currentSegment = pathname.split("/").filter(Boolean).pop();

  return (
    <div className="mt-5 shadow-[inset_0_-4px_0_0_rgba(249,250,251,0.2)] sticky top-0 pt-5 bg-fesyar-green-700/20 backdrop-blur-xl z-30 w-full">
      <div className="mx-auto w-full max-w-7xl">
        <nav className="flex flex-col gap-2 md:flex-row md:gap-0">
          {NAV_LINKS.map((link) => {
            const targetSegment = link.href.split("/").filter(Boolean).pop();
            const isActive = currentSegment === targetSegment;

            return (
              <Link
                key={link.href}
                href={`${basePath}/campaign/${campaignId}/detail${link.href}`}
                className={cn(
                  "pb-3 transition-colors hover:border-b-4 hover:border-fesyar-yellow-600/50 border-b-4 md:border-transparent font-semibold text-xs md:text-sm text-center px-3 text-white flex items-center gap-1 max-md:border-gray-500/50",
                  isActive && "border-b-4 md:border-fesyar-yellow-600 max-md:border-fesyar-yellow-600",
                )}
              >
                {link.label}
                {link.label === "Wakif" && (
                  <p className="text-sm px-2 py-1 bg-[#BF4157] text-white rounded-md">{donorCount ?? 0}</p>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

// ─── Mobile CTA Bar ───────────────────────────────────────────────────────────

interface MobileCtaBarProps {
  campaign: any;
  onDonate: () => void;
}

const MobileCtaBar = ({ campaign, onDonate }: MobileCtaBarProps) => (
  <div
    className="w-full fixed bottom-0 left-0 right-0 flex items-center mx-auto z-40 md:hidden h-[65px] md:h-[80px] p-4 backdrop-blur-lg border-t border-white/20"
    style={{ background: MOBILE_CTA_BG }}
  >
    <Button
      className="w-full text-sm md:text-lg font-semibold h-full bg-fesyar-gold text-fesyar-green-600 border-white border"
      onClick={onDonate}
    >
      {`${TCampaignType[campaign?.type as CampaignTypeKeys]} Sekarang`}
    </Button>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

interface SharedCampaignDetailLayoutProps {
  children: React.ReactNode;
  campaignId: string;
  basePath: string;
  authDialogSlot: (props: {
    authModal: boolean;
    setAuthModal: React.Dispatch<React.SetStateAction<boolean>>;
    campaign: any;
  }) => React.ReactNode;
  layoutWrapper: React.ComponentType<{ children: React.ReactNode; footer: "detail-page" | "landing-page" }>;
}

const SharedCampaignDetailLayout = ({
  children,
  campaignId,
  basePath,
  authDialogSlot,
  layoutWrapper: LayoutWrapper,
}: SharedCampaignDetailLayoutProps) => {
  const { resetDonationAnonymous } = useDonationStore();
  const [authModal, setAuthModal] = useState(false);
  const [openShare, setOpenShare] = useState(false);
  const [openQrCodeShare, setOpenQrCodeShare] = useState(false);
  const isLgUp = useMediaQuery("(min-width: 1024px)");
  const [scrollY, setScrollY] = useState(0);

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
    <LayoutWrapper footer="detail-page">
      {/* Desktop Sidebar Card */}
      <SidebarCard
        campaign={campaign}
        isCampaignLoading={isCampaignLoading}
        isErrorCampaign={isErrorCampaign}
        percent={percent}
        donorCount={donorCount}
        onDonate={handleDonate}
        scrollY={scrollY}
        isLgUp={isLgUp}
      />

      {/* Banner / Image */}
      <div className="mx-auto w-full max-w-7xl px-2">
        <div className="flex max-md:flex-col justify-center w-full items-start md:gap-2 lg:gap-5">
          {isCampaignLoading ? (
            <div className="w-full md:w-[60%] h-[250px] md:h-[400px] rounded-2xl border-2 border-white bg-gray-300 animate-pulse" />
          ) : (
            <>
              <div className="relative w-full md:w-[60%] h-[200px] sm:h-[300px] md:h-[400px] rounded-2xl border-2 border-white overflow-hidden">
                <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                  <button
                    className="bg-white/90 backdrop-blur-sm rounded-full p-2.5 hover:bg-white transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                    onClick={handleQrCodeClick}
                  >
                    <QrCodeIcon size={18} className="text-gray-700" />
                  </button>
                  <button
                    className="bg-white/90 backdrop-blur-sm rounded-full p-2.5 hover:bg-white transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                    onClick={handleShareClick}
                  >
                    <Share2Icon size={18} className="text-gray-700" />
                  </button>
                </div>
                <SharedBannerContent bannerUrl={campaign?.banner_url} />
              </div>
              <MobileHero campaign={campaign} percent={percent} donorCount={donorCount} />
            </>
          )}
          <div className="w-[0%] md:w-[40%]" />
        </div>
      </div>

      {/* Navigation */}
      <CampaignNav
        basePath={basePath}
        campaignId={campaignId}
        totalDonation={campaign?.total_donation}
        donorCount={donorCount}
      />

      {/* Page Content */}
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

      {/* Mobile CTA */}
      <MobileCtaBar campaign={campaign} onDonate={handleDonate} />

      {/* Auth Dialog */}
      {authDialogSlot({ authModal, setAuthModal, campaign })}

      {/* Share Dialogs */}
      <SharedCampaignShareDialog open={openShare} onOpenChange={setOpenShare} campaign={campaign} />
      <SharedCampaignQRCodeShareDialog
        open={openQrCodeShare}
        onOpenChange={setOpenQrCodeShare}
        campaign={campaign}
      />
    </LayoutWrapper>
  );
};

export default SharedCampaignDetailLayout;
