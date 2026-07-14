import { DownloadIcon, Share2Icon, XIcon } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import React, { useRef } from "react";
import { Toaster } from "react-hot-toast";
import { Button } from "../Button";

interface QRCodeShareProps {
  title?: string;
  onClose: () => void;
  url: string;
  nameDownload?: string;
}

export const QRCodeShare: React.FC<QRCodeShareProps> = ({ title = "Campaign", onClose, url, nameDownload }) => {
  const domainHost = window.location.host;
  const shareUrls = `https://${domainHost}/${url}`;

  const QRRef = useRef<HTMLDivElement | null>(null);

  const downloadQR = () => {
    try {
      const originalCanvas = QRRef.current?.querySelector("canvas");
      if (!originalCanvas) return;

      const originalSize = originalCanvas.width;
      const padding = 40; // px putih di sekitar QR
      const paddedSize = originalSize + padding * 2;

      const canvas = document.createElement("canvas");
      canvas.width = paddedSize;
      canvas.height = paddedSize;

      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#ffffff"; // background putih
      ctx.fillRect(0, 0, paddedSize, paddedSize);

      // Gambar QR code di tengah
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
    <React.Fragment>
      <div className="fixed bottom-0 inset-x-0 w-full rounded-t-2xl bg-white px-5 pb-4 layout z-40">
        <div className="w-full relative mb-8">
          <button onClick={onClose}>
            <XIcon size={20} className="absolute left-2 bottom-0" />
          </button>
          <h1 className="text-base font-bold text-center">QR {title}</h1>
        </div>

        <div className="flex items-center justify-center" ref={QRRef}>
          <QRCodeCanvas
            id="canvas"
            value={shareUrls}
            size={300}
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
        <p className="text-xs text-center max-w-xs mx-auto my-3">
          Gunakan QR untuk membagikan {title} ini. <br /> QR dapat dipindai atau diunduh untuk disimpan.
        </p>

        <div className="flex items-center w-full justify-center gap-4 border-t border-t-gray-100">
          <div className="flex items-center justify-center my-3">
            <Button onClick={shareToWhatsapp} type="button" size="sm" variant="link" className="text-xs">
              <Share2Icon className="w-4 mr-2" /> Bagikan QR {title}
            </Button>
          </div>

          <div className="flex items-center justify-center my-3">
            <Button onClick={downloadQR} type="button" size="sm" variant="link" className="text-xs">
              <DownloadIcon className="w-4 mr-2" /> Unduh QR {title}
            </Button>
          </div>
        </div>
      </div>

      <div aria-hidden className="h-screen bg-black/20 w-full absolute top-0"></div>
      <Toaster position="bottom-center" />
    </React.Fragment>
  );
};
