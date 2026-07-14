"use client";

import { Skeleton } from "@/components/Skeleton";
import { useGetCampaignDetail } from "@/services/campaign/hooks";
import { AlertTriangle } from "lucide-react";

interface SharedAboutPageProps {
  campaignId: string;
}

const SharedAboutPage = ({ campaignId }: SharedAboutPageProps) => {
  const {
    data: campaign,
    isLoading: isCampaignLoading,
    isFetched: isCampaignFetched,
    isError: isErrorCampaign,
  } = useGetCampaignDetail({ campaignId });

  // --- Loading ---
  if (isCampaignLoading) {
    return (
      <div className="h-full space-y-4">
        <Skeleton className="w-1/2 h-6 bg-white/20" />
        <Skeleton className="w-full h-4 bg-white/10" />
        <Skeleton className="w-full h-4 bg-white/10" />
        <Skeleton className="w-[80%] h-4 bg-white/10" />
        <Skeleton className="w-[70%] h-4 bg-white/10" />
        <Skeleton className="w-[60%] h-4 bg-white/10" />
      </div>
    );
  }

  // --- Error ---
  if (isErrorCampaign) {
    return (
      <div className="h-full flex flex-col items-center justify-center py-16 text-center">
        <div className="w-20 h-20 flex items-center justify-center rounded-full bg-red-500/10 mb-6">
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-red-400 mb-2">Gagal Memuat Data</h3>
        <p className="text-gray-400 max-w-sm">Terjadi kesalahan saat memuat data campaign. Silakan coba lagi nanti.</p>
      </div>
    );
  }

  // --- Normal Render ---
  return (
    <div className="h-full text-white z-50">
      <div
        className="prose max-w-none prose-green text-white z-50 rounded-[16px] border-2 border-white backdrop-blur-3xl p-4 text-xs sm:text-sm lg:text-base [overflow:anywhere]"
        style={{
          background: "linear-gradient(119deg, rgba(255, 255, 255, 0.20) 2.36%, rgba(78, 78, 78, 0.15) 97.64%)",
        }}
        dangerouslySetInnerHTML={{ __html: campaign.description }}
      />
    </div>
  );
};

export default SharedAboutPage;
