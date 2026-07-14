"use client";

import { Badge } from "@/components/Badge";
import { Skeleton } from "@/components/Skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { extractYouTubeId, getYouTubeThumbnail } from "@/lib/youtube";
import { getContents } from "@/services/content";
import { useGetContentDetail } from "@/services/content/hooks";
import { useFeatureFlag } from "@/store/feature-flag-context";
import { INews, TTypeNews } from "@/types/news";
import { useInfiniteQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { ArrowUpIcon, ChevronLeftIcon, ChevronRightIcon, ImageIcon, Loader2Icon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { formatDate } from "./shared-content-card";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Converts an ISO‑8601 date string into a human-readable Indonesian
 * relative time string, e.g. "2 jam lalu", "3 hari lalu".
 */
const formatTimeAgo = (dateString: string): string => {
  if (!dateString) return "";
  const now = new Date();
  const past = new Date(dateString);
  const diffMs = now.getTime() - past.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  if (diffYear > 0) return `${diffYear} tahun lalu`;
  if (diffMonth > 0) return `${diffMonth} bulan lalu`;
  if (diffDay > 0) return `${diffDay} hari lalu`;
  if (diffHour > 0) return `${diffHour} jam lalu`;
  if (diffMin > 0) return `${diffMin} menit lalu`;
  return "Baru saja";
};

const fetchOtherContents = async ({
  pageParam = "",
  specialSectionId = "",
}: {
  pageParam?: string;
  specialSectionId?: string;
}): Promise<any> => {
  const res = await getContents({
    special_section_id: specialSectionId,
    next: pageParam,
    type_ids: "3,4,5",
    sort: "terbaru",
    limit: "10",
  });
  return res;
};

// ---------------------------------------------------------------------------
// Skeletons
// ---------------------------------------------------------------------------

const NewsDetailSkeleton = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-pulse">
      {/* Main content skeleton */}
      <div className="lg:col-span-8 space-y-4">
        <Skeleton className="w-full h-[400px] rounded-lg" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
      {/* Sidebar skeleton */}
      <div className="lg:col-span-4 space-y-4">
        <Skeleton className="h-6 w-48" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="w-24 h-20 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Sidebar news item card (compact)
// ---------------------------------------------------------------------------

interface SidebarNewsCardProps {
  news: INews;
  onClick: (news: INews) => void;
}

const SidebarNewsCard = ({ news, onClick }: SidebarNewsCardProps) => {
  const youtubeId = extractYouTubeId(news?.thumbnail_url);
  const thumbnailSrc = youtubeId ? getYouTubeThumbnail(youtubeId) : news?.thumbnail_url;

  return (
    <div
      onClick={() => onClick(news)}
      className="flex gap-3 p-2.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/15 cursor-pointer transition-colors duration-200 group"
    >
      {/* Thumbnail */}
      <div className="relative w-24 h-[68px] rounded-lg overflow-hidden flex-shrink-0 bg-black/30">
        {thumbnailSrc ? (
          <img
            src={thumbnailSrc}
            alt={news?.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full grid place-items-center">
            <ImageIcon className="w-5 h-5 text-gray-400" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col justify-center gap-0.5">
        <h4 className="text-white text-xs font-semibold line-clamp-2 leading-tight group-hover:text-fesyar-gold transition-colors">
          {news?.title}
        </h4>
        <p className="text-white/80 text-[0.65rem] truncate">{news?.author_lembaga}</p>
        <p className="text-white/60 text-[0.6rem]">{formatTimeAgo(news?.published_at)}</p>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

interface SharedRegionNewsDetailPageProps {
  params: { id: string };
  LayoutComponent: React.ComponentType<{ children: React.ReactNode; footer: "landing-page" | "detail-page" }>;
}

const SharedRegionNewsDetailPage = ({ params, LayoutComponent }: SharedRegionNewsDetailPageProps) => {
  const { data: data, isLoading: isLoading } = useGetContentDetail({ id: params?.id });
  const { specialSectionId } = useFeatureFlag();
  const router = useRouter();

  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentDetail: INews = data?.[0];
  const [selectedAttachment, setSelectedAttachment] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // YouTube detection for the banner
  const youtubeId = extractYouTubeId(contentDetail?.thumbnail_url);

  // Infinite query for sidebar "Daftar konten lainnya"
  const {
    data: otherNewsList,
    isLoading: isOtherLoading,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["other-contents", specialSectionId],
    queryFn: ({ pageParam = "" }) => fetchOtherContents({ pageParam, specialSectionId }),
    getNextPageParam: (lastPage: any) => (lastPage?.next ? lastPage?.next : null),
    staleTime: 60000,
  });

  // Filter out the current article from the sidebar list
  const filteredOtherNews =
    otherNewsList?.pages?.flatMap((page: any) => (page?.data || []).filter((item: INews) => item?.id !== params?.id)) ??
    [];

  const handleOtherNewsClick = (news: INews) => {
    router.push(`/news/${news?.id}`);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -500, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 500, behavior: "smooth" });
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // -----------------------------------------------------------------------
  // Sidebar component (reused for both desktop and mobile)
  // -----------------------------------------------------------------------

  const SidebarContent = () => (
    <div className="bg-glass-gradient rounded-xl p-4 border border-white/10">
      <h2 className="text-white font-semibold text-base lg:text-lg mb-3">Daftar konten lainnya</h2>

      {/* Desktop: vertical infinite scroll */}
      <div className="hidden lg:block">
        {isOtherLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex gap-3 animate-pulse">
                <Skeleton className="w-24 h-[68px] rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <InfiniteScroll
            // @ts-ignore
            loadMore={() => fetchNextPage()}
            hasMore={hasNextPage}
            loader={
              <div className="w-full flex justify-center py-3" key="loader">
                <Loader2Icon className="animate-spin w-5 text-gray-400" />
              </div>
            }
            initialLoad={false}
            useWindow
          >
            <div className="space-y-2">
              {filteredOtherNews.map((news: INews, index: number) => (
                <SidebarNewsCard key={`${news?.id}-${index}`} news={news} onClick={handleOtherNewsClick} />
              ))}
            </div>
          </InfiniteScroll>
        )}
      </div>

      {/* Mobile: horizontal scroll */}
      <div className="lg:hidden">
        {isOtherLoading ? (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="w-56 h-24 rounded-lg flex-shrink-0" />
            ))}
          </div>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {filteredOtherNews.map((news: INews, index: number) => (
              <div key={`${news?.id}-${index}`} className="flex-shrink-0 w-64">
                <SidebarNewsCard news={news} onClick={handleOtherNewsClick} />
              </div>
            ))}
            {hasNextPage && (
              <button
                onClick={() => fetchNextPage()}
                className="flex-shrink-0 w-24 h-[68px] rounded-lg bg-white/10 grid place-items-center text-white/60 text-xs hover:bg-white/20 transition-colors"
              >
                Muat lagi...
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <LayoutComponent footer="detail-page">
      {isLoading ? (
        <NewsDetailSkeleton />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* ============================================================ */}
          {/* LEFT COLUMN — Main Content                                   */}
          {/* ============================================================ */}
          <div className="lg:col-span-8 flex flex-col space-y-4">
            {/* Banner Image / YouTube */}
            <div className="w-full max-h-[500px] rounded-lg overflow-hidden bg-black/20">
              {youtubeId && isPlaying ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                  title="YouTube video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full aspect-video"
                />
              ) : youtubeId ? (
                <div className="relative cursor-pointer group" onClick={() => setIsPlaying(true)}>
                  <img
                    src={getYouTubeThumbnail(youtubeId)}
                    alt={contentDetail?.title}
                    className="w-full aspect-video object-cover"
                  />
                  {/* Play button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
              ) : (
                <Image
                  src={contentDetail?.thumbnail_url}
                  height={500}
                  width={900}
                  alt="Thumbnail"
                  className="w-full object-contain"
                />
              )}
            </div>

            {/* Title */}
            <section className="bg-glass-gradient rounded-lg p-4 space-y-1 border border-white/10">
              <Badge variant={contentDetail?.type_id == "3" ? "fesyar-gold" : "fesyar-burgundy"}>
                {(TTypeNews as any)[contentDetail?.type_id]}
              </Badge>
              <h1 className="text-fesyar-yellow-500 text-2xl lg:text-3xl font-bold">{contentDetail?.title}</h1>
              <p className="text-fesyar-yellow-300 text-xs">
                Oleh <span className="font-bold">{contentDetail?.author_name}</span>,{" "}
                {formatDate(contentDetail?.published_at)}
              </p>
            </section>

            {/* Body / Content */}
            <div
              className="bg-glass-gradient dangerously-set-style rounded-lg text-white p-5"
              dangerouslySetInnerHTML={{ __html: contentDetail?.body }}
            />

            {/* Attachments */}
            {contentDetail?.attachments?.length > 0 && (
              <>
                <section className="flex w-full items-center pt-3 justify-between">
                  <h2 className="text-white font-semibold text-lg">Lampiran</h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={scrollLeft}
                      className="group bg-white p-2 hover:bg-fesyar-red-500 rounded-full shadow transition"
                    >
                      <ChevronLeftIcon className="w-3 h-3 lg:w-5 lg:h-5 text-fesyar-red-500 group-hover:text-white" />
                    </button>
                    <button
                      onClick={scrollRight}
                      className="group z-20 bg-white hover:bg-fesyar-red-500 p-2 rounded-full shadow transition"
                    >
                      <ChevronRightIcon className="w-3 h-3 lg:w-5 lg:h-5 text-fesyar-red-500 group-hover:text-white" />
                    </button>
                  </div>
                </section>

                <section ref={scrollRef} className="w-full overflow-x-auto">
                  <div className="flex gap-3">
                    {contentDetail?.attachments?.map((item, index) => (
                      <div
                        key={index}
                        className="flex-shrink-0 w-64 h-64 rounded-lg overflow-hidden bg-black/10"
                        onClick={() =>
                          setSelectedAttachment(`https://storage.googleapis.com/ziswaf-asset-prod/${item}`)
                        }
                      >
                        <Image
                          src={`https://storage.googleapis.com/ziswaf-asset-prod/${item}`}
                          alt={`Attachment ${index + 1}`}
                          width={256}
                          height={256}
                          className="object-cover w-full h-full hover:cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}
          </div>

          {/* ============================================================ */}
          {/* RIGHT COLUMN — Sidebar "Daftar konten lainnya"               */}
          {/* ============================================================ */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-4">
              <SidebarContent />
            </div>
          </aside>
        </div>
      )}

      {/* Attachment preview dialog */}
      <Dialog open={!!selectedAttachment} onOpenChange={() => setSelectedAttachment(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Lampiran</DialogTitle>
          </DialogHeader>
          {selectedAttachment && (
            <div className="flex items-center justify-center">
              <Image
                src={selectedAttachment}
                alt="Attachment preview"
                width={800}
                height={800}
                className="object-contain max-h-[80vh]"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Scroll to top button */}
      <button
        onClick={scrollToTop}
        className={clsx(
          "fixed bottom-44 right-5 z-50 w-10 h-10 flex items-center justify-center rounded-full hover:scale-105 shadow-lg transition-all duration-300",
          showScrollToTop
            ? "opacity-100 scale-100 pointer-events-auto bg-white text-black"
            : "opacity-0 scale-95 pointer-events-none",
        )}
        aria-label="Scroll to top"
      >
        <ArrowUpIcon size={25} className="transition-opacity duration-300 font-bold" />
      </button>
    </LayoutComponent>
  );
};

export default SharedRegionNewsDetailPage;
