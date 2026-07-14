"use client";
import { Empty } from "@/components/Empty";
import { CampaignListSkeleton } from "@/components/Skeleton";
import { getDonationPraysList } from "@/services/campaign";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ArrowLeftIcon, LoaderIcon, MessageCircleIcon, Quote, User } from "lucide-react";
import moment from "moment";
import "moment/locale/id";
import Link from "next/link";
import React from "react";
import InfiniteScroll from "react-infinite-scroller";

interface Props {
  params: { campaignId: string };
}

const PraysPage = ({ params }: Props) => {
  const fetcher = async ({ pageParam = "" }): Promise<any> => {
    const res = await getDonationPraysList(params?.campaignId, pageParam);
    return res;
  };

  const { isLoading, data, hasNextPage, fetchNextPage, isFetching, isError } = useInfiniteQuery({
    queryKey: ["donation-prays-list", params?.campaignId],
    queryFn: fetcher,
    getNextPageParam: (nextPage: any) => (nextPage?.next ? nextPage?.next : null),
    staleTime: 60000,
  });

  if (isLoading && isFetching) {
    return (
      <div className="relative layout bg-white min-h-screen">
        <CampaignListSkeleton orientation="vertical" />
      </div>
    );
  }

  if (isError) {
    return (
      <section className="layout bg-white relative min-h-screen ">
        <div className="w-full bg-primary-600 text-white flex items-center px-3 h-[60px] fixed layout z-50">
          <Link href={`/campaign/${params?.campaignId}`}>
            <ArrowLeftIcon size={18} />
          </Link>
          <p className="ml-5 font-semibold">Doa-doa & Harapan</p>
        </div>
        <div className="h-screen w-full flex items-center justify-center">
          <Empty type="campaign" />
        </div>
      </section>
    );
  }

  if (
    (data && data?.pages[0]?.length === 0) ||
    (data && data?.pages[0] === null) ||
    (data && data?.pages?.[0]?.data === null) ||
    (data && data?.pages?.[0]?.data?.length === 0)
  ) {
    return (
      <section className="layout bg-white relative min-h-screen ">
        <div className="w-full bg-primary-600 text-white flex items-center px-3 h-[60px] fixed layout z-50">
          <Link href={`/campaign/${params?.campaignId}`}>
            <ArrowLeftIcon size={18} />
          </Link>
          <p className="ml-5 font-semibold">Doa-doa & Harapan</p>
        </div>

        <div className="h-screen w-full flex items-center justify-center p-5">
          <section className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-xl w-full">
            <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-full bg-primary-50 mb-6">
              <MessageCircleIcon className="w-6 h-6 sm:w-10 sm:h-10 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum Ada Doa</h3>
            <p className="text-gray-500 max-w-sm text-sm">
              Saat ini belum ada doa &amp; harapan yang dikirimkan oleh wakif di campaign ini.
            </p>
          </section>
        </div>
      </section>
    );
  }

  return (
    <section className="layout bg-white relative min-h-screen pb-10">
      <div className="w-full bg-primary-600 text-white flex items-center px-3 h-[60px] fixed layout z-50">
        <Link href={`/campaign/${params?.campaignId}`}>
          <ArrowLeftIcon size={18} />
        </Link>
        <p className="ml-5 font-semibold">Doa-doa & Harapan</p>
      </div>

      <section className="p-5 space-y-4 pt-[80px]">
        <InfiniteScroll
          // @ts-ignore
          loadMore={fetchNextPage}
          pageStart={0}
          hasMore={hasNextPage}
          loader={
            <div className="w-full inline-flex justify-center my-3" key={0}>
              <LoaderIcon size={20} className="animate-spin text-primary-600" />
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
                      className="w-full rounded-xl p-4 bg-gray-50 border border-gray-100 relative overflow-hidden"
                    >
                      {/* Wakif info */}
                      <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center shrink-0 border border-primary-100">
                            <User className="w-4 h-4 text-primary-600" />
                          </div>
                          <div>
                            <p className="text-gray-900 font-semibold text-sm">{wakifName}</p>
                            {timeAgo && <p className="text-gray-500 text-xs">{timeAgo}</p>}
                          </div>
                        </div>
                        {/* Decorative quote icon */}
                        <Quote className="w-6 h-6 text-gray-300" />
                      </div>

                      {/* Prayer content */}
                      <p className="text-gray-700 text-sm leading-relaxed italic">&ldquo;{pray}&rdquo;</p>
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </InfiniteScroll>
      </section>
    </section>
  );
};

export default PraysPage;
