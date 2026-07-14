"use client";
import { Badge } from "@/components/Badge";
import { Header } from "@/components/Header";
import { HistoryCard } from "@/components/HistoryCard";
import Lucide from "@/components/Icon/lucide";
import { Navigation } from "@/components/Navigation";
import { CampaignListSkeleton, Skeleton } from "@/components/Skeleton";
import useSession from "@/lib/use-session";
import { cn } from "@/lib/utils";
import { getUserDonationList } from "@/services/donation";
import { visitor } from "@/services/visitor";
import { useVisitorHistory } from "@/store/visitor";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";

export default function Profile() {
  const { session } = useSession();
  const router = useRouter();
  const { store, storeVisitorHistory } = useVisitorHistory();
  const [selectedSort, setSelectedSort] = useState<number>(0);
  const sort = [
    {
      id: 0,
      name: "Semua",
      status: "",
    },
    {
      id: 1,
      name: "Berhasil",
      status: "verified",
    },
    {
      id: 2,
      name: "Dibatalkan",
      status: "cancelled",
    },
    {
      id: 3,
      name: "Menunggu Pembayaran",
      status: "pending",
    },
  ];

  const fetchNewCampaign = async ({ pageParam = "" }): Promise<any> => {
    const res = await getUserDonationList(pageParam, sort[selectedSort].status);
    return res;
  };

  const { isLoading, isError, data, hasNextPage, fetchNextPage, isFetching, refetch } = useInfiniteQuery({
    queryKey: ["donation-list", sort[selectedSort].status],
    queryFn: fetchNewCampaign,
    getNextPageParam: (nextPage: any) => (nextPage?.next ? nextPage?.next : null),
    staleTime: 60000,
    enabled: session?.isLoggedIn,
  });

  useEffect(() => {
    refetch();
  }, [selectedSort, refetch]);

  const RenderFilter = () => {
    if ((isLoading && isFetching) || isError) {
      return (
        <div className="inline-flex items-center w-full border-b py-3 px-5">
          <Skeleton className="w-full rounded-sm h-6" />
        </div>
      );
    }

    return (
      <div className="text-center w-full inline-flex justify-start space-x-2 items-center border-b p-3 overflow-x-auto">
        {sort.map((item: Record<string, any>, index: number) => {
          return (
            <Badge
              key={index}
              className={cn(
                "cursor-pointer font-normal whitespace-nowrap",
                item.id === selectedSort ? "bg-primary-500 text-white" : "border border-gray-400 text-gray-400 bg-white"
              )}
              onClick={() => {
                setSelectedSort(item.id);
              }}
            >
              {item.name}
            </Badge>
          );
        })}
      </div>
    );
  };

  const RenderDonoationList = () => {
    if ((isLoading && isFetching) || isError) {
      return <CampaignListSkeleton orientation="vertical" />;
    }

    if ((data && data?.pages[0]?.length === 0) || (data && data?.pages[0] === null)) {
      return (
        <div className="flex flex-col items-center gap-5 justify-center w-full py-5">
          <div className="space-y-2 text-center">
            <h1 className="text-base font-bold">Tidak ditemukan donasi</h1>
            <p className="text-sm text-gray-500">Saat ini tidak ditemukan donasi</p>
          </div>
        </div>
      );
    }

    return (
      <div className="pb-24">
        <InfiniteScroll
          // @ts-ignore
          loadMore={fetchNextPage}
          pageStart={0}
          hasMore={hasNextPage}
          loader={
            <div className="w-full inline-flex justify-center my-3" key={0}>
              <Lucide name="loader" size={20} className="animate-spin" />
            </div>
          }
          initialLoad={true}
          useWindow
        >
          {/**@ts-ignore */}
          {data?.pages?.map((group, i) => (
            <React.Fragment key={i}>
              {group?.data?.map((item: Record<string, any>, index: number) => (
                <HistoryCard
                  key={index}
                  title={item.campaign.title}
                  id={item.id}
                  cover={item.campaign.banner_url}
                  category={item.campaign.campaign_category.name}
                  created={item.created}
                  status={item.status.name}
                  donationAmount={item.amount}
                  campaignType={item?.campaign?.type}
                />
              ))}
            </React.Fragment>
          ))}
        </InfiniteScroll>
      </div>
    );
  };

  useEffect(() => {
    async function runVisit() {
      const result = await visitor({ user: session, page: "history", store });
      if (result) {
        storeVisitorHistory({ page: "history" });
      }
    }

    if (session?.corp_id) {
      runVisit();
    }

    if (!session?.isLoggedIn) {
      router.push("/login");
    }
  }, [session]);

  return (
    <section className="layout bg-white min-h-screen">
      <Header className="left-0 top-0" />
      <section className="pt-16">
        <RenderFilter />
      </section>
      <section className="p-5">
        <RenderDonoationList />
      </section>
      <Navigation />
    </section>
  );
}
