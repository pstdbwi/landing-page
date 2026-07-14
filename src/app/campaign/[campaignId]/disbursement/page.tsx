"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/Avatar";
import { Empty } from "@/components/Empty";
import currencyFormater, { cn } from "@/lib/utils";
import { getDisbursmentByCampaignId } from "@/services/disbursement";
import { IDisbursementCampaign } from "@/types/disbursement";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ArrowLeftIcon, Loader2Icon } from "lucide-react";
import moment from "moment";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";
import InfiniteScroll from "react-infinite-scroller";

interface Props {
  params: { campaignId: string };
}

const Disbursement = ({ params }: Props) => {
  const searchParams = useSearchParams()!;
  const sortType = searchParams.get("sort") || "terbaru";

  const fetchNews = async ({ pageParam = "", sort = sortType }): Promise<any> => {
    const res = await getDisbursmentByCampaignId(sort, pageParam, params?.campaignId);
    return res;
  };

  const { isLoading, data, hasNextPage, isError, fetchNextPage, isFetching } = useInfiniteQuery({
    queryKey: ["disbursement", params?.campaignId, sortType],
    queryFn: fetchNews,
    getNextPageParam: (nextPage: any) => (nextPage?.next ? nextPage?.next : null),
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });

  if (isLoading || isFetching) {
    return (
      <section className="layout bg-white relative min-h-screen flex justify-center items-center gap-5">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-t-transparent border-gray-400 mb-2"></div>
        <p className="text-sm">Memuat data pencairan...</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="layout bg-white relative min-h-screen flex justify-center items-center gap-5">
        <div className="mb-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728"
            />
          </svg>
        </div>
        <p className="text-sm text-center">Gagal memuat data. Silakan coba lagi.</p>
      </section>
    );
  }

  return (
    <section className="layout bg-white relative min-h-screen ">
      <div className="w-full bg-primary-600 text-white flex items-center px-3 h-[60px]">
        <Link href={`/campaign/${params?.campaignId}`}>
          <ArrowLeftIcon size={18} />
        </Link>

        <p className="ml-5 font-semibold">Pencairan Dana </p>
      </div>

      <div className="pt-5 w-full px-3">
        {/* CARD */}
        {data?.pages?.[0]?.length === 0 || data?.pages?.[0] === null || data?.pages?.[0]?.data === null ? (
          <div className="grid place-items-center min-h-[80vh]">
            <Empty type="disbursement" />
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            <InfiniteScroll
              // @ts-ignore
              loadMore={fetchNextPage}
              pageStart={0}
              hasMore={hasNextPage}
              loader={
                <div className="w-full inline-flex justify-center my-3" key={0}>
                  <Loader2Icon size={20} className="animate-spin" />
                </div>
              }
              initialLoad={false}
              useWindow
            >
              {data?.pages?.map((group, i) => (
                <React.Fragment key={i}>
                  <div className={cn("grid-cols-1 gap-4 grid")}>
                    {group?.data?.map((data: IDisbursementCampaign, index: number) => {
                      return <Card data={data} key={index} />;
                    })}
                  </div>
                </React.Fragment>
              ))}
            </InfiniteScroll>
          </div>
        )}
      </div>
    </section>
  );
};

export default Disbursement;

const Card = ({ data }: { data: IDisbursementCampaign }) => {
  const momentObj = moment(data?.report_date);
  const timeAgo = momentObj.isValid() ? momentObj.fromNow() : "–";

  return (
    <div className="border-b pb-3">
      {/* TIME */}
      <p className="text-xs text-gray-500">{timeAgo}</p>

      {/* PROFILE */}
      <div className="inline-flex items-center space-x-3 mt-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={""} alt={"Lembaga"} className="object-center object-cover bg-gray-100" />
          <AvatarFallback>{data?.lembaga_name?.substring(0, 1)}</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <h1 className="text-xs">{data?.lembaga_name}</h1>
        </div>
      </div>

      <p className="font-semibold my-3">
        Pencairan Dana Rp. {data?.amount_disbursed ? currencyFormater(data?.amount_disbursed) : ""}
      </p>

      <span
        className="text-gray-500 text-xs dangerously-set-style"
        dangerouslySetInnerHTML={{ __html: data?.report_description }}
      />
    </div>
  );
};
