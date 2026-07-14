"use client";
import LayoutReport from "@/components/Layout/layout-report";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/Select";
import { Skeleton } from "@/components/Skeleton";
import { useGetListReportCampaignPrograms } from "@/services/report/hooks";
import { useRouter } from "next/navigation";

const ReportProgram = () => {
  const navigation = useRouter();
  const { data, isLoading, isError } = useGetListReportCampaignPrograms({});

  if (isLoading) {
    return (
      <LayoutReport>
        <div className="mt-40 flex items-center justify-center flex-col">
          <Skeleton className="mt-4 h-12 w-1/2 rounded-md mb-2" />
          <Skeleton className="w-1/3 h-7 rounded-md mb-2" />
          <Skeleton className="w-1/2 h-7 rounded-md mb-2" />
        </div>
      </LayoutReport>
    );
  }

  return (
    <LayoutReport>
      <div className="py-4 grid place-items-center h-[80dvh] w-full">
        <div className="flex items-center flex-col w-full space-y-2">
          <h1 className="text-xl md:text-3xl font-bold">Rekap dan Detil Campaign</h1>
          <p className="text-sm">Pilih Campaign Terlebih Dahulu</p>
          <Select
            onValueChange={(value) => {
              navigation.push(`/report/program/${value}`);
            }}
          >
            <SelectTrigger className="w-full max-w-sm">
              <SelectValue placeholder="Pilih Campaign" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {data?.data?.items?.map((item: { id: string; title: string }) => (
                <SelectGroup key={item?.id}>
                  <SelectItem value={item?.id}>{item?.title}</SelectItem>
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </LayoutReport>
  );
};

export default ReportProgram;
