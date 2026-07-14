"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/Avatar";
import { Badge } from "@/components/Badge";
import { Button, buttonVariants } from "@/components/Button";
import Lucide from "@/components/Icon/lucide";
import { ChevronRight } from "@/components/Icon/svg";
import { ScreenLoader } from "@/components/Loader";
import { Navigation } from "@/components/Navigation";
import Separtor from "@/components/Separtor";
import { AboutEziswaf, ProfileSection } from "@/constant/account-settings";
import useIsSubDomain from "@/lib/isSubDomain";
import { defaultSession } from "@/lib/session";
import useSession from "@/lib/use-session";
import { useGetDonorProfile } from "@/services/donor/hooks";
import { useCreateDonationStore } from "@/store";
import { deleteCookie } from "cookies-next";
import { NetworkIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function Accounts() {
  const { isSubDomain } = useIsSubDomain();
  const { session, logout, isLoading } = useSession();
  const router = useRouter();

  const { data: Profile } = useGetDonorProfile({
    donorId: session?.id,
    enabled: session?.isLoggedIn,
    refetchOnMount: "always",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const { reset } = useCreateDonationStore();

  const RenderProfileSection = (): JSX.Element => {
    return (
      <React.Fragment>
        {session?.isLoggedIn ? (
          <section className="bg-white">
            <div className="p-5 inline-flex items-center space-x-2">
              <Avatar>
                <AvatarImage src={Profile?.profile_picture} />
                <AvatarFallback>{Profile?.full_name.substring(0, 1)}</AvatarFallback>
              </Avatar>
              <div>
                {session?.corp_name ? (
                  <Badge variant="gradient-blue" className="text-white">
                    {session?.corp_name}
                  </Badge>
                ) : null}
                <h1 className="text-sm">{Profile?.full_name}</h1>
                <h2 className="text-sm">{Profile?.email}</h2>
              </div>
            </div>
          </section>
        ) : (
          <>
            {isSubDomain ? (
              <section className="p-5 space-y-2">
                <p className="text-sm text-gray-500">Masuk untuk nikmati kemudahan berwakaf dan akses fitur lainnya.</p>
                <Button
                  onClick={() => router.push("/login")}
                  variant="outline"
                  className="w-full border-primary-500 font-semibold text-primary-500"
                >
                  Masuk sekarang
                </Button>
                <div className="p-1 w-full inline-flex justify-center">
                  <span className="text-center text-sm font-medium w-full text-gray-500">
                    Belum punya akun ?{" "}
                    <Link href="/register" className="text-secondary-500">
                      Daftar
                    </Link>
                  </span>
                </div>
              </section>
            ) : (
              <section className="p-5 space-y-2">
                <p className="text-sm text-gray-500">Masuk untuk nikmati kemudahan berwakaf dan akses fitur lainnya.</p>
                <Link
                  href="/login"
                  className={buttonVariants({
                    className: "w-full border-primary-500 font-semibold text-primary-500",
                    variant: "outline",
                  })}
                >
                  Masuk sekarang
                </Link>
                <div className="p-1 w-full inline-flex justify-center">
                  <span className="text-center text-sm font-medium w-full text-gray-500">
                    Belum punya akun ?{" "}
                    <Link href="/register" className="text-secondary-500">
                      Daftar
                    </Link>
                  </span>
                </div>
              </section>
            )}
          </>
        )}
        {session?.isLoggedIn ? (
          <section className="bg-white">
            <h1 className="text-base font-bold px-5">Akun saya</h1>
            <div>
              {ProfileSection.map((items, index) => {
                const redirectLink = (): string => {
                  if (items.link === "/accounts/user") {
                    return `${items.link}?id=${session?.id}`;
                  }
                  return items.link;
                };
                return (
                  <Link
                    href={redirectLink()}
                    className="inline-flex items-center justify-between w-full p-5 border-b cursor-pointer last:border-none"
                    key={index}
                  >
                    <div className="inline-flex space-x-2 items-center">
                      <items.icon size={20} />
                      <p>{items.title}</p>
                    </div>
                    <ChevronRight />
                  </Link>
                );
              })}
              {session?.corp_id && (
                <Link
                  href={`/accounts/unit?id=${session?.id}`}
                  className="inline-flex items-center justify-between w-full p-5 border-b cursor-pointer last:border-none"
                >
                  <div className="inline-flex space-x-2 items-center">
                    <NetworkIcon size={20} />
                    <div className="flex flex-col">
                      <p>Satuan Kerja</p>
                      <p
                        style={{
                          fontSize: "0.6rem",
                        }}
                      >
                        {session?.corp_unit_name}
                      </p>
                    </div>
                  </div>
                  <ChevronRight />
                </Link>
              )}
            </div>
          </section>
        ) : null}
      </React.Fragment>
    );
  };

  return (
    <main>
      <RenderProfileSection />
      <Separtor />
      <section className="bg-white">
        <h1 className="text-base font-bold px-5 pt-5">Seputar SATUWAKAF Indonesia</h1>
        <div>
          {AboutEziswaf.map((items, index) => {
            return (
              <Link
                href={items.link}
                className="inline-flex items-center justify-between w-full p-5 border-b cursor-pointer last:border-none"
                key={index}
              >
                <div className="inline-flex space-x-2 items-center">
                  <items.icon size={20} />
                  <p>{items.title}</p>
                </div>
                <ChevronRight />
              </Link>
            );
          })}
        </div>
      </section>
      {session?.isLoggedIn ? (
        <React.Fragment>
          <Separtor />
          <section className="bg-white pb-28">
            <div className="inline-flex items-center justify-between w-full p-5 border-b cursor-pointer last:border-none">
              <button
                onClick={() => {
                  setLoading(true);
                  logout(null, {
                    optimisticData: defaultSession,
                  });
                  deleteCookie("user_token");
                  reset();
                  setTimeout(() => {
                    setLoading(false);
                    router.refresh();
                  }, 1000);
                }}
                className="inline-flex space-x-2 items-center"
              >
                <Lucide name="log-out" size={20} color="red" />
                <p className="text-red-500">Keluar</p>
              </button>
              <span className="text-xs">Ver 1.0</span>
            </div>
          </section>
        </React.Fragment>
      ) : null}
      {loading || isLoading ? <ScreenLoader /> : null}
      <Navigation />
    </main>
  );
}
