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

interface ShareProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  url: string;
  title?: string;
}

export const FesyarShareDialog: React.FC<ShareProps> = ({ open, onOpenChange, url }) => {
  const domainHost = typeof window !== "undefined" ? window.location.host : "";
  const shareUrls = url.startsWith("http") ? url : `https://${domainHost}${url}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-fesyar-green-500 text-white border-0">
        <Image
          src={"/assets/fesyar/wastra.png"}
          fill
          alt="wastra"
          className="absolute top-0 left-0 pointer-events-none"
        />
        <Image
          src="/assets/fesyar/wastra.png"
          fill
          alt="wastra"
          className="absolute top-0 right-0 scale-x-[-1] pointer-events-none"
        />

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

export const FesyarQRCodeShareDialog: React.FC<QRCodeShareProps> = ({
  open,
  onOpenChange,
  url,
  title = "Campaign",
  nameDownload,
}) => {
  const domainHost = typeof window !== "undefined" ? window.location.host : "";
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
      <DialogContent className="sm:max-w-md bg-fesyar-green-500 text-white border-0">
        <Image
          src={"/assets/fesyar/wastra.png"}
          fill
          alt="wastra"
          className="absolute top-0 left-0 pointer-events-none"
        />
        <Image
          src="/assets/fesyar/wastra.png"
          fill
          alt="wastra"
          className="absolute top-0 right-0 scale-x-[-1] pointer-events-none"
        />

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
