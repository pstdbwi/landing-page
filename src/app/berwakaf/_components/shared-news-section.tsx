"use client";

import { useGetContents } from "@/services/content/hooks";
import { useFeatureFlag } from "@/store/feature-flag-context";
import { INews } from "@/types/news";
import { ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { Skeleton } from "../../../components/Skeleton";
import SharedContentCard from "./shared-content-card";

interface Props {}

const BerwakafNews = ({}: Props) => {
  const { specialSectionId } = useFeatureFlag();
  const { data, isLoading } = useGetContents({ special_section_id: specialSectionId, limit: "15", type_ids: "3,4,5" });
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  if (isLoading) {
    return (
      <section className="mt-6">
        <div className="mb-4">
          <Skeleton className="w-[200px] h-[25px] rounded-md" />
        </div>
        <div className="inline-flex gap-5 overflow-x-auto w-full pb-5">
          {Array.from({ length: 3 }, (_, index) => index).map((_, index) => (
            <Skeleton className="w-[250px] h-[250px] lg:w-[450px] lg:h-[450px] rounded-md flex-shrink-0" key={index} />
          ))}
        </div>
      </section>
    );
  }

  const handleNewsClick = (news: INews) => {
    router.push(`/news/${news?.id}`);
  };

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -500, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 500, behavior: "smooth" });
  };

  return (
    <section className="space-y-3">
      <h1 className="text-white font-bold text-lg lg:text-2xl">Berita & Artikel Wakaf</h1>

      {data?.data?.length > 0 ? (
        <div className="space-y-3">
          <div className="flex items-center w-full justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={scrollLeft}
                className="group bg-white p-2 hover:bg-fesyar-red-500 rounded-full shadow transition"
              >
                <ChevronLeftIcon className="w-3 h-3 lg:w-5 lg:h-5 text-fesyar-red-500 group-hover:text-white" />
              </button>

              {/* Tombol kanan */}
              <button
                onClick={scrollRight}
                className="group z-20 bg-white hover:bg-fesyar-red-500 p-2 rounded-full shadow transition"
              >
                <ChevronRightIcon className="w-3 h-3 lg:w-5 lg:h-5 text-fesyar-red-500 group-hover:text-white" />
              </button>
            </div>

            <Link
              href={`/news`}
              className="text-xs lg:text-sm flex items-center gap-1 py-1.5 px-3 font-medium rounded-lg bg-fesyar-gold hover:opacity-90 tracking-wide text-fesyar-green-500 transition-all duration-200"
            >
              Lihat Semua
              <ArrowRightIcon className="inline-flex w-5" />
            </Link>
          </div>

          <div className="relative">
            {/* Left fog */}
            <div className="z-10 rounded-lg pointer-events-none absolute top-0 left-0 h-full w-12 bg-gradient-to-r from-white/30 to-transparent" />
            {/* Right fog */}
            {data?.data?.length > 4 && (
              <div className="z-10 rounded-lg pointer-events-none absolute top-0 right-0 h-full w-12 bg-gradient-to-l from-white/30 to-transparent" />
            )}

            <div ref={scrollRef} className="flex flex-nowrap gap-5 overflow-x-auto w-full scrollbar-hide rounded-lg">
              {data?.data?.map((content: INews) => (
                <SharedContentCard
                  key={content?.id}
                  className="flex-none w-[250px] lg:w-[500px]"
                  news={content}
                  onClick={handleNewsClick}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-glass-gradient p-8 rounded-lg flex mt-5 z-50 flex-col !w-full items-center justify-center gap-3">
          <Image src="/assets/fesyar/file-search.svg" height={150} width={150} alt="No Campaigns" className="z-50" />
          <p className="text-white text-sm tracking-wider font-semibold">Belum ada berita & artikel</p>
        </div>
      )}
    </section>
  );
};

export default BerwakafNews;
