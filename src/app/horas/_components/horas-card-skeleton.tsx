"use client";

import { Skeleton } from "@/components/Skeleton";

export function HorasCardSkeleton({}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="w-[410px] h-[350px] flex-shrink-0 border border-gray-200/50 overflow-hidden rounded-xl">
      <Skeleton className="w-full h-[200px] mb-3" />
      <div className="px-2 space-y-3">
        <Skeleton className="w-full h-[25px] rounded-lg" />
        <Skeleton className="w-full h-[25px] rounded-lg" />
        <Skeleton className="w-full h-[5px]" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="w-full h-[30px] rounded-lg" />
          <Skeleton className="w-full h-[30px] rounded-lg" />
        </div>
      </div>
    </div>
  );
}
