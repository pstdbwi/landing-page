"use client";

import { useEffect } from "react";

export default function ChunkErrorHandler() {
  useEffect(() => {
    const handler = (e: ErrorEvent) => {
      if (e.message?.includes("ChunkLoadError") || e.message?.includes("Loading chunk")) {
        console.warn("⚠️ Chunk load failed, forcing reload...");
        // Hard reload tanpa argumen `true`
        window.location.href = window.location.href; // force re-fetch semua dari server
      }
    };
    window.addEventListener("error", handler);
    return () => window.removeEventListener("error", handler);
  }, []);

  return null;
}
