"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/Avatar";
import { CampaignCard } from "@/components/CampaignCard";
import { Header } from "@/components/Header";
import { QRCodeShare } from "@/components/Share/qr-code-share";
import { VerticalCardSkeleton } from "@/components/Skeleton";
import { useGetCampaignByLembagaId } from "@/services/campaign/hooks";
import { useGetLembagaById } from "@/services/lembaga/hooks";
import { Link2Icon, QrCodeIcon } from "lucide-react";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
export default function Lembaga({
  params,
}: {
  params: { lembagaId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const currentPathname = usePathname();
  const { data: lembaga } = useGetLembagaById({ lembagaId: params.lembagaId });
  const [openQrCodeShare, setOpenQrCodeShare] = useState(false);

  const {
    data: campaign,
    isLoading: isLoadingCampaignList,
    isFetching: isFetchingCampaign,
  } = useGetCampaignByLembagaId({ lembagaId: params.lembagaId });

  const RenderSocialMediaIcons = (platform: "youtube" | "instagram" | "facebook", url: string) => {
    if (url?.toLowerCase()?.includes("facebook")) {
      return <Image alt="facebook" priority width={20} height={20} src="/assets/facebook.svg" />;
    }

    if (url?.toLowerCase()?.includes("instagram")) {
      return <Image alt="instagram" priority width={20} height={20} src="/assets/instagram.svg" />;
    }

    if (url?.toLowerCase()?.includes("youtube")) {
      return <Image alt="youtube" priority width={20} height={20} src="/assets/youtube.svg" />;
    }

    return <Link2Icon className="w-[23px] h-[23px]" />;
  };

  const RenderCampaignList = () => {
    if (isLoadingCampaignList && isFetchingCampaign) {
      return Array.from({ length: 3 }, (_, index) => index).map((_, index) => <VerticalCardSkeleton key={index} />);
    }

    return campaign?.map((items: any) => {
      return (
        <CampaignCard
          key={items.id}
          campaignId={items.id}
          title={items.title}
          campaigner={items.lembaga}
          cover={items.image}
          expired={items.expired}
          donationTarget={items.donation_target}
          location={`${items.location.district} , ${items.location.city}`}
          donationAmount={items.final_donation_amount}
          isPermanent={items?.is_permanent}
        />
      );
    });
  };

  return (
    <main className="relative bg-white pt-16 layout min-h-screen">
      <Header title="Profil Nazhir" className="left-0 top-0" />
      <section className="p-5 space-y-4 w-full flex flex-col justify-center items-center border-b pb-4">
        <Avatar className="w-[80px] h-[80px]">
          <AvatarImage src={lembaga?.image} />
          <AvatarFallback>{lembaga?.name}</AvatarFallback>
        </Avatar>
        <div className="space-y-1 text-center">
          <h1 className="text-base font-semibold">{lembaga?.name}</h1>
          <h2 className="text-sm text-gray-500">Bergabung sejak {moment(lembaga?.created_at).format("ll")}</h2>
        </div>

        <button onClick={() => setOpenQrCodeShare(true)} className="flex items-center gap-1">
          <QrCodeIcon className="w-4" />
          <span className="text-sm">QR Nazhir</span>
        </button>
      </section>
      <section className="p-5 border-b pb-4">
        <div className="space-y-1 mb-4">
          <h1 className="text-base font-semibold">Tentang</h1>
          <div className="text-gray-500 text-sm" dangerouslySetInnerHTML={{ __html: lembaga?.description }} />
        </div>
        <div className="p-5 grid grid-cols-2 bg-gray-400/10 rounded-lg">
          <div className="border-r space-y-1 text-center">
            <h3 className="text-gray-500 text-base">Program</h3>
            <span className="text-base font-bold">{lembaga?.total_campaign}</span>
          </div>
          <div className="space-y-1 text-center">
            <h3 className="text-gray-500 text-base">Wakif</h3>
            <span className="text-base font-bold">{lembaga?.total_donor}</span>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4 items-center w-full p-3">
          {lembaga?.social_media_urls?.map((items: any, index: number) => {
            return (
              <Link key={index} href={items?.url} target="_blank" className="inline-flex space-x-2 items-center">
                {RenderSocialMediaIcons(items?.platform, items?.url)}
                <span className="text-sm">{items?.platform}</span>
              </Link>
            );
          })}
        </div>
      </section>
      <section className="p-5">
        <div className="mb-4">
          <h1 className="font-bold text-base">Program Kebaikan</h1>
          <h2 className="text-xs text-gray-500">Program-program kebaikan {lembaga?.name}</h2>
        </div>
        <div className="space-y-3">
          <RenderCampaignList />
        </div>
      </section>

      {openQrCodeShare ? (
        <QRCodeShare
          title="Profil Nazhir"
          onClose={() => setOpenQrCodeShare(false)}
          url={currentPathname}
          nameDownload={`Profil ${lembaga?.name}`}
        />
      ) : null}
    </main>
  );
}
