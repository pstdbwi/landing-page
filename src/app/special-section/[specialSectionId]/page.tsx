"use client";

import { CampaignCard } from "@/components/CampaignCard";
import { CampaignListSkeleton, Skeleton } from "@/components/Skeleton";
import currencyFormater, { urlImageStoreGoogle } from "@/lib/utils";
import { useGetSpecialSectionById } from "@/services/campaign/hooks";
import Link from "next/link";
import { Fragment, useEffect, useMemo, useState, type CSSProperties } from "react";

const getImageBackgroundUrl = (background?: string) => {
  if (!background) return undefined;

  const trimmedBackground = background.trim();
  const urlMatch = trimmedBackground.match(/^url\((['"]?)(.*)\1\)$/i);

  if (urlMatch?.[2]) return urlMatch[2];
  if (/^https?:\/\//i.test(trimmedBackground) || /^\//.test(trimmedBackground)) return trimmedBackground;

  return undefined;
};

const getBackgroundStyle = (background?: string) => {
  if (!background) return {};

  const trimmedBackground = background.trim();
  const imageBackgroundUrl = getImageBackgroundUrl(trimmedBackground);

  if (!imageBackgroundUrl) {
    return { backgroundColor: trimmedBackground };
  }

  return {
    backgroundImage: `url(${imageBackgroundUrl})`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  };
};

const getReadableTextColor = (red: number, green: number, blue: number) => {
  const luminance = 0.299 * red + 0.587 * green + 0.114 * blue;

  return luminance > 150 ? "#111827" : "#ffffff";
};

const getReadableTextStyle = (color: string): CSSProperties => ({
  color,
  textShadow: color === "#ffffff" ? "0 2px 8px rgba(0, 0, 0, 0.45)" : "0 2px 8px rgba(255, 255, 255, 0.35)",
});

const getTextColorFromCssColor = (color?: string) => {
  if (!color || typeof document === "undefined") return undefined;

  const normalizedColor = color.trim();
  const option = new Option();
  option.style.color = normalizedColor;

  if (!option.style.color) return undefined;

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d", { willReadFrequently: true });

  if (!context) return undefined;

  canvas.width = 1;
  canvas.height = 1;
  context.fillStyle = normalizedColor;
  context.fillRect(0, 0, 1, 1);

  const imageData = context.getImageData(0, 0, 1, 1).data;

  return getReadableTextColor(imageData[0], imageData[1], imageData[2]);
};

const SpecialSection = ({ params }: { params: { specialSectionId: string } }) => {
  const { data, isLoading: isLoadingSpecialSection } = useGetSpecialSectionById({
    id: params?.specialSectionId,
  });

  const specialSection = data?.[0] || {};
  const specialSectionCampaigns = specialSection?.special_section_details;
  const backgroundStyle = useMemo(() => getBackgroundStyle(specialSection?.background), [specialSection?.background]);
  const imageBackgroundUrl = useMemo(
    () => getImageBackgroundUrl(specialSection?.background),
    [specialSection?.background],
  );
  const [titleTextColor, setTitleTextColor] = useState("#ffffff");

  const totalDonation = useMemo(() => {
    return specialSectionCampaigns?.reduce(
      (sum: any, item: any) => sum + (item?.campaign?.total_donation_amount || 0),
      0,
    );
  }, [data]);

  useEffect(() => {
    const solidBackgroundTextColor = getTextColorFromCssColor(specialSection?.background);

    if (!imageBackgroundUrl) {
      setTitleTextColor(solidBackgroundTextColor || "#111827");
      return;
    }

    let isCurrentBackground = true;
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = imageBackgroundUrl;

    image.onload = () => {
      if (!isCurrentBackground) return;

      try {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d", { willReadFrequently: true });

        if (!context) {
          setTitleTextColor("#ffffff");
          return;
        }

        canvas.width = 16;
        canvas.height = 16;
        context.drawImage(image, 0, 0, canvas.width, canvas.height);

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height).data;
        let red = 0;
        let green = 0;
        let blue = 0;

        for (let index = 0; index < imageData.length; index += 4) {
          red += imageData[index];
          green += imageData[index + 1];
          blue += imageData[index + 2];
        }

        const pixelCount = imageData.length / 4;
        setTitleTextColor(getReadableTextColor(red / pixelCount, green / pixelCount, blue / pixelCount));
      } catch {
        setTitleTextColor("#ffffff");
      }
    };

    image.onerror = () => {
      if (!isCurrentBackground) return;

      setTitleTextColor("#ffffff");
    };

    return () => {
      isCurrentBackground = false;
    };
  }, [imageBackgroundUrl, specialSection?.background]);

  const titleTextStyle = useMemo(() => getReadableTextStyle(titleTextColor), [titleTextColor]);

  return (
    <div className="h-screen">
      <div className="fixed inset-0 z-0" style={backgroundStyle} />

      <div className="max-w-7xl mx-auto py-8 px-4 lg:px-0 space-y-6 lg:space-y-8 relative z-10">
        {/* LOGO */}
        <section className="flex flex-wrap items-center gap-6 justify-center">
          {isLoadingSpecialSection ? (
            <Fragment>
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="w-12 h-12 lg:w-24 lg:h-24 rounded" />
              ))}
            </Fragment>
          ) : (
            <Fragment>
              {specialSection?.logos?.map((url: string, index: number) => (
                <img
                  key={url}
                  src={urlImageStoreGoogle(url)}
                  alt={`logo ${index + 1}`}
                  className="h-[50px] lg:h-[75px] w-auto object-contain"
                />
              ))}
            </Fragment>
          )}
        </section>

        {/* TITLE & DESCRIPTION */}
        <section style={titleTextStyle}>
          {isLoadingSpecialSection ? (
            <div className="flex items-center justify-center flex-col gap-2">
              <Skeleton className="w-64 h-8 rounded" />
              <Skeleton className="w-52 h-6 rounded" />
            </div>
          ) : (
            <Fragment>
              <h1 className="text-center font-bold text-lg md:text-2xl lg:text-3xl xl:text-4xl uppercase">
                {specialSection?.title}
              </h1>
              <h1 className="text-center font-semibold text-sm sm:text-base md:text-lg lg:text-xl">
                {specialSection?.description}
              </h1>
              <h1 className="text-center font-medium text-xs sm:text-sm lg:text-base mt-2">
                Total Wakaf Terkumpul : <span className="font-bold">Rp. {currencyFormater(totalDonation)}</span>
              </h1>
            </Fragment>
          )}
        </section>

        {/* CAMPAIGNS */}
        <section>
          {isLoadingSpecialSection ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 grid-cols-1 gap-3">
              {Array.from({ length: 1 }).map((_, index) => (
                <CampaignListSkeleton key={index} orientation="default" />
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 grid-cols-1 gap-3">
              {specialSectionCampaigns?.map((item: any) => {
                return (
                  <CampaignCard
                    key={item.campaign.id}
                    campaignId={item.campaign.id}
                    title={item.campaign.title}
                    campaigner={item.campaign.lembaga}
                    cover={item.campaign.banner_url}
                    donationTarget={item.campaign.donation_target}
                    expired={item.campaign.expired}
                    donationAmount={item.campaign.total_donation_amount}
                    campaignType={item.campaign.type}
                    isPermanent={item.campaign.is_permanent}
                    variant="vertical"
                    className="z-20"
                    location={`${item?.campaign.location.district} , ${item?.campaign.location.city}`}
                  />
                );
              })}
            </div>
          )}
        </section>

        <div className="flex items-center justify-center w-full py-3">
          <Link
            href={`https://apps.satuwakaf.id/${specialSection?.shortlink}`}
            className="text-center font-semibold text-sm"
          >
            satuwakaf.id/{specialSection?.shortlink}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SpecialSection;
