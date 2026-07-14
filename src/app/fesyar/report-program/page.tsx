"use client";

import { EposHeaderSection } from "@/components/shared-program/epos/epos-header-section";
import LayoutEpos from "@/components/shared-program/epos/epos-layout";
import { Skeleton } from "@/components/Skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActiveProgram } from "@/hooks/useActiveProgram";
import { useCummulative } from "@/hooks/useCummulative";
import useSearchParamsEntries from "@/lib/use-searchparams-entries";
import { qs, toMoney } from "@/lib/utils";
import { HeartIcon, SparklesIcon, UsersIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";

const reportCardClass =
  "relative h-full overflow-hidden rounded-2xl border border-[#DAB95A]/35 bg-white/10 p-6 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#FFE7A1]/70 hover:shadow-[#DAB95A]/20";

const iconClass =
  "flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#FFE7A1] via-[#DAB95A] to-[#A9812B] text-[#0C4C55] shadow-lg";

function EposReportPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { activeProgram, programPayload, programOptions } = useActiveProgram();
  const { date_start = "", date_end = "", special_section_id = "", ...searchParams } = useSearchParamsEntries();

  const programId = programPayload?.corp_program_id || "";
  const { data, isLoading: isReportLoading } = useCummulative(date_start, date_end, 10000, programId);
  const report = data?.data?.[0];

  const replaceQuery = useCallback(
    (params: Record<string, string>) => {
      router.replace(`${pathname}?${qs(params)}`, { scroll: false });
    },
    [pathname, router],
  );

  const isLoading = isReportLoading || (!!special_section_id && !activeProgram);
  const hasProgramOptions = programOptions.length > 0;

  return (
    <LayoutEpos footer="detail-page" header={false}>
      <div className="mx-auto flex min-h-dvh w-full max-w-7xl flex-col px-3 pb-36 sm:px-4 ">
        <EposHeaderSection size="small" />

        <section className="mt-6 w-full space-y-5">
          <div className="flex justify-end">
            <div className="w-full md:w-fit">
              <Label className="mb-1 block text-xs text-white">Periode</Label>
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                <Input
                  type="date"
                  className="h-8 rounded-lg border-[#DAB95A]/50 bg-white text-xs text-[#0C4C55]"
                  value={date_start}
                  onChange={(event) =>
                    replaceQuery({
                      ...searchParams,
                      special_section_id,
                      date_start: event.target.value,
                      date_end,
                    })
                  }
                />
                <span className="text-xs text-white">Sampai</span>
                <Input
                  type="date"
                  className="h-8 rounded-lg border-[#DAB95A]/50 bg-white text-xs text-[#0C4C55]"
                  value={date_end}
                  onChange={(event) =>
                    replaceQuery({
                      ...searchParams,
                      special_section_id,
                      date_start,
                      date_end: event.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2">
              {Array.from({ length: 2 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="h-[148px] rounded-2xl border border-[#DAB95A]/25 bg-white/10 backdrop-blur-xl"
                />
              ))}
              <Skeleton className="h-[112px] rounded-2xl border border-[#DAB95A]/25 bg-white/10 backdrop-blur-xl md:col-span-2" />
            </div>
          ) : hasProgramOptions && programId ? (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className={reportCardClass}>
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#FFE7A1] to-transparent" />
                  <div className="flex items-center gap-4">
                    <div className={iconClass}>
                      <HeartIcon className="h-7 w-7" fill="currentColor" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="text-sm font-medium uppercase text-[#DAB95A]">Total Wakaf</h2>
                      <p className="mt-2 break-words text-2xl font-semibold text-white md:text-3xl">
                        Rp. {toMoney(report?.total_paid_donation)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className={reportCardClass}>
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#FFE7A1] to-transparent" />
                  <div className="flex items-center gap-4">
                    <div className={iconClass}>
                      <UsersIcon className="h-7 w-7" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="text-sm font-medium uppercase text-[#DAB95A]">Total Wakif</h2>
                      <p className="mt-2 break-words text-2xl font-semibold text-white md:text-3xl">
                        {toMoney(report?.count_donation)} Orang
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#DAB95A]/60 bg-gradient-to-r from-[#003846]/85 via-[#0C4C55]/85 to-[#003846]/85 p-5 shadow-2xl backdrop-blur-xl">
                <div className="flex flex-wrap items-center justify-center gap-3 text-center text-base font-semibold text-white md:text-xl">
                  <SparklesIcon className="h-7 w-7 shrink-0 text-[#FFE7A1]" />
                  <span>
                    Bersama <span className="text-[#FFE7A1]">{toMoney(report?.count_donation)}</span> wakif, kita telah
                    mengumpulkan <span className="text-[#FFE7A1]">Rp. {toMoney(report?.total_paid_donation)}</span>{" "}
                    untuk kebaikan wakaf.
                  </span>
                  <HeartIcon className="h-7 w-7 shrink-0 text-[#FFE7A1]" fill="currentColor" />
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-[#DAB95A]/35 bg-[#002B34]/70 p-8 text-center text-sm text-white shadow-2xl backdrop-blur-xl">
              Belum ada program Murabbi yang bisa ditampilkan.
            </div>
          )}
        </section>
      </div>
    </LayoutEpos>
  );
}

export default EposReportPage;
