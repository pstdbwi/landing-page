"use client";

import { useCallback, useRef, useState } from "react";

type Panel = "search" | "filter" | "sorting" | "content_type";
type PanelState = Record<Panel, boolean>;

export function useTogglePanel() {
  const [active, setActive] = useState<PanelState>({
    search: false,
    filter: false,
    sorting: false,
    content_type: false,
  });

  const [closing, setClosing] = useState<PanelState>({
    search: false,
    filter: false,
    sorting: false,
    content_type: false,
  });

  const closeTimerRef = useRef<Partial<Record<Panel, NodeJS.Timeout>>>({});

  const open = useCallback((panel: Panel) => {
    // Batalkan closing yang sedang berjalan
    if (closeTimerRef.current[panel]) {
      clearTimeout(closeTimerRef.current[panel]);
      closeTimerRef.current[panel] = undefined;
    }

    setActive((prev) => ({ ...prev, [panel]: true }));
    setClosing((prev) => ({ ...prev, [panel]: false }));
  }, []);

  const close = useCallback(
    (panel?: Panel) => {
      if (!panel) {
        Object.keys(active).forEach((key) => {
          const p = key as Panel;

          setClosing((prev) => ({ ...prev, [p]: true }));

          closeTimerRef.current[p] = setTimeout(() => {
            setActive((prev) => ({ ...prev, [p]: false }));
            setClosing((prev) => ({ ...prev, [p]: false }));
            closeTimerRef.current[p] = undefined;
          }, 200);
        });

        return;
      }

      if (!active[panel]) return;

      setClosing((prev) => ({ ...prev, [panel]: true }));

      closeTimerRef.current[panel] = setTimeout(() => {
        setActive((prev) => ({ ...prev, [panel]: false }));
        setClosing((prev) => ({ ...prev, [panel]: false }));
        closeTimerRef.current[panel] = undefined;
      }, 200);
    },

    [active]
  );

  const toggle = useCallback(
    (panel: Panel) => {
      if (active[panel]) {
        close(panel);
      } else {
        open(panel);
      }
    },
    [active, close, open]
  );

  const isOpen = useCallback((panel: Panel) => active[panel] || closing[panel], [active, closing]);

  const isVisible = useCallback((panel: Panel) => active[panel] && !closing[panel], [active, closing]);

  const cleanup = useCallback(() => {
    Object.values(closeTimerRef.current).forEach((timer) => {
      if (timer) clearTimeout(timer);
    });
  }, []);

  return {
    active,
    closing,
    open,
    close,
    toggle,
    isOpen,
    isVisible,
    cleanup,
  };
}
