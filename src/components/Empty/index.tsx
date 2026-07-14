import { CampaignTypeKeys, personByCampaignType } from "@/lib/typeCampaign";
import Image from "next/image";
import { Label } from "../Label";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { ArrowLeftIcon } from "lucide-react";
interface Props {
  type: "campaign" | "donors" | "news" | "disbursement";
  campaignType?: CampaignTypeKeys;
}

const Empty: React.FC<Props> = ({ type = "campaign", campaignType = "3" }) => {
  const renderText = (value: string) => {
    if (value === "donors") {
      return {
        title: `Tidak ditemukan ${personByCampaignType[campaignType]}`,
        description: `Saat ini tidak ditemukan ${personByCampaignType[campaignType]}`,
      };
    }
    if (value === "news") {
      return {
        title: `Belum ada Berita saat ini.`,
        description: `Belum ada berita terbaru seputar program saat ini. Yuk, cek kembali nanti untuk update terbaru.`,
      };
    }
    if (value === "disbursement") {
      return {
        title: `Belum ada Pencairan dana saat ini.`,
        description: `Belum ada Pencairan dana terbaru seputar program saat ini. Yuk, cek kembali nanti untuk update terbaru.`,
      };
    }
    return {
      title: "Tidak ditemukan program",
      description: "Saat ini tidak ditemukan data",
    };
  };
  return (
    <div className="flex flex-col items-center gap-5 justify-center w-full py-5">
      {type === "campaign" ? (
        <Image src="/assets/empty.svg" width={200} height={200} fetchPriority="auto" alt="empty" />
      ) : null}
      <div className="space-y-2 text-center px-8">
        <h1 className="text-base font-bold">{renderText(type).title}</h1>
        <p className="text-sm text-gray-500">{renderText(type).description}</p>
      </div>
    </div>
  );
};

const EmptyReport = ({
  description = "Tidak ada data",
  linkBack = "/",
}: {
  description?: string;
  linkBack?: string;
}) => {
  return (
    <div className="grid place-items-center h-[60vh]">
      <div className="flex flex-col gap-3 items-center justify-center">
        <Image src="/assets/empty.svg" width={200} height={200} fetchPriority="auto" alt="empty" />
        <Label className="text-lg">{description}</Label>
        <Link href={linkBack} className={buttonVariants({ variant: "outline" })}>
          <ArrowLeftIcon className="w-4 mr-1" /> Kembali
        </Link>
      </div>
    </div>
  );
};

export { Empty, EmptyReport };
