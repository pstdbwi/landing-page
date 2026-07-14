"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/Accordion";
import { Button, buttonVariants } from "@/components/Button";
import { ScreenLoader } from "@/components/Loader";
import Separtor from "@/components/Separtor";
import { notifySuccess } from "@/components/Toaster";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CampaignTypeKeys, TCampaignType } from "@/lib/typeCampaign";
import useSearchParamsEntries from "@/lib/use-searchparams-entries";
import currencyFormater from "@/lib/utils";
import { useGetDonationByIdNonLogin } from "@/services/donation/hooks";
import { decode } from "js-base64";
import { ArrowRightIcon, CheckCircle, Clock, ClockIcon, XCircle } from "lucide-react";
import moment from "moment";
import "moment/locale/id";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";
import React, { useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Toaster } from "react-hot-toast";
import Balancer from "react-wrap-balancer";
import Payment from "./payment";

type PaymentStatus = "PENDING" | "VERIFIED" | "CANCELLED" | "PAID" | "REFUNDED";

const getStatusConfig = (status: string) => {
  switch (status) {
    case "PENDING":
      return {
        icon: <Clock className="w-12 h-12 text-orange-500" />,
        title: "Menunggu Pembayaran",
        subtitle: "Silakan lakukan pembayaran sebelum batas waktu",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200",
        textColor: "text-orange-600",
      };
    case "VERIFIED":
      return {
        icon: <CheckCircle className="w-12 h-12 text-[#61B548]" />,
        title: "Pembayaran Berhasil",
        subtitle: "Terima kasih transaksi sudah berhasil",
        bgColor: "bg-[#61B548]/10",
        borderColor: "border-[#61B548]/5",
        textColor: "text-[#61B548]",
      };
    case "CANCELLED":
      return {
        icon: <XCircle className="w-12 h-12 text-red-500" />,
        title: "Pembayaran Dibatalkan",
        subtitle: "Transaksi telah dibatalkan",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        textColor: "text-red-600",
      };
  }
};

export default function Transaction({
  params,
}: {
  params: {
    campaignId: string;
    Id: string;
  };
}) {
  const router = useRouter();
  const { type: donationType = "", from = "" } = useSearchParamsEntries();

  const [qr, setQr] = useState("");
  const [screenLoading, setScreenLoading] = useState(false);
  const [countCheckStatus, setCountCheckStatus] = useState(0);

  const {
    data: detail,
    refetch,
    isLoading,
  } = useGetDonationByIdNonLogin({
    donationId: params.Id,
  });
  const statusConfig = getStatusConfig(detail?.status?.name);
  console.log(detail);
  const checkStatus = () => {
    try {
      setScreenLoading(true);

      setCountCheckStatus((prev) => prev + 1);
      refetch();
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        setScreenLoading(false);
      }, 800);
    }
  };

  useEffect(() => {
    // Redirect to fesyar page
    if (from?.includes("fesyar")) {
      router.push(`/fesyar/campaign/${params?.campaignId}/anonymous/${params?.Id}?type=${donationType}&from=${from}`);
    }

    if (!detail || !detail?.payment?.qr_string) {
      console.log("Detail is undefined or QR string is missing");
      return;
    }

    QRCode.toDataURL(
      decode(detail?.payment?.qr_string),
      {
        width: 800,
        margin: 3,
      },
      (err, url) => {
        if (err) {
          console.error(err);
          return;
        }
        setQr(url);
      }
    );
  }, [detail, from]);

  if (isLoading) {
    return <ScreenLoader />;
  }

  const Wrapper: React.FC<{
    children: React.ReactNode;
  }> = ({ children }) => {
    return (
      <section className="layout bg-white min-h-screen">
        <div className={"inline-flex justify-center items-center inset-x-0 fixed z-50 left-0 top-0 shadow-lg layout"}>
          <div className={"p-5 inline-flex w-full items-center layout justify-between bg-white"}>
            <div className="inline-flex items-center space-x-2">
              <p className="text-base font-bold line-clamp-1">
                {detail?.status?.name == "PENDING" ? "Intruksi Pembayaran" : "Status Pembayaran"}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16">
          {detail?.status?.name == "PENDING" && (
            <div className="bg-secondary-500 w-full h-14 inline-flex items-center space-x-2 px-5">
              <ClockIcon size={18} color="white" />
              <p className="text-white text-sm">
                Transfer sebelum <b>{moment(detail?.payment?.expired_at).format("MMMM Do YYYY, HH:mm")}</b>
              </p>
            </div>
          )}
        </div>

        <section className="p-5 space-y-5">
          {detail?.status?.name == "PENDING" && (
            <section>
              <h1 className="text-base font-bold mb-2">Berbuat baik jangan ditunda tunda</h1>
              <p className="text-sm text-gray-500">
                Segera selesaikan {TCampaignType[detail?.campaign?.type as CampaignTypeKeys]} Anda dengan transfer
                sesuai instruksi pembayaran dibawah ini
              </p>
            </section>
          )}

          {children}
        </section>
      </section>
    );
  };

  const RenderPaymentTypeContainer = () => {
    if (donationType === "qris") {
      return (
        <section>
          <div className="border rounded-md p-3 space-y-3 mb-4">
            <div className="inline-flex space-x-2 items-center">
              <Image src={detail?.payment?.image!!} alt="logo" width={50} height={50} />
              <h1 className="text-sm text-gray-500 ">QRIS</h1>
            </div>
            <div className="rounded-md bg-[#1C8AE5]/10 p-2 w-full">
              <img src={qr} alt="qrcode" width={500} height={500} className="rounded-md" />
              <div className="w-full inline-flex justify-center mt-2">
                <a href={qr} download="qrcode.png" className="text-base font-semibold text-center text-[#1C8AE5]">
                  Simpan QRIS
                </a>
              </div>
            </div>
            <h1 className="text-sm text-gray-500 mb-2">Total Bayar</h1>
            <div className="w-full rounded-md bg-[#61B548]/10 p-4 inline-flex justify-between items-center">
              <span className="text-lg font-bold">RP {currencyFormater(detail?.amount?.total_amount!!)}</span>
              <CopyToClipboard
                text={String(detail?.amount?.total_amount!!)}
                onCopy={() => {
                  notifySuccess(`berhasil salin nominal ${TCampaignType[detail?.campaign?.type as CampaignTypeKeys]}`);
                }}
              >
                <button className="font-semibold text-primary-500">Salin</button>
              </CopyToClipboard>
            </div>
            {+detail?.amount?.unique_amount > 0 ? (
              <section className="w-full rounded-md bg-red-200 p-4 inline-flex justify-between items-center">
                <p className="text-xs">
                  <strong className="text-lg">{detail?.amount?.unique_amount}</strong> adalah kode unik Anda. Pastikan
                  nominal yang dikirim sesuai dengan <strong>Total Bayar</strong> yang tertera.
                </p>
              </section>
            ) : null}

            <div className="space-y-3">
              <div className="inline-flex justify-between items-center w-full">
                <h1 className="text-sm text-gray-500">
                  Nilai {TCampaignType[detail?.campaign?.type as CampaignTypeKeys]}
                </h1>
                <span className="text-sm text-gray-500">Rp {currencyFormater(detail?.amount?.amount!!)}</span>
              </div>

              {detail?.amount?.bank_fee > 0 && (
                <div className="inline-flex justify-between items-center w-full">
                  <h1 className="text-sm text-gray-500">
                    Biaya Operasional Pemrosesan Pembayaran {detail?.campaign?.rakornas_kemenag != 1 ? "(0.7%)" : ""}
                  </h1>
                  <span className="text-sm text-gray-500">+Rp {currencyFormater(detail?.amount?.bank_fee!!)}</span>
                </div>
              )}

              {detail?.amount?.infak_fee > 0 && (
                <div className="inline-flex justify-between items-center w-full">
                  <h1 className="text-sm text-gray-500">Infak Pemeliharaan</h1>
                  <span className="text-sm text-gray-500">Rp {currencyFormater(detail?.amount?.infak_fee!!)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Status Card */}
          {countCheckStatus > 0 || detail?.status?.name != "PENDING" ? (
            <div className={`${statusConfig?.bgColor} ${statusConfig?.borderColor} border rounded-2xl p-6 mb-6`}>
              <div className="text-center">
                <div className="flex justify-center mb-4">{statusConfig?.icon}</div>
                <h2 className={`text-lg font-semibold ${statusConfig?.textColor} mb-2`}>{statusConfig?.title}</h2>
                <p className="text-gray-600 text-xs">{statusConfig?.subtitle}</p>
              </div>
            </div>
          ) : null}

          {detail?.status?.name == "PENDING" && (
            <Button className="w-full" onClick={() => checkStatus()}>
              <span className="text-base">Cek status pembayaran</span>
            </Button>
          )}

          {detail?.status?.name == "VERIFIED" && (
            <div className="w-full flex items-center gap-1">
              <Link
                href={`/campaign/${params?.campaignId}/anonymous/${params?.Id}/receipt`}
                target="_blank"
                className={buttonVariants({
                  variant: "outline",
                  className: "w-full py-4 font-semibold border-secondary-400 text-secondary-400",
                })}
              >
                Lihat bukti penerimaan {TCampaignType[detail?.campaign?.type as CampaignTypeKeys]}
              </Link>
            </div>
          )}

          <BackToHomeDialog />
        </section>
      );
    }

    return (
      <section>
        <div className="border rounded-md p-3 space-y-3 mb-4">
          <div>
            <div className="inline-flex space-x-2 items-center mb-2">
              <Image src={detail?.payment?.image!!} alt="logo" width={50} height={30} />
              <h1 className="text-sm text-gray-500 ">{detail?.payment?.name}</h1>
            </div>
            <div className="w-full rounded-md bg-gray-100 p-4 inline-flex justify-between items-center">
              <span className="text-lg font-bold">{detail?.payment?.account_number}</span>
              <CopyToClipboard
                text={String(detail?.payment?.account_number)}
                onCopy={() => {
                  notifySuccess("berhasil salin nomor va");
                }}
              >
                <button className="font-semibold text-primary-500">Salin</button>
              </CopyToClipboard>
            </div>
          </div>

          <h1 className="text-sm text-gray-500 mb-2">Total bayar</h1>
          <div className="w-full rounded-md bg-[#61B548]/10 p-4 inline-flex justify-between items-center">
            <span className="text-lg font-bold">RP {currencyFormater(detail?.amount?.total_amount!!)}</span>
            <CopyToClipboard
              text={String(detail?.amount?.total_amount!!)}
              onCopy={() => {
                notifySuccess(`berhasil salin nominal ${TCampaignType[detail?.campaign?.type as CampaignTypeKeys]}`);
              }}
            >
              <button className="font-semibold text-primary-500">Salin</button>
            </CopyToClipboard>
          </div>
          <div className="space-y-3">
            <div className="inline-flex justify-between items-center w-full">
              <h1 className="text-sm text-gray-500">
                Nilai {TCampaignType[detail?.campaign?.type as CampaignTypeKeys]}
              </h1>
              <span className="text-sm text-gray-500">Rp {currencyFormater(detail?.amount?.amount!!)}</span>
            </div>

            {detail?.amount?.bank_fee > 0 && (
              <div className="inline-flex justify-between items-center w-full">
                <h1 className="text-sm text-gray-500">Biaya Operasional Pemrosesan Pembayaran</h1>
                <span className="text-sm text-gray-500">+Rp {currencyFormater(detail?.amount?.bank_fee!!)}</span>
              </div>
            )}

            {detail?.amount?.infak_fee > 0 && (
              <div className="inline-flex justify-between items-center w-full">
                <h1 className="text-sm text-gray-500">Infak pemeliharaan</h1>
                <span className="text-sm text-gray-500">Rp {currencyFormater(detail?.amount?.infak_fee!!)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Status Card */}
        {countCheckStatus > 0 || detail?.status?.name != "PENDING" ? (
          <div className={`${statusConfig?.bgColor} ${statusConfig?.borderColor} border rounded-2xl p-6 mb-6`}>
            <div className="text-center">
              <div className="flex justify-center mb-4">{statusConfig?.icon}</div>
              <h2 className={`text-lg font-semibold ${statusConfig?.textColor} mb-2`}>{statusConfig?.title}</h2>
              <p className="text-gray-600 text-xs">{statusConfig?.subtitle}</p>
            </div>
          </div>
        ) : null}

        {detail?.status?.name == "PENDING" && (
          <Button className="w-full" onClick={() => checkStatus()}>
            <span className="text-base">Cek status pembayaran</span>
          </Button>
        )}

        {detail?.status?.name == "VERIFIED" && (
          <div className="w-full flex items-center gap-1">
            <Link
              href={`/campaign/${params?.campaignId}/anonymous/${params?.Id}/receipt`}
              target="_blank"
              className={buttonVariants({
                variant: "outline",
                className: "w-full py-4 font-semibold border-secondary-400 text-secondary-400",
              })}
            >
              Lihat bukti penerimaan {TCampaignType[detail?.campaign?.type as CampaignTypeKeys]}
            </Link>
          </div>
        )}

        <BackToHomeDialog />
      </section>
    );
  };

  return (
    <Wrapper>
      <RenderPaymentTypeContainer />

      {detail?.status?.name == "PENDING" && (
        <section>
          {donationType === "va" ? <h1 className="text-base font-bold mb-2">Panduan Pembayaran</h1> : null}
          <div className="border rounded-md p-5">
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1" defaultChecked>
                <AccordionTrigger>
                  {donationType === "va" ? `${detail?.payment?.name} Mobile Banking` : "Panduan Pembayaran"}
                </AccordionTrigger>
                {donationType !== "va" ? (
                  <AccordionContent>
                    <ul className="space-y-2 text-gray-500">
                      <li>
                        <Balancer>1. Scan/simpan/screenshot QR code</Balancer>
                      </li>
                      <li>
                        <Balancer>2. Buka aplikasi bank/dompet digital (Gojek, OVO, Dana, QRIS BCA, dll).</Balancer>
                      </li>
                      <li>
                        <Balancer>3. Pilih ‘Pay’ atau ‘Scan’</Balancer>
                      </li>
                      <li>
                        <Balancer>4. Upload tangkapan layar (hasil screenshot) QR Code.</Balancer>
                      </li>
                      <li>
                        <Balancer>5. Masukkan kode PIN dompet digitalmu.</Balancer>
                      </li>
                      <li>
                        <Balancer>
                          6. Jika pembayaran telah selesai dan berhasil, kamu akan mendapat notifikasi.
                        </Balancer>
                      </li>
                    </ul>
                  </AccordionContent>
                ) : (
                  <Payment payment={detail?.payment} />
                )}
              </AccordionItem>
            </Accordion>
          </div>
        </section>
      )}
      <Separtor isAbsolute />
      <section className="pt-10 inline-flex justify-between w-full items-center">
        <div className="inline-flex space-x-5 cursor-pointer">
          <div className="rounded-full bg-primary-500 h-[50px] w-[50px] flex flex-col justify-center items-center p-3">
            <Image src="/assets/whatsapp.svg" alt="whatsapp" width={50} height={50} />
          </div>
          <Link href="/accounts/contact">
            <h1 className="text-base font-bold mb-1">Punya kendala? Hubungi kami</h1>
            <p className="text-sm text-gray-500">Lapor kendala melaui chat WhatsApp</p>
          </Link>
        </div>
        <ArrowRightIcon size={18} className="text-gray-500 ml-2" />
      </section>

      {screenLoading ? <ScreenLoader /> : null}
      <Toaster position="bottom-center" />
    </Wrapper>
  );
}

const BackToHomeDialog = () => {
  const router = useRouter();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full mt-2" variant="link">
          Kembali Ke Beranda
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Konfirmasi</DialogTitle>
        </DialogHeader>
        <div className="flex gap-2 flex-col">
          <span className="text-xs block font-bold">Yakin ingin meninggalkan halaman ini ?</span>
          <span className="text-xs block text-gray-700">
            Kamu bisa kembali ke halaman ini kapan saja melalui tautan yang telah dikirim ke email anda.
          </span>
        </div>
        <DialogFooter className="justify-end flex items-center gap-2 flex-row">
          <DialogClose asChild>
            <Button type="button" variant="outline" className="w-full">
              Batal
            </Button>
          </DialogClose>
          <Button type="button" className="w-full" onClick={() => router.push("/")}>
            Ke Beranda
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
