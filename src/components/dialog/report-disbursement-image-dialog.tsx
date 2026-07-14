"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Dispatch, Fragment, SetStateAction, useEffect, useState } from "react";

interface Props {
  reportDisbursementImageDialog: boolean;
  setReportDisbursementImageDialog: Dispatch<SetStateAction<boolean>>;
  reportImages: string[] | null;
}

const ReportDisbursementImageDialog = ({
  reportDisbursementImageDialog,
  setReportDisbursementImageDialog,
  reportImages,
}: Props) => {
  return (
    <Fragment>
      <Dialog open={reportDisbursementImageDialog} onOpenChange={setReportDisbursementImageDialog}>
        <DialogContent className="max-w-5xl sm:max-w-5xl w-full">
          <DialogHeader className="border-b pb-2">
            <DialogTitle className="text-lg">Lampiran Foto Penyaluran</DialogTitle>
          </DialogHeader>

          <div>
            {!reportImages?.length || !reportImages ? (
              <div>Tidak ada lampiran foto </div>
            ) : (
              <ImageSlider autoPlay={true} images={reportImages} />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};

export default ReportDisbursementImageDialog;

interface ImageSliderProps {
  images?: string[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

const ImageSlider: React.FC<ImageSliderProps> = ({ images = [], autoPlay = false, autoPlayInterval = 7000 }) => {
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

  const goToSlide = (index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(nextSlide, autoPlayInterval);
    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, currentIndex]);

  if (!images.length) return null;

  return (
    <div className="relative w-full mx-auto overflow-hidden ">
      {/* Main Image Container */}
      <div className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] overflow-hidden rounded-lg">
        <div
          className="flex transition-transform duration-300 ease-out h-full"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((image, index) => (
            <div key={index} className="min-w-full h-full relative">
              <img
                src={image}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
                loading={index === 0 ? "eager" : "lazy"}
              />
              {/* Optional overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          disabled={isTransitioning}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
          aria-label="Previous image"
        >
          <ChevronLeftIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 group-hover:text-gray-900" />
        </button>

        <button
          onClick={nextSlide}
          disabled={isTransitioning}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
          aria-label="Next image"
        >
          <ChevronRightIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 group-hover:text-gray-900" />
        </button>
      </div>

      {/* Indicators */}
      <div className="flex items-center justify-center space-x-2 py-3">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            disabled={isTransitioning}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              index === currentIndex
                ? "bg-primary-500 scale-125 shadow-lg"
                : "bg-gray-300 hover:bg-gray-400 hover:scale-110"
            } disabled:cursor-not-allowed`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Image Counter */}
      <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
};
