"use client";

import { CampaignCard } from "@/components/CampaignCard";
import { Empty } from "@/components/Empty";
import { Label } from "@/components/Label";
import { RadioGroup, RadioGroupItem } from "@/components/Radio";
import { CampaignListSkeleton } from "@/components/Skeleton";
import React, { Suspense, useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getCampaignBasedTypeList } from "@/services/campaign";
import { useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroller";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { SUB_DOMAIN } from "@/constant/sub-domain";
import { corporateProgram } from "@/services/corporate";
import { ICorporatesProgram } from "@/types/corporate";
import { ArrowUpDownIcon, LayoutGridIcon, Loader2Icon, Settings2Icon, XIcon } from "lucide-react";
import useSession from "@/lib/use-session";

const Header = dynamic(() => import("@/components/Header").then((mod) => mod.Header));

const category = [
  {
    id: 1,
    name: "Wakaf Uang",
    query: "wakaf-uang",
    icon: "/assets/ic-wakaf-uang.svg",
  },
  {
    id: 2,
    name: "Wakaf Sosial",
    query: "wakaf-sosial",
    icon: "/assets/ic-wakaf-sosial.svg",
  },
  {
    id: 3,
    name: "Wakaf Produktif",
    query: "wakaf-produktif",
    icon: "/assets/ic-wakaf-produktif.svg",
  },
  {
    id: 4,
    name: "Wakaf Uang Kemenag",
    query: "wakaf-uang-kemenag",
    icon: "/assets/ic-kemenag.svg",
  },
];

const sort = [
  {
    id: 1,
    name: "terbaru",
  },
  {
    id: 2,
    name: "terlama",
  },
];

function Explore() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams()!;
  const pageType = searchParams.get("type");
  const sortType = searchParams.get("sort") || "terbaru";
  const [subProgram, setSubProgram] = useState<ICorporatesProgram | null>(null);

  const [openCategory, setOpenCategory] = useState(false);
  const [openSort, setOpenSort] = useState(false);
  const [gridView, setGridView] = useState(false);

  const { session } = useSession();
  const corpId = session?.corp_id || subProgram?.corp_id || "";

  const fetchCampaign = async ({ pageParam = "", sort = sortType }): Promise<any> => {
    const res = await getCampaignBasedTypeList(pageType || "", sort, pageParam, corpId, subProgram?.id || "");
    return res;
  };

  const { isLoading, data, hasNextPage, isError, fetchNextPage, isFetching } = useInfiniteQuery({
    queryKey: ["campaign", pageType, subProgram, corpId],
    queryFn: fetchCampaign,
    getNextPageParam: (nextPage: any) => (nextPage?.next ? nextPage?.next : null),
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams();
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const Wrapper = ({ children }: { children: React.ReactNode }): JSX.Element => (
    <div className="relative layout bg-white min-h-screen">
      <Header title="Semua Program" className="left-0 top-0" searchIcon backTo="/" />

      {/* MENU */}
      <div className="grid grid-cols-3 border-b z-50 mt-16 fixed layout w-full bg-white">
        <button
          className="border-r p-4 inline-flex items-center justify-center gap-2 cursor-pointer"
          onClick={() => {
            setOpenCategory(!openCategory);
            setOpenSort(false);
          }}
        >
          <Settings2Icon size={18} className="text-gray-500" />
          <Label className="text-gray-500">Kategori</Label>
        </button>
        <button
          className="border-r p-4 inline-flex items-center justify-center gap-2 cursor-pointer"
          onClick={() => {
            setOpenSort(!openSort);
            setOpenCategory(false);
          }}
        >
          <ArrowUpDownIcon size={18} className="text-gray-500" />
          <Label className="text-gray-500">Urutkan</Label>
        </button>
        <button className="p-4 inline-flex items-center justify-center gap-2" onClick={() => setGridView(!gridView)}>
          <LayoutGridIcon size={18} className="text-gray-500" />
        </button>
      </div>

      {children}
    </div>
  );

  const RenderCampaignList = (): JSX.Element => {
    if (isLoading && isFetching) {
      return <CampaignListSkeleton orientation="vertical" />;
    }

    if (
      (data && data?.pages[0]?.length === 0) ||
      (data && data?.pages[0] === null) ||
      (data && data?.pages?.[0]?.data === null)
    ) {
      return <Empty type="campaign" />;
    }

    if (isError) {
      return <Empty type="campaign" />;
    }

    return (
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
              {group?.data?.map((items: Record<string, any>, index: number) => (
                <CampaignCard
                  key={index}
                  campaignId={items.id}
                  title={items.title}
                  campaigner={items.lembaga}
                  cover={items.image}
                  expired={items.expired}
                  donationTarget={items.donation_target}
                  variant={gridView ? "vertical" : "default"}
                  location={`${items.location.district} , ${items.location.city}`}
                  donationAmount={items.final_donation_amount}
                  campaignType={items?.type}
                  isPermanent={items?.is_permanent}
                />
              ))}
            </div>
          </React.Fragment>
        ))}
      </InfiniteScroll>
    );
  };

  useEffect(() => {
    async function runGetCoporateProgram(address: string) {
      try {
        const result = await corporateProgram({ address });
        if (result?.length > 0) {
          const program = result?.[0];
          setSubProgram(program);
          localStorage.setItem("sub-program", JSON.stringify(program));
        }
      } catch (error) {
        console.error("something wrong when get data...");
      }
    }

    // handle UI & Data if not apps.satuwakaf.id
    if (typeof window) {
      const URL =
        window?.location?.host == "fesyarsumatra.satuwakaf.id" ? "fesyarsumatera.satuwakaf.id" : window?.location?.host;
      const isSub = SUB_DOMAIN.includes(URL);

      const programLS = localStorage.getItem("sub-program");
      if (isSub) {
        !programLS ? runGetCoporateProgram(URL) : setSubProgram(JSON.parse(programLS));
      }
    }
  }, [searchParams]);

  return (
    <Wrapper>
      <section className="p-5 space-y-4 pt-[135px]">
        <RenderCampaignList />
      </section>

      {/* DIALOG CATEGORY */}
      {openCategory ? (
        <div className="fixed bottom-0 w-full rounded-t-2xl bg-white px-5 pb-4 layout z-40">
          <div className="w-full relative mb-8">
            <button
              onClick={() => {
                setOpenCategory(!openCategory);
                setOpenSort(false);
              }}
            >
              <XIcon size={20} className="absolute left-2 bottom-0" />
            </button>
            <h1 className="text-base font-semibold text-center">Pilih Kategori</h1>
          </div>
          <RadioGroup defaultValue={pageType || ""} className="space-y-3">
            {category.map((cat, index: number) => {
              return (
                <div
                  key={index}
                  className="flex items-center justify-between space-x-2"
                  onClick={() =>
                    router.push(pathname + "?" + createQueryString("type", cat.query)) + "&" + `sort=${sortType}`
                  }
                >
                  <Label htmlFor={cat.query} className="flex items-center gap-2">
                    <div className="bg-[#F0F9ED] rounded-xl">
                      {cat.icon ? <img src={cat?.icon} className="w-4" /> : null}
                    </div>
                    <span className="text-base font-semibold">{cat.name}</span>
                  </Label>
                  <RadioGroupItem value={cat.query} id={cat.query} />
                </div>
              );
            })}
          </RadioGroup>
        </div>
      ) : null}

      {/* DIALOG SORT */}
      {openSort ? (
        <div className="fixed bottom-0 w-full rounded-t-2xl bg-white px-5 pb-4 layout z-40">
          <div className="w-full relative mb-8">
            <button
              onClick={() => {
                setOpenSort(!openSort);
                setOpenCategory(false);
              }}
            >
              <XIcon size={20} className="absolute left-2 bottom-0" />
            </button>
            <h1 className="text-base font-semibold text-center">Urutkan</h1>
          </div>
          <RadioGroup defaultValue="terbaru" className="space-y-3">
            {sort.map((sort, index: number) => {
              return (
                <div
                  key={index}
                  className="flex items-center justify-between space-x-2"
                  onClick={() =>
                    router.push(pathname + "?" + `type=${pageType}` + "&" + createQueryString("sort", sort.name))
                  }
                >
                  <Label htmlFor={sort.name} className="flex items-center gap-2">
                    <span className="text-base font-semibold capitalize">{sort.name}</span>
                  </Label>
                  <RadioGroupItem value={sort.name} id={sort.name} />
                </div>
              );
            })}
          </RadioGroup>
        </div>
      ) : null}

      {/* OVERLAY */}
      {openCategory || openSort ? <div aria-hidden className="h-full bg-black/20 w-full absolute top-0"></div> : null}
    </Wrapper>
  );
}

export default function ExplorePage() {
  return (
    <Suspense>
      <Explore />
    </Suspense>
  );
}
