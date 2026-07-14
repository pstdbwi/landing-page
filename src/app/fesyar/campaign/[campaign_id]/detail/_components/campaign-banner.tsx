"use client";

import SharedBannerContent from "@/components/shared-program/shared-banner-content";
import { QrCodeIcon, Share2Icon } from "lucide-react";

interface CampaignBannerProps {
  bannerUrl: string;
  onQrCodeClick: () => void;
  onShareClick: () => void;
}

const CampaignBanner = ({ bannerUrl, onQrCodeClick, onShareClick }: CampaignBannerProps) => {
  return (
    <div className="relative w-full md:w-[60%] h-[300px] lg:h-[400px] rounded-2xl border-2 border-white overflow-hidden">
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <button
          type="button"
          aria-label="Lihat QR campaign"
          className="bg-white/90 backdrop-blur-sm rounded-full p-2.5 hover:bg-white transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
          onClick={onQrCodeClick}
        >
          <QrCodeIcon size={18} className="text-gray-700" />
        </button>
        <button
          type="button"
          aria-label="Bagikan campaign"
          className="bg-white/90 backdrop-blur-sm rounded-full p-2.5 hover:bg-white transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
          onClick={onShareClick}
        >
          <Share2Icon size={18} className="text-gray-700" />
        </button>
      </div>
      <SharedBannerContent bannerUrl={bannerUrl} />
    </div>
  );
};

export default CampaignBanner;
