"use client";

import ReportDisbursementBeneficiaryDialog from "@/components/dialog/report-disbursement-beneficiary-file-dialog";
import ReportDisbursementFileDialog from "@/components/dialog/report-disbursement-file-dialog";
import ReportDisbursementImageDialog from "@/components/dialog/report-disbursement-image-dialog";
import InputSearch from "@/components/Input/input-search";
import { Label } from "@/components/Label";
import LayoutReport from "@/components/Layout/layout-report";
import { CampaignListSkeleton } from "@/components/Skeleton";
import { buttonVariants } from "@/components/ui/button";
import { env } from "@/lib/env";
import useSearchParamsEntries from "@/lib/use-searchparams-entries";
import currencyFormater, { qs } from "@/lib/utils";
import { useReportCampaignDistribution } from "@/services/report/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  ArrowLeftIcon,
  Building,
  Calendar,
  FileText,
  HelpingHandIcon,
  ImageIcon,
  Loader2Icon,
  User,
  Users2Icon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import InfiniteScroll from "react-infinite-scroller";

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const fetchReportDisbursement = async ({
  pageParam = 1,
  campaign_id,
  purpose_id,
}: {
  pageParam?: number;
  campaign_id: string;
  purpose_id: string;
}): Promise<any> => {
  try {
    const query = qs({
      pagination: "true",
      purpose_id,
      campaign_id,
      page: String(pageParam),
      size: "9",
    });

    const response = await fetch(`${env.NEXT_PUBLIC_BASE_URL2}/public/report/campaign?${query}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    return data?.data;
  } catch (error) {
    console.error("Failed to fetch report disbursement:", error);
    throw error;
  }
};

const page = () => {
  const router = useRouter();
  const { purpose_id = "" } = useSearchParamsEntries();
  const [imageDialog, setImageDialog] = useState(false);
  const [reportImages, setReportImages] = useState<string[] | null>([]);

  const [fileDialog, setFileDialog] = useState(false);
  const [reportFiles, setReportFiles] = useState<string[] | null>([]);

  const [beneficiaryDialog, setBeneficiaryDialog] = useState(false);
  const [beneficiaryFile, setBeneficiaryFile] = useState<string | null>(null);

  const {
    data: distribution,
    isLoading: isLoadingDistribution,
    isError: isErrorDistribution,
  } = useReportCampaignDistribution({ campaign_id: "9d52c675-2b96-499d-a94e-224fbae26817" });

  const { isLoading, data, hasNextPage, fetchNextPage, isFetching } = useInfiniteQuery({
    queryKey: ["report-disbursement-list", purpose_id],
    queryFn: ({ pageParam = 0 }) =>
      fetchReportDisbursement({ pageParam, campaign_id: "9d52c675-2b96-499d-a94e-224fbae26817", purpose_id }),
    getNextPageParam: (lastPage) => {
      // Hitung halaman berikutnya
      const nextPage = lastPage.current_page + 1;
      // Cek apakah masih ada halaman berikutnya
      return nextPage < lastPage.total_pages ? nextPage : undefined;
    },
    staleTime: 60000,
  });

  if ((isLoading && isFetching) || isLoadingDistribution) {
    return (
      <LayoutReport>
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 3 }, (_, i) => {
            return <CampaignListSkeleton orientation="default" />;
          })}
        </div>
      </LayoutReport>
    );
  }

  if (!data?.pages?.[0]?.items?.length) {
    return (
      <LayoutReport>
        <div className="grid place-items-center h-[60vh]">
          <div className="flex flex-col gap-3 items-center justify-center">
            <Image src="/assets/empty.svg" width={200} height={200} fetchPriority="auto" alt="empty" />
            <Label className="text-lg">Tidak ada data pelaporan</Label>
            <Link href={`/report/asn-kemenag`} className={buttonVariants({ variant: "outline" })}>
              <ArrowLeftIcon className="w-4 mr-1" /> Kembali
            </Link>
          </div>
        </div>
      </LayoutReport>
    );
  }

  const purpose = distribution?.purposes?.find((item) => item?.id == purpose_id);

  return (
    <LayoutReport>
      <div className="space-y-4">
        <div className="bg-primary-800 w-full rounded-md shadow text-white flex flex-wrap items-start gap-4 p-6">
          <div className="flex flex-col gap-1">
            <h5 className="font-medium">Implementasi Program</h5>

            <div className="flex items-end">
              <span className="text-lg font-bold">{purpose?.name}</span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <h5 className="font-medium">Total Nilai Disalurkan</h5>

            <div className="flex items-end">
              <span className="text-lg font-bold">Rp. {currencyFormater(Number(purpose?.amount || 0))}</span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <h5 className="font-medium">Total Penyaluran</h5>

            <div className="flex items-end">
              <span className="text-lg font-bold">{purpose?.report_count} Laporan</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between w-full gap-4">
          <InputSearch placeholder="Cari Laporan Penyaluran" />
          <Link href={`/report/asn-kemenag/beneficiary`} className={buttonVariants({ variant: "outline" })}>
            <ArrowLeftIcon className="w-4 mr-1" /> Kembali
          </Link>
        </div>

        <div className="space-y-4">
          <InfiniteScroll
            // @ts-ignore
            loadMore={(page) => {
              console.log("client", page);
              fetchNextPage();
            }}
            pageStart={0}
            hasMore={hasNextPage}
            loader={
              <div className="w-full inline-flex justify-center my-3" key={0}>
                <Loader2Icon className="animate-spin w-8 text-gray-600" />
              </div>
            }
            initialLoad={false}
            className="space-y-4"
            useWindow
          >
            {data?.pages?.map((group, i) => (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4" key={i}>
                {group?.items?.map((report: any, index: number) => (
                  <div
                    key={report?.id}
                    className="group bg-white/70 backdrop-blur-sm rounded-2xl border shadow overflow-hidden hover:cursor-pointer hover:bg-primary-50/30 transition-all hover:border-primary-100/50"
                    onClick={() => {
                      router.push(
                        `/report/dana-abadi-pai/beneficiary/report-disbursement/detail?${qs({
                          id: report?.id,
                        })}`
                      );
                    }}
                  >
                    {/* Campaign Banner */}
                    <div className="relative overflow-hidden">
                      {report?.report_images?.[0] ? (
                        <img
                          src={report?.report_images?.[0]}
                          alt={report?.report_title}
                          className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-56 grid place-items-center">
                          <ImageIcon className="w-8 h-8 text-gray-500" />
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                      <div className="absolute bottom-2 left-6 right-6">
                        <h4 className="text-white/90 hover:text-white font-semibold text-base mb-3 line-clamp-2 transition-colors">
                          {report?.report_title}
                        </h4>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5">
                      {/* Description */}
                      <div className="min-h-[90px] ">
                        <article
                          className="prose prose-sm sm:prose lg:prose-lg prose-p:leading-relaxed prose-img:rounded-lg max-w-none dangerously-set-style text-[0.72rem] text-gray-600 line-clamp-5"
                          dangerouslySetInnerHTML={{ __html: report?.report_description }}
                        />
                      </div>

                      {/* Meta Information */}
                      <div className="space-y-3 my-4 ">
                        <div className="flex items-center gap-3 text-sm text-slate-600">
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-slate-400" />
                            <span className="font-medium text-xs">{report?.lembaga_name}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-slate-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-slate-400" />
                            <span className="text-xs font-medium">{formatDate(report?.report_date)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-slate-400" />
                            <span className="text-xs font-medium">{report?.reporter_name}</span>
                          </div>
                        </div>

                        {/* Amount */}
                        <div className="flex gap-2 items-start">
                          <HelpingHandIcon className="h-4 w-4 text-slate-400" />
                          <div className="flex flex-col gap-1">
                            <Label className="text-xs text-slate-600">Dana Disalurkan</Label>
                            <Label className="font-bold text-lg text-primary-600">
                              Rp. {currencyFormater(Number(report?.amount_disbursed || 0))}
                            </Label>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-100">
                        {/* Attachments */}
                        {report?.report_images && report?.report_images?.length > 0 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setImageDialog(true);
                              setReportImages(report?.report_images);
                            }}
                            className="flex items-center gap-2 text-[0.675rem] text-slate-500 bg-slate-100 px-3 py-2 rounded-lg hover:bg-primary-600 hover:text-white transition-all"
                          >
                            <ImageIcon className="h-4 w-4" />
                            <span>{report?.report_images?.length || 0} foto</span>
                          </button>
                        )}
                        {report?.report_files && report?.report_files?.length > 0 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();

                              setFileDialog(true);
                              setReportFiles(report?.report_files);
                            }}
                            className="flex items-center gap-2 text-[0.675rem] text-slate-500 bg-slate-100 px-3 py-2 rounded-lg hover:bg-primary-600 hover:text-white transition-all"
                          >
                            <FileText className="h-4 w-4" />
                            <span>{report?.report_files?.length} file</span>
                          </button>
                        )}

                        {/* Beneficiary File */}
                        {report?.beneficiary_file && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();

                              setBeneficiaryDialog(true);
                              setBeneficiaryFile(report?.beneficiary_file);
                            }}
                            className="flex items-center gap-2 text-[0.675rem] text-slate-500 bg-slate-100 px-3 py-2 rounded-lg hover:bg-primary-600 hover:text-white transition-all"
                          >
                            <Users2Icon className="h-4 w-4" />
                            <span>Penerima Manfaat</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </InfiniteScroll>
        </div>

        {imageDialog && (
          <ReportDisbursementImageDialog
            reportDisbursementImageDialog={imageDialog}
            setReportDisbursementImageDialog={setImageDialog}
            reportImages={reportImages}
          />
        )}

        {fileDialog && (
          <ReportDisbursementFileDialog
            reportDisbursementFileDialog={fileDialog}
            setReportDisbursementFileDialog={setFileDialog}
            reportFiles={reportFiles}
          />
        )}

        {beneficiaryDialog && (
          <ReportDisbursementBeneficiaryDialog
            reportDisbursementBeneficiaryDialog={beneficiaryDialog}
            setreportDisbursementBeneficiaryDialog={setBeneficiaryDialog}
            beneficiaryFile={beneficiaryFile}
          />
        )}
      </div>
    </LayoutReport>
  );
};

export default page;
