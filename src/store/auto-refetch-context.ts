// contexts/AutoRefetchContext.ts
"use client";
import { createContext, useContext } from "react";

export const AutoRefetchContext = createContext<{
  isAutoRefetch: boolean;
  setIsAutoRefetch: (val: boolean) => void;
} | null>(null);

export const useAutoRefetch = () => {
  const context = useContext(AutoRefetchContext);
  if (!context) throw new Error("useAutoRefetch must be used within AutoRefetchProvider");
  return context;
};
