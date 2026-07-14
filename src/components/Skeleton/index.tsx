import { cn } from "@/lib/utils";
import React, { Fragment } from "react";
interface CardSkeletonProps {
  orientation: "default" | "vertical";
}

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse bg-gray-200", className)} {...props} />;
}

function ReportSkeleton({}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Fragment>
      <Skeleton className="w-4/6 h-7 rounded-md mb-2" />
      <Skeleton className="mt-4 h-12 w-full rounded-md mb-2" />
      <Skeleton className="mt-4 h-24 w-full rounded-md mb-2" />
      <Skeleton className="w-full h-7 rounded-md mb-2" />
      <Skeleton className="w-full h-7 rounded-md mb-2" />
      <Skeleton className="w-full h-7 rounded-md mb-2" />
      <Skeleton className="w-full h-7 rounded-md mb-2" />
      <Skeleton className="w-full h-7 rounded-md mb-2" />
    </Fragment>
  );
}

function CardSkeleton({}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="w-[250px] h-[250px] flex-shrink-0 border border-gray-200/50 rounded-md">
      <Skeleton className="w-full h-[100px] mb-3" />
      <div className="px-2 space-y-3">
        <Skeleton className="w-full h-[25px] rounded-md" />
        <Skeleton className="w-10/12 h-[25px] rounded-md" />
        <Skeleton className="w-full h-[5px]" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="w-full h-[30px] rounded-md" />
          <Skeleton className="w-full h-[30px] rounded-md" />
        </div>
      </div>
    </div>
  );
}

function VerticalCardSkeleton({}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="w-full max-h-[140px] grid grid-cols-2 flex-shrink-0 border border-gray-200/50 rounded-md relative mb-4">
      <Skeleton className="w-full h-full" />
      <div className="px-2 space-y-3 my-3 h-full">
        <Skeleton className="w-full h-[20px] rounded-md" />
        <Skeleton className="w-10/12 h-[20px] rounded-md" />
        <Skeleton className="w-full h-[5px]" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="w-full h-[30px] rounded-md" />
          <Skeleton className="w-full h-[30px] rounded-md" />
        </div>
      </div>
    </div>
  );
}

function SkeletonHeaderCampaign() {
  return (
    <div>
      <Skeleton className="w-full h-[50px] rounded-md mb-3" />
      <Skeleton className="w-full h-[50px] rounded-md mb-3" />
      <h1 className="text-gray-500 text-sm">Wakaf terkumpul</h1>
      <div className="border-b py-3 inline-flex justify-between w-full">
        <Skeleton className="w-[150px] h-[20px] rounded-md" />
        <Skeleton className="w-[70px] h-[20px] rounded-md" />
      </div>
    </div>
  );
}

const MenuSkeleton = () => {
  return (
    <div className="flex flex-col p-2 space-y-2 items-center cursor-pointer">
      <div className="bg-[#F0F9ED] rounded-xl">
        <Skeleton className="w-[50px] h-[50px] rounded-md" />
      </div>
      <Skeleton className="w-[70px] h-[20px] rounded-md" />
    </div>
  );
};

const SkeletonMenu = () => {
  return Array.from({ length: 3 }, (_, index) => index).map((_, index) => <MenuSkeleton key={index} />);
};

const CampaignListSkeleton: React.FC<CardSkeletonProps> = ({ orientation }) => {
  return Array.from({ length: 5 }, (_, index) => index).map((_, index) =>
    orientation === "default" ? <CardSkeleton key={index} /> : <VerticalCardSkeleton key={index} />
  );
};

const CardVerticalSkeleton = () => {
  return Array.from({ length: 3 }, (_, index) => index).map((_, index) => (
    <Skeleton className="w-[250px] h-[250px] rounded-md flex-shrink-0" key={index} />
  ));
};

const PaymentListSkeleton = () => {
  return (
    <div>
      <div className="space-y-2 mb-3">
        <Skeleton className="w-3/6 h-7 rounded-md" />
        <Skeleton className="w-4/6 h-5 rounded-md" />
      </div>
      <div className="w-full p-2 rounded-md border space-y-3">
        <Skeleton className="w-full h-10 rounded-md" />
        <Skeleton className="w-full h-10 rounded-md" />
        <Skeleton className="w-full h-10 rounded-md" />
        <Skeleton className="w-full h-10 rounded-md" />
        <Skeleton className="w-full h-10 rounded-md" />
      </div>
    </div>
  );
};

const ProfileSkeleton = () => {
  return (
    <div className="p-5 flex flex-col justify-center items-start w-full gap-4">
      <div className="w-full inline-flex justify-center">
        <Skeleton className="w-[80px] h-[80px] rounded-full" />
      </div>
      <div className="w-full inline-flex justify-center">
        <Skeleton className="w-1/6 mb-2 h-5 rounded-md" />
      </div>
      <div className="border rounded-md w-full">
        <div className="border-b p-2">
          <Skeleton className="w-2/6 mb-2 h-5 rounded-md" />
          <Skeleton className="w-full h-10 rounded-md" />
        </div>
        <div className="border-b p-2">
          <Skeleton className="w-2/6 mb-2 h-5 rounded-md" />
          <Skeleton className="w-full h-10 rounded-md" />
        </div>
        <div className="p-2">
          <Skeleton className="w-2/6 mb-2 h-5 rounded-md" />
          <Skeleton className="w-full h-10 rounded-md" />
        </div>
      </div>
      <div className="w-full bg-gray-100 h-5"></div>
      <div className="border rounded-md w-full inset-x-0">
        <div className="border-b p-2">
          <Skeleton className="w-2/6 mb-2 h-5 rounded-md" />
          <Skeleton className="w-full h-10 rounded-md" />
        </div>
        <div className="p-2">
          <Skeleton className="w-2/6 mb-2 h-5 rounded-md" />
          <Skeleton className="w-full h-10 rounded-md" />
        </div>
      </div>
    </div>
  );
};

const SpecialSectionSkeleton: React.FC<{
  length: number;
}> = ({ length = 1 }) => {
  return Array.from({ length: length }, (_, index) => index).map((_, index) => (
    <section className={cn("p-5", index === 1 ? "bg-secondary-50" : "")} key={index}>
      <div className="mb-4">
        <Skeleton className="w-[200px] h-[30px] rounded-md" />
      </div>
      <div className="inline-flex gap-5 overflow-x-auto w-full pb-5">
        <CardVerticalSkeleton />
      </div>
    </section>
  ));
};

const Imageshimmer = () => `
<svg width="1" height="1" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#333" offset="20%" />
      <stop stop-color="#222" offset="50%" />
      <stop stop-color="#333" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="1" height="1" fill="#333" />
  <rect id="r" width="1" height="1" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-1" to="1" dur="2s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === "undefined" ? Buffer.from(str).toString("base64") : window.btoa(str);

const blurDataURLDefault = () => {
  return `data:image/svg+xml;base64,${toBase64(Imageshimmer())}`;
};

export {
  Skeleton,
  CardSkeleton,
  PaymentListSkeleton,
  ProfileSkeleton,
  VerticalCardSkeleton,
  SkeletonHeaderCampaign,
  CampaignListSkeleton,
  SpecialSectionSkeleton,
  blurDataURLDefault,
  SkeletonMenu,
  ReportSkeleton,
};
