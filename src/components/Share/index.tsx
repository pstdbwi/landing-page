import { LinkIcon, XIcon } from "lucide-react";
import React from "react";
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
import { notifySuccess } from "../Toaster";

interface ShareProps {
  onClose: () => void;
  url: string;
}

export const Share: React.FC<ShareProps> = ({ onClose, url }) => {
  const domainHost = window.location.host;
  const shareUrls = `https://${domainHost}${url}`;
  return (
    <React.Fragment>
      <div className="fixed bottom-0 inset-x-0 w-full rounded-t-2xl bg-white px-5 pb-4 layout z-40">
        <div className="w-full relative mb-8">
          <button onClick={onClose}>
            <XIcon size={20} className="absolute left-2 bottom-0" />
          </button>
          <h1 className="text-base font-bold text-center">Bagikan Lewat</h1>
        </div>
        <div className="grid grid-cols-4 gap-5 place-items-center mb-4">
          <FacebookShareButton url={shareUrls}>
            <FacebookIcon size={40} className="rounded-md" />
          </FacebookShareButton>
          <WhatsappShareButton url={shareUrls}>
            <WhatsappIcon size={40} className="rounded-md" />
          </WhatsappShareButton>
          <LineShareButton url={shareUrls}>
            <LineIcon size={40} className="rounded-md" />
          </LineShareButton>
          <TwitterShareButton url={shareUrls}>
            <TwitterIcon size={40} className="rounded-md" />
          </TwitterShareButton>
        </div>
        <div className="bg-gray-200/50 p-3 w-full inline-flex gap-1 rounded-md border relative">
          <LinkIcon size={16} className="mr-1" />
          <p className="line-clamp-1 text-xs">{shareUrls}</p>
          <CopyToClipboard
            text={shareUrls}
            onCopy={() => {
              notifySuccess("berhasil salin link");
            }}
          >
            <button className="font-semibold text-xs text-white h-full absolute right-0 top-0 w-14 rounded-r-md bg-primary-500">
              Salin
            </button>
          </CopyToClipboard>
        </div>
      </div>
      <div aria-hidden className="h-screen bg-black/20 w-full absolute top-0"></div>
      <Toaster position="bottom-center" />
    </React.Fragment>
  );
};
