"use client";

import { useEffect, useState, useRef } from "react";

export default function useWindowWidth() {
  const [width, setWidth] = useState<number | null>(() => (typeof window === "undefined" ? null : window.innerWidth));
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const onResize = () => {
      // throttle via rAF
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        setWidth(window.innerWidth);
        rafRef.current = null;
      });
    };

    window.addEventListener("resize", onResize, { passive: true });
    // ensure initial value (in case SSR -> hydration)
    setWidth(window.innerWidth);

    return () => {
      window.removeEventListener("resize", onResize);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return width;
}
