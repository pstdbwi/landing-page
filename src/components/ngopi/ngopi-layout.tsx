"use client";

import { useFeatureFlag } from "@/store/feature-flag-context";
import Image from "next/image";
import React from "react";
import { GradientText } from "../fesyar/gradient-text";
import NgopiHeader from "./ngopi-header";

interface LayoutNgopiProps {
  children: React.ReactNode;
  header?: boolean;
  footer: "landing-page" | "detail-page";
  params?: any;
  tnc?: boolean;
  backgroundUrl?: string;
}

const topStarFieldStyle: React.CSSProperties = {
  backgroundImage: [
    "radial-gradient(circle, rgba(255,255,255,0.95) 0 1px, transparent 1.6px)",
    "radial-gradient(circle, rgba(180,225,255,0.85) 0 1.2px, transparent 1.9px)",
    "radial-gradient(circle, rgba(255,231,161,0.75) 0 0.9px, transparent 1.7px)",
    "radial-gradient(circle, rgba(255,255,255,0.55) 0 1px, transparent 1.8px)",
  ].join(", "),
  backgroundPosition: "0 0, 46px 54px, 110px 26px, 18px 96px",
  backgroundSize: "128px 128px, 168px 168px, 220px 220px, 96px 96px",
};

// const MOBILE_BREAKPOINT = 640;

const LayoutNgopi = ({
  children,
  header = true,
  footer,
  params,
  tnc = true,
  backgroundUrl = "/assets/wakafein/bg-kv-2026.jpg",
}: LayoutNgopiProps) => {
  const { currentDomain } = useFeatureFlag();

  // const router = useRouter();
  // const pathname = usePathname();

  // React.useEffect(() => {
  //   if (typeof window !== "undefined" && window.innerWidth <= MOBILE_BREAKPOINT) {
  //     const segments = pathname.split("/").filter(Boolean);
  //     const isFesyarCampaignDetailAbout =
  //       segments[0] === "fesyar" && segments[1] === "campaign" && segments[3] === "detail";

  //     const campaignId = segments[2];

  //     if (isFesyarCampaignDetailAbout) {
  //       router.push(`/campaign/${campaignId}`);
  //     }

  //     if (pathname === "/fesyar") {
  //       router.push(`/`);
  //     }
  //   }
  // }, [pathname, router]);

  const showBottomOrnaments = footer === "landing-page" || footer === "detail-page";

  const TermsAndConditions = () => {
    if (currentDomain == "wakafein.id") {
      return (
        <div className="bg-glass-gradient p-6 max-w-7xl mx-auto relative z-10 text-white rounded-lg grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 my-8">
          <div className="space-y-2 col-span-7">
            <GradientText className="text-sm lg:text-base">*Syarat & Ketentuan WAKAFein</GradientText>
            <ol className="list-decimal ml-4 text-xs font-medium text-justify space-y-1">
              <li>Setiap transaksi wakaf minimal Rp15.000 (tidak berlaku kelipatan) berhak atas 1 kode voucher</li>
              <li>
                Kode voucher dapat ditukarkan dengan 1 minuman secara offline di booth Taste of Sumatera (Wakafein)
              </li>
              <li>Minuman yang dapat dipilih mengikuti ketersediaan saat penukaran</li>
            </ol>
          </div>
          <div className="space-y-2 col-span-5">
            <GradientText className="text-sm lg:text-base">Lokasi penukaran voucher</GradientText>
            <ol className="list-decimal ml-4 text-xs font-medium space-y-1">
              <li>Booth Taste of Sumatera di Atrium Palembang Icon Mall (5-7 Juni 2026)</li>
            </ol>
          </div>
        </div>
      );
    } else {
      return (
        <div className="bg-glass-gradient p-6 max-w-7xl mx-auto relative z-10 text-white rounded-lg grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 my-8">
          <div className="space-y-2 col-span-7">
            <GradientText className="text-sm lg:text-base">*Syarat & Ketentuan WAKAFein</GradientText>
            <ol className="list-decimal ml-4 text-xs font-medium text-justify space-y-1">
              <li>Setiap transaksi wakaf minimal Rp15.000 (tidak berlaku kelipatan) berhak atas 1 kode voucher</li>
              <li>
                Kode voucher dapat ditukarkan dengan 1 minuman secara offline di booth Taste of Sumatera (Wakafein)
              </li>
              <li>Minuman yang dapat dipilih mengikuti ketersediaan saat penukaran </li>
            </ol>
          </div>
          <div className="space-y-2 col-span-5">
            <GradientText className="text-sm lg:text-base">Lokasi penukaran voucher</GradientText>
            <ol className="list-decimal ml-4 text-xs font-medium space-y-1">
              <li>Booth Taste of Sumatera di Atrium Palembang Icon Mall (5-7 Juni 2026)</li>
            </ol>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="bg-[#071c3d]">
      <div className="fixed inset-0 z-0 bg-[#071c3d]">
        <Image src={backgroundUrl} fill sizes="100vw" alt="" priority className="object-cover" />
      </div>

      <div
        className="pointer-events-none fixed inset-x-0 top-0 z-[1] h-[42vh] opacity-70 [mask-image:linear-gradient(to_bottom,black_0%,black_46%,transparent_100%)]"
        style={topStarFieldStyle}
        aria-hidden="true"
      />

      {header ? <NgopiHeader /> : null}

      {showBottomOrnaments ? (
        <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden" aria-hidden="true">
          <Image
            src="/assets/wakafein/flower.png"
            width={355}
            height={397}
            alt=""
            priority
            className="fixed top-0 right-0 z-[2] h-auto w-[35vw] min-w-[240px] max-w-[420px]  scale-y-[-1] scale-x-[-1] mix-blend-screen"
          />
          <Image
            src="/assets/wakafein/flower.png"
            width={355}
            height={397}
            alt=""
            priority
            className="fixed top-0 left-0 z-[2] h-auto w-[35vw] min-w-[240px] max-w-[420px]  scale-y-[-1] mix-blend-screen"
          />
        </div>
      ) : null}

      {showBottomOrnaments ? (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-0 overflow-hidden" aria-hidden="true">
          <Image
            src="/assets/wakafein/brush-bottom.png"
            width={491}
            height={346}
            alt=""
            priority
            className="fixed bottom-0 left-0 z-0 h-auto w-[58vw] min-w-[260px] max-w-[491px]"
          />
          <Image
            src="/assets/wakafein/ribbon.png"
            width={558}
            height={230}
            alt=""
            priority
            className="fixed bottom-0 left-0 z-[1] h-auto w-[66vw] min-w-[290px] max-w-[558px] mix-blend-screen scale-x-[-1]"
          />
          <Image
            src="/assets/wakafein/ellipsis.png"
            width={300}
            height={230}
            alt=""
            priority
            className="fixed bottom-10 left-10 z-[1] h-auto w-[66vw] min-w-[290px] max-w-[300px] mix-blend-screen "
          />
          <Image
            src="/assets/wakafein/ellipsis.png"
            width={300}
            height={230}
            alt=""
            priority
            className="fixed bottom-10 right-10 z-[1] h-auto w-[66vw] min-w-[290px] max-w-[300px] mix-blend-screen scale-x-[-1]"
          />
          <Image
            src="/assets/wakafein/color-dodge.png"
            width={558}
            height={230}
            alt=""
            priority
            className="fixed bottom-0 left-0 z-[1] h-auto w-[66vw] min-w-[290px] max-w-[558px] mix-blend-color-dodge"
          />
          <Image
            src="/assets/wakafein/wastra-sumatera.png"
            width={558}
            height={230}
            alt=""
            priority
            className="fixed bottom-0 left-0 z-[1] h-auto w-[66vw] min-w-[290px] max-w-[300px] scale-x-[-1]"
          />
          <Image
            src="/assets/wakafein/brush-bottom.png"
            width={491}
            height={346}
            alt=""
            priority
            className="fixed bottom-0 right-0 z-0 h-auto w-[58vw] min-w-[260px] max-w-[491px] scale-x-[-1]"
          />
          <Image
            src="/assets/wakafein/ribbon.png"
            width={558}
            height={230}
            alt=""
            priority
            className="fixed bottom-0 right-0 z-[1] h-auto w-[66vw] min-w-[290px] max-w-[558px] mix-blend-screen"
          />
          <Image
            src="/assets/wakafein/color-dodge.png"
            width={558}
            height={230}
            alt=""
            priority
            className="fixed bottom-0 right-0 z-[1] h-auto w-[66vw] min-w-[290px] max-w-[558px] scale-x-[-1] mix-blend-color-dodge"
          />
          <Image
            src="/assets/wakafein/wastra-sumatera.png"
            width={558}
            height={230}
            alt=""
            priority
            className="fixed bottom-0 right-0 z-[1] h-auto w-[66vw] min-w-[290px] max-w-[300px] "
          />
        </div>
      ) : null}

      <div className="z-20 relative ">{children}</div>

      {tnc ? <TermsAndConditions /> : null}

      {/* Logo BI dan BWI */}
      <div className="p-2 relative z-10 w-fit flex items-center gap-4 mx-auto ">
        <Image
          src="/assets/bank-indonesia-logo-white.svg"
          width={150}
          height={150}
          alt="Bank Indonesia"
          className="object-contain"
        />
        <Image src="/assets/bwi-logo.png" width={50} height={50} alt="BWI" className="object-contain" />
      </div>
    </div>
  );
};

export default LayoutNgopi;
