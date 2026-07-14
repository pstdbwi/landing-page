"use client";

import { PlayIcon, QrCodeIcon, Share2Icon } from "lucide-react";
import { extractYouTubeId, getYouTubeThumbnail } from "@/lib/youtube";
import Image from "next/image";
import React, { useState } from "react";

interface CampaignBannerProps {
  bannerUrl: string;
  onQrCodeClick: () => void;
  onShareClick: () => void;
}

const YouTubePlayer = ({ videoId }: { videoId: string }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  // Listen for YouTube IFrame API messages to detect video state changes
  React.useEffect(() => {
    if (!isPlaying) return;

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== "https://www.youtube-nocookie.com") return;

      try {
        const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        if (data?.event === "onStateChange") {
          // playerState: 0 = ended, 1 = playing, 2 = paused
          if (data.info === 0) {
            setIsPlaying(false);
            setIsPaused(false);
          } else if (data.info === 2) {
            setIsPaused(true);
          } else if (data.info === 1) {
            setIsPaused(false);
          }
        }
      } catch {
        // ignore non-JSON messages
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [isPlaying]);

  const resumeVideo = () => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: "command", func: "playVideo", args: [] }),
        "*",
      );
    }
    setIsPaused(false);
  };

  if (isPlaying) {
    return (
      <>
        <iframe
          ref={iframeRef}
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1&origin=${typeof window !== "undefined" ? window.location.origin : ""}`}
          title="Campaign Video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        {/* Pause overlay — hides YouTube suggestions */}
        {isPaused && (
          <button
            onClick={resumeVideo}
            className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-[2px] transition-opacity"
            aria-label="Resume video"
          >
            <div className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
              <PlayIcon size={18} className="text-white ml-0.5" fill="white" />
            </div>
          </button>
        )}
      </>
    );
  }

  return (
    <>
      {/* High-res YouTube thumbnail */}
      <Image src={getYouTubeThumbnail(videoId)} alt="Video thumbnail" fill className="object-cover" />

      {/* Cinematic gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

      {/* Glassmorphism play button */}
      <button
        onClick={() => setIsPlaying(true)}
        className="absolute inset-0 flex items-center justify-center"
        aria-label="Play video"
      >
        <div className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
          <PlayIcon size={18} className="text-white ml-0.5" fill="white" />
        </div>
      </button>
    </>
  );
};

const CampaignBanner = ({ bannerUrl, onQrCodeClick, onShareClick }: CampaignBannerProps) => {
  const youtubeId = extractYouTubeId(bannerUrl);

  return (
    <div className="relative w-full md:w-[60%] h-[300px] lg:h-[400px] rounded-[24px] border-2 border-white/40 overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.25)]">
      {/* Share / QR overlay buttons */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <button
          className="bg-white/90 backdrop-blur-sm rounded-full p-2.5 hover:bg-white transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
          onClick={onQrCodeClick}
        >
          <QrCodeIcon size={18} className="text-gray-700" />
        </button>
        <button
          className="bg-white/90 backdrop-blur-sm rounded-full p-2.5 hover:bg-white transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
          onClick={onShareClick}
        >
          <Share2Icon size={18} className="text-gray-700" />
        </button>
      </div>

      {/* Banner content: YouTube embed or Image */}
      {youtubeId ? (
        <YouTubePlayer videoId={youtubeId} />
      ) : (
        <Image src={bannerUrl} alt="banner" fill className="object-cover" />
      )}
    </div>
  );
};

export default CampaignBanner;
