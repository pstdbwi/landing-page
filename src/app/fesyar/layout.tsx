import { headers } from "next/headers";
import { Fragment } from "react";

const FESYAR_HOST_MAP: Record<string, string> = {
  fesyarsumatra: "FESYAR SUMATERA",
  fesyarsumatera: "FESYAR SUMATERA",
  fesyarjawa: "FESYAR JAWA",
  fesyarkti: "FESYAR KTI",
};

function getFesyarTitle(host: string | null): string {
  if (!host) return "FESYAR";

  const subdomain = host.split(".")[0]?.toLowerCase();
  if (!subdomain) return "FESYAR";

  return FESYAR_HOST_MAP[subdomain] ?? `FESYAR ${subdomain.replace("fesyar", "").toUpperCase()}`;
}

export async function generateMetadata() {
  const host = headers().get("host");
  const title = getFesyarTitle(host);

  return {
    title,
    description: title,
  };
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <Fragment>{children}</Fragment>;
};

export default Layout;
