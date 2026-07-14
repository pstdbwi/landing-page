// NewsPage.tsx
"use client";

import { FesyarNewsArticleCard } from "@/components/Card/fesyar-news-article-card";
import { FesyarCardSkeleton } from "@/components/fesyar/landing-page/fesyar-card-skeleton";
import { FesyarHeaderSection } from "@/components/fesyar/landing-page/fesyar-header-section";
import FesyarNavButton from "@/components/fesyar/landing-page/fesyar-nav";
import LayoutFesyar from "@/components/fesyar/layout-fesyar";
import { useGetContents } from "@/services/content/hooks";
import { useFeatureFlag } from "@/store/feature-flag-context";
import Image from "next/image";

const FesyarNewsArticlePage = () => {
  const { currentDomain } = useFeatureFlag();
  const { data: contents, isLoading: isLoadingContents } = useGetContents({});

  return (
    <LayoutFesyar footer="landing-page" header={false}>
      <FesyarHeaderSection />

      <section className="bg-transparent max-w-7xl mx-auto flex justify-center mt-5 gap-3 items-center">
        <FesyarNavButton />
      </section>

      <section className="bg-transparent z-20 pb-10 mt-5 max-w-7xl mx-auto">
        {isLoadingContents ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-start">
            {Array.from({ length: 6 }).map((_, index) => (
              <FesyarCardSkeleton key={index} />
            ))}
          </div>
        ) : contents?.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-5 mt-5">
            {contents?.map((item: any) => (
              <FesyarNewsArticleCard
                key={item?.id}
                id={item?.id}
                title={item?.title}
                thumbnail_url={item?.thumbnail_url}
                short_description={item?.short_description}
                created={item?.created}
              />
            ))}
          </div>
        ) : (
          <div className="flex mt-20 z-50 flex-col !w-full items-center justify-center gap-3">
            <Image src="/assets/fesyar/file-search.svg" height={300} width={300} alt="Not Found" className="z-50" />
            <p className="text-white text-sm tracking-wider z-50">{`Belum ada program di ${currentDomain}`}</p>
          </div>
        )}
      </section>
    </LayoutFesyar>
  );
};

export default FesyarNewsArticlePage;
