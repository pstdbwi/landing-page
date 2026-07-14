import { useMemo } from "react";

export function useSubdomain() {
  return useMemo(() => {
    if (typeof window === "undefined") return null;

    // window.location.hostname;
    //"fesyarsumatra.satuwakaf.id"
    //"mitra.satuwakaf.id"
    //"apps.satuwakaf.id"
    const hostname = window.location.hostname;
    const parts = hostname.split(".");

    // asumsi: subdomain.satuwakaf.id → ambil bagian pertama
    if (parts.length >= 3) {
      return parts[0]; // "fesyarsumatra"
    }

    return null; // tidak ada subdomain
  }, []);
}
