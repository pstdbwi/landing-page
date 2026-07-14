"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  {
    href: "/about",
    label: "Tentang Program",
  },
  {
    href: "/news",
    label: "Kabar Terbaru",
  },
  {
    href: "/donor",
    label: "Wakif",
  },
  {
    href: "/prays",
    label: "Doa & Harapan",
  },
  {
    href: "/disbursement",
    label: "Penyaluran Dana",
  },
];

interface CampaignNavigationProps {
  campaignId: string;
  donorCount: number;
}

const CampaignNavigation = ({ campaignId, donorCount }: CampaignNavigationProps) => {
  const pathname = usePathname();

  return (
    <div className="mt-5 md:shadow-[inset_0_-4px_0_0_rgba(249,250,251,0.2)] sticky top-14 pt-5 bg-fesyar-green-700/20 backdrop-blur-xl z-30 w-full">
      <div className="mx-auto w-full max-w-7xl overflow-x-auto">
        <nav className="flex min-w-max gap-0">
          {LINKS.map((link) => {
            const currentSegment = pathname.split("/").filter(Boolean).pop();
            const targetSegment = link.href.split("/").filter(Boolean).pop();
            const isActive = currentSegment === targetSegment;

            return (
              <Link
                key={link.href}
                href={`/fesyar/campaign/${campaignId}/detail${link.href}`}
                className={cn(
                  "pb-3 transition-colors hover:border-b-4 hover:border-fesyar-yellow-600/50 border-b-4 border-transparent font-semibold text-center px-3 text-sm sm:text-base text-white flex items-center gap-1 whitespace-nowrap max-md:border-gray-500/50",
                  isActive && "border-b-4 md:border-fesyar-yellow-600 max-md:border-fesyar-yellow-600",
                )}
              >
                {link.label}{" "}
                {link.label === "Wakif" && (
                  <p className="text-sm px-2 py-1 bg-[#BF4157] text-white rounded-md">{donorCount}</p>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default CampaignNavigation;
