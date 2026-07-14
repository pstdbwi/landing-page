"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/Avatar";
import { CampaignCard } from "@/components/CampaignCard";
import { Input } from "@/components/Input";
import { CampaignListSkeleton, Skeleton } from "@/components/Skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Tab";
import { SUB_DOMAIN } from "@/constant/sub-domain";
import useSession from "@/lib/use-session";
import { getSearchCampaignList, getSearchLembagaList } from "@/services/campaign";
import { corporateProgram } from "@/services/corporate";
import { ICorporatesProgram } from "@/types/corporate";
import { debounce } from "lodash";
import { ArrowLeftIcon } from "lucide-react";
import moment from "moment";
import "moment/locale/id";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import Balancer from "react-wrap-balancer";

function Search() {
  const { session } = useSession();
  const [isSubDomain, setIsSubDomain] = useState(false);
  const [subProgram, setSubProgram] = useState<ICorporatesProgram | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [campaignResponse, setCampaignResponse] = React.useState<Record<string, any>>([]);
  const [lembagaResponse, setLembagaResponse] = React.useState<Record<string, any>>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const searchQueryParams = searchParams.get("query") || "";
  const corpId = Array.isArray(subProgram) ? subProgram?.[0]?.corp_id : session?.corp_id ? session?.corp_id : "";
  const subProgramIds = Array.isArray(subProgram) ? subProgram?.map((item) => item?.id)?.join(",") : "";
  const [inputValue, setInputValue] = useState(searchQueryParams);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams();
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const fetchCampaignList = async ({ searchQuery = "", corpId = "", corpProgramId = "" }): Promise<any> => {
    const res = await getSearchCampaignList(searchQuery, corpId, corpProgramId);
    return res;
  };

  const fetchLembagaList = async ({ searchQuery = "" }): Promise<any> => {
    const res = await getSearchLembagaList(searchQuery);
    return res;
  };

  const debouncedSearch = useMemo(
    () =>
      debounce(async (query: string) => {
        setLoading(true);

        router.push(pathname + "?" + createQueryString("query", query));

        const campaignRes = await fetchCampaignList({ searchQuery: query, corpId, corpProgramId: subProgramIds });
        const lembagaRes = await fetchLembagaList({ searchQuery: query });

        setCampaignResponse(campaignRes || []);
        setLembagaResponse(lembagaRes || []);
        setLoading(false);
      }, 1500),
    [corpId, subProgramIds]
  );

  const handleSearchQuery = (query: React.ChangeEvent<HTMLInputElement>) => {
    const searchQuery = query.target.value;

    setInputValue(searchQuery);
    debouncedSearch(searchQuery);
  };

  React.useEffect(() => {
    if (searchQueryParams && !inputValue) {
      debouncedSearch(searchQueryParams);
    }
  }, [searchQueryParams]);

  const RenderInfoSearch = () => {
    return (
      <div className="mb-3">
        <p className="text-gray-500 text-sm mb-2">
          Masukkan kata kunci program atau lembaga yang ingin Anda cari, contoh:
        </p>
        <div className="inline-flex space-x-3 items-center">
          <div className="bg-[#F0F9ED] p-1 px-3 rounded-full">
            <span className="text-xs font-semibold">Wakaf sosial</span>
          </div>
          <div className="bg-[#F0F9ED] p-1 px-3 rounded-full">
            <span className="text-xs font-semibold">Wakaf produktif</span>
          </div>
          <div className="bg-[#F0F9ED] p-1 px-3 rounded-full">
            <span className="text-xs font-semibold">Wakaf uang</span>
          </div>
        </div>
      </div>
    );
  };

  const RenderEmptySearch = () => {
    return (
      <div className="p-3">
        <Balancer className="text-gray-500 text-sm">
          Kami menemukan <b>0</b> program / lembaga dengan kata kunci <b>{searchQueryParams}</b>
        </Balancer>
        <div className="flex flex-col justify-center items-center gap-5 mt-5">
          <Image src="/assets/search.svg" width={200} height={200} alt="search" />
          <div className="text-center w-full">
            <Balancer className="text-base font-bold mb-1">Pencarian tidak ditemukan</Balancer>
            <Balancer className="text-sm text-gray-500">Silahkan cek kembali pencarian Anda dan coba lagi.</Balancer>
          </div>
        </div>
      </div>
    );
  };

  const RenderCampaignList = () => {
    if (loading) {
      return (
        <React.Fragment>
          <Skeleton className="w-full h-10 mb-5 rounded-md" />
          <CampaignListSkeleton orientation="vertical" />
        </React.Fragment>
      );
    }

    const RenderCampaignCard = () => {
      if (campaignResponse.length <= 0) {
        return <RenderEmptySearch />;
      }

      return campaignResponse.map((campaign: Record<string, any>, index: number) => {
        return (
          <CampaignCard
            key={index}
            campaignId={campaign.id}
            title={campaign.title}
            cover={campaign.image}
            expired={campaign.expired}
            donationTarget={campaign.donation_target}
            donationAmount={campaign.final_donation_amount}
            location={`${campaign.location.district} , ${campaign.location.city}`}
            campaigner={campaign.lembaga}
            campaignType={campaign?.type}
            isPermanent={campaign?.is_permanent}
          />
        );
      });
    };

    const RenderLembagaCard = () => {
      if (lembagaResponse.length <= 0) {
        return <RenderEmptySearch />;
      }
      return lembagaResponse.map((item: Record<string, any>, index: number) => {
        return (
          <div key={index}>
            <Link href={`/lembaga/${item.id}`} className="inline-flex items-center gap-3 mb-3 w-full">
              <Avatar className="w-[40px] h-[40px]">
                <AvatarImage src={item.image} />
                <AvatarFallback>{item.name}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-base font-bold">{item.name}</h1>
                <span className="text-xs text-gray-500">{moment.unix(item.joined_at).format("LL")}</span>
              </div>
            </Link>
          </div>
        );
      });
    };

    return (
      <Tabs defaultValue="program" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="program" className="w-full">
            Program
          </TabsTrigger>
          {!isSubDomain ? (
            <TabsTrigger value="lembaga" className="w-full">
              Lembaga
            </TabsTrigger>
          ) : null}
        </TabsList>
        <TabsContent value="program">
          <div className="my-3">
            <RenderCampaignCard />
          </div>
        </TabsContent>
        {!isSubDomain ? (
          <TabsContent value="lembaga">
            <div className="my-5">
              <RenderLembagaCard />
            </div>
          </TabsContent>
        ) : null}
      </Tabs>
    );
  };

  useEffect(() => {
    async function runGetCoporateProgram(address: string) {
      const result = await corporateProgram({ address });
      const current = JSON.stringify(result);
      const saved = localStorage.getItem("sub-program");

      if (current !== saved) {
        localStorage.setItem("sub-program", current);
      }
      setSubProgram(result);
    }

    // handle UI & Data if not apps.satuwakaf.id
    if (typeof window) {
      const URL =
        window?.location?.host == "fesyarsumatra.satuwakaf.id" ? "fesyarsumatera.satuwakaf.id" : window?.location?.host;

      const isSub = SUB_DOMAIN.includes(URL);
      setIsSubDomain(isSub);

      if (isSub) {
        runGetCoporateProgram(URL);
      }
    }

    return () => {
      debouncedSearch.cancel();
    };
  }, []);

  return (
    <section className="layout bg-white min-h-screen relative">
      <div className="bg-primary-500 p-5 w-full inline-flex items-center justify-center gap-3">
        <button onClick={() => router.push("/")}>
          <ArrowLeftIcon size={20} color="white" />
        </button>
        <div className="relative w-full block">
          {/* <Lucide name='search' size={20} className="left-2 absolute h-full text-gray-500" /> */}
          <Input
            className="w-full bg-white rounded-full px-3 placeholder:px-1"
            placeholder="cari program kebaikan"
            onChange={(query) => handleSearchQuery(query)}
            value={inputValue}
          />
        </div>
      </div>
      <section className="p-5">
        {!inputValue ? <RenderInfoSearch /> : <RenderCampaignList />}
        {/* <div>
                    <Balancer className="text-base font-semibold mb-3">Pencarian Terakhir</Balancer>
                    <div className="inline-flex justify-between w-full items-center">
                        <Balancer className="text-sm text-gray-500">Zakat</Balancer>
                        <button>
                            <Lucide name='x' size={18} className="text-gray-500" />
                        </button>
                    </div>
                </div> */}
      </section>
    </section>
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <Search />
    </Suspense>
  );
}
