"use client";

import LayoutReport from "@/components/Layout/layout-report";
import { Skeleton } from "@/components/Skeleton";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const page = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/report/campaign");
  }, []);

  return (
    <LayoutReport>
      <Skeleton className="w-4/6 h-7 rounded-md mb-2" />
      <Skeleton className="mt-4 h-12 w-full rounded-md mb-2" />
      <Skeleton className="mt-4 h-24 w-full rounded-md mb-2" />
      <Skeleton className="w-full h-7 rounded-md mb-2" />
      <Skeleton className="w-full h-7 rounded-md mb-2" />
      <Skeleton className="w-full h-7 rounded-md mb-2" />
      <Skeleton className="w-full h-7 rounded-md mb-2" />
      <Skeleton className="w-full h-7 rounded-md mb-2" />
    </LayoutReport>
  );
};

export default page;
