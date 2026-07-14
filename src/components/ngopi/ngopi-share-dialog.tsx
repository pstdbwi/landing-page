"use client";

import { notifySuccess } from "@/components/Toaster";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CopyIcon, DownloadIcon, Share2Icon } from "lucide-react";
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
import {
  NgopiGradientText,
  NgopiWastraCorners,
  ngopiDialogContentClassName,
  ngopiGlassPanelClassName,
  ngopiPrimaryButtonClassName,
} from "./ngopi-theme";

interface ShareProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  url: string;
  title?: string;
}

export const NgopiShareDialog: React.FC<ShareProps> = ({ open, onOpenChange, url }) => {
  const domainHost = typeof window !== "undefined" ? window.location.host : "";
  const shareUrls = url.startsWith("http") ? url : `https://${domainHost}${url}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${ngopiDialogContentClassName} sm:max-w-md overflow-hidden text-white`}>
        <NgopiWastraCorners />

        <DialogHeader>
          <DialogTitle className="relative z-10 text-center">
            <NgopiGradientText>Bagikan Lewat</NgopiGradientText>
          </DialogTitle>
        </DialogHeader>

        <div className="relative z-10 grid grid-cols-4 gap-4 place-items-center mb-4">
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

        <div
          className={`${ngopiGlassPanelClassName} relative z-10 inline-flex w-full items-center gap-2 rounded-md p-3`}
        >
          <p className="line-clamp-1 flex-1 font-mono text-xs text-sky-100">{shareUrls}</p>
          <CopyToClipboard
            text={shareUrls}
            onCopy={() => {
              notifySuccess("Berhasil salin link");
            }}
          >
            <Button size="sm" className={`h-7 px-3 text-xs ${ngopiPrimaryButtonClassName}`}>
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

export const NgopiQRCodeShareDialog: React.FC<QRCodeShareProps> = ({
  open,
  onOpenChange,
  url,
  title = "Campaign",
  nameDownload,
}) => {
  const domainHost = typeof window !== "undefined" ? window.location.host : "";
  const shareUrls = url?.startsWith("http") ? url : `https://${domainHost}/${url}`;

  const QRRef = useRef<HTMLDivElement | null>(null);

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

  const downloadQR = () => {
    try {
      const image = getQRDataUrl();
      if (!image) return;

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
      <DialogContent className={`${ngopiDialogContentClassName} sm:max-w-md overflow-hidden text-white`}>
        <NgopiWastraCorners />

        <DialogHeader>
          <DialogTitle className="relative z-10 text-center">
            <NgopiGradientText>QR {title}</NgopiGradientText>
          </DialogTitle>
        </DialogHeader>

        <div
          className="relative z-10 mx-auto flex w-fit items-center justify-center rounded-xl border border-[#DAB95A]/40 bg-white p-4 shadow-xl"
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

        <p className="relative z-10 mx-auto my-2 max-w-xs text-center text-xs text-sky-100/85">
          Gunakan QR untuk membagikan {title} ini. <br /> QR dapat dipindai atau diunduh untuk disimpan.
        </p>

        <div className="relative z-10 flex w-full items-center justify-center gap-2">
          <Button onClick={shareToWhatsapp} type="button" size="sm" className={`text-xs ${ngopiPrimaryButtonClassName}`}>
            <Share2Icon className="mr-2 h-3 w-3" /> Bagikan
          </Button>

          <Button onClick={downloadQR} type="button" size="sm" className={`text-xs ${ngopiPrimaryButtonClassName}`}>
            <DownloadIcon className="mr-2 h-3 w-3" /> Unduh
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

