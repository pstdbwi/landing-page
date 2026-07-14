"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  ChevronLeftIcon,
  ChevronRightIcon,
  Download,
  File,
  FileSpreadsheet,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import Link from "next/link";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { buttonVariants } from "@/components/ui/button";

interface SharedDisbursementDialogProps {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  type: "image" | "file" | "beneficiary";
  data: string[] | string | null;
  title: string;
}

const SharedDisbursementDialog = ({ open, onOpenChange, type, data, title }: SharedDisbursementDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-4xl sm:max-w-4xl w-full border-white/20 backdrop-blur-3xl p-6 overflow-hidden"
        style={{
          background: "linear-gradient(119deg, rgba(255, 255, 255, 0.15) 2.36%, rgba(78, 78, 78, 0.15) 97.64%)",
        }}
      >
        <DialogHeader className="border-b border-white/10 pb-4 mb-4">
          <DialogTitle className="text-xl font-bold bg-clip-text text-transparent bg-fesyar-gold">{title}</DialogTitle>
        </DialogHeader>

        <div className="relative">
          {type === "image" && <ImageSlider images={data as string[]} />}
          {type === "file" && <FileList files={data as string[]} />}
          {type === "beneficiary" && (
            <>
              {typeof data === "string" ? (
                <FileList files={[data]} isBeneficiary />
              ) : (
                <BeneficiaryDetails data={data as any} />
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SharedDisbursementDialog;

// --- Sub-components (Themed) ---

const BeneficiaryDetails = ({ data }: { data: { details: any; total: number } }) => {
  if (!data || !data.details) return null;

  return (
    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
      {Array.from({ length: data.total }).map((_, bIdx) => {
        const serviceCount = data.details?.service?.[bIdx] || 0;
        const location = data.details?.location?.[bIdx] || "-";
        const beneficiaryGroup = data.details?.beneficiary?.[bIdx] || "-";

        return (
          <div key={bIdx} className="relative group p-4 rounded-xl border border-white/10 bg-white/5 overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-fesyar-gold"></div>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                <span className="text-white/40">Penerima Layanan/Manfaat</span>
                <span className="font-semibold text-white text-right ml-4">{serviceCount}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                <span className="text-white/40">Lokasi Penyaluran</span>
                <span className="font-semibold text-white text-right ml-4">{location}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/40">Kelompok Penerima Manfaat</span>
                <span className="font-semibold text-white text-right ml-4">{beneficiaryGroup}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const ImageSlider = ({ images = [] }: { images: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsTransitioning(false), 300);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  if (!images || images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-white/60">
        <AlertCircle className="w-12 h-12 mb-4 opacity-20" />
        <p>Tidak ada lampiran foto</p>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden rounded-xl">
      <div className="relative h-64 sm:h-96 md:h-[500px] overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-out h-full"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((image, index) => (
            <div key={index} className="min-w-full h-full relative">
              <img src={image} alt={`Slide ${index + 1}`} className="w-full h-full object-contain" />
            </div>
          ))}
        </div>

        {images.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              disabled={isTransitioning}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg hover:bg-white/20 transition-all disabled:opacity-50"
            >
              <ChevronLeftIcon className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={nextSlide}
              disabled={isTransitioning}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg hover:bg-white/20 transition-all disabled:opacity-50"
            >
              <ChevronRightIcon className="w-6 h-6 text-white" />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex items-center justify-center space-x-2 py-4">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                index === currentIndex ? "bg-fesyar-gold w-6" : "bg-white/20 hover:bg-white/40",
              )}
            />
          ))}
        </div>
      )}

      <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-medium border border-white/10">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
};

const FileList = ({ files = [], isBeneficiary = false }: { files: string[]; isBeneficiary?: boolean }) => {
  const getFileExtension = (filename: string): string => filename.split(".").pop()?.toLowerCase() || "";

  const getFileIcon = (filename: string) => {
    const ext = getFileExtension(filename);
    const iconClass = "w-6 h-6";
    switch (ext) {
      case "pdf":
        return <FileText className={`${iconClass} text-red-400`} />;
      case "doc":
      case "docx":
        return <FileText className={`${iconClass} text-blue-400`} />;
      case "xls":
      case "xlsx":
        return <FileSpreadsheet className={`${iconClass} text-green-400`} />;
      case "jpg":
      case "jpeg":
      case "png":
        return <ImageIcon className={`${iconClass} text-purple-400`} />;
      default:
        return <File className={`${iconClass} text-white/60`} />;
    }
  };

  if (!files || files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-white/60">
        <AlertCircle className="w-12 h-12 mb-4 opacity-20" />
        <p>Tidak ada lampiran file</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
      {files.map((file, index) => (
        <div
          key={index}
          className="group flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all"
        >
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            <div className="p-2 rounded-lg bg-white/10">{getFileIcon(file)}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {isBeneficiary ? "Daftar Penerima Manfaat" : `Lampiran File ${index + 1}`}
              </p>
              <p className="text-xs text-white/40 uppercase mt-0.5">{getFileExtension(file)}</p>
            </div>
          </div>
          <Link
            href={file}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ size: "sm", variant: "outline" }),
              "bg-fesyar-gold border-none text-fesyar-green-900 hover:bg-fesyar-gold/80 transition-all font-bold px-4",
            )}
          >
            <Download className="w-4 h-4 mr-2" /> Unduh
          </Link>
        </div>
      ))}
    </div>
  );
};
