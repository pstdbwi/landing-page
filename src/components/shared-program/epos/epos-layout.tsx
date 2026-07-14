"use client";

import { EPOS_VISUALS, EPOS_VISUALS_DEFAULT, VisualAsset } from "@/app/fesyar/epos/epos-visuals";
import { useFeatureFlag } from "@/store/feature-flag-context";
import Image from "next/image";
import React from "react";
import EposHeader from "./epos-header";

interface LayoutEposProps {
  children: React.ReactNode;
  header?: boolean;
  footer: "landing-page" | "detail-page";
  params?: any;
  tnc?: boolean;
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

const LayoutEpos = ({ children, header = true, footer, tnc = false }: LayoutEposProps) => {
  const { specialSectionId } = useFeatureFlag();
  const attributeVisual = specialSectionId ? EPOS_VISUALS[specialSectionId] : undefined;
  const showBottomOrnaments = footer === "landing-page" || footer === "detail-page";

  return (
    <div className="bg-[#071c3d]">
      {/* Background layer */}
      <div className="fixed inset-0 z-0 bg-[#071c3d]">
        <Image src="/assets/wakafein/bg-kv-2026.jpg" fill sizes="100vw" alt="" priority className="object-cover" />
      </div>

      {/* Star field top overlay */}
      <div
        className="pointer-events-none fixed inset-x-0 top-0 z-[1] h-[42vh] opacity-70 [mask-image:linear-gradient(to_bottom,black_0%,black_46%,transparent_100%)]"
        style={topStarFieldStyle}
        aria-hidden="true"
      />

      {header ? <EposHeader /> : null}

      {/* Top flowers */}
      {showBottomOrnaments ? (
        <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden" aria-hidden="true">
          <Image
            src="/assets/wakafein/flower.png"
            width={355}
            height={397}
            alt=""
            priority
            className="fixed top-0 right-0 z-[2] h-auto w-[35vw] min-w-[240px] max-w-[420px] scale-y-[-1] scale-x-[-1] mix-blend-screen"
          />
          <Image
            src="/assets/wakafein/flower.png"
            width={355}
            height={397}
            alt=""
            priority
            className="fixed top-0 left-0 z-[2] h-auto w-[35vw] min-w-[240px] max-w-[420px] scale-y-[-1] mix-blend-screen"
          />
        </div>
      ) : null}

      {/* Bottom ornaments */}
      {showBottomOrnaments ? (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-0 overflow-hidden" aria-hidden="true">
          {/* Left side */}
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
            className="fixed bottom-10 left-10 z-[1] h-auto w-[66vw] min-w-[290px] max-w-[300px] mix-blend-screen"
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
            src={attributeVisual?.wastra ?? EPOS_VISUALS_DEFAULT?.wastra}
            width={558}
            height={230}
            alt=""
            priority
            className="fixed bottom-0 left-0 z-[1] h-auto w-[66vw] min-w-[290px] max-w-[300px] scale-x-[-1]"
          />

          {/* Right side */}
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
            className="fixed bottom-0 right-0 z-[1] h-auto w-[66vw] min-w-[290px] max-w-[558px] scale-x-[-1] mix-blend-color-dodge"
          />
          <Image
            src={attributeVisual?.wastra ?? EPOS_VISUALS_DEFAULT?.wastra}
            width={558}
            height={230}
            alt=""
            priority
            className="fixed bottom-0 right-0 z-[1] h-auto w-[66vw] min-w-[290px] max-w-[300px]"
          />
        </div>
      ) : null}

      <div className="z-20 relative">{children}</div>

      {tnc ? <TermsAndConditions attributeVisual={attributeVisual} /> : null}

      {/* Footer Logos BI dan BWI */}
      <div className="p-2 relative z-10 w-fit flex items-center gap-4 mx-auto">
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

export default LayoutEpos;

const TermsAndConditions = ({ attributeVisual }: { attributeVisual?: VisualAsset }) => {
  return (
    <div className="flex flex-col md:flex-row items-start justify-between max-w-7xl mx-auto relative z-10 my-8 bg-white/95 p-3 md:p-4 rounded-lg border gap-4 md:gap-6">
      <div className="flex items-start gap-3 w-full md:w-auto flex-1">
        <div className="w-1 h-10 bg-gradient-to-b from-[#FFE7A1] to-[#DAB95A] rounded-full shrink-0 mt-0.5" />
        <div className="min-w-0 space-y-2">
          <span className="text-xs text-gray-400 tracking-wide">
            *Syarat & Ketentuan {attributeVisual?.program || "WAKAFein FESyar"}
          </span>
          <ol className="list-decimal ml-4 text-xs font-medium text-justify space-y-1 text-gray-600">
            <li>Setiap transaksi wakaf minimal Rp15.000 (tidak berlaku kelipatan) berhak atas 1 kode voucher</li>
            <li>Kode voucher dapat ditukarkan dengan 1 minuman secara offline di booth Wakafein FESyar KTI</li>
            <li>Minuman yang dapat dipilih mengikuti ketersediaan menu saat penukaran</li>
          </ol>
        </div>
      </div>

      <div className="flex items-start gap-3 w-full md:w-auto md:min-w-[200px]">
        <div className="w-1 h-10 bg-gradient-to-b from-[#FFE7A1] to-[#DAB95A] rounded-full shrink-0 mt-0.5" />
        <div className="min-w-0 space-y-2">
          <span className="text-xs text-gray-400 tracking-wide">Lokasi penukaran voucher</span>
          <ol className="list-decimal ml-4 text-xs font-medium space-y-1 text-gray-600">
            <li>Booth Wakafein FESyar KTI</li>
          </ol>
        </div>
      </div>
    </div>
  );
};
