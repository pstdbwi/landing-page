"use client";

import { useGetContentDetail } from "@/services/content/hooks";
import React from "react";

const FesyarNewsArticleDetailPage = ({ params }: { params: { id: string } }) => {
  const { data: contentDetail, isLoading: isLoadingContentDetail } = useGetContentDetail({ id: params.id });

  return <div>{contentDetail?.title}</div>;
};

export default FesyarNewsArticleDetailPage;
