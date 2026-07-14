"use client";
import { Button } from "@/components/Button";
import { Header } from "@/components/Header";
import { PaymentListSkeleton } from "@/components/Skeleton";
import { cn } from "@/lib/utils";
import { useGetCampaignDetail } from "@/services/campaign/hooks";
import { useGetPaymentList } from "@/services/payment/hooks";
import { useDonationStore } from "@/store/useDonationStore";
import { IPaymentMethod } from "@/types/payment";
import { CheckIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import Balancer from "react-wrap-balancer";

export default function PaymentMehod({ params }: { params: { campaignId: string } }) {
  const router = useRouter();
  const { data: list, isLoading, isFetching, isError } = useGetPaymentList({});
  const { data: campaign, isLoading: isLoadingCampaign } = useGetCampaignDetail({ campaignId: params.campaignId });
  const { donation, updateDonation } = useDonationStore();

  const hasPaymentMethods =
    campaign?.payment_methods?.instant_payment?.length > 0 || campaign?.payment_methods?.virtual_account?.length > 0;

  const RenderPaymentList = () => {
    const renderTitle = (title: string) => {
      switch (title) {
        case "virtual_account":
          return {
            title: "Virtual Account",
            description: "Transaksi diverifikasi otomatis",
          };
        case "instant_payment":
          return {
            title: "Instant Payment",
            description: "Transaksi diverifikasi otomatis",
          };
        default:
          break;
      }
    };

    const handleSelectedPaymentMethod = (data: IPaymentMethod): void => {
      updateDonation({
        payment_method_id: data?.id,
        paymentMethod: data,
      });

      router.push(`/campaign/${params.campaignId}/donate`);
    };

    if (isLoading && isFetching && isLoadingCampaign) {
      return <PaymentListSkeleton />;
    }

    if (isError) {
      return (
        <div className="w-full flex flex-col justify-center items-center gap-3">
          <Image src="/assets/payment-error.svg" width={300} height={300} alt="error" />
          <div className="space-y-3 text-center mb-4">
            <Balancer className="text-xl font-bold">Pembayaran Sedang Dalam Perbaikan</Balancer>
            <Balancer className="text-sm text-gray-500">
              Semua pembayaran sedang tidak bisa gunakan, silakan kembali lagi ananti
            </Balancer>
          </div>
          <Button variant="default" size="full" onClick={() => router.back()}>
            Kembali
          </Button>
        </div>
      );
    }

    const paymentType = {
      justQris: campaign?.qris === 1 && campaign?.va === 0,
      justVA: campaign?.qris === 0 && campaign?.va === 1,
      qrisVA: campaign?.qris === 1 && campaign?.va === 1,
    };

    const selectedPayments = hasPaymentMethods
      ? {
          ...(campaign?.payment_methods?.instant_payment?.length > 0 && {
            instant_payment: campaign?.payment_methods?.instant_payment,
          }),
          ...(campaign?.payment_methods?.virtual_account?.length > 0 && {
            virtual_account: campaign?.payment_methods?.virtual_account,
          }),
        }
      : {
          ...(paymentType.justQris && { instant_payment: list?.instant_payment }),
          ...(paymentType.justVA && { virtual_account: list?.virtual_account }),
          ...(paymentType.qrisVA && list),
        };

    return Object.entries(selectedPayments).map(([key, value]: any) => (
      <div className="mb-5 space-y-2" key={key}>
        {value ? (
          <React.Fragment>
            <h1 className="font-semibold text-base mb-1">{renderTitle(key)?.title}</h1>
            <p className="text-gray-500">{renderTitle(key)?.description}</p>
          </React.Fragment>
        ) : null}
        <div className={cn((value && "border rounded-lg") || "")}>
          {key === "virtual_account"
            ? value?.map((virtualAccount: Record<string, any>, index: number) => (
                <button
                  key={virtualAccount.id}
                  disabled={!virtualAccount.is_enabled}
                  className={cn(
                    "border-b w-full cursor-pointer last:border-none",
                    !virtualAccount.is_enabled ? "bg-gray-300/20 hover:cursor-not-allowed" : ""
                  )}
                  role="button"
                  onClick={() => handleSelectedPaymentMethod(value[index])}
                >
                  <div className="p-3 inline-flex items-center space-x-2 w-full">
                    <div className="inline-flex justify-between items-center w-full">
                      <div className="inline-flex space-x-5 items-center">
                        <img src={virtualAccount.logo} alt={virtualAccount.name} className="max-w-[50px]" />
                        <span className="text-base shrink-0">{virtualAccount.name}</span>
                      </div>
                      {!virtualAccount.is_enabled && (
                        <p className="text-gray-400 text-[7px] shrink-0">Sedang tidak bisa digunakan</p>
                      )}
                    </div>
                    {donation?.payment_method_id === virtualAccount.id ? <CheckIcon size={20} /> : null}
                  </div>
                </button>
              ))
            : value?.map((instantPayment: Record<string, any>, index: number) => (
                <button
                  key={instantPayment.id}
                  className={cn(
                    "border-b w-full cursor-pointer last:border-none",
                    !instantPayment.is_enabled ? "bg-gray-300/20 hover:cursor-not-allowed" : ""
                  )}
                  role="button"
                  onClick={() => handleSelectedPaymentMethod(value[index])}
                >
                  <div className="p-3 inline-flex items-center space-x-2 w-full">
                    <div className="inline-flex justify-between items-center w-full">
                      <div className="inline-flex space-x-5 items-center">
                        <img src={instantPayment.logo} alt={instantPayment.name} className="max-w-[50px]" />
                        <span className="text-base">{instantPayment.name}</span>
                      </div>
                      {!instantPayment.is_enabled && (
                        <p className="text-gray-400 text-[7px] shrink-0">Sedang tidak bisa digunakan</p>
                      )}
                    </div>
                    {donation?.payment_method_id === instantPayment.id ? <CheckIcon size={20} /> : null}
                  </div>
                </button>
              ))}
        </div>
      </div>
    ));
  };

  return (
    <section className="relative layout bg-white h-screen">
      <Header inverted className="left-0 top-0" title="Pilih Metode Pembayaran" />
      <section className="pt-16">
        <div className="p-5">
          <RenderPaymentList />
        </div>
      </section>
    </section>
  );
}
