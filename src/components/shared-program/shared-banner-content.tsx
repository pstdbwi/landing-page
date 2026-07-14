"use client";

import { extractYouTubeId, getYouTubeThumbnail } from "@/lib/youtube";
import { PlayIcon } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

const YouTubePlayer = ({ videoId }: { videoId: string }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  React.useEffect(() => {
    if (!isPlaying) return;

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== "https://www.youtube-nocookie.com") return;

      try {
        const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        if (data?.event === "onStateChange") {
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
      <Image src={getYouTubeThumbnail(videoId)} alt="Video thumbnail" fill className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
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

const SharedBannerContent = ({ bannerUrl }: { bannerUrl: string }) => {
  const youtubeId = extractYouTubeId(bannerUrl);

  if (youtubeId) {
    return <YouTubePlayer videoId={youtubeId} />;
  }

  return <Image src={bannerUrl} alt="banner" fill className="object-cover" />;
};

export default SharedBannerContent;
