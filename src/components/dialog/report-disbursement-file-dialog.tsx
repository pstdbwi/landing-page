"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Dispatch, Fragment, SetStateAction } from "react";

interface Props {
  reportDisbursementFileDialog: boolean;
  setReportDisbursementFileDialog: Dispatch<SetStateAction<boolean>>;
  reportFiles: string[] | null;
}

const ReportDisbursementFileDialog = ({
  reportDisbursementFileDialog,
  setReportDisbursementFileDialog,
  reportFiles,
}: Props) => {
  return (
    <Fragment>
      <Dialog open={reportDisbursementFileDialog} onOpenChange={setReportDisbursementFileDialog}>
        <DialogContent className="max-w-5xl sm:max-w-5xl w-full">
          <DialogHeader className="border-b pb-2">
            <DialogTitle className="text-lg">Lampiran Laporan Penyaluran</DialogTitle>
          </DialogHeader>

          <div>
            {!reportFiles || !reportFiles?.length ? (
              <ReportFilesAttachment files={null} />
            ) : (
              <ReportFilesAttachment files={reportFiles} />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};

export default ReportDisbursementFileDialog;

import { AlertCircle, Download, File, FileArchive, FileSpreadsheet, FileText, Image } from "lucide-react";
import Link from "next/link";
import React from "react";
import { buttonVariants } from "../ui/button";

interface ReportFilesProps {
  files: string[] | null;
  onFileDownload?: (filename: string) => void;
  className?: string;
}

const ReportFilesAttachment: React.FC<ReportFilesProps> = ({ files, onFileDownload, className = "" }) => {
  // Get file extension
  const getFileExtension = (filename: string): string => {
    return filename.split(".").pop()?.toLowerCase() || "";
  };

  // Get file icon based on extension
  const getFileIcon = (filename: string) => {
    const ext = getFileExtension(filename);
    const iconClass = "w-5 h-5";

    switch (ext) {
      case "pdf":
        return <FileText className={`${iconClass} text-red-500`} />;
      case "doc":
      case "docx":
        return <FileText className={`${iconClass} text-blue-500`} />;
      case "xls":
      case "xlsx":
        return <FileSpreadsheet className={`${iconClass} text-green-500`} />;
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return <Image className={`${iconClass} text-purple-500`} />;
      case "zip":
      case "rar":
        return <FileArchive className={`${iconClass} text-orange-500`} />;
      default:
        return <File className={`${iconClass} text-gray-500`} />;
    }
  };

  // Empty state
  if (!files || files.length === 0) {
    return (
      <div className={`${className}`}>
        <div className="bg-white rounded-lg border-2 border-dashed border-gray-200 p-8">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada lampiran</h3>
            <p className="text-gray-500 text-sm">Belum ada file yang dilampirkan pada report ini</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Files List */}
        <div className="divide-y divide-gray-200">
          {files.map((filename, index) => (
            <div key={index} className="px-6 py-4 hover:bg-gray-50 transition-colors group">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  {/* File Icon */}
                  <div className="flex-shrink-0">{getFileIcon(filename)}</div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">Lampiran - {index + 1}</p>
                    <div className="flex items-center space-x-3 mt-1">
                      <span className="text-xs text-gray-400 uppercase">{getFileExtension(filename)}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <Link
                    href={filename}
                    target="_blank"
                    rel="noopenner norefferer"
                    className={buttonVariants({ size: "sm", className: "text-xs" })}
                    title="Download file"
                  >
                    <Download className="w-4 h-4" /> Unduh Lampiran
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
