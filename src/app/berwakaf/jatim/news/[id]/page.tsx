"use client";

import SharedRegionNewsDetailPage from "@/app/berwakaf/_components/shared-region-news-detail-page";
import JatimLayout from "@/app/berwakaf/jatim/_components/jatim-layout";

const NewsArticleDetailPage = ({ params }: { params: { id: string } }) => {
  return <SharedRegionNewsDetailPage params={params} LayoutComponent={JatimLayout} />;
};

export default NewsArticleDetailPage;
