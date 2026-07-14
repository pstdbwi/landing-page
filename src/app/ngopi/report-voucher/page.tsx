"use client";

import { GradientText } from "@/components/fesyar/gradient-text";
import { NgopiHeaderSection } from "@/components/ngopi/ngopi-header-section";
import LayoutNgopi from "@/components/ngopi/ngopi-layout";
import { Skeleton } from "@/components/Skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActiveProgram } from "@/hooks/useActiveProgram";
import { useCummulative } from "@/hooks/useCummulative";
import useSearchParamsEntries from "@/lib/use-searchparams-entries";
import { qs, toMoney } from "@/lib/utils";
import { CheckCircle2, HeartIcon, SparklesIcon, TicketIcon, UsersIcon } from "lucide-react";
import { useRouter } from "next/navigation";

const cardGlowClassName =
  "absolute inset-0 rounded-2xl bg-gradient-to-r from-[#205398]/45 via-[#DAB95A]/20 to-[#071c3d]/35 blur-2xl opacity-35 transition-opacity duration-500 group-hover:opacity-55";

const cardClassName =
  "relative rounded-2xl border border-white/20 bg-white/[0.075] bg-[radial-gradient(circle_at_top_left,_rgba(32,83,152,0.28),_rgba(255,255,255,0.055)_42%,_rgba(7,28,61,0.16)_100%)] p-8 shadow-2xl shadow-black/20 backdrop-blur-2xl backdrop-saturate-150 transition-all duration-300 hover:-translate-y-1 hover:border-[#DAB95A]/45 hover:bg-white/[0.105]";

const primaryIconClassName =
  "rounded-2xl border border-[#DAB95A]/35 bg-white/[0.12] p-4 shadow-lg backdrop-blur-xl ring-1 ring-white/10";

const Report = () => {
  const router = useRouter();
  const { programPayload } = useActiveProgram();
  const { date_start = "", date_end = "", ...searchParams } = useSearchParamsEntries();
  const { data, isLoading } = useCummulative(date_start, date_end, 10000, programPayload?.corp_program_id);

  const report = data?.data?.[0];

  return (
    <LayoutNgopi footer="detail-page" header={false} tnc={false}>
      <NgopiHeaderSection size="small" />

      <section className="max-w-7xl grid place-items-center mx-auto mt-8 px-4 md:mt-16">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-start">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="w-full h-[125px]" />
            ))}
          </div>
        ) : (
          <div className="space-y-4 w-full">
            <div className="flex flex-col md:flex-row gap-4 w-full justify-end">
              <div className="flex-col gap-2 w-full md:w-fit self-end rounded-lg border border-white/20 bg-white/[0.075] p-3 shadow-xl shadow-black/20 backdrop-blur-2xl">
                <Label className="text-xs text-sky-100">Periode</Label>
                <div className="flex items-center gap-1">
                  <Input
                    type="date"
                    className="px-2 border-white/20 bg-white/10 text-white [color-scheme:dark] focus-visible:ring-[#DAB95A]"
                    value={date_start}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      router.replace(`?` + qs({ ...searchParams, date_start: newValue, date_end }));
                    }}
                  />
                  <span className="text-xs text-sky-100">Sampai</span>
                  <Input
                    type="date"
                    className="px-2 border-white/20 bg-white/10 text-white [color-scheme:dark] focus-visible:ring-[#DAB95A]"
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
                <div className={cardGlowClassName} />
                <div className={cardClassName}>
                  <div className="flex items-center justify-between gap-4">
                    <div className={primaryIconClassName}>
                      <HeartIcon className="text-[#FFE7A1]" size={40} fill="currentColor" />
                    </div>

                    <div className="space-y-2 flex-1">
                      <h3 className="text-sky-100 text-lg font-medium uppercase tracking-wider">Total Wakaf</h3>
                      <GradientText className="text-3xl">Rp. {toMoney(report?.total_paid_donation)}</GradientText>
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
                      <h3 className="text-sky-100 text-lg font-medium uppercase tracking-wider">Total Wakif</h3>
                      <GradientText className="text-3xl">{toMoney(report?.count_donation)} Orang</GradientText>
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
                      <h3 className="text-sky-100 text-lg font-medium uppercase tracking-wider">Total Voucher</h3>
                      <GradientText className="text-3xl">{toMoney(report?.count_redeem_code)}</GradientText>
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
                      <CheckCircle2 className="text-[#FFE7A1]" size={40} />
                    </div>

                    <div className="space-y-2 flex-1">
                      <h3 className="text-sky-100 text-lg font-medium uppercase tracking-wider">
                        Total Voucher Digunakan
                      </h3>
                      <GradientText className="text-3xl">{toMoney(report?.count_has_redeem)}</GradientText>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full rounded-2xl border border-white/20 bg-white/[0.075] bg-[linear-gradient(135deg,_rgba(32,83,152,0.24),_rgba(255,255,255,0.06)_44%,_rgba(218,185,90,0.14))] p-8 shadow-2xl shadow-black/20 backdrop-blur-2xl backdrop-saturate-150">
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <SparklesIcon className="text-[#FFE7A1]" size={32} />
                <div className="text-xl text-white font-semibold text-center">
                  Bersama <GradientText className="inline-flex text-xl">{toMoney(report?.count_donation)}</GradientText>{" "}
                  wakif, kita telah mengumpulkan{" "}
                  <GradientText className="inline-flex text-xl">
                    Rp. {toMoney(report?.total_paid_donation)}
                  </GradientText>{" "}
                  untuk kebaikan wakaf
                </div>
                <HeartIcon className="text-[#DAB95A]" size={32} fill="currentColor" />
              </div>
            </div>
          </div>
        )}
      </section>
    </LayoutNgopi>
  );
};

export default Report;
