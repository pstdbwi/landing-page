"use client"
import Lucide from "@/components/Icon/lucide";
import { Label } from "@/components/Label";
import { PressReleaseCard } from "@/components/PressReleaseCard";
import { VerticalCardSkeleton } from "@/components/Skeleton";
import { cn } from "@/lib/utils";
import { getPresReleaseList } from "@/services/content";
import { useInfiniteQuery } from "@tanstack/react-query";
import React from "react";
import InfiniteScroll from "react-infinite-scroller";

export default function PressRelease() {
    const [gridView, setGridView] = React.useState<boolean>(false)
    const fetchNewCampaign = async ({ pageParam = '' }): Promise<any> => {
        const res = await getPresReleaseList(
            pageParam
        )
        return res
    }

    const {
        isLoading,
        data,
        hasNextPage,
        fetchNextPage,
        isFetching,
        isError
    } = useInfiniteQuery({
        queryKey: ['press release'],
        queryFn: fetchNewCampaign,
        getNextPageParam: (nextPage: any) => nextPage?.next ? nextPage?.next : null,
        staleTime: 60000,
    })
    const RenderPresReleaseList = () => {
        if (isLoading && isFetching || isError) {
            return <VerticalCardSkeleton />
        }
        return (
            <InfiniteScroll
                // @ts-ignore
                loadMore={fetchNextPage}
                pageStart={0}
                hasMore={hasNextPage}
                loader={
                    <div className="w-full inline-flex justify-center my-3" key={0}>
                        <Lucide name='loader-2' size={20} className="animate-spin" />
                    </div>
                }
                initialLoad={false}
                useWindow
            >
                {/**@ts-ignore */}
                {data?.pages?.map((group, i) => (
                    <React.Fragment key={i}>
                        <div className={cn('grid', gridView ? 'grid-cols-2 gap-3' : 'grid-cols-1 gap-2')}>
                            {group?.map((item: Record<string, any>, index: number) =>
                                <PressReleaseCard
                                    key={index}
                                    id={item.id}
                                    variant={gridView ? 'vertical' : 'default'}
                                    cover={item.thumbnail_url}
                                    title={item.title}
                                    description={item.short_description}
                                    created={item.created}
                                />
                            )}
                        </div>
                    </React.Fragment>
                ))}
            </InfiniteScroll>
        )
    }

    return (
        <section>
            <div className="grid grid-cols-1 border-b z-40">
                {/* <button className="border-r p-4 inline-flex items-center justify-center gap-2">
                    <Lucide name='settings-2' size={18} className="text-gray-500" />
                    <Label className="text-gray-500">Kategori</Label>
                </button>
                <button className="border-r p-4 inline-flex items-center justify-center gap-2">
                    <Lucide name='arrow-up-down' size={18} className="text-gray-500" />
                    <Label className="text-gray-500">Urutkan</Label>
                </button> */}
                <button className="p-4 inline-flex items-center justify-center gap-2" onClick={() => setGridView(!gridView)}>
                    <Lucide name='layout-grid' size={18} className="text-gray-500" />
                </button>
            </div>
            <div className="p-5">
                <RenderPresReleaseList />
            </div>
        </section>
    )
}
