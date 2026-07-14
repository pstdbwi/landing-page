"use client";

import { GradientText } from "@/components/fesyar/gradient-text";
import { notifySuccess } from "@/components/Toaster";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CopyIcon, DownloadIcon, Share2Icon } from "lucide-react";
import Image from "next/image";
import { QRCodeCanvas } from "qrcode.react";
import React, { useRef } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { Toaster } from "react-hot-toast";
import {
  FacebookIcon,
  FacebookShareButton,
  LineIcon,
  LineShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";

const murabiDialogStyle = {
  background: "radial-gradient(circle at center, #0C4C55 0%, #001F2D 100%)",
};

const murabiDialogClassName =
  "sm:max-w-md text-white border-0 overflow-hidden [&_[data-slot=dialog-close]]:text-white [&_[data-slot=dialog-close]]:opacity-100";

function MurabiDialogOrnaments() {
  return (
    <>
      <Image
        src="/assets/murobbi/ornament-bottom-left-right.png"
        width={113}
        height={627}
        alt="ornament"
        className="pointer-events-none absolute bottom-0 left-0 z-0 h-[58%] max-h-[627px] w-auto"
      />
      <Image
        src="/assets/murobbi/ornament-bottom-left-right.png"
        width={113}
        height={627}
        alt="ornament"
        className="pointer-events-none absolute bottom-0 right-0 z-0 h-[58%] max-h-[627px] w-auto scale-x-[-1]"
      />
    </>
  );
}

interface ShareProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  url: string;
  title?: string;
}

export const MurabiShareDialog: React.FC<ShareProps> = ({ open, onOpenChange, url, title }) => {
  const domainHost = typeof window !== "undefined" ? window.location.host : "";
  // Ensure url is absolute or relative correctly handled. The original code did `https://${domainHost}${url}` but passed url with query params.
  // In usage: `url={typeof window !== "undefined" ? window.location.href + ... : ""}` which is ALREADY absolute.
  // Wait, let's check usage in layout.tsx.
  // It passes `window.location.href + ...`. So `url` prop IS the full URL.
  // Original Share component: `const shareUrls = "https://${domainHost}${url}";`
  // But layout.tsx passed `window.location.href...`.
  // If `url` starts with `http`, prepending `https://${domainHost}` would be wrong.
  // Let's assume `url` is the full string to share.

  // Checking original Share component again:
  // Layout passes: `currentPathname + "?share=1..."` which is relative path!
  // BUT in my modification to layout.tsx I changed it to `window.location.href + ...`?
  // Let's check my modification to layout.tsx.
  // `url={typeof window !== "undefined" ? window.location.href + "?share=1..." : ""}`
  // So `url` is ABSOLUTE.

  // Original Share component:
  // `const shareUrls = "https://${domainHost}${url}";`
  // If url is absolute, this is bugged in original component unless pure path is passed.
  // In `page.tsx` (original): `url={currentPathname + "?share=1..."}` -> pure path.
  // My current layout.tsx passes absolute path.
  // So I should just use `url` directly if it is absolute.

  const shareUrls = url.startsWith("http") ? url : `https://${domainHost}${url}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={murabiDialogClassName} style={murabiDialogStyle}>
        <MurabiDialogOrnaments />

        <DialogHeader>
          <DialogTitle className="text-center relative z-10">
            <GradientText>Bagikan Lewat</GradientText>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-4 gap-4 place-items-center mb-4 relative z-10">
          <FacebookShareButton url={shareUrls}>
            <FacebookIcon size={48} round />
          </FacebookShareButton>
          <WhatsappShareButton url={shareUrls}>
            <WhatsappIcon size={48} round />
          </WhatsappShareButton>
          <LineShareButton url={shareUrls}>
            <LineIcon size={48} round />
          </LineShareButton>
          <TwitterShareButton url={shareUrls}>
            <TwitterIcon size={48} round />
          </TwitterShareButton>
        </div>

        <div className="bg-white/10 p-3 w-full inline-flex items-center gap-2 rounded-md border border-white/20 relative z-10 backdrop-blur-sm">
          <p className="line-clamp-1 text-xs text-white flex-1 font-mono">{shareUrls}</p>
          <CopyToClipboard
            text={shareUrls}
            onCopy={() => {
              notifySuccess("Berhasil salin link");
            }}
          >
            <Button size="sm" variant="secondary" className="h-7 text-xs px-3">
              <CopyIcon size={12} className="mr-1" /> Salin
            </Button>
          </CopyToClipboard>
        </div>

        <DialogFooter className="relative z-10 sm:justify-center">
          <DialogClose asChild>
            <Button type="button" variant="ghost" className="text-white hover:bg-white/20 hover:text-white">
              Tutup
            </Button>
          </DialogClose>
        </DialogFooter>
        <Toaster position="bottom-center" />
      </DialogContent>
    </Dialog>
  );
};

interface QRCodeShareProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  url: string;
  title?: string;
  nameDownload?: string;
}

export const MurabiQRCodeShareDialog: React.FC<QRCodeShareProps> = ({
  open,
  onOpenChange,
  url,
  title = "Campaign",
  nameDownload,
}) => {
  const domainHost = typeof window !== "undefined" ? window.location.host : "";
  // QR Code share url usually needs to be full url
  const shareUrls = url?.startsWith("http") ? url : `https://${domainHost}/${url}`;

  const QRRef = useRef<HTMLDivElement | null>(null);

  const downloadQR = () => {
    try {
      const originalCanvas = QRRef.current?.querySelector("canvas");
      if (!originalCanvas) return;

      const originalSize = originalCanvas.width;
      const padding = 40;
      const paddedSize = originalSize + padding * 2;

      const canvas = document.createElement("canvas");
      canvas.width = paddedSize;
      canvas.height = paddedSize;

      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, paddedSize, paddedSize);

      ctx.drawImage(originalCanvas, padding, padding);

      const image = canvas.toDataURL("image/png");

      const anchor = document.createElement("a");
      anchor.href = image;
      anchor.download = `QR ${nameDownload}.png`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
    } catch (error) {
      console.log(error);
    }
  };

  const getQRDataUrl = (): string | null => {
    const originalCanvas = QRRef.current?.querySelector("canvas");
    if (!originalCanvas) return null;

    const originalSize = originalCanvas.width;
    const padding = 40;
    const paddedSize = originalSize + padding * 2;

    const canvas = document.createElement("canvas");
    canvas.width = paddedSize;
    canvas.height = paddedSize;

    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, paddedSize, paddedSize);
    ctx.drawImage(originalCanvas, padding, padding);

    return canvas.toDataURL("image/png");
  };

  const shareToWhatsapp = async () => {
    const dataUrl = getQRDataUrl();
    if (!dataUrl) return;

    const blob = await (await fetch(dataUrl)).blob();
    const file = new File([blob], `QR-${nameDownload || "qr"}.png`, { type: blob.type });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      navigator.share({
        files: [file],
        title: `QR ${title}`,
        text: `Scan atau bagikan QR ini untuk ${title}`,
      });
    } else {
      const fallbackUrl = `https://wa.me/?text=${encodeURIComponent(`Lihat ${title}: ${shareUrls}`)}`;
      window.open(fallbackUrl, "_blank");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={murabiDialogClassName} style={murabiDialogStyle}>
        <MurabiDialogOrnaments />

        <DialogHeader>
          <DialogTitle className="text-center relative z-10">
            <GradientText>QR {title}</GradientText>
          </DialogTitle>
        </DialogHeader>

        <div
          className="flex items-center justify-center p-4 bg-white rounded-xl w-fit mx-auto relative z-10"
          ref={QRRef}
        >
          <QRCodeCanvas
            id="canvas"
            value={shareUrls}
            size={200}
            bgColor={"#ffffff"}
            level={"H"}
            imageSettings={{
              src: "/images/icons/icon-128x128.png",
              x: undefined,
              y: undefined,
              height: 24,
              width: 24,
              opacity: 1,
              excavate: true,
            }}
          />
        </div>

        <p className="text-xs text-center max-w-xs mx-auto my-2 text-white/80 relative z-10">
          Gunakan QR untuk membagikan {title} ini. <br /> QR dapat dipindai atau diunduh untuk disimpan.
        </p>

        <div className="flex items-center w-full justify-center gap-2 relative z-10">
          <Button onClick={shareToWhatsapp} type="button" size="sm" variant="secondary" className="text-xs">
            <Share2Icon className="w-3 h-3 mr-2" /> Bagikan
          </Button>

          <Button onClick={downloadQR} type="button" size="sm" variant="secondary" className="text-xs">
            <DownloadIcon className="w-3 h-3 mr-2" /> Unduh
          </Button>
        </div>

        <DialogFooter className="relative z-10 sm:justify-center">
          <DialogClose asChild>
            <Button type="button" variant="ghost" className="text-white hover:bg-white/20 hover:text-white">
              Tutup
            </Button>
          </DialogClose>
        </DialogFooter>
        <Toaster position="bottom-center" />
      </DialogContent>
    </Dialog>
  );
};
