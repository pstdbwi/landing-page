"use client";

import axios from "axios";
import { ArrowLeftIcon, LoaderIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Status = "loading" | "not_found" | "error" | "idle";

export default function ShortlinkClientPage({ params }: { params: { shortlink: string } }) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        if (!params?.shortlink) throw { error: "Shortlink tidak ditemukan" };

        // FETCH CAMPAIGN
        const res = await axios.get(`https://api.satuwakafindonesia.id/campaigns?shortlink=${params?.shortlink}`);
        const campaignId = res.data?.data?.[0]?.id;

        if (campaignId) {
          router.replace(`/campaign/${campaignId}/detail/about`);

          return;
        }

        setStatus("not_found");
      } catch (err) {
        console.error("Shortlink fetch error:", err);
        setStatus("error");
      }
    };

    fetchCampaign();
  }, [params.shortlink, router]);

  return (
    <div className="layout bg-white h-screen grid place-items-center">
      <RenderSituation status={status} />
    </div>
  );
}

const RenderSituation = ({ status }: { status: Status }) => {
  switch (status) {
    case "loading":
      return (
        <div className="flex items-center justify-center flex-col gap-2">
          <h1 className="mt-4 text-lg">Sedang mengarahkan ke halaman sebenarnya...</h1>
          <LoaderIcon className="w-4 animate-spin" />
        </div>
      );

    case "not_found":
      return (
        <div className="flex items-center justify-center flex-col gap-2">
          <h1 className="mt-4 text-xl">Shortlink Campaign tidak ditemukan</h1>
          <a href="/" className="underline flex gap-2">
            <ArrowLeftIcon className="w-4" /> Kembali ke home
          </a>
        </div>
      );

    case "error":
      return (
        <div className="flex items-center justify-center flex-col gap-2">
          <h1 className="mt-4 text-xl">Ooops, Terjadi Kesalahan</h1>
          <a href="/" className="underline flex gap-2">
            <ArrowLeftIcon className="w-4" /> Kembali ke home
          </a>
        </div>
      );

    default:
      return null;
  }
};
