"use client";

import { Badge } from "@/components/Badge";
import { Card, CardContent } from "@/components/Card";
import { CampaignListSkeleton, Skeleton } from "@/components/Skeleton";
import { buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import useSession from "@/lib/use-session";
import { cn } from "@/lib/utils";
import { getApplicationListByDonorId } from "@/services/donor";
import { IApplication } from "@/types/applicant";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ArrowLeftIcon, Loader2Icon } from "lucide-react";
import moment from "moment";
import "moment/locale/id";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import InfiniteScroll from "react-infinite-scroller";

export default function About() {
  const router = useRouter();
  const { session } = useSession();
  const donorId = session?.id;
  const pathname = usePathname();

  const [selectedSort, setSelectedSort] = useState<number>(0);
  const sort = [
    {
      id: 0,
      name: "Semua",
      status: "",
    },
    {
      id: 1,
      name: "Menunggu",
      status: "waiting",
    },
    {
      id: 2,
      name: "Ditolak",
      status: "rejected",
    },
    {
      id: 3,
      name: "Disetujui",
      status: "approved",
    },
    {
      id: 4,
      name: "Selesai",
      status: "Done",
    },
  ];

  const fetchApplications = async ({ pageParam = "", donor_id = donorId }): Promise<any> => {
    const res = await getApplicationListByDonorId({ donor_id, next: pageParam, status: sort[selectedSort].status });

    return res;
  };

  const { isLoading, data, hasNextPage, isError, fetchNextPage, isFetching } = useInfiniteQuery({
    queryKey: ["applications", donorId, sort[selectedSort].status],
    queryFn: fetchApplications,
    getNextPageParam: (nextPage: any) => (nextPage?.next ? nextPage?.next : null),
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });

  const RenderFilter = () => {
    if ((isLoading && isFetching) || isError) {
      return (
        <div className="inline-flex items-center w-full border-b py-3 px-5">
          <Skeleton className="w-full rounded-sm h-6" />
        </div>
      );
    }

    return (
      <div className="text-center w-full inline-flex justify-start space-x-2 items-center border-b p-3 overflow-x-auto">
        {sort.map((item: Record<string, any>, index: number) => {
          return (
            <Badge
              key={index}
              className={cn(
                "cursor-pointer font-normal whitespace-nowrap",
                item.id === selectedSort ? "bg-primary-500 text-white" : "border border-gray-400 text-gray-400 bg-white"
              )}
              onClick={() => {
                setSelectedSort(item.id);
              }}
            >
              {item.name}
            </Badge>
          );
        })}
      </div>
    );
  };

  if (isLoading && isFetching) {
    return (
      <div className="p-4">
        <CampaignListSkeleton orientation="vertical" />
      </div>
    );
  }

  if (
    (data && data?.pages[0]?.length === 0) ||
    (data && data?.pages[0] === null) ||
    (data && data?.pages?.[0]?.data === null) ||
    (data && data?.pages?.[0]?.data?.length === 0)
  ) {
    return (
      <section>
        <RenderFilter />

        <div className="grid place-items-center ">
          <div className="flex flex-col gap-4 items-center justify-center">
            <Image src="/assets/empty.svg" width={220} height={220} alt="empty" fetchPriority="auto" />
            <Label className="text-xl font-semibold text-gray-700">Belum ada pengajuan yang dibuat</Label>
            <p className="text-sm text-gray-500 text-center max-w-sm">
              Silakan ajukan permohonan manfaat baru melalui halaman utama.
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <div className="grid place-items-center h-[60vh]">
        <div className="flex flex-col gap-4 items-center justify-center">
          <Image src="/assets/empty.svg" width={220} height={220} alt="error" fetchPriority="auto" />
          <Label className="text-xl font-semibold text-red-600">Terjadi kesalahan</Label>
          <p className="text-sm text-gray-500 text-center max-w-sm">
            Gagal memuat data pengajuan. Silakan coba lagi beberapa saat kemudian.
          </p>
          <Link href={"/"} className={buttonVariants({ variant: "outline" })}>
            <ArrowLeftIcon className="w-4 mr-1" /> Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section>
      <RenderFilter />

      <section className="p-5 space-y-4 ">
        <InfiniteScroll
          // @ts-ignore
          loadMore={fetchNextPage}
          pageStart={0}
          hasMore={hasNextPage}
          loader={
            <div className="w-full inline-flex justify-center my-3" key={0}>
              <Loader2Icon size={20} className="animate-spin" />
            </div>
          }
          initialLoad={false}
          useWindow
        >
          {/**@ts-ignore */}
          {data?.pages?.map((group, i) => (
            <React.Fragment key={i}>
              <div className={cn("grid-cols-1 gap-2 grid")}>
                {group?.data?.map((item: IApplication, index: number) => {
                  return (
                    <Link key={index} href={`/accounts/propose/${item.id}`}>
                      <ApplicationCard data={item} />
                    </Link>
                  );
                })}
              </div>
            </React.Fragment>
          ))}
        </InfiniteScroll>
      </section>
    </section>
  );
}

interface IApplicationCardProps {
  data: IApplication;
}

function ApplicationCard({ data }: IApplicationCardProps) {
  const createdAt = moment(data.created_at).locale("id").format("DD MMMM YYYY");

  const statusLabel: Record<string, string> = {
    waiting: "Menunggu",
    approved: "Disetujui",
    rejected: "Ditolak",
    done: "Selesai",
  };

  return (
    <Card className="w-full max-w-[450px] shadow-sm border rounded-xl overflow-hidden">
      <CardContent className="p-4 flex flex-col gap-3">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-base font-semibold text-gray-800">{data?.applicant_name}</h2>
            <p className="text-sm text-gray-500">{data?.campaign_title}</p>
          </div>
          <Badge variant={data?.status as any} className="capitalize">
            {statusLabel[data?.status] ?? data?.status}
          </Badge>
        </div>

        {/* Extra Info */}
        <div className="mt-2 space-y-1 text-sm text-gray-600">
          <div className="flex">
            <span className="w-20 font-medium">Dibuat</span>
            <span>: {createdAt}</span>
          </div>
          <div className="flex">
            <span className="w-20 font-medium">Bank</span>
            <span>
              : {data?.bank_name} - {data?.bank_account_name}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
