"use client";

import { Skeleton } from "@/components/Skeleton";
import ReactSelectFesyar from "@/components/fesyar/react-select-fesyar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActiveProgram } from "@/hooks/useActiveProgram";
import { useCummulative } from "@/hooks/useCummulative";
import useSearchParamsEntries from "@/lib/use-searchparams-entries";
import { toMoney } from "@/lib/utils";
import { HeartIcon, SparklesIcon, TicketIcon, UsersIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { HorasGradientText } from "./horas-gradient-text";
import { HorasHeaderSection } from "./horas-header-section";
import LayoutHoras from "./horas-layout";

const HorasReportPage = () => {
  const { programPayload, programOptions } = useActiveProgram();
  const { date_start: urlDateStart = "", date_end: urlDateEnd = "" } = useSearchParamsEntries();

  const [selectedProgramId, setSelectedProgramId] = useState(programPayload?.corp_program_id);
  const [dateStart, setDateStart] = useState(urlDateStart);
  const [dateEnd, setDateEnd] = useState(urlDateEnd);

  useEffect(() => {
    setSelectedProgramId(programPayload?.corp_program_id);
  }, [programPayload?.corp_program_id]);

  useEffect(() => {
    setDateStart(urlDateStart);
    setDateEnd(urlDateEnd);
  }, [urlDateStart, urlDateEnd]);

  const { data, isLoading } = useCummulative(dateStart, dateEnd, 10000, selectedProgramId);

  const report = data?.data?.[0];

  const handleProgramChange = useCallback((option: any | null) => {
    setSelectedProgramId(option?.id || "");
  }, []);

  const activeOption = programOptions.find((opt) => opt.id === selectedProgramId);

  return (
    <LayoutHoras footer="landing-page" header={false}>
      <HorasHeaderSection />
      <section className="max-w-7xl grid place-items-center mx-auto mt-8 md:mt-16">
        {isLoading || !selectedProgramId ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-start">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="w-full h-[125px]" />
            ))}
          </div>
        ) : (
          <div className="space-y-4 w-full">
            <div className="flex flex-col md:flex-row gap-4 w-full justify-between items-end">
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

              <div className="flex-col gap-2 w-full md:w-fit text-white">
                <Label className="text-xs text-inherit">Periode</Label>
                <div className="flex items-center gap-1">
                  <Input
                    type="date"
                    className="px-2 border rounded-md text-black"
                    value={dateStart}
                    onChange={(e) => setDateStart(e.target.value)}
                  />
                  <span className="text-xs text-inherit">Sampai</span>
                  <Input
                    type="date"
                    className="px-2 border rounded-md text-black"
                    value={dateEnd}
                    onChange={(e) => setDateEnd(e.target.value)}
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
                    <div className="bg-gradient-to-br from-[#03B7AC] to-[#01464B] p-4 rounded-2xl shadow-lg">
                      <HeartIcon className="text-white" size={40} fill="currentColor" />
                    </div>

                    <div className="space-y-2 flex-1">
                      <h3 className="text-fesyar-green-50 text-lg font-medium uppercase tracking-wider">Total Wakaf</h3>
                      <HorasGradientText className="text-3xl">
                        Rp. {toMoney(report?.total_paid_donation)}
                      </HorasGradientText>
                    </div>
                  </div>
                </div>
              </div>

              {/* Total Donation Card */}
              <div className="group relative h-full">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#01464B] via-[#03B7AC] to-[#01464B] rounded-3xl  opacity-20 blur group-hover:opacity-75 transition-opacity duration-500" />
                <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl transform hover:scale-105 transition-all duration-500 hover:shadow-fesyar-yellow-800/50">
                  <div className="flex items-center justify-between gap-4">
                    <div className="bg-gradient-to-br from-[#03B7AC] to-[#01464B] p-4 rounded-2xl shadow-lg">
                      <UsersIcon className="text-white" size={40} />
                    </div>

                    <div className="space-y-2 flex-1">
                      <h3 className="text-fesyar-green-50 text-lg font-medium uppercase tracking-wider">Total Wakif</h3>
                      <HorasGradientText className="text-3xl">
                        {toMoney(report?.count_donation)} Orang
                      </HorasGradientText>
                    </div>
                  </div>
                </div>
              </div>

              {/* Total Voucher */}
              <div className="group relative h-full">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#01464B] via-[#03B7AC] to-[#01464B] rounded-3xl  opacity-20 blur group-hover:opacity-75 transition-opacity duration-500" />
                <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl transform hover:scale-105 transition-all duration-500 hover:shadow-fesyar-yellow-800/50">
                  <div className="flex items-center justify-between gap-4">
                    <div className="bg-gradient-to-br from-[#03B7AC] to-[#01464B] p-4 rounded-2xl shadow-lg">
                      <TicketIcon className="text-white" size={40} fill="currentColor" />
                    </div>

                    <div className="space-y-2 flex-1">
                      <h3 className="text-fesyar-green-50 text-lg font-medium uppercase tracking-wider">
                        Total Voucher
                      </h3>
                      <HorasGradientText className="text-3xl">{toMoney(report?.count_redeem_code)}</HorasGradientText>
                    </div>
                  </div>
                </div>
              </div>

              {/* Total Voucher Redeem */}
              <div className="group relative h-full">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#01464B] via-[#03B7AC] to-[#01464B] rounded-3xl  opacity-20 blur group-hover:opacity-75 transition-opacity duration-500" />
                <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl transform hover:scale-105 transition-all duration-500 hover:shadow-fesyar-yellow-800/50">
                  <div className="flex items-center justify-between gap-4">
                    <div className="bg-gradient-to-br from-[#03B7AC] to-[#01464B] p-4 rounded-2xl shadow-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="40"
                        height="40"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-ticket-check-icon lucide-ticket-check text-white"
                      >
                        <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
                        <path d="m9 12 2 2 4-4" />
                      </svg>
                    </div>

                    <div className="space-y-2 flex-1">
                      <h3 className="text-fesyar-green-50 text-lg font-medium uppercase tracking-wider">
                        Total Voucher Digunakan
                      </h3>
                      <HorasGradientText className="text-3xl">{toMoney(report?.count_has_redeem)}</HorasGradientText>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className=" bg-gradient-to-tr from-[#01464B]/80 via-[#03B7AC]/80 to-[#01464B]/80 backdrop-blur-xl rounded-3xl p-8 border border-yellow-400/80 w-full">
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <SparklesIcon className="text-fesyar-yellow-300" size={32} />
                <div className="text-xl text-white font-semibold text-center">
                  Bersama{" "}
                  <HorasGradientText className="inline-flex text-xl">
                    {toMoney(report?.count_donation)}
                  </HorasGradientText>{" "}
                  wakif, kita telah mengumpulkan{" "}
                  <HorasGradientText className="inline-flex text-xl">
                    Rp. {toMoney(report?.total_paid_donation)}
                  </HorasGradientText>{" "}
                  untuk kebaikan wakaf
                </div>
                <HeartIcon className="text-pink-400" size={32} fill="currentColor" />
              </div>
            </div>
          </div>
        )}
      </section>
    </LayoutHoras>
  );
};

export default HorasReportPage;
