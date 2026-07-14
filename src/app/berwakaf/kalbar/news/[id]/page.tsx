"use client";

import SharedRegionNewsDetailPage from "@/app/berwakaf/_components/shared-region-news-detail-page";
import KalbarLayout from "@/app/berwakaf/kalbar/_components/kalbar-layout";

const NewsArticleDetailPage = ({ params }: { params: { id: string } }) => {
  return <SharedRegionNewsDetailPage params={params} LayoutComponent={KalbarLayout} />;
};

export default NewsArticleDetailPage;
