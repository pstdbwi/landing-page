"use client";
import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import currencyFormater from "@/lib/utils";
import moment from "moment";
import "moment/locale/id";
import { useGetDonationById } from "@/services/donation/hooks";
import { CampaignTypeKeys, TCampaignType, personByCampaignType } from "@/lib/typeCampaign";
import QRCode from "react-qr-code";
import { TwinCircle } from "@/components/Icon/svg";

function Certificate() {
  const searchParams = useSearchParams();
  const donationId = searchParams.getAll("id");

  const { data: payment, isLoading } = useGetDonationById({
    donationId: donationId,
    enabled: !!donationId,
  });

  if (isLoading) {
    return (
      <div className="relative h-full bg-white inset-x-0">
        <img src="/assets/top-left.svg" width={100} height={100} className="absolute left-3 top-3" alt="decoration" />
        <img src="/assets/top-right.svg" width={100} height={100} className="absolute right-3 top-3" alt="decoration" />
        <img
          src="/assets/bottom-right.svg"
          width={100}
          height={100}
          className="absolute right-3 bottom-3"
          alt="decoration"
        />
        <img
          src="/assets/bottom-left.svg"
          width={100}
          height={100}
          className="absolute left-3 bottom-3"
          alt="decoration"
        />
        {/* <img src='/assets/certificate-bg.svg' width={500} height={500} className='absolute z-0  left-[50%] top-[50%] transform: translate-x-[-50%] transform: translate-y-[-50%]' alt='decoration' /> */}
        <div className="absolute top-0 bg-black/30 h-screen w-full flex flex-col items-center justify-center z-40">
          <div className="bg-white rounded-lg p-5 flex flex-col justify-center items-center gap-2">
            <TwinCircle />
            <span>Mohon tunggu</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full bg-white inset-x-0">
      <img src="/assets/top-left.svg" width={100} height={100} className="absolute left-3 top-3" alt="decoration" />
      <img src="/assets/top-right.svg" width={100} height={100} className="absolute right-3 top-3" alt="decoration" />
      <img
        src="/assets/bottom-right.svg"
        width={100}
        height={100}
        className="absolute right-3 bottom-3"
        alt="decoration"
      />
      <img
        src="/assets/bottom-left.svg"
        width={100}
        height={100}
        className="absolute left-3 bottom-3"
        alt="decoration"
      />
      <img
        src="/assets/certificate-bg.svg"
        width={500}
        height={500}
        className="absolute z-0  left-[50%] top-[50%] transform: translate-x-[-50%] transform: translate-y-[-50%]"
        alt="decoration"
      />

      <div className="flex flex-col justify-center w-full items-center py-10 gap-5 z-50 relative">
        <img src="/assets/logo.svg" width={200} height={200} alt="logo" />
        <div>
          <h1 className="font-bold text-[24px] text-center">
            BUKTI PENERIMAAN {TCampaignType[payment?.campaign?.type as CampaignTypeKeys]?.toUpperCase()}
          </h1>
          <p className="text-[14px] text-center">{moment.unix(payment?.verified).format("LL")}</p>
        </div>
        <div>
          <img src="/assets/bismillah.svg" width={200} height={100} alt="decoration" />
        </div>
        <div className="space-y-3">
          <h1 className="font-bold text-[18px] text-center">Telah kami terima dari</h1>
          <div>
            <h1 className="text-[14px] text-[#6A6A6A] text-center">
              Nama {personByCampaignType[payment?.campaign?.type as CampaignTypeKeys]}
            </h1>
            <h2 className="text-[18px] font-semibold text-center">{payment?.wakif_name}</h2>
          </div>
          <div>
            <h1 className="text-[14px] text-[#6A6A6A] text-center">
              Jenis {TCampaignType[payment?.campaign?.type as CampaignTypeKeys]}
            </h1>
            <h2 className="text-[18px] font-semibold text-center">{payment?.campaign.campaign_category.name}</h2>
          </div>
          <div>
            <h1 className="text-[14px] text-[#6A6A6A] text-center">Dengan jumlah</h1>
            <h2 className="text-[18px] font-semibold text-center">Rp{currencyFormater(payment?.amount?.amount)}</h2>
          </div>
        </div>
        <div>
          <p className="text-[14px] text-[#6A6A6A] text-center">
            Untuk dikelola dan diberikan manfaatnya sebagai berikut
          </p>
          <h1 className="font-bold text-[24px] text-center text-[#D7B56D]">{payment?.campaign.title}</h1>
        </div>
        <div>
          <h1 className="text-[14px] text-[#6A6A6A] text-center">Nama Nazhir</h1>
          <h2 className="text-[18px] font-semibold text-center">{payment?.campaign.lembaga.name?.toUpperCase()}</h2>
          <h1 className="text-[14px] text-[#6A6A6A] text-center mt-2">
            NAZHIR ID : {payment?.campaign?.lembaga?.nazhir_id}
          </h1>
        </div>
        <div>
          <p className="text-[14px] text-[#6A6A6A] text-center max-w-md">
            Semoga Allah SWT memberikan balasan yang berlipat serta pahala yang terus mengalir hingga yaumil akhir nanti
            kepada <b>{payment?.wakif_name}</b>. Aamiin
          </p>
        </div>
        <div>
          <h1 className="text-[14px] text-[#6A6A6A] text-center">Salam,</h1>
          <h2 className="text-[18px] font-semibold text-center">{payment?.campaign.lembaga.leader_name}</h2>
        </div>
        <div>
          {/* <h1 className='text-[14px] text-[#6A6A6A] text-center'>#{payment?.id}</h1> */}
          {payment?.id ? <QRCode className="p-2" value={payment?.id} size={100} /> : ""}
        </div>
        <img src="/assets/logo.svg" width={100} height={200} alt="logo" />
        <div>
          <p className="text-[10px] text-[#6A6A6A] text-center max-w-md px-8">
            Taman Mini Indonesia Indah (TMII, Gedung Bayt Al-Qur'an, Pintu Utama, Ceger, Kec. Cipayung, Kota Jakarta
            Timur, Daerah Khusus Ibukota Jakarta 13560
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CertificatePage() {
  return (
    <Suspense>
      <Certificate />
    </Suspense>
  );
}
