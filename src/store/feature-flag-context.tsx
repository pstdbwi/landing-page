"use client";

import { SUB_DOMAIN } from "@/constant/sub-domain";
import { corporateProgram } from "@/services/corporate";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

type ProgramOptions = {
  id: string;
  corp_id: string;
  corp_name: string;
  banner_url: string;
  title: string;
  hashtags: string;
  description: string;
  remarks: string;
  start_date: string;
  end_date: string;
  address: string;
  region_id: string;
  region_name: string;
  special_section: string;
  active: boolean;
  is_private: boolean;
  corp_unit_id: string;
  corp_unit_name: string;
  rewards: { id: string; qty: number; name: string }[];
  min_amount: number;
  value: string;
  label: string;
};

type TFeatureFlag = {
  isReady: boolean;
  isSubdomain: boolean | undefined;
  isSubdomainFesyar: boolean | undefined;
  currentDomain: string;
  specialSectionId: string;
  corpIdSpecialSection: string;
  programOptions: ProgramOptions[];
  paymentMethods: TPaymentMethods | null;
  setPaymentMethods: (val: TPaymentMethods | null) => void;
  setCurrentDomain: (val: string) => void;
  setSpecialSectionId: (val: string) => void;
  setCorpIdSpecialSection: (val: string) => void;
};

type PaymentMethodItem = {
  id: string;
  logo: string;
  name: string;
  type: "instant_payment" | "virtual_account";
  provider: string;
  bank_code: string;
  fixed_fee: number;
  is_enabled: boolean;
  to_corporate: number;
  variable_fee: number;
};

type TPaymentMethods = {
  instant_payment: PaymentMethodItem[];
  virtual_account: PaymentMethodItem[];
};

const FeatureFlagContext = createContext<TFeatureFlag>({
  isReady: false,
  isSubdomain: false,
  isSubdomainFesyar: false,
  currentDomain: "",
  specialSectionId: "",
  corpIdSpecialSection: "",
  programOptions: [],
  paymentMethods: null,
  setPaymentMethods: () => {},
  setCurrentDomain: () => {},
  setSpecialSectionId: () => {},
  setCorpIdSpecialSection: () => {},
});

const localRouteDomains: Record<string, string> = {
  "/ngopi": "ngopi.satuwakaf.id",
  "/ikhtiar": "ikhtiar.satuwakaf.id",
  "/horas": "horas.satuwakaf.id",
  "/murabbi": "murabbi.satuwakaf.id",
  "/fesyar/epos": "wakafeinfesyar.satuwakaf.id",
  "/berwakaf/kalbar": "kalbarberwakaf.id",
  "/berwakaf/sumut": "sumutberwakaf.satuwakaf.id",
  "/berwakaf/jatim": "wakafjatim.satuwakaf.id",
};

function resolveCurrentDomain() {
  const host = window.location.host;
  const normalizedHost = host === "fesyarsumatra.satuwakaf.id" ? "fesyarsumatera.satuwakaf.id" : host;
  const pathname = window.location.pathname.toLowerCase();
  const routeMatch = Object.entries(localRouteDomains)
    .sort(([a], [b]) => b.length - a.length)
    .find(([route]) => pathname === route || pathname.startsWith(`${route}/`));

  if (routeMatch && !SUB_DOMAIN.includes(normalizedHost)) {
    return routeMatch[1];
  }

  return normalizedHost;
}

export function FeatureFlagProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);
  const [isSubdomain, setIsSubdomain] = useState(false);
  const [isSubdomainFesyar, setIsSubdomainFesyar] = useState(false);
  const [currentDomain, setCurrentDomain] = useState("");
  const [specialSectionId, setSpecialSectionId] = useState("");
  const [corpIdSpecialSection, setCorpIdSpecialSection] = useState("");
  const [programOptions, setProgramOptions] = useState<ProgramOptions[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<TPaymentMethods | null>(null);

  useEffect(() => {
    async function runGetCoporateProgram(address: string) {
      const result = await corporateProgram({ address });
      const current = JSON.stringify(result);
      const saved = localStorage.getItem("sub-program");

      if (current !== saved) {
        localStorage.setItem("sub-program", current);
      }

      if (Array.isArray(result) && result.length > 0) {
        setSpecialSectionId(result?.[0].special_section || "");

        if (result?.[0].is_private) {
          setCorpIdSpecialSection(result?.[0].corp_id || "");
        }

        const options: ProgramOptions[] = result.map((item: ProgramOptions) => ({
          ...item,
          value: item.special_section || "",
          label: item.title || item.address || "",
        }));
        setProgramOptions(options);
        setPaymentMethods(result?.[0]?.payment_methods);
      } else {
        console.warn("empty result for:", address);
      }
    }

    if (typeof window) {
      const URL = resolveCurrentDomain();
      const isSub = SUB_DOMAIN.includes(URL);

      if (isSub) {
        runGetCoporateProgram(URL);
      }

      setIsSubdomainFesyar(URL?.includes("fesyar"));
      setIsSubdomain(isSub);
      setCurrentDomain(URL);
      setIsReady(true);
    }
  }, [pathname]);

  return (
    <FeatureFlagContext.Provider
      value={{
        isReady,
        isSubdomain,
        isSubdomainFesyar,
        currentDomain,
        specialSectionId,
        corpIdSpecialSection,
        programOptions,
        paymentMethods,
        setPaymentMethods,
        setCorpIdSpecialSection,
        setCurrentDomain,
        setSpecialSectionId,
      }}
    >
      {children}
    </FeatureFlagContext.Provider>
  );
}

export const useFeatureFlag = () => useContext(FeatureFlagContext);
