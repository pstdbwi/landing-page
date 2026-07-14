"use client";

import ReactSelectFesyar from "@/components/fesyar/react-select-fesyar";
import { Skeleton } from "@/components/Skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCummulativePrograms } from "@/hooks/useCummulative";
import { useSumutPrograms } from "@/hooks/useSumutPrograms";
import useSearchParamsEntries from "@/lib/use-searchparams-entries";
import { qs, toMoney } from "@/lib/utils";
import { HeartIcon, SparklesIcon, UsersIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GradientText } from "../../_components/gradient-text";

interface SumutReportPageProps {
  Layout: React.ComponentType<{ children: React.ReactNode; footer: "landing-page" | "detail-page" }>;
}

// programOptions is now fetched dynamically using useSumutPrograms hook

export const SumutReportPage = ({ Layout }: SumutReportPageProps) => {
  const router = useRouter();
  const { data: programsData, isLoading: isProgramsLoading } = useSumutPrograms();
  const programOptions = programsData?.programOptions || [];
  const allIds = programsData?.allIds || "";

  const { date_start = "", date_end = "", special_section_id = "all", ...searchParams } = useSearchParamsEntries();
  const [selectedProgramId, setSelectedProgramId] = useState(special_section_id);

  useEffect(() => {
    setSelectedProgramId(special_section_id);
  }, [special_section_id]);

  const queryId = selectedProgramId === "all" ? allIds : selectedProgramId;
  const { data, isLoading: isReportLoading } = useCummulativePrograms(date_start, date_end, 10000, queryId);

  const report = data?.data?.[0];
  const activeOption = programOptions.find((opt) => opt.id === selectedProgramId) || programOptions[0];

  const handleProgramChange = (option: any) => {
    setSelectedProgramId(option.id);
    router.replace(`?` + qs({ ...searchParams, special_section_id: option.id, date_start, date_end }));
  };

  const showVoucherCards = activeOption?.address === "program.wakafsumutberkah.id" || selectedProgramId === "all";

  const isLoading = isProgramsLoading || isReportLoading;

  return (
    <Layout footer="detail-page">
      <section className="max-w-7xl grid place-items-center mx-auto mt-8 md:mt-16">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-start w-full">
            {Array.from({ length: showVoucherCards ? 4 : 2 }).map((_, index) => (
              <Skeleton
                key={index}
                className="w-full h-[125px] bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20"
              />
            ))}

            <div className="col-span-full">
              <Skeleton className="w-full h-[125px] bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20" />
            </div>
          </div>
        ) : (
          <div className="space-y-4 w-full">
            <div className="flex flex-col md:flex-row gap-4 w-full justify-between items-center">
              {programOptions.length > 0 && (
                <div className="w-full sm:max-w-xs">
                  <ReactSelectFesyar
                    name="special_section_id"
                    placeholder="Pilih Program"
                    options={programOptions}
                    value={activeOption}
                    onChange={handleProgramChange}
                    variant="gold"
                    className="text-xs text-center"
                  />
                </div>
              )}

              <div className="flex-col gap-2 w-full md:w-fit self-end">
                <Label className="text-xs text-white">Periode</Label>
                <div className="flex items-center gap-1">
                  <Input
                    type="date"
                    className="px-2 border rounded-md"
                    value={date_start}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      router.replace(`?` + qs({ ...searchParams, date_start: newValue, date_end }));
                    }}
                  />
                  <span className="text-xs text-white">Sampai</span>
                  <Input
                    type="date"
                    className="px-2 border rounded-md"
                    value={date_end}
                    onChange={(e) => {
                      const newValue = e.target.value;

                      router.replace(`?` + qs({ ...searchParams, date_start, date_end: newValue }));
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-x-6 gap-y-4 mb-12 w-full">
              {/* Total Donors Card */}
              <div className="group relative h-full">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#01464B] via-[#03B7AC] to-[#01464B] rounded-3xl opacity-30 blur group-hover:opacity-75 transition-opacity duration-500" />
                <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl transform hover:scale-105 transition-all duration-500 hover:shadow-fesyar-green-500/50">
                  <div className="flex items-center justify-between gap-4">
                    <div className="bg-gradient-to-br from-fesyar-green-400 to-fesyar-green-600 p-4 rounded-2xl shadow-lg">
                      <HeartIcon className="text-white" size={40} fill="currentColor" />
                    </div>

                    <div className="space-y-2 flex-1">
                      <h3 className="text-fesyar-green-50 text-lg font-medium uppercase tracking-wider">Total Wakaf</h3>
                      <GradientText className="text-3xl">Rp. {toMoney(report?.total_paid_donation)}</GradientText>
                    </div>
                  </div>
                </div>
              </div>

              {/* Total Donation Card */}
              <div className="group relative h-full">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#01464B] via-[#03B7AC] to-[#01464B] rounded-3xl  opacity-20 blur group-hover:opacity-75 transition-opacity duration-500" />
                <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl transform hover:scale-105 transition-all duration-500 hover:shadow-fesyar-yellow-800/50">
                  <div className="flex items-center justify-between gap-4">
                    <div className="bg-gradient-to-br from-fesyar-green-400 to-fesyar-green-600 p-4 rounded-2xl shadow-lg">
                      <UsersIcon className="text-white" size={40} />
                    </div>

                    <div className="space-y-2 flex-1">
                      <h3 className="text-fesyar-green-50 text-lg font-medium uppercase tracking-wider">Total Wakif</h3>
                      <GradientText className="text-3xl">{toMoney(report?.count_donation)} Orang</GradientText>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className=" bg-gradient-to-tr from-[#01464B]/80 via-[#03B7AC]/80 to-[#01464B]/80 backdrop-blur-xl rounded-3xl p-8 border border-yellow-400/80 w-full">
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <SparklesIcon className="text-fesyar-yellow-300" size={32} />
                <div className="text-xl text-white font-semibold text-center">
                  Bersama <GradientText className="inline-flex text-xl">{toMoney(report?.count_donation)}</GradientText>{" "}
                  wakif, kita telah mengumpulkan{" "}
                  <GradientText className="inline-flex text-xl">
                    Rp. {toMoney(report?.total_paid_donation)}
                  </GradientText>{" "}
                  untuk kebaikan wakaf
                </div>
                <HeartIcon className="text-pink-400" size={32} fill="currentColor" />
              </div>
            </div>
          </div>
        )}
      </section>
    </Layout>
  );
};
