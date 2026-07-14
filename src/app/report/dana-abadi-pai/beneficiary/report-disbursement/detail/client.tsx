"use client";

import ReportDisbursementBeneficiaryDialog from "@/components/dialog/report-disbursement-beneficiary-file-dialog";
import ReportDisbursementFileDialog from "@/components/dialog/report-disbursement-file-dialog";
import ReportDisbursementImageDialog from "@/components/dialog/report-disbursement-image-dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { IDistributionReports } from "@/constant/pai";
import currencyFormater from "@/lib/utils";
import {
  ArrowLeftIcon,
  BuildingIcon,
  CalendarIcon,
  FileText,
  HelpingHandIcon,
  ImageIcon,
  User2Icon,
  Users2Icon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

interface Props {
  distribution: IDistributionReports;
}

const ClientDetailReportDisbursement = ({ distribution }: Props) => {
  const router = useRouter();
  const [imageDialog, setImageDialog] = useState(false);
  const [reportImages, setReportImages] = useState<string[] | null>([]);

  const [fileDialog, setFileDialog] = useState(false);
  const [reportFiles, setReportFiles] = useState<string[] | null>([]);

  const [beneficiaryDialog, setBeneficiaryDialog] = useState(false);
  const [beneficiaryFile, setBeneficiaryFile] = useState<string | null>(null);

  return (
    <section className="space-y-4">
      <div key={distribution?.id} className="group bg-white/70 backdrop-blur-sm rounded-2xl overflow-hidden">
        <div className="flex items-center w-full justify-end absolute top-4 right-4 z-10">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeftIcon className="w-4 mr-1" /> Kembali
          </Button>
        </div>
        {/* Campaign Banner */}
        <div className="relative overflow-hidden">
          {distribution?.report_images?.[0] ? (
            <img
              src={distribution?.report_images?.[0]}
              alt={distribution?.report_title}
              className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-96 grid place-items-center">
              <ImageIcon className="w-8 h-8 text-gray-500" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          <div className="absolute bottom-2 left-6 right-6">
            <h4 className="text-white/90 hover:text-white font-semibold text-xl mb-3 line-clamp-2 transition-colors">
              {distribution?.report_title}
            </h4>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-6">
          {/* Description */}
          <article
            className="prose prose-sm sm:prose lg:prose-lg prose-p:leading-relaxed prose-img:rounded-lg max-w-none dangerously-set-style text-sm text-gray-600 "
            dangerouslySetInnerHTML={{ __html: distribution?.report_description }}
          />

          {/* Meta Information */}
          <div className="space-y-3 my-4 ">
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <BuildingIcon className="h-4 w-4 text-slate-400" />
                <span className="font-medium text-xs">{distribution?.lembaga_name}</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-slate-400" />
                <span className="text-xs font-medium">{formatDate(distribution?.report_date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <User2Icon className="h-4 w-4 text-slate-400" />
                <span className="text-xs font-medium">{distribution?.reporter_name}</span>
              </div>
            </div>

            {/* Amount */}
            <div className="flex gap-2 items-start">
              <HelpingHandIcon className="h-4 w-4 text-slate-400" />
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-slate-600">Dana Disalurkan</Label>
                <Label className="font-bold text-xl text-primary-600">
                  Rp. {currencyFormater(Number(distribution?.amount_disbursed || 0))}
                </Label>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-100">
            {/* Attachments */}
            {distribution?.report_images && distribution?.report_images?.length > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setImageDialog(true);
                  setReportImages(distribution?.report_images);
                }}
                className="flex items-center gap-2 text-xs text-slate-500 bg-slate-100 px-3 py-2 rounded-lg hover:bg-primary-600 hover:text-white transition-all"
              >
                <ImageIcon className="h-4 w-4" />
                <span>{distribution?.report_images?.length || 0} foto</span>
              </button>
            )}
            {distribution?.report_files && distribution?.report_files?.length > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();

                  setFileDialog(true);
                  setReportFiles(distribution?.report_files);
                }}
                className="flex items-center gap-2 text-xs text-slate-500 bg-slate-100 px-3 py-2 rounded-lg hover:bg-primary-600 hover:text-white transition-all"
              >
                <FileText className="h-4 w-4" />
                <span>{distribution?.report_files?.length} file</span>
              </button>
            )}

            {/* Beneficiary File */}
            {distribution?.beneficiary_file && (
              <button
                onClick={(e) => {
                  e.stopPropagation();

                  setBeneficiaryDialog(true);
                  setBeneficiaryFile(distribution?.beneficiary_file);
                }}
                className="flex items-center gap-2 text-xs text-slate-500 bg-slate-100 px-3 py-2 rounded-lg hover:bg-primary-600 hover:text-white transition-all"
              >
                <Users2Icon className="h-4 w-4" />
                <span>Penerima Manfaat</span>
              </button>
            )}
          </div>
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
    </section>
  );
};

export default ClientDetailReportDisbursement;
