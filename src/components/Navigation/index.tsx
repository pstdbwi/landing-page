"use client";
import { NavigationItems } from "@/constant/navigation";
import { cn } from "@/lib/utils";
import useSiteSettings from "@/store/site-settings";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";

const extractLastPathSegment = <T extends string>(url: T): string => {
  const parts = url.split("/");
  const lastPart = parts.pop();
  if (lastPart !== undefined) {
    return `/${lastPart}`;
  }
  return "";
};

const Navigation = React.memo(() => {
  const pathname = usePathname();
  const currentPathSegment = extractLastPathSegment(pathname);
  const { settings, setSiteSettings } = useSiteSettings();
  useEffect(() => {
    window.onbeforeunload = function () {
      setSiteSettings({ ...settings, install_app: true });
    };
  }, []);
  return (
    <div className="fixed bottom-0 flex flex-col gap-1 justify-center inset-x-0 left-0 shadow-xl z-50">
      {/* {settings.install_app ? (
        <div className="block md:hidden w-full layout items-center p-2">
          <div className="bg-white flex flex-row justify-between items-center p-3 rounded shadow-md w-full">
            <div className="flex flex-row gap-1 justify-start items-center w-full">
              <XIcon
                onClick={() => setSiteSettings({ ...settings, install_app: false })}
                className="w-5 h-5 text-red-600"
              />
              <p className="text-xs font-medium px-4 w-full">SatuWakaf telah tersedia di PlayStore</p>
            </div>
            <Link href={"https://play.google.com/store/apps/details?id=id.bwi.ziswafindonesia&hl=en"} target="_blank">
              <Image className="w-full h-8" src={"/assets/google-play.png"} width={75} height={75} alt="playtsore" />
            </Link>
          </div>
        </div>
      ) : null} */}
      <div className="rounded-t-xl bg-white p-5 inline-flex w-full layout items-center justify-between">
        {NavigationItems.map((items, index) => {
          return (
            <Link
              href={items.link}
              className={cn(
                "inline-flex items-center space-x-1 rounded-full px-5 py-2",
                currentPathSegment === items.pathName && "bg-primary-500/20 text-primary-500"
              )}
              key={index}
            >
              <items.icon size={18} />
              <span className="text-xs">{items.title}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
});

export { Navigation };
