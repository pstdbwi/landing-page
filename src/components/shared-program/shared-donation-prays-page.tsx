"use client";

import { Skeleton } from "@/components/Skeleton";
import { getDonationPraysList } from "@/services/campaign";
import { useInfiniteQuery } from "@tanstack/react-query";
import { AlertTriangle, LoaderIcon, MessageCircleIcon, Quote, User } from "lucide-react";
import moment from "moment";
import "moment/locale/id";
import React from "react";
import InfiniteScroll from "react-infinite-scroller";

interface SharedDonationPraysPageProps {
  campaignId: string;
}

const SharedDonationPraysPage = ({ campaignId }: SharedDonationPraysPageProps) => {
  const fetcher = async ({ pageParam = "" }): Promise<any> => {
    const res = await getDonationPraysList(campaignId, pageParam);
    return res;
  };

  const { isLoading, data, hasNextPage, fetchNextPage, isFetching, isError } = useInfiniteQuery({
    queryKey: ["donation-prays-list", campaignId],
    queryFn: fetcher,
    getNextPageParam: (nextPage: any) => (nextPage?.next ? nextPage?.next : null),
    staleTime: 60000,
  });

  if (isLoading && isFetching) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }, (_, index) => index).map((_, index) => (
          <Skeleton className="w-full h-[100px] rounded-xl" key={index} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <section className="flex flex-col items-center justify-center py-16 text-center bg-fesyar-green-700/10 backdrop-blur-xl rounded-xl border-gray-200 border-2">
        <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-full bg-red-500/10 mb-6">
          <AlertTriangle className="w-6 h-6 sm:w-10 sm:h-10 text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-red-400 mb-2">Gagal Memuat Data</h3>
        <p className="text-gray-200 max-w-sm text-sm">
          Terjadi kesalahan saat memuat data doa. Silakan coba lagi nanti.
        </p>
      </section>
    );
  }

  if (
    (data && data?.pages[0]?.length === 0) ||
    (data && data?.pages[0] === null) ||
    (data && data?.pages?.[0]?.data === null) ||
    (data && data?.pages?.[0]?.data.length === 0)
  ) {
    return (
      <section className="flex flex-col items-center justify-center py-16 text-center bg-fesyar-green-700/10 backdrop-blur-xl rounded-xl border-gray-200 border-2">
        <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-full bg-white/5 mb-6">
          <MessageCircleIcon className="w-6 h-6 sm:w-10 sm:h-10 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">Belum Ada Doa</h3>
        <p className="text-gray-200 max-w-sm text-sm">
          Saat ini belum ada doa &amp; harapan yang dikirimkan oleh wakif di campaign ini.
        </p>
      </section>
    );
  }

  return (
    <div>
      <InfiniteScroll
        // @ts-ignore
        loadMore={fetchNextPage}
        pageStart={0}
        hasMore={hasNextPage}
        loader={
          <div className="w-full inline-flex justify-center my-3" key={0}>
            <LoaderIcon size={20} className="animate-spin text-white" />
          </div>
        }
        initialLoad={false}
        useWindow
      >
        <div className="space-y-4">
          {data?.pages?.map((group: any, i: number) => (
            <React.Fragment key={i}>
              {group?.data?.map((item: Record<string, any>, idx: number) => {
                const wakifName = item?.is_anonymous ? "Wakif" : item?.wakif_name;
                const pray = item?.WakifPray;
                const unixTimestamp = item?.verified;
                const timeAgo = unixTimestamp ? moment.unix(unixTimestamp).fromNow() : "";

                if (!pray) return null;

                return (
                  <div
                    key={item?.id || idx}
                    className="w-full rounded-xl p-4 backdrop-blur-[7.5px] border border-white/50 relative overflow-hidden"
                    style={{
                      background: "linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(78, 78, 78, 0.08) 100%)",
                    }}
                  >
                    {/* Wakif info */}
                    <div className="flex items-center justify-between mb-3 pb-3 border-b border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white/80 to-white flex items-center justify-center shrink-0 border border-white/50">
                          <User className="w-4 h-4 text-fesyar-yellow-800" />
                        </div>
                        <div>
                          <p className="text-white font-semibold text-sm">{wakifName}</p>
                          {timeAgo && <p className="text-white/50 text-xs">{timeAgo}</p>}
                        </div>
                      </div>
                      {/* Decorative quote icon */}
                      <Quote className="w-6 h-6 text-white/50" />
                    </div>

                    {/* Prayer content */}
                    <p className="text-white/90 text-sm leading-relaxed italic">&ldquo;{pray}&rdquo;</p>
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default SharedDonationPraysPage;
