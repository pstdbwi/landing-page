import { Badge } from "@/components/Badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { extractYouTubeId, getYouTubeThumbnail } from "@/lib/youtube";
import { cn, urlImageStoreGoogle } from "@/lib/utils";
import { INews, TTypeNews } from "@/types/news";
import { Building, Calendar, ChevronLeftIcon, ChevronRightIcon, ImageIcon, PlayCircle, User } from "lucide-react";
import { Dispatch, Fragment, HTMLAttributes, SetStateAction, useEffect, useState } from "react";

interface SharedContentCardProps extends Omit<HTMLAttributes<HTMLDivElement>, "onClick"> {
  news: INews;
  onClick?: (news: INews) => void;
}

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const SharedContentCard = ({ news, onClick, ...props }: SharedContentCardProps) => {
  const [imageDialog, setImageDialog] = useState(false);
  const [reportImages, setReportImages] = useState<string[] | null>([]);
  const [youtubeVideoId, setYoutubeVideoId] = useState<string | null>(null);

  const youtubeId = news?.thumbnail_url ? extractYouTubeId(news.thumbnail_url) : null;
  const thumbnailSrc = youtubeId ? getYouTubeThumbnail(youtubeId) : (news?.thumbnail_url ?? null);

  const handleClick = () => {
    if (onClick) {
      onClick(news);
    }
  };

  return (
    <Fragment>
      <div
        className={cn(
          "group bg-white backdrop-blur-sm rounded-lg border shadow overflow-hidden hover:cursor-pointer",
          props?.className,
        )}
        onClick={handleClick}
      >
        {/* Campaign Banner */}
        <div className="relative overflow-hidden w-full">
          {thumbnailSrc ? (
            <div
              className="relative w-full h-40 lg:h-56"
              onClick={
                youtubeId
                  ? (e) => {
                      e.stopPropagation();
                      setYoutubeVideoId(youtubeId);
                    }
                  : undefined
              }
            >
              <img
                src={thumbnailSrc}
                alt={news?.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              {/* YouTube play button overlay */}
              {youtubeId && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors">
                  <PlayCircle className="w-14 h-14 text-white drop-shadow-lg" />
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-40 lg:h-56 grid place-items-center">
              <ImageIcon className="w-8 h-8 text-gray-500" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"></div>
          <div className="absolute top-2 left-6">
            <Badge variant={news?.type_id == "3" ? "fesyar-gold" : "fesyar-burgundy"}>
              {(TTypeNews as any)[news?.type_id]}
            </Badge>
          </div>
          <div className="absolute bottom-2 left-6 right-6">
            <h4 className="text-white/90 hover:text-white font-semibold text-base mb-3 line-clamp-2 transition-colors">
              {news?.title}
            </h4>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-5 w-full">
          {/* Description */}
          <div className="min-h-[60px] ">
            <article
              className="prose prose-sm sm:prose lg:prose-lg prose-p:leading-relaxed prose-img:rounded-lg max-w-none dangerously-set-style text-[0.72rem] text-gray-600 line-clamp-3"
              dangerouslySetInnerHTML={{ __html: news?.short_description }}
            />
          </div>

          {/* Meta Information */}
          <div className="space-y-3 my-4 ">
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-slate-400" />
                <span className="font-medium text-xs">{news?.author_lembaga}</span>
              </div>
            </div>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between text-sm gap-2 text-slate-600">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-slate-400" />
                <span className="text-xs font-medium">{formatDate(news?.published_at)}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-slate-400" />
                <span className="text-xs font-medium">{news?.author_name}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-100">
            {/* Attachments */}
            {news?.attachments && news?.attachments?.length > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setImageDialog(true);
                  setReportImages(news?.attachments);
                }}
                className="flex items-center gap-2 text-[0.675rem] text-slate-500 bg-slate-100 px-3 py-2 rounded-lg hover:bg-primary-600 hover:text-white transition-all"
              >
                <ImageIcon className="h-4 w-4" />
                <span>{news?.attachments?.length || 0} foto</span>
              </button>
            )}
          </div>
        </div>
      </div>
      {imageDialog && (
        <ContentImageDialog
          contentImageDialog={imageDialog}
          setContentImageDialog={setImageDialog}
          reportImages={reportImages}
        />
      )}
      {youtubeVideoId && (
        <YouTubeVideoDialog videoId={youtubeVideoId} open={!!youtubeVideoId} onClose={() => setYoutubeVideoId(null)} />
      )}
    </Fragment>
  );
};

export default SharedContentCard;

interface YouTubeVideoDialogProps {
  videoId: string;
  open: boolean;
  onClose: () => void;
}

const YouTubeVideoDialog = ({ videoId, open, onClose }: YouTubeVideoDialogProps) => {
  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <DialogContent className="max-w-3xl sm:max-w-3xl w-full p-4">
        <DialogHeader className="border-b pb-2">
          <DialogTitle className="text-lg">Video</DialogTitle>
        </DialogHeader>
        <div className="relative w-full aspect-video">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title="YouTube video player"
            className="w-full h-full rounded-lg"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface ContentImageDialogProps {
  contentImageDialog: boolean;
  setContentImageDialog: Dispatch<SetStateAction<boolean>>;
  reportImages: string[] | null;
}

const ContentImageDialog = ({ contentImageDialog, setContentImageDialog, reportImages }: ContentImageDialogProps) => {
  return (
    <Fragment>
      <Dialog open={contentImageDialog} onOpenChange={setContentImageDialog}>
        <DialogContent className="max-w-5xl sm:max-w-5xl w-full">
          <DialogHeader className="border-b pb-2">
            <DialogTitle className="text-lg">Lampiran Foto</DialogTitle>
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
                src={urlImageStoreGoogle(image)}
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
