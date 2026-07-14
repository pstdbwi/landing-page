"use client";

import { Skeleton } from "@/components/Skeleton";
import ReactSelectFesyar from "@/components/fesyar/react-select-fesyar";
import { EposGradientText } from "@/components/shared-program/epos/epos-gradient-text";
import { EposHeaderSection } from "@/components/shared-program/epos/epos-header-section";
import LayoutEpos from "@/components/shared-program/epos/epos-layout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActiveProgram } from "@/hooks/useActiveProgram";
import { useCummulative } from "@/hooks/useCummulative";
import useSearchParamsEntries from "@/lib/use-searchparams-entries";
import { toMoney } from "@/lib/utils";
import { HeartIcon, SparklesIcon, TicketIcon, UsersIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const cardGlowClassName =
  "absolute inset-0 rounded-2xl bg-gradient-to-r from-[#01464B]/45 via-[#03B7AC]/20 to-[#01464B]/35 blur-2xl opacity-35 transition-opacity duration-500 group-hover:opacity-55";

const cardClassName =
  "relative rounded-2xl border border-white/20 bg-white/[0.075] bg-[radial-gradient(circle_at_top_left,_rgba(1,70,75,0.28),_rgba(255,255,255,0.055)_42%,_rgba(1,70,75,0.16)_100%)] p-8 shadow-2xl shadow-black/20 backdrop-blur-2xl backdrop-saturate-150 transition-all duration-300 hover:-translate-y-1 hover:border-[#03B7AC]/45 hover:bg-white/[0.105]";

const primaryIconClassName =
  "rounded-2xl border border-[#03B7AC]/35 bg-white/[0.12] p-4 shadow-lg backdrop-blur-xl ring-1 ring-white/10";

const EposReportPage = () => {
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
    <LayoutEpos footer="landing-page" header={false}>
      <EposHeaderSection />
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
                <div className={cardGlowClassName} />
                <div className={cardClassName}>
                  <div className="flex items-center justify-between gap-4">
                    <div className={primaryIconClassName}>
                      <HeartIcon className="text-[#FFE7A1]" size={40} fill="currentColor" />
                    </div>

                    <div className="space-y-2 flex-1">
                      <h3 className="text-fesyar-green-50 text-lg font-medium uppercase tracking-wider">Total Wakaf</h3>
                      <EposGradientText className="text-3xl">
                        Rp. {toMoney(report?.total_paid_donation)}
                      </EposGradientText>
                    </div>
                  </div>
                </div>
              </div>

              {/* Total Donation Card */}
              <div className="group relative h-full">
                <div className={cardGlowClassName} />
                <div className={cardClassName}>
                  <div className="flex items-center justify-between gap-4">
                    <div className={primaryIconClassName}>
                      <UsersIcon className="text-[#FFE7A1]" size={40} />
                    </div>

                    <div className="space-y-2 flex-1">
                      <h3 className="text-fesyar-green-50 text-lg font-medium uppercase tracking-wider">Total Wakif</h3>
                      <EposGradientText className="text-3xl">{toMoney(report?.count_donation)} Orang</EposGradientText>
                    </div>
                  </div>
                </div>
              </div>

              {/* Total Voucher */}
              <div className="group relative h-full">
                <div className={cardGlowClassName} />
                <div className={cardClassName}>
                  <div className="flex items-center justify-between gap-4">
                    <div className={primaryIconClassName}>
                      <TicketIcon className="text-[#FFE7A1]" size={40} fill="currentColor" />
                    </div>

                    <div className="space-y-2 flex-1">
                      <h3 className="text-fesyar-green-50 text-lg font-medium uppercase tracking-wider">
                        Total Voucher
                      </h3>
                      <EposGradientText className="text-3xl">{toMoney(report?.count_redeem_code)}</EposGradientText>
                    </div>
                  </div>
                </div>
              </div>

              {/* Total Voucher Redeem */}
              <div className="group relative h-full">
                <div className={cardGlowClassName} />
                <div className={cardClassName}>
                  <div className="flex items-center justify-between gap-4">
                    <div className={primaryIconClassName}>
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
                        className="lucide lucide-ticket-check-icon lucide-ticket-check text-[#FFE7A1]"
                      >
                        <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
                        <path d="m9 12 2 2 4-4" />
                      </svg>
                    </div>

                    <div className="space-y-2 flex-1">
                      <h3 className="text-fesyar-green-50 text-lg font-medium uppercase tracking-wider">
                        Total Voucher Digunakan
                      </h3>
                      <EposGradientText className="text-3xl">{toMoney(report?.count_has_redeem)}</EposGradientText>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full rounded-2xl border border-white/20 bg-white/[0.075] bg-[linear-gradient(135deg,_rgba(1,70,75,0.24),_rgba(255,255,255,0.06)_44%,_rgba(3,183,172,0.14))] p-8 shadow-2xl shadow-black/20 backdrop-blur-2xl backdrop-saturate-150">
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <SparklesIcon className="text-[#FFE7A1]" size={32} />
                <div className="text-xl text-white font-semibold text-center">
                  Bersama{" "}
                  <EposGradientText className="inline-flex text-xl">{toMoney(report?.count_donation)}</EposGradientText>{" "}
                  wakif, kita telah mengumpulkan{" "}
                  <EposGradientText className="inline-flex text-xl">
                    Rp. {toMoney(report?.total_paid_donation)}
                  </EposGradientText>{" "}
                  untuk kebaikan wakaf
                </div>
                <HeartIcon className="text-[#DAB95A]" size={32} fill="currentColor" />
              </div>
            </div>
          </div>
        )}
      </section>
    </LayoutEpos>
  );
};

export default EposReportPage;
