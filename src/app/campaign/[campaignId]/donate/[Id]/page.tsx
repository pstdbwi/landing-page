"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/Accordion";
import { Header } from "@/components/Header";
import Lucide from "@/components/Icon/lucide";
import { notifySuccess } from "@/components/Toaster";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import "moment/locale/id";
import Separtor from "@/components/Separtor";
import Balancer from "react-wrap-balancer";
import currencyFormater from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { useGetDonationById } from "@/services/donation/hooks";
import Link from "next/link";
import QRCode from "qrcode";
import { decode } from "js-base64";
import { CampaignTypeKeys, TCampaignType } from "@/lib/typeCampaign";
import Payment from "./payment";

export default function Transaction({
  params,
}: {
  params: {
    campaignId: string;
    Id: string;
  };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const donationType = searchParams.get("type");
  const [qr, setQr] = useState("");
  const { data: detail } = useGetDonationById({
    donationId: params.Id,
  });

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

  const Wrapper: React.FC<{
    children: React.ReactNode;
  }> = ({ children }) => {
    return (
      <section className="layout bg-white min-h-screen">
        <Header inverted title="Instruksi Pembayaran" className="left-0 top-0" backTo={`/history/${params?.Id}`} />
        <div className="mt-16 bg-secondary-500 w-full h-14 inline-flex items-center space-x-2 px-5">
          <Lucide name="clock" size={18} color="white" />
          <p className="text-white text-sm">
            Transfer sebelum <b>{moment(detail?.payment?.expired_at).format("MMMM Do YYYY, HH:mm")}</b>
          </p>
        </div>
        <section className="p-5 space-y-5">{children}</section>
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
            ) : (
              ""
            )}

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
          <button
            onClick={() => router.push(`/history/${params.Id}`)}
            className="w-full rounded-md bg-gray-100 p-3 cursor-pointer inline-flex justify-between items-center"
          >
            <span className="text-base">Cek status pembayaran</span>
            <Lucide name="chevron-right" size={30} className="text-primary-500" />
          </button>
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

        <button
          onClick={() => router.push(`/history/${params.Id}`)}
          className="w-full rounded-md bg-gray-100 p-3 cursor-pointer inline-flex justify-between items-center"
        >
          <span className="text-base">Cek status pembayaran</span>
          <Lucide name="chevron-right" size={30} className="text-primary-500" />
        </button>
      </section>
    );
  };

  return (
    <Wrapper>
      <section>
        <h1 className="text-base font-bold mb-2">Berbuat baik jangan ditunda tunda</h1>
        <p className="text-sm text-gray-500">
          Segera selesaikan {TCampaignType[detail?.campaign?.type as CampaignTypeKeys]} Anda dengan transfer sesuai
          instruksi pembayaran dibawah ini
        </p>
      </section>
      <RenderPaymentTypeContainer />
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
                      <Balancer>6. Jika pembayaran telah selesai dan berhasil, kamu akan mendapat notifikasi.</Balancer>
                    </li>
                  </ul>
                </AccordionContent>
              ) : (
                <Payment payment={detail?.payment} />
              )}
            </AccordionItem>
            {/* <AccordionItem value="item-2">
                            <AccordionTrigger>ATM {detail?.payment?.name}</AccordionTrigger>
                            <AccordionContent>
                                ...
                            </AccordionContent>
                        </AccordionItem> */}
          </Accordion>
        </div>
        <Toaster position="bottom-center" />
      </section>
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
        <Lucide name="chevron-right" size={30} className="text-gray-500" />
      </section>
    </Wrapper>
  );
}
