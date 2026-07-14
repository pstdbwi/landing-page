"use client";

import { GradientText } from "@/components/fesyar/gradient-text";
import { notifySuccess } from "@/components/Toaster";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { sanitizeTitle } from "@/lib/utils";
import { CopyIcon, DownloadIcon, Share2Icon } from "lucide-react";
import Image from "next/image";
import { QRCodeCanvas } from "qrcode.react";
import React, { useMemo, useRef } from "react";
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

const DIALOG_RADIAL_BG = "bg-[radial-gradient(circle_at_center,_theme(colors.fesyar.green.100),_#00484C)]";

interface SharedShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaign: any;
}

export const SharedCampaignShareDialog: React.FC<SharedShareDialogProps> = ({ open, onOpenChange, campaign }) => {
  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return `${window.location.href}?share=1&title=${sanitizeTitle(campaign?.title || "")}`;
  }, [campaign?.title]);

  const domainHost = typeof window !== "undefined" ? window.location.host : "";
  const absoluteShareUrl = shareUrl.startsWith("http") ? shareUrl : `https://${domainHost}${shareUrl}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`sm:max-w-lg ${DIALOG_RADIAL_BG} text-white border-0`}>
        <DialogHeader>
          <DialogTitle className="text-center relative z-10">
            <GradientText>Bagikan Lewat</GradientText>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-4 gap-4 place-items-center mb-4 relative z-10">
          <FacebookShareButton url={absoluteShareUrl}>
            <FacebookIcon size={48} round />
          </FacebookShareButton>
          <WhatsappShareButton url={absoluteShareUrl}>
            <WhatsappIcon size={48} round />
          </WhatsappShareButton>
          <LineShareButton url={absoluteShareUrl}>
            <LineIcon size={48} round />
          </LineShareButton>
          <TwitterShareButton url={absoluteShareUrl}>
            <TwitterIcon size={48} round />
          </TwitterShareButton>
        </div>

        <div className="bg-white/10 p-3 w-full inline-flex items-center gap-2 rounded-md border border-white/20 relative z-10 backdrop-blur-sm">
          <p className="line-clamp-1 text-xs text-white flex-1 font-mono">{absoluteShareUrl}</p>
          <CopyToClipboard
            text={absoluteShareUrl}
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

export const SharedCampaignQRCodeShareDialog: React.FC<SharedShareDialogProps> = ({ open, onOpenChange, campaign }) => {
  const domainHost = typeof window !== "undefined" ? window.location.host : "";
  const shareUrl = campaign?.shortlink?.startsWith("http")
    ? campaign?.shortlink
    : `https://${domainHost}/${campaign?.shortlink}`;
  const qrRef = useRef<HTMLDivElement | null>(null);

  const getQRDataUrl = (): string | null => {
    const originalCanvas = qrRef.current?.querySelector("canvas");
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
      anchor.download = `QR ${campaign?.title}.png`;
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
    const file = new File([blob], `QR-${campaign?.title || "qr"}.png`, { type: blob.type });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      navigator.share({
        files: [file],
        title: `QR Campaign`,
        text: `Scan atau bagikan QR ini untuk Campaign`,
      });
    } else {
      const fallbackUrl = `https://wa.me/?text=${encodeURIComponent(`Lihat Campaign: ${shareUrl}`)}`;
      window.open(fallbackUrl, "_blank");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`sm:max-w-md ${DIALOG_RADIAL_BG} text-white border-0`}>
        <DialogHeader>
          <DialogTitle className="text-center relative z-10">
            <GradientText>QR Campaign</GradientText>
          </DialogTitle>
        </DialogHeader>

        <div
          className="flex items-center justify-center p-4 bg-white rounded-xl w-fit mx-auto relative z-10"
          ref={qrRef}
        >
          <QRCodeCanvas
            id="canvas"
            value={shareUrl}
            size={200}
            bgColor="#ffffff"
            level="H"
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
          Gunakan QR untuk membagikan Campaign ini. <br /> QR dapat dipindai atau diunduh untuk disimpan.
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
