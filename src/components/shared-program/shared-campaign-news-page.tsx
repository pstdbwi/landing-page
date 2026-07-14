"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getNewsListByCampaignId } from "@/services/news";
import { INews } from "@/types/news";
import { useInfiniteQuery } from "@tanstack/react-query";
import { AlertTriangle, Loader2Icon, Newspaper } from "lucide-react";
import moment from "moment";
import "moment/locale/id";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";

interface SharedCampaignNewsPageProps {
  campaignId: string;
}

const SharedCampaignNewsPage = ({ campaignId }: SharedCampaignNewsPageProps) => {
  const fetchNews = async ({ pageParam = "", sort = "terbaru" }): Promise<any> => {
    const res = await getNewsListByCampaignId(sort, pageParam, campaignId);
    return res;
  };

  const { isLoading, data, hasNextPage, isError, fetchNextPage, isFetching } = useInfiniteQuery({
    queryKey: ["news", campaignId],
    queryFn: fetchNews,
    getNextPageParam: (nextPage: any) => (nextPage?.next ? nextPage?.next : null),
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });

  if (isLoading && isFetching) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="border-2 border-white w-full rounded-lg p-4 text-white animate-pulse bg-white/5">
            <div className="w-2/3 h-5 bg-white/20 mb-2 rounded" />
            <div className="w-1/3 h-3 bg-white/20 mb-4 rounded" />
            <div className="w-full h-[253px] bg-white/10 rounded-lg mb-4" />
            <div className="w-full h-4 bg-white/10 rounded mb-2" />
            <div className="w-[80%] h-4 bg-white/10 rounded" />
          </div>
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
        <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-full bg-white/50 mb-6">
          <Newspaper className="w-6 h-6 sm:w-10 sm:h-10 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">Belum Ada Berita</h3>
        <p className="text-gray-200 max-w-md text-sm">
          Saat ini belum ada berita terkait campaign ini. Silakan cek kembali nanti untuk mendapatkan update terbaru.
        </p>
      </section>
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
          Terjadi kesalahan saat memuat data campaign. Silakan coba lagi nanti.
        </p>
      </section>
    );
  }

  return (
    <div className="space-y-5">
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
            {group?.data?.map((item: INews, index: number) => {
              return (
                <NewsCard
                  key={index}
                  index={index}
                  title={item.title}
                  date={moment(item?.published_at).format("MMMM Do YYYY")}
                  content={item.body}
                  image={item.thumbnail_url}
                />
              );
            })}
          </React.Fragment>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default SharedCampaignNewsPage;

interface NewsCardProps {
  index: number;
  title: string;
  date: string;
  content: string;
  image?: string;
}

const NewsCard = ({ index, title, date, content, image }: NewsCardProps) => {
  const [isOverflowing, setIsOverflowing] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = contentRef.current;
    if (el && el.scrollHeight > 200) {
      setIsOverflowing(true);
    }
  }, []);

  return (
    <div
      className="border-2 border-white w-full rounded-lg p-4 text-white backdrop-blur-3xl mb-5"
      style={{
        background: "linear-gradient(119deg, rgba(255, 255, 255, 0.20) 2.36%, rgba(78, 78, 78, 0.15) 97.64%)",
      }}
    >
      <h2 className="text-xl font-bold line-clamp-2 mb-2">{title}</h2>

      <p className="text-sm mb-4">{date}</p>

      <div className="relative w-full h-[253px] rounded-lg mb-4 overflow-hidden">
        {image ? (
          <Image src={image} alt="Campaign banner" fill className="object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
            Gambar tidak tersedia
          </div>
        )}
      </div>

      <div
        ref={contentRef}
        className="text-sm text-white max-h-[200px] overflow-hidden relative"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      <div className="w-full flex justify-end">
        {isOverflowing && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" className="text-fesyar-yellow-500 text-sm mt-2 cursor-pointer">
                Lihat Selengkapnya
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription></DialogDescription>
              </DialogHeader>
              <div
                className="text-sm text-gray-700 mt-4 space-y-2 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};
