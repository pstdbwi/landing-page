"use client";
import { AspectRatio } from "@/components/AspecRatio";
import { Badge } from "@/components/Badge";
import { Button, buttonVariants } from "@/components/Button";
import { CampaignerProfile } from "@/components/CampaignerProfile";
import AuthDialog from "@/components/dialog/auth-dialog";
import DonateNowDialog from "@/components/dialog/donate-now-dialog";
import { DonorCard } from "@/components/DonorCard";
import { Empty } from "@/components/Empty";
import { Header } from "@/components/Header";
import { Progress } from "@/components/ProgressBar";
import Separtor from "@/components/Separtor";
import { Share } from "@/components/Share";
import { QRCodeShare } from "@/components/Share/qr-code-share";
import { Skeleton, SkeletonHeaderCampaign } from "@/components/Skeleton";
import { useSubdomain } from "@/hooks/use-subdomain";
import { getRemainingDays } from "@/lib/countRemainingDays";
import { CampaignTypeKeys, TCampaignType, colorBadgeByCampaignType, personByCampaignType } from "@/lib/typeCampaign";
import useSession from "@/lib/use-session";
import { useShareLink } from "@/lib/useShareLink";
import { extractYouTubeId, getYouTubeThumbnail } from "@/lib/youtube";
import currencyFormater, { calculateDonationPercent, cn, sanitizeTitle, unixTimeNow } from "@/lib/utils";
import { getDonationList } from "@/services/campaign";
import { useGetCampaignDetail } from "@/services/campaign/hooks";
import { useGetDonorListByCampaignId } from "@/services/donation/hooks";
import { useGetLembagaById } from "@/services/lembaga/hooks";
import { visitor } from "@/services/visitor";
import { useDonationStore } from "@/store/useDonationStore";
import { useVisitorHistory } from "@/store/visitor";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  FileTextIcon,
  InfinityIcon,
  LoaderIcon,
  MapPinIcon,
  PlayIcon,
  QrCodeIcon,
  Share2Icon,
  TimerIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import Balancer from "react-wrap-balancer";

export default function Campaign({
  params,
  searchParams,
}: {
  params: { campaignId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { session } = useSession();
  const { store, storeVisitorHistory } = useVisitorHistory();
  const { resetDonation, resetDonationAnonymous } = useDonationStore();
  const now = unixTimeNow();
  const router = useRouter();
  const currentPathname = usePathname();
  const subdomain = useSubdomain();
  const isApps = subdomain === "apps";
  const { share, redirect_from = "" } = searchParams;

  const [expandDescription, setExpandDescription] = useState(false);
  const [openShare, setOpenShare] = useState(false);
  const [openQrCodeShare, setOpenQrCodeShare] = useState(false);
  const [authModal, setAuthModal] = useState(false);
  const [donateNowModal, setDonateNowModal] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const { setShareLink } = useShareLink();

  // useEffect(() => {
  //   // Record<real campaing id, clone campaign id>
  //   const realToClone: Record<string, string> = {
  //     "cfe46cbb-6fcc-4b7f-9fe5-807609e8f8fa": "c14e4159-6e1c-4761-bc9a-819186a6e0c3",
  //     "0b9ee9a8-8efe-4582-b6be-f1ab6ba5a018": "f41af94b-6092-455c-ab0b-57ed5e7df300",
  //     "9bbc4a60-eec9-4792-a37f-96cbbeb6df73": "4fa9218e-1c32-441f-8de3-55fb1d168032",
  //     "e03e1740-1ff4-4b0d-ac16-850ca889d813": "6cd4a8eb-5761-43d0-a5d6-d5aa9ece8dd3",
  //     "1c61369c-6571-41fc-a432-0d76e31c8517": "d599e1f6-dcc9-4347-9c0f-a39c8a5b4329",
  //     "0281cf36-6107-472e-9806-4539d53e5efd": "20985d5c-ce88-403e-b420-4e4f9a709119",
  //   };

  //   const target = realToClone[params.campaignId];
  //   if (target) {
  //     router.push(`https://wakafeinisef.satuwakaf.id/campaign/${target}/detail/about`);
  //   }
  // }, [params?.campaignId]);

  const {
    data: campaign,
    isLoading: isCampaignLoading,
    isFetched: isCampaignFetched,
    isError: isErrorCampaign,
  } = useGetCampaignDetail({ campaignId: params.campaignId });

  const {
    data: lembaga,
    isLoading: isLembagaLoading,
    isError: isLembagaError,
  } = useGetLembagaById({
    lembagaId: campaign?.lembaga?.id,
    enabled: isCampaignFetched,
  });

  const isBWI = lembaga?.id === "9b2a83fe-20b0-4d6e-a488-aa3d7d580ceb";

  const { data: donationList, isLoading: isLoadingDonationList } = useGetDonorListByCampaignId({
    campaignId: params.campaignId,
  });

  const isPermanentVL = {
    variant:
      campaign?.is_permanent == 2
        ? "gradient-green"
        : campaign?.is_permanent == 1
          ? "gradient-blue"
          : "gradient-purple",
    label: campaign?.is_permanent == 2 ? "Temporer & Abadi" : campaign?.is_permanent == 1 ? "Abadi" : "Temporer",
  };
  const location = `${campaign?.location?.district} , ${campaign?.location?.city}`;

  const percent = Number(
    calculateDonationPercent(campaign?.total_donation_amount, campaign?.donation_target).toFixed(2),
  );

  const fetcher = async ({ pageParam = "" }): Promise<any> => {
    const res = await getDonationList(params.campaignId, pageParam);
    return res;
  };

  const { isLoading, data, hasNextPage, fetchNextPage, isFetching } = useInfiniteQuery({
    queryKey: ["donors-list", params.campaignId],
    queryFn: fetcher,
    getNextPageParam: (nextPage: any) => (nextPage?.next ? nextPage?.next : null),
    staleTime: 60000,
  });

  const RenderDonorsList = () => {
    if (isLoading && isFetching) {
      return Array.from({ length: 3 }, (_, index) => index).map((_, index) => (
        <Skeleton className="w-full h-[80px] rounded-md" key={index} />
      ));
    }

    if ((data && data?.pages[0]?.length === 0) || (data && data?.pages[0].data === null)) {
      return <Empty type="donors" campaignType={campaign?.type} />;
    }

    return (
      <InfiniteScroll
        // @ts-ignore
        loadMore={fetchNextPage}
        pageStart={0}
        hasMore={hasNextPage}
        loader={
          <div className="w-full inline-flex justify-center my-3" key={0}>
            <LoaderIcon size={20} className="animate-spin" />
          </div>
        }
        initialLoad={false}
        useWindow
      >
        {/**@ts-ignore */}
        {data?.pages?.map((group, i) => (
          <React.Fragment key={i}>
            {group?.data?.map((item: Record<string, any>, idx: number) => (
              <DonorCard
                key={item?.donor?.id + idx}
                name={item?.is_anonymous ? personByCampaignType[campaign?.type as CampaignTypeKeys] : item?.wakif_name}
                avatar={item?.donor?.image}
                donationTime={item?.verified}
                donationAmount={item?.amount}
                donor={item}
              />
            ))}
          </React.Fragment>
        ))}
      </InfiniteScroll>
    );
  };

  const RenderHeaderCampaign = React.memo(() => {
    const handleBackClick = () => {
      if (share) {
        router.push("/");
      } else {
        if (typeof document !== "undefined" && !document.referrer) {
          router.push("/");
        } else {
          router.back();
        }
      }
    };

    const youtubeId = extractYouTubeId(campaign?.banner_url);

    return (
      <div className="relative">
        <div className="absolute w-full inline-flex justify-between z-50 p-5">
          <button className="bg-white rounded-full p-2" onClick={handleBackClick}>
            <ChevronLeftIcon size={18} />
          </button>

          <div className="flex items-center gap-2">
            <button
              className="bg-white rounded-full p-2"
              onClick={() => {
                setOpenQrCodeShare(true);
                setOpenShare(false);
              }}
            >
              <QrCodeIcon size={18} />
            </button>
            <button
              className="bg-white rounded-full p-2"
              onClick={() => {
                setOpenShare(true);
                setOpenQrCodeShare(false);
              }}
            >
              <Share2Icon size={18} />
            </button>
          </div>
        </div>
        <AspectRatio ratio={16 / 9} className="overflow-hidden relative">
          {isCampaignLoading ? (
            <Skeleton className="w-full h-full" />
          ) : youtubeId && isPlaying ? (
            <iframe
              className="absolute inset-0 w-full h-full rounded-lg"
              src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`}
              title="Campaign Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <>
              <Image
                src={youtubeId ? getYouTubeThumbnail(youtubeId) : campaign?.banner_url}
                fill
                sizes="(max-width: 480px) 100vw"
                alt="banner"
                className={cn("object-cover", youtubeId && "cursor-pointer")}
                onClick={() => youtubeId && setIsPlaying(true)}
              />
              {youtubeId && (
                <div
                  className="absolute inset-0 flex items-center justify-center z-10 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsPlaying(true);
                  }}
                >
                  <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                    <PlayIcon size={24} className="text-white ml-1" fill="white" />
                  </div>
                </div>
              )}
            </>
          )}
        </AspectRatio>
      </div>
    );
  });

  if (isErrorCampaign) {
    return (
      <section className="relative bg-white pt-16 layout min-h-screen">
        <Header title="Program Tidak Ditemukan" className="left-0 top-0" />
        <div className="flex flex-col justify-center items-center gap-5 mt-5">
          <Image src="/assets/search.svg" width={200} height={200} alt="search" />
          <div className="text-center w-full">
            <Balancer className="text-base font-bold mb-1">Program tidak ditemukan</Balancer>
            <Balancer className="text-sm text-gray-500">
              Silahkan cek kembali pencarian program Anda dan coba lagi.
            </Balancer>
          </div>
        </div>
      </section>
    );
  }

  useEffect(() => {
    async function runVisit() {
      const result = await visitor({ user: session, page: "campaign", store });
      if (result) {
        storeVisitorHistory({ page: "campaign" });
      }
    }

    if (session?.corp_id) {
      runVisit();
    }
  }, [session]);

  useEffect(() => {
    const googleAdsString = campaign?.gads_script || "";
    const metaAdsString = campaign?.pixel_script || "";

    const tempGoogleAds = document.createElement("div");
    const tempMetaAds = document.createElement("div");

    tempGoogleAds.innerHTML = googleAdsString;
    tempMetaAds.innerHTML = metaAdsString;

    // Append each script element to the head
    Array.from(tempGoogleAds.children).forEach((child) => {
      if (child.tagName === "SCRIPT") {
        document.head.appendChild(child);
      }
    });

    Array.from(tempMetaAds.children).forEach((child) => {
      if (child.tagName === "SCRIPT") {
        document.head.appendChild(child);
      }
    });

    // Clean up the scripts when the component unmounts
    return () => {
      Array.from(tempGoogleAds.children).forEach((child) => {
        if (child.tagName === "SCRIPT") {
          document.head.removeChild(child);
        }
      });
      Array.from(tempMetaAds.children).forEach((child) => {
        if (child.tagName === "SCRIPT") {
          document.head.removeChild(child);
        }
      });
    };
  }, [campaign]);

  useEffect(() => {
    if (share && !redirect_from) {
      setShareLink(window.location.href || "");
    }
  }, [share]);

  return (
    <section className="mb-14 layout bg-white relative min-h-screen">
      <React.Fragment>
        <RenderHeaderCampaign />
        <div className="p-5 space-y-3">
          {isCampaignLoading ? (
            <Skeleton className="h-6 rounded-md w-44" />
          ) : (
            <div className="inline-flex items-center space-x-2 bg-[#F8F8F8] rounded-full px-2 py-1">
              <MapPinIcon size={14} className="text-gray-500" color="#44A846" />
              <span className="text-gray-500 text-xs">
                {["Other , Other", " , "].some((item) => item?.includes(location)) ? "Seluruh Indonesia" : location}
              </span>
            </div>
          )}

          {isCampaignLoading ? (
            <SkeletonHeaderCampaign />
          ) : (
            <>
              <div className="flex items-center gap-2">
                <Badge size="sm" variant={colorBadgeByCampaignType[campaign?.type]} className="block">
                  {TCampaignType[campaign?.type as CampaignTypeKeys]}
                </Badge>

                {/* 3 == WAKAF, SHOW TYPE WAKAF */}
                {campaign?.type == 3 && (
                  <Badge size={"sm"} variant={isPermanentVL?.variant as any} className="text-white block w-fit">
                    {isPermanentVL?.label}
                  </Badge>
                )}
              </div>
              <h1 className="font-bold text-lg line-clamp-2 text-[#3A3A3A]">{campaign?.title}</h1>
              <div className="border-b pb-3  w-full">
                <h1 className="text-lg text-primary-500 mb-3 font-bold">
                  Rp{currencyFormater(campaign?.total_donation_amount)}
                </h1>
                <div className="space-y-2">
                  {campaign?.donation_target ? (
                    <p className="text-gray-500 text-sm">
                      Terkumpul dana {TCampaignType[campaign?.type as CampaignTypeKeys]} dari Rp{" "}
                      {currencyFormater(campaign?.donation_target)}
                    </p>
                  ) : (
                    <div className="text-xs flex items-center gap-1">
                      <InfinityIcon size={16} className="text-gray-500" /> Tanpa Target{" "}
                    </div>
                  )}
                  <Progress value={percent} className="h-2" />
                  <div className="inline-flex justify-between items-center w-full">
                    <p className="text-sm text-gray-500">
                      {donationList ? campaign?.total_donation : 0}{" "}
                      {personByCampaignType[campaign?.type as CampaignTypeKeys]}
                    </p>
                    <div className="inline-flex items-center gap-1">
                      {!campaign?.expired ? (
                        <InfinityIcon size={14} className="text-gray-500" />
                      ) : (
                        <TimerIcon size={14} className="text-gray-500" />
                      )}
                      <span className="text-xs text-gray-500">
                        {!campaign?.expired
                          ? "tanpa batas waktu"
                          : `${getRemainingDays(campaign?.expired)} hari lagi`}{" "}
                      </span>
                    </div>
                  </div>
                </div>
                {campaign?.prospectus ? (
                  <Link
                    href={campaign?.prospectus}
                    className={buttonVariants({ size: "sm", className: "w-full mt-4", variant: "orange" })}
                    target="_blank"
                  >
                    <FileTextIcon className="w-4 h-4 mr-2 inline-flex items-center" /> Lihat Prospektus
                  </Link>
                ) : null}
              </div>
            </>
          )}

          {isLembagaLoading ? (
            <Skeleton className="w-full h-10 rounded-md" />
          ) : (
            <Link
              href={`/lembaga/${lembaga?.id}`}
              className="inline-flex items-center justify-between w-full cursor-pointer"
            >
              <h1 className="text-lg font-bold text-[#3A3A3A]">Profil Nazhir</h1>
              <ChevronRightIcon size={24} />
            </Link>
          )}

          {isLembagaLoading ? (
            <Skeleton className="w-full h-16 rounded-md" />
          ) : isLembagaError ? (
            <Skeleton className="w-full h-16 rounded-md" />
          ) : (
            <CampaignerProfile campaignerName={lembaga?.name} image={lembaga?.image} />
          )}

          <div className="space-y-2">
            <h1 className="text-lg text-primary-500 font-bold">Tentang Program</h1>
            <div className={cn("overflow-hidden relative", !expandDescription ? "max-h-[480px]" : "")}>
              {!expandDescription ? (
                <div className="bg-gradient-to-t from-white absolute w-full h-20 bottom-0" aria-hidden />
              ) : (
                ""
              )}
              <div
                className="text-gray-500 text-sm dangerously-set-style"
                dangerouslySetInnerHTML={{ __html: campaign?.description }}
              />
            </div>
            <button
              className="text-secondary-500 text-sm font-semibold"
              onClick={() => setExpandDescription(!expandDescription)}
            >
              {expandDescription ? "Tampilkan lebih sedikit" : "Baca Selengkapnya"}
            </button>
          </div>
        </div>
      </React.Fragment>
      <Separtor isAbsolute={false} />

      <section className="p-5">
        {!isCampaignLoading && (
          <>
            <Link
              href={`/campaign/${params?.campaignId}/news`}
              className="inline-flex space-x-3 items-center w-full border-b py-3 mb-3 justify-between cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <h1 className="text-lg font-bold text-[#3A3A3A]">Kabar Terbaru</h1>
              </div>

              <ChevronRightIcon size={24} />
            </Link>

            <Link
              href={`/campaign/${params?.campaignId}/prays`}
              className="inline-flex space-x-3 items-center w-full border-b py-3 mb-3 justify-between cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <h1 className="text-lg font-bold text-[#3A3A3A]">Doa-doa & Harapan</h1>
              </div>

              <ChevronRightIcon size={24} />
            </Link>

            {!isApps && (
              <Link
                href={`/campaign/${params?.campaignId}/disbursement`}
                className="inline-flex space-x-3 items-center w-full border-b pb-3 mb-3 justify-between cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <h1 className="text-lg font-bold text-[#3A3A3A]">Pencairan Dana</h1>
                </div>

                <ChevronRightIcon size={24} />
              </Link>
            )}

            {isBWI && campaign?.beneficiary_app === 1 && (
              <Button
                onClick={() => {
                  setShareLink(`/campaign/${params?.campaignId}/propose`);
                  router.push(`/campaign/${params?.campaignId}/propose`);
                }}
                variant={null}
                className="inline-flex w-full items-center justify-between space-x-3 border-b pb-5 mb-3 cursor-pointer rounded-none px-0"
              >
                <div className="flex items-center space-x-3">
                  <h1 className="text-lg font-bold text-[#3A3A3A]">Permohonan Manfaat Wakaf</h1>
                </div>

                <ChevronRightIcon size={24} />
              </Button>
            )}
          </>
        )}

        <div className="inline-flex space-x-3 items-center w-full border-b pb-3">
          <h1 className="text-lg font-bold text-[#3A3A3A]">
            {personByCampaignType[campaign?.type as CampaignTypeKeys]}
          </h1>
          {isLoadingDonationList ? (
            <Skeleton className="w-[30px] h-[20px] rounded-full" />
          ) : (
            <div className="px-3 bg-green-500/20 rounded-full">
              <span className="text-xs p-0 text-green-500 font-bold">
                {donationList ? campaign?.total_donation : 0}
              </span>
            </div>
          )}
        </div>
        <div className="space-y-3 mt-2 pb-5">
          <RenderDonorsList />
        </div>
      </section>
      <section className="fixed bottom-0 layout border-t p-3 inset-x-0 bg-white">
        <Button
          size="full"
          variant="default"
          className="text-bold text-white"
          disabled={
            campaign?.campaign_status?.name !== "ACTIVE" ||
            campaign?.lembaga?.status?.name !== "Active" ||
            !campaign?.expired
              ? false
              : now > campaign?.expired
          }
          onClick={() => {
            resetDonation();
            resetDonationAnonymous();

            // SET SHARELINK, IF NOT LOGGEDIN, AND WHEN SUCCED LOGIN WILL BACK TO THIS CAMPAIGN
            if (typeof window !== "undefined" && !session?.isLoggedIn) {
              setShareLink(window.location.href);
            }

            if (campaign?.is_nonlogin == 2) {
              setDonateNowModal(true);
            } else {
              if (!campaign.is_nonlogin || session?.isLoggedIn) {
                router.push(`/campaign/${params.campaignId}/donate`);
              } else if (campaign.is_nonlogin == 1) {
                setAuthModal(true);
              }
            }
          }}
        >
          {isCampaignLoading ? "Loading..." : `${TCampaignType[campaign?.type as CampaignTypeKeys]} Sekarang`}
        </Button>
      </section>

      {openShare ? (
        <Share
          onClose={() => setOpenShare(false)}
          url={currentPathname + `?share=1&title=${sanitizeTitle(campaign?.title)}`}
        />
      ) : null}

      {openQrCodeShare ? (
        <QRCodeShare
          onClose={() => setOpenQrCodeShare(false)}
          url={campaign?.shortlink}
          nameDownload={campaign?.title}
        />
      ) : null}

      {authModal && <AuthDialog authModal={authModal} setAuthModal={setAuthModal} campaign={campaign} />}

      {donateNowModal && (
        <DonateNowDialog donateNowModal={donateNowModal} setDonateNowModal={setDonateNowModal} campaign={campaign} />
      )}
    </section>
  );
}
