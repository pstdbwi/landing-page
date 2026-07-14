"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/Accordion";
import CountdownTimer from "@/components/fesyar/countdown";
import { GradientText } from "@/components/fesyar/gradient-text";
import { IcClock } from "@/components/fesyar/icon/svg";
import LayoutFesyar from "@/components/fesyar/layout-fesyar";
import { ScreenLoaderFesyar } from "@/components/fesyar/screen-loader-fesyar";
import { notifySuccess } from "@/components/Toaster";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { WHATSAPP_ADMIN } from "@/constant/config";
import { PaymentMethods } from "@/constant/payment-method";
import { CampaignTypeKeys, TCampaignType } from "@/lib/typeCampaign";
import useSearchParamsEntries from "@/lib/use-searchparams-entries";
import currencyFormater, { cn } from "@/lib/utils";
import { useGetDonationByIdNonLogin } from "@/services/donation/hooks";
import { decode } from "js-base64";
import { ChevronDownIcon, CopyIcon, DownloadIcon, FileTextIcon, FlagIcon } from "lucide-react";
import moment from "moment";
import "moment/locale/id";
import Image from "next/image";
import Link from "next/link";
import QRCode from "qrcode";
import { useEffect, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { Toaster } from "react-hot-toast";
import Balancer from "react-wrap-balancer";

const getStatusConfig = (status: string) => {
  switch (status) {
    case "PENDING":
      return {
        illustrationSrc: "/assets/fesyar/payment-waiting.svg",
        title: "Menunggu Pembayaran",
        subtitle: "Silakan lakukan pembayaran sebelum batas waktu",
        bgColor: "transparent",
        borderColor: "border-gray-50",
        textColor: "text-white",
      };
    case "VERIFIED":
      return {
        illustrationSrc: "/assets/fesyar/payment-success.svg",
        title: "Pembayaran Berhasil",
        subtitle: "Terima kasih transaksi sudah berhasil",
        bgColor: "transparent",
        borderColor: "border-gray-50",
        textColor: "text-white",
      };
    case "CANCELLED":
      return {
        illustrationSrc: "/assets/fesyar/payment-fail.svg",
        title: "Pembayaran Dibatalkan",
        subtitle: "Transaksi telah dibatalkan",
        bgColor: "transparent",
        borderColor: "border-gray-50",
        textColor: "text-white",
      };
  }
};

const page = ({ params }: { params: { campaign_id: string; id: string } }) => {
  const domainHost = window.location.host;
  const { type: donationType = "", from = "" } = useSearchParamsEntries();
  const [qr, setQr] = useState("");
  const [screenLoading, setScreenLoading] = useState(false);
  const [countCheckStatus, setCountCheckStatus] = useState(0);
  const [showDetailTransaction, setShowDetailTransaction] = useState(false);

  const {
    data: detail,
    refetch,
    isLoading,
  } = useGetDonationByIdNonLogin({
    donationId: params.id,
  });
  const statusConfig = getStatusConfig(detail?.status?.name);

  useEffect(() => {
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
  }, [detail]);

  if (isLoading) {
    return <ScreenLoaderFesyar />;
  }

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

  const messageProblemEncode = () => {
    const message = `Assalamualaikum admin, saya mengalami kendala saat donasi ${from}.
Berikut detailnya:
- ID Ref Pembayaran: ${detail?.payment?.reference_id} 
- Domain: ${domainHost}
- Campaign: ${detail?.campaign?.title}
- Lembaga: ${detail?.campaign?.lembaga?.name}
- Tipe Pembayaran: ${detail?.payment_method?.name}
- Total Pembayaran: ${detail?.amount?.total_amount}`;

    return encodeURIComponent(message);
  };
  return (
    <LayoutFesyar footer="detail-page">
      <div className="grid place-items-center min-h-screen pt-20 pb-16">
        <div
          className="z-10 rounded-2xl p-5 border-gray-50 border-2 max-w-4xl w-full mx-auto space-y-5 backdrop-blur-[7.5px]"
          style={{
            background: "linear-gradient(119deg, rgba(255, 255, 255, 0.20) 2.36%, rgba(78, 78, 78, 0.15) 97.64%)",
          }}
        >
          <div className="flex flex-col md:flex-row gap-2 items-center justify-between">
            <div className="flex items-center gap-2">
              <IcClock size={50} />

              <div className="flex flex-col gap-1">
                <GradientText className="text-base">Bayar Sebelum</GradientText>
                <p className="text-white text-sm">
                  {moment(detail?.payment?.expired_at).format("Do MMMM YYYY, HH:mm")}
                </p>
              </div>
            </div>

            {!isLoading && detail?.payment?.expired_at && detail?.status?.name == "PENDING" ? (
              <CountdownTimer targetTimeISO={detail.payment.expired_at} />
            ) : null}
          </div>

          <Separator />

          {detail?.status?.name == "PENDING" && (
            <div>
              <h1 className="text-base text-white font-bold">Berbuat baik jangan ditunda tunda</h1>
              <p className="text-sm text-gray-200">
                Segera selesaikan {TCampaignType[detail?.campaign?.type as CampaignTypeKeys]} Anda dengan transfer
                sesuai instruksi pembayaran dibawah ini
              </p>
            </div>
          )}

          {donationType == "va" ? (
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <p className="text-white text-xs md:text-sm">Nomor Virtual Account</p>

                <div className="flex items-center gap-2">
                  <GradientText className="text-base md:text-2xl">{detail?.payment?.account_number}</GradientText>
                  <button>
                    <CopyToClipboard
                      text={String(detail?.payment?.account_number)}
                      onCopy={() => {
                        notifySuccess("berhasil salin nomor va");
                      }}
                    >
                      <CopyIcon className="text-fesyar-yellow-600 w-5" />
                    </CopyToClipboard>
                  </button>
                </div>
              </div>

              <div className="p-2 rounded bg-white/80">
                <Image src={detail?.payment?.image!!} alt="logo" width={100} height={30} />
              </div>
            </div>
          ) : donationType == "qris" ? (
            <div>
              <div className="flex justify-between items-center">
                <h1 className="text-sm text-white font-bold">Scan QR Code di Bawah Ini</h1>
                <Image src={detail?.payment?.image!!} alt="qris" className="invert" width={75} height={75} />
              </div>
              <div className="p-2 flex-col justify-center items-center bg-white w-fit mx-auto rounded-lg my-3">
                <img src={qr} alt="qrcode" width={400} height={400} className="rounded-md mx-auto" />
                <div className="w-full inline-flex justify-center mt-2">
                  <a
                    href={qr}
                    download="qrcode.png"
                    className="text-base text-fesyar-green-700 font-bold flex items-center"
                  >
                    <DownloadIcon className="w-5 mr-1" /> Simpan QRIS
                  </a>
                </div>
              </div>
            </div>
          ) : null}

          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <p className="text-white text-xs md:text-sm">Total Bayar</p>
              <div className="flex items-center gap-2">
                <GradientText className="text-base md:text-2xl">
                  Rp. {currencyFormater(detail?.amount?.total_amount!!)}
                </GradientText>
                <button>
                  <CopyToClipboard
                    text={String(detail?.amount?.total_amount!!)}
                    onCopy={() => {
                      notifySuccess("berhasil salin nomor va");
                    }}
                  >
                    <CopyIcon className="text-fesyar-yellow-600 w-5" />
                  </CopyToClipboard>
                </button>
              </div>
            </div>

            <button
              type="button"
              className="text-white text-sm font-semibold underline flex items-center"
              onClick={() => setShowDetailTransaction(!showDetailTransaction)}
            >
              {showDetailTransaction ? "Tutup Detail" : "Lihat Detail"}
              <ChevronDownIcon className={cn("w-4 ml-2", showDetailTransaction ? "rotate-180" : "rotate-0")} />
            </button>
          </div>

          {+detail?.amount?.unique_amount > 0 ? (
            <section className="w-full rounded-md bg-gray-50/30 p-4 gap-2 items-center flex">
              <GradientText>{detail?.amount?.unique_amount}</GradientText>
              <p className="text-xs text-white">
                adalah kode unik Anda. Pastikan nominal yang dikirim sesuai dengan <strong>Total Bayar</strong> yang
                tertera.
              </p>
            </section>
          ) : null}

          {showDetailTransaction ? (
            <div className="border border-gray-50 rounded-lg p-3 space-y-3">
              <div className="inline-flex justify-between items-center w-full">
                <h1 className="text-sm text-white">
                  Nilai {TCampaignType[detail?.campaign?.type as CampaignTypeKeys]}
                </h1>
                <span className="text-sm text-white font-semibold">
                  Rp {currencyFormater(detail?.amount?.amount!!)}
                </span>
              </div>

              {detail?.amount?.bank_fee > 0 && (
                <div className="inline-flex justify-between items-center w-full">
                  <h1 className="text-sm text-white">Biaya Operasional Pemrosesan Pembayaran</h1>
                  <span className="text-sm text-white font-semibold">
                    +Rp {currencyFormater(detail?.amount?.bank_fee!!)}
                  </span>
                </div>
              )}

              {detail?.amount?.infak_fee > 0 && (
                <div className="inline-flex justify-between items-center w-full">
                  <h1 className="text-sm text-white">Infak Pemeliharaan</h1>
                  <span className="text-sm text-white font-semibold">
                    Rp {currencyFormater(detail?.amount?.infak_fee!!)}
                  </span>
                </div>
              )}
            </div>
          ) : null}

          {/* Status Card */}
          {countCheckStatus > 0 || detail?.status?.name != "PENDING" ? (
            <div className={`bg-glass-gradient ${statusConfig?.borderColor} border rounded-2xl p-6 mb-6`}>
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  {statusConfig?.illustrationSrc && (
                    <Image src={statusConfig.illustrationSrc} alt={statusConfig.title} width={128} height={128} />
                  )}
                </div>
                <h2 className={`text-lg font-semibold ${statusConfig?.textColor} mb-2`}>{statusConfig?.title}</h2>
                <p className="text-gray-100 text-xs">{statusConfig?.subtitle}</p>
              </div>
            </div>
          ) : null}

          {detail?.status?.name == "VERIFIED" && (
            <div className="w-full flex items-center gap-1">
              <Link
                href={`/fesyar/campaign/${params?.campaign_id}/anonymous/${params?.id}/receipt`}
                target="_blank"
                className={buttonVariants({
                  variant: "outline",
                  className: "font-semibold bg-fesyar-gold w-full text-fesyar-green-700",
                })}
              >
                <FileTextIcon className="w-4 inline-flex" /> Lihat bukti penerimaan{" "}
                {TCampaignType[detail?.campaign?.type as CampaignTypeKeys]}
              </Link>
            </div>
          )}

          {detail?.status?.name == "PENDING" && (
            <Button className="font-semibold bg-fesyar-gold w-full text-fesyar-green-700" onClick={() => checkStatus()}>
              Cek status pembayaran
            </Button>
          )}

          <Separator />

          {detail?.status?.name == "PENDING" && (
            <section>
              {donationType === "va" ? (
                <h1 className="text-base font-bold mb-2 text-white">Panduan Pembayaran</h1>
              ) : null}

              <Accordion type="single" collapsible>
                <AccordionItem value="item-1" defaultChecked className="border border-white py-1 px-3 rounded-lg">
                  <AccordionTrigger className="text-white text-sm">
                    {donationType === "va" ? `${detail?.payment?.name} Mobile Banking` : "Panduan Pembayaran"}
                  </AccordionTrigger>

                  {/* QRIS */}
                  {donationType !== "va" ? (
                    <AccordionContent>
                      <ul className="space-y-2  text-white">
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
            </section>
          )}

          <Separator />

          <section className="flex flex-col md:flex-row justify-between w-full items-center ">
            <div className="inline-flex space-x-5 cursor-pointer">
              <div className="rounded-full bg-primary-500 h-[50px] w-[50px] flex flex-col justify-center items-center p-3">
                <Image src="/assets/whatsapp.svg" alt="whatsapp" width={50} height={50} />
              </div>
              <Link href="/accounts/contact">
                <h1 className="text-base font-bold mb-1 text-white">Punya kendala? Hubungi kami</h1>
                <p className="text-sm text-gray-200">Lapor kendala melaui chat WhatsApp</p>
              </Link>
            </div>

            <Link
              href={`https://wa.me/${WHATSAPP_ADMIN}?text=${messageProblemEncode()}`}
              target="_blank"
              className={buttonVariants({ className: "!text-fesyar-green-700 !font-semibold !bg-fesyar-gold" })}
            >
              Laporkan Kendala <FlagIcon className="w-4 ml-1" />
            </Link>
          </section>
        </div>

        {screenLoading ? <ScreenLoaderFesyar /> : null}
        <Toaster position="bottom-center" />
      </div>
    </LayoutFesyar>
  );
};

export default page;

export interface IPayment {
  reference_id: string;
  bank_code: string;
  account_number: string;
  expired_at: string;
  name: string;
  image: string;
}

const Payment = ({ payment }: { payment: IPayment }) => {
  const findPayment = PaymentMethods?.find((data) => data?.value?.toLowerCase() == payment?.bank_code?.toLowerCase());
  return (
    <AccordionContent>
      <ul className="space-y-2 text-white">
        {findPayment?.steps?.map((step, index) => (
          <li key={index}>
            <Balancer>
              {index + 1}. {step}
            </Balancer>
          </li>
        ))}
      </ul>
    </AccordionContent>
  );
};
