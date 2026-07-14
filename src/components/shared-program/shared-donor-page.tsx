"use client";

import { Skeleton } from "@/components/Skeleton";
import { CampaignTypeKeys, personByCampaignType } from "@/lib/typeCampaign";
import currencyFormater from "@/lib/utils";
import { getDonationList } from "@/services/campaign";
import { useGetCampaignDetail } from "@/services/campaign/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import { AlertTriangle, LoaderIcon, User, UserCircle } from "lucide-react";
import moment from "moment";
import "moment/locale/id";
import React from "react";
import InfiniteScroll from "react-infinite-scroller";

interface SharedDonorPageProps {
  campaignId: string;
}

const SharedDonorPage = ({ campaignId }: SharedDonorPageProps) => {
  const {
    data: campaign,
    isLoading: isCampaignLoading,
    isError: isErrorCampaign,
  } = useGetCampaignDetail({ campaignId });

  if (isCampaignLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="w-1/2 h-5 rounded" />
        <Skeleton className="w-full h-[80px] rounded-md" />
        <Skeleton className="w-full h-[80px] rounded-md" />
        <Skeleton className="w-full h-[80px] rounded-md" />
      </div>
    );
  }

  if (isErrorCampaign) {
    return (
      <section className="flex flex-col items-center justify-center py-16 text-center bg-fesyar-green-700/10 backdrop-blur-xl rounded-xl border-gray-200 border-2">
        <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-full bg-red-500/10 mb-6">
          <AlertTriangle className="w-6 h-6 sm:w-10 sm:h-10 text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-red-400 mb-2">Gagal Memuat Data</h3>
        <p className="text-gray-200 max-w-sm text-sm">
          Terjadi kesalahan saat memuat data campaign. Silakan coba lagi nanti.
        </p>
      </section>
    );
  }

  const fetcher = async ({ pageParam = "" }): Promise<any> => {
    const res = await getDonationList(campaignId, pageParam);
    return res;
  };

  const { isLoading, data, hasNextPage, fetchNextPage, isFetching } = useInfiniteQuery({
    queryKey: ["donors-list", campaignId],
    queryFn: fetcher,
    getNextPageParam: (nextPage: any) => (nextPage?.next ? nextPage?.next : null),
    staleTime: 60000,
  });

  if (isLoading && isFetching) {
    return (
      <div className="space-y-5">
        {Array.from({ length: 3 }, (_, index) => index).map((_, index) => (
          <Skeleton className="w-full h-[80px] rounded-md" key={index} />
        ))}
      </div>
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
          <UserCircle className="w-6 h-6 sm:w-10 sm:h-10 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">Belum Ada Wakif</h3>
        <p className="text-gray-200 max-w-sm text-sm">
          Saat ini belum ada wakif yang berpartisipasi di campaign ini. Jadilah yang pertama untuk memberikan dukungan.
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
        <div className="space-y-5">
          {data?.pages?.map((group, i) => (
            <React.Fragment key={i}>
              {group?.data?.map((item: Record<string, any>, idx: number) => {
                let unixTimestamp = item?.verified;
                let momentObj = moment.unix(unixTimestamp);
                let timeAgo = momentObj.fromNow();

                return (
                  <div
                    key={idx}
                    className="w-full rounded-xl p-4 backdrop-blur-[7.5px] border border-white/50 relative overflow-hidden"
                    style={{
                      background: "linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(78, 78, 78, 0.08) 100%)",
                    }}
                  >
                    <div className="flex flex-row items-center justify-between gap-4">
                      {/* LEFT */}
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white/80 to-white flex items-center justify-center shrink-0 border border-white/50">
                          <User className="w-4 h-4 text-fesyar-yellow-800" />
                        </div>

                        <div className="flex flex-col">
                          <p className="font-semibold text-white text-sm">
                            {item?.is_anonymous
                              ? personByCampaignType[campaign?.type as CampaignTypeKeys] || "Hamba Allah"
                              : item?.wakif_name}
                          </p>
                          {!item?.is_anonymous &&
                            (item?.corp_unit_lvl1_name ||
                              item?.corp_unit_lvl2_name ||
                              item?.corp_unit_lvl3_name ||
                              item?.corp_unit_province_name) && (
                              <>
                                <div className="text-[0.625rem] flex flex-wrap gap-x-1 text-white/80 mt-0.5">
                                  {[
                                    item?.corp_unit_lvl1_name && (
                                      <span key="lvl1" className="font-bold">
                                        {item.corp_unit_lvl1_name}
                                      </span>
                                    ),
                                    item?.corp_unit_lvl2_name && (
                                      <span key="lvl2" className="font-semibold">
                                        {item.corp_unit_lvl2_name}
                                      </span>
                                    ),
                                    item?.corp_unit_lvl3_name && (
                                      <span key="lvl3" className="font-medium">
                                        {item.corp_unit_lvl3_name}
                                      </span>
                                    ),
                                  ]
                                    .filter(Boolean)
                                    .map((val, index, arr) => (
                                      <React.Fragment key={index}>
                                        {val}
                                        {index !== arr.length - 1 && " | "}
                                      </React.Fragment>
                                    ))}
                                </div>
                                <div className="text-[0.625rem] flex flex-wrap gap-x-1 text-white/80 mt-0.5">
                                  {[
                                    item?.corp_unit_province_name,
                                    item?.corp_unit_city_name,
                                    item?.corp_unit_district_name,
                                  ]
                                    .filter(Boolean)
                                    .map((val, index, arr) => (
                                      <React.Fragment key={index}>
                                        {val}
                                        {index !== arr.length - 1 && ", "}
                                      </React.Fragment>
                                    ))}
                                </div>
                              </>
                            )}
                          <p className="text-white/50 text-xs mt-1">{timeAgo}</p>
                        </div>
                      </div>

                      {/* RIGHT */}
                      <div className="space-y-1 flex flex-col justify-end items-end shrink-0">
                        <p className="text-xs text-white/70 font-light">Mendonasikan</p>
                        <p className="text-transparent bg-clip-text bg-fesyar-gold font-semibold whitespace-nowrap text-sm">
                          Rp {currencyFormater(item?.amount)}
                        </p>
                      </div>
                    </div>
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

export default SharedDonorPage;
