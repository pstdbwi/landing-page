"use client";

import { Button } from "@/components/Button";
import { Header } from "@/components/Header";
import { Skeleton } from "@/components/Skeleton";
import { useGetNewsDetail } from "@/services/news/hooks";

import { INews } from "@/types/news";
import { ArrowLeftIcon, Share2Icon } from "lucide-react";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import Balancer from "react-wrap-balancer";

interface Props {
  params: { campaignId: string; newsId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

const DetailNews = ({ params, searchParams }: Props) => {
  const { data, isLoading, isFetched, isError } = useGetNewsDetail({ newsId: params?.newsId });



  if (isLoading) {
    return (
      <section className="layout bg-white relative min-h-screen">
        <div className="w-full bg-primary-600 text-white flex items-center px-3 h-[60px] fixed layout">
          <Link href={`/campaign/${params?.campaignId}/news`}>
            <ArrowLeftIcon size={18} />
          </Link>

          <p className="ml-5 font-semibold">Kabar Terbaru</p>
        </div>

        <div className="max-w-3xl mx-auto p-6 space-y-4 pt-[80px]">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-96 w-full rounded-lg" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-10/12" />
          <Skeleton className="h-4 w-9/12" />
        </div>
      </section>
    );
  }

  if (isError || !data?.data || data?.data?.length === 0) {
    return (
      <section className="relative bg-white pt-16 layout min-h-screen">
        <Header title="Program Tidak Ditemukan" className="left-0 top-0" />
        <div className="flex flex-col justify-center items-center gap-5 mt-5">
          <Image src="/assets/search.svg" width={200} height={200} alt="search" />
          <div className="text-center w-full">
            <Balancer className="text-base font-bold mb-1">Berita tidak ditemukan</Balancer>
            <Balancer className="text-sm text-gray-500">
              Silahkan cek kembali pencarian program Anda dan coba lagi.
            </Balancer>
          </div>
        </div>
      </section>
    );
  }

  const news: INews = data?.data?.[0];

  const handleShare = () => {
    toast.success("Berhasil salin link");
    navigator.clipboard.writeText(window.location.href);
  };

  return (
    <section className="pb-14 layout bg-white relative min-h-screen">
      <div className="w-full bg-primary-600 text-white flex items-center px-3 h-[60px] fixed layout">
        <Link href={`/campaign/${params?.campaignId}/news`}>
          <ArrowLeftIcon size={18} />
        </Link>

        <p className="ml-5 font-semibold">Kabar Terbaru</p>
      </div>

      <div className="pt-[75px] px-3">
        {/* Thumbnail */}
        <Image
          src={news?.thumbnail_url}
          alt={news?.title}
          className="w-full rounded-lg object-cover max-h-[400px]"
          width={200}
          height={400}
        />

        {/* Header Berita */}
        <div className="flex items-start justify-between mt-4 mb-6">
          <div className="space-y-2 max-w-[85%]">
            <h1 className="text-lg font-bold leading-tight">{news?.title}</h1>
            <div className="text-xs text-gray-500">
              {news?.author_name} · {moment(news?.published_at).format("DD/MM/YYYY HH:mm")}
            </div>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={handleShare}
            className="text-muted-foreground"
            aria-label="Salin link berita"
          >
            <Share2Icon className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <article
          className="prose prose-sm sm:prose lg:prose-lg prose-p:leading-relaxed prose-img:rounded-lg max-w-none mt-10 dangerously-set-style text-sm"
          dangerouslySetInnerHTML={{ __html: news.body }}
        />
      </div>

      <Toaster position="bottom-center" />
    </section>
  );
};

export default DetailNews;
