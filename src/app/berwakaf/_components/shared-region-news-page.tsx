"use client";

import { SharedContentCategory } from "@/app/berwakaf/_components/shared-content-category";
import { SharedSorting } from "@/app/berwakaf/_components/shared-sorting";

import { Skeleton } from "@/components/Skeleton";
import { useTogglePanel } from "@/hooks/useTogglePanel";
import useSearchParamsEntries from "@/lib/use-searchparams-entries";
import { getContents } from "@/services/content";
import { useFeatureFlag } from "@/store/feature-flag-context";
import { INews } from "@/types/news";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import InfiniteScroll from "react-infinite-scroller";
import SharedContentCard from "./shared-content-card";

const fetchNewContents = async ({ pageParam = "", specialSectionId = "", sort = "", type_id = "" }): Promise<any> => {
  const res = await getContents({
    special_section_id: specialSectionId,
    next: pageParam,
    type_ids: type_id ? type_id : "3,4,5",
    sort,
    limit: "9",
  });
  return res;
};

interface SharedRegionNewsPageProps {
  title: string;
  LayoutComponent: React.ComponentType<{ children: React.ReactNode; footer: "landing-page" | "detail-page" }>;
}

const SharedRegionNewsPage = ({ title, LayoutComponent }: SharedRegionNewsPageProps) => {
  const { specialSectionId } = useFeatureFlag();
  const searchParams = useSearchParamsEntries();
  const router = useRouter();
  const { sort = "terbaru", content_type = "" } = searchParams;
  const { close, toggle, isOpen, isVisible } = useTogglePanel();

  const {
    isLoading,
    data: newsList,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["contents", searchParams, specialSectionId],
    queryFn: ({ pageParam = 0 }) => fetchNewContents({ pageParam, specialSectionId, sort, type_id: content_type }),
    getNextPageParam: (nextPage: any) => (nextPage?.next ? nextPage?.next : null),
    staleTime: 60000,
  });

  if (isLoading) {
    return (
      <section className="mt-6">
        <div className="mb-4">
          <Skeleton className="w-[200px] h-[25px] rounded-md" />
        </div>
        <div className="grid grid-cols-3 gap-5">
          {Array.from({ length: 3 }, (_, index) => index).map((_, index) => (
            <Skeleton className="w-full h-[350px] rounded-md flex-shrink-0" key={index} />
          ))}
        </div>
      </section>
    );
  }

  const handleNewsClick = (news: INews) => {
    router.push(`/news/${news?.id}`);
  };

  return (
    <LayoutComponent footer="detail-page">
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row gap-2 items-center justify-between">
          <h1 className="text-2xl font-semibold text-white">{title}</h1>

          <div className="flex items-center gap-2">
            <SharedSorting
              isOpen={isOpen("sorting")}
              isVisible={isVisible("sorting")}
              onToggle={() => toggle("sorting")}
              onClose={() => close("sorting")}
            />

            <SharedContentCategory
              isOpen={isOpen("content_type")}
              isVisible={isVisible("content_type")}
              onToggle={() => toggle("content_type")}
              onClose={() => close("content_type")}
            />
          </div>
        </div>
        <InfiniteScroll
          // @ts-ignore
          loadMore={(page) => {
            fetchNextPage();
          }}
          pageStart={0}
          hasMore={hasNextPage}
          loader={
            <div className="w-full inline-flex justify-center my-3" key={0}>
              <Loader2Icon className="animate-spin w-8 text-gray-600" />
            </div>
          }
          initialLoad={false}
          className="space-y-4"
          useWindow
        >
          {newsList?.pages?.map((group, i) => (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4" key={i}>
              {group?.data?.map((news: INews, index: number) => (
                <SharedContentCard key={index} news={news} onClick={handleNewsClick} />
              ))}
            </div>
          ))}
        </InfiniteScroll>
      </div>
    </LayoutComponent>
  );
};

export default SharedRegionNewsPage;
