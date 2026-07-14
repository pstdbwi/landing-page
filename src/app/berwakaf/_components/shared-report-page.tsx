"use client";

import { Skeleton } from "@/components/Skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActiveProgram } from "@/hooks/useActiveProgram";
import { useCummulative } from "@/hooks/useCummulative";
import useSearchParamsEntries from "@/lib/use-searchparams-entries";
import { qs, toMoney } from "@/lib/utils";
import { HeartIcon, SparklesIcon, UsersIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { GradientText } from "./gradient-text";

interface SharedReportPageProps {
  Layout: React.ComponentType<{ children: React.ReactNode; footer: "landing-page" | "detail-page" }>;
}

export const SharedReportPage = ({ Layout }: SharedReportPageProps) => {
  const router = useRouter();
  const { programPayload } = useActiveProgram();
  const { date_start = "", date_end = "", ...searchParams } = useSearchParamsEntries();
  const { data, isLoading } = useCummulative(date_start, date_end, 10000, programPayload?.corp_program_id);

  const report = data?.data?.[0];

  return (
    <Layout footer="detail-page">
      <section className="max-w-7xl grid place-items-center mx-auto mt-8 md:mt-16">
        {isLoading || !programPayload?.corp_program_id ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-start">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="w-full h-[125px]" />
            ))}
          </div>
        ) : (
          <div className="space-y-4 w-full">
            <div className="flex flex-col md:flex-row gap-4 w-full justify-end">
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
