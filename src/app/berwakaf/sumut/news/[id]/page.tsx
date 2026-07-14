"use client";

import SharedRegionNewsDetailPage from "@/app/berwakaf/_components/shared-region-news-detail-page";
import SumutLayout from "@/app/berwakaf/sumut/_components/sumut-layout";

const NewsArticleDetailPage = ({ params }: { params: { id: string } }) => {
  return <SharedRegionNewsDetailPage params={params} LayoutComponent={SumutLayout} />;
};

export default NewsArticleDetailPage;
