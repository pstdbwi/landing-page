"use client";
import { Empty } from "@/components/Empty";
import { Label } from "@/components/Label";
import { NewsCard } from "@/components/NewsCard";
import { RadioGroup, RadioGroupItem } from "@/components/Radio";
import { CampaignListSkeleton } from "@/components/Skeleton";
import { cn } from "@/lib/utils";
import { getNewsListByCampaignId } from "@/services/news";
import { INews } from "@/types/news";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ArrowDownUpIcon, ArrowLeftIcon, LayoutGridIcon, Loader2Icon, XIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import InfiniteScroll from "react-infinite-scroller";

interface Props {
  params: { campaignId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

const News = ({ params }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams()!;

  const sortType = searchParams.get("sort") || "terbaru";

  const [gridView, setGridView] = useState(false);
  const [openType, setOpenType] = React.useState(false);
  const [openSort, setOpenSort] = React.useState<boolean>(false);
  const [sort] = useState<Array<{ id: number; name: string }>>([
    {
      id: 1,
      name: "terbaru",
    },
    {
      id: 2,
      name: "terlama",
    },
  ]);

  const fetchNews = async ({ pageParam = "", sort = sortType }): Promise<any> => {
    const res = await getNewsListByCampaignId(sort, pageParam, params?.campaignId);

    return res;
  };

  const { isLoading, data, hasNextPage, isError, fetchNextPage, isFetching } = useInfiniteQuery({
    queryKey: ["news", params?.campaignId, sortType],
    queryFn: fetchNews,
    getNextPageParam: (nextPage: any) => (nextPage?.next ? nextPage?.next : null),
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });

  if (isLoading && isFetching) {
    return (
      <div className="relative layout bg-white min-h-screen">
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
      <section className="layout bg-white relative min-h-screen ">
        <div className="w-full bg-primary-600 text-white flex items-center px-3 h-[60px] fixed layout">
          <Link href={`/campaign/${params?.campaignId}`}>
            <ArrowLeftIcon size={18} />
          </Link>

          <p className="ml-5 font-semibold">Kabar Terbaru</p>
        </div>

        <div className="h-screen grid place-items-center">
          <Empty type="news" />
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="layout bg-white relative min-h-screen ">
        <div className="w-full bg-primary-600 text-white flex items-center px-3 h-[60px] fixed layout">
          <Link href={`/campaign/${params?.campaignId}`}>
            <ArrowLeftIcon size={18} />
          </Link>

          <p className="ml-5 font-semibold">Kabar Terbaru</p>
        </div>

        <div className="h-screen grid place-items-center">
          <Empty type="news" />
        </div>
      </section>
    );
  }

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams();
    params.set(name, value);

    return params.toString();
  };

  return (
    <section className="layout bg-white relative min-h-screen ">
      <div className="w-full bg-primary-600 text-white flex items-center px-3 h-[60px] fixed layout">
        <Link href={`/campaign/${params?.campaignId}`}>
          <ArrowLeftIcon size={18} />
        </Link>

        <p className="ml-5 font-semibold">Kabar Terbaru</p>
      </div>
      {/* MENU */}
      <div className="grid grid-cols-3 border-b z-50 mt-16 fixed layout w-full bg-white">
        <div
          className="border-r p-4 inline-flex items-center justify-center gap-2 cursor-pointer"
          onClick={() => {}}
        ></div>
        <button
          className="p-4 inline-flex items-center justify-center gap-2 border-r "
          onClick={() => setGridView(!gridView)}
        >
          <LayoutGridIcon size={18} className="text-gray-500" />
        </button>
        <div className="p-4 inline-flex items-center justify-center gap-2 cursor-pointer" onClick={() => {}}></div>
      </div>{" "}
      <div className="grid grid-cols-2 border-b z-50 mt-16 fixed layout w-full bg-white">
        <button
          className="border-r p-4 inline-flex items-center justify-center gap-2 cursor-pointer"
          onClick={() => {
            setOpenType(false);
            setOpenSort(!openSort);
          }}
        >
          <ArrowDownUpIcon size={18} className="text-gray-500" />
          <Label className="text-gray-500">Urutkan</Label>
        </button>
        <button
          className="p-4 inline-flex items-center justify-center gap-2 border-r "
          onClick={() => setGridView(!gridView)}
        >
          <LayoutGridIcon size={18} className="text-gray-500" />
        </button>
      </div>
      <section className="p-5 space-y-4 pt-[135px]">
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
              <div className={cn("grid", gridView ? "grid-cols-2 gap-3" : "grid-cols-1 gap-2")}>
                {group?.data?.map((items: INews, index: number) => {
                  return (
                    <Link key={index} href={`/campaign/${params?.campaignId}/news/${items?.id}`}>
                      <NewsCard news={items} variant={gridView ? "vertical" : "default"} />
                    </Link>
                  );
                })}
              </div>
            </React.Fragment>
          ))}
        </InfiniteScroll>
      </section>
      {openSort ? (
        <div className="fixed bottom-0 w-full rounded-t-2xl bg-white px-5 pb-4 layout z-40">
          <div className="w-full relative mb-8">
            <button onClick={() => setOpenSort(!openSort)}>
              <XIcon name="x" size={20} className="absolute left-2 bottom-0" />
            </button>
            <h1 className="text-base font-semibold text-center">Urutkan</h1>
          </div>
          <RadioGroup defaultValue={sortType} className="space-y-3">
            {sort.map((sort, index: number) => {
              return (
                <div
                  key={index}
                  className="flex items-center justify-between space-x-2"
                  onClick={() => {
                    router.push(pathname + "?" + createQueryString("sort", sort.name));
                  }}
                >
                  <Label htmlFor={sort.name} className="flex items-center gap-2">
                    <span className="text-base font-semibold">{sort.name}</span>
                  </Label>
                  <RadioGroupItem value={sort.name} id={sort.name} />
                </div>
              );
            })}
          </RadioGroup>
        </div>
      ) : null}
      {openSort || openType ? <div aria-hidden className="h-full bg-black/20 w-full absolute top-0 z-20"></div> : null}
    </section>
  );
};

export default News;

// const NewsCard = ({ data }: { data: (typeof newsData)[number] }) => {
//   const getExcerpt = (html: string) => {
//     const tempDiv = document.createElement("div");
//     tempDiv.innerHTML = html;
//     const firstP = tempDiv.querySelector("p");
//     return firstP ? firstP.outerHTML : html;
//   };

//   return (
//     <div>
//       {/* PROFILE */}
//       <div className="inline-flex items-center space-x-3 mt-2">
//         <Avatar className="h-8 w-8">
//           <AvatarImage src={data?.profile?.image} alt={"Lembaga"} className="object-center object-cover bg-gray-100" />
//           <AvatarFallback>{data?.profile?.name?.substring(0, 1)}</AvatarFallback>
//         </Avatar>
//         <div className="space-y-1">
//           <h1 className="text-xs ">{data?.profile?.name}</h1>
//           <h2 className="text-[10px] text-gray-500">{data?.time}</h2>
//         </div>
//       </div>

//       {/* TITTLE */}
//       <p className="font-semibold my-3">{data?.title}</p>

//       {/* SHORT PREVIEW DESCRIPTION */}
//       <div
//         className="prose prose-sm max-w-none text-xs leading-relaxed"
//         dangerouslySetInnerHTML={{
//           __html: getExcerpt(data?.description),
//         }}
//       />

//       {/* Short preview with fade effect */}
//       {/* <div className="relative">
//         <div
//           className="text-xs leading-relaxed line-clamp-3 prose prose-sm max-w-none"
//           dangerouslySetInnerHTML={{ __html: getExcerpt(data?.description) }}
//         /> */}
//       {/* Fade overlay */}
//       {/* <div className="absolute bottom-0 left-0 w-full h-6 bg-gradient-to-t from-white to-transparent" />
//       </div> */}

//       {/* SELENGKAPNYA ALWAYS AVAILABLE */}
//       <Dialog>
//         <DialogTrigger asChild>
//           <button className="pt-5 pb-3 bg-white border-b text-blue-500 text-xs font-semibold w-full text-left">
//             Selengkapnya
//           </button>
//         </DialogTrigger>
//         <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto prose prose-sm">
//           <h2 className="text-sm font-semibold">{data?.title}</h2>
//           <div className="text-xs leading-relaxed" dangerouslySetInnerHTML={{ __html: data?.description }} />
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };
