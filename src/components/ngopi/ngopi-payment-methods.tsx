"use client";

import currencyFormater, { cn } from "@/lib/utils";
import { useGetCampaignDetail } from "@/services/campaign/hooks";
import { useGetPaymentList } from "@/services/payment/hooks";
import { useDonationStore } from "@/store/useDonationStore";
import { PaymentMethods } from "@/types/campaign";
import { IPaymentMethod } from "@/types/payment";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Balancer from "react-wrap-balancer";
import { Skeleton } from "../Skeleton";
import { Switch } from "../Switch";
import { NGOPI_QRIS_MAX_AMOUNT } from "./constants";

interface Props {
  selectPayment: (payment: IPaymentMethod) => void;
  paymentMethods?: PaymentMethods | null;
}

const NgopiPaymentMethods = ({ selectPayment, paymentMethods }: Props) => {
  const [showVA, setShowVA] = useState(false);
  const usesFallback = paymentMethods == null;
  const params = useParams();
  const { data: payments, isLoading: isLoadingPayments, isError: isErrorPayments } = useGetPaymentList({});
  const {
    data: campaign,
    isLoading: isLoadingCampaign,
    isError: isErrorCampaign,
  } = useGetCampaignDetail({ campaignId: params?.campaign_id });
  const { donationAnonymous } = useDonationStore();

  const source = paymentMethods ?? campaign?.payment_methods;
  const hasPaymentMethods = source?.instant_payment?.length > 0 || source?.virtual_account?.length > 0;

  const paymentType = {
    justQris: campaign?.qris === 1 && campaign?.va === 0,
    justVA: campaign?.qris === 0 && campaign?.va === 1,
    qrisVA: campaign?.qris === 1 && campaign?.va === 1,
  };

  const selectedPayments = hasPaymentMethods
    ? {
        ...(source?.instant_payment?.length > 0 && { instant_payment: source.instant_payment }),
        ...(source?.virtual_account?.length > 0 && { virtual_account: source.virtual_account }),
      }
    : {
        ...(paymentType.justQris && { instant_payment: payments?.instant_payment }),
        ...(paymentType.justVA && { virtual_account: payments?.virtual_account }),
        ...(paymentType.qrisVA && payments),
      };

  const handleChange = (payment: any) => {
    selectPayment(payment);
  };

  const amount = Number(donationAnonymous?.amount || 0);
  const qrisMethod = selectedPayments?.instant_payment?.find((method: IPaymentMethod) => method.is_enabled);
  const virtualAccountMethod = selectedPayments?.virtual_account?.find((method: IPaymentMethod) => method.is_enabled);

  const selectQrisPayment = () => {
    if (qrisMethod) {
      selectPayment(qrisMethod);
    }
  };

  const selectVirtualAccountPayment = () => {
    if (virtualAccountMethod) {
      selectPayment(virtualAccountMethod);
    }
  };

  const isResolvingFallback = usesFallback && (isLoadingPayments || isLoadingCampaign);

  useEffect(() => {
    if (isResolvingFallback || isErrorPayments || isErrorCampaign || amount <= 0) return;

    if (amount > NGOPI_QRIS_MAX_AMOUNT) {
      setShowVA(true);
      if (virtualAccountMethod && donationAnonymous?.payment_method_id !== virtualAccountMethod.id) {
        selectVirtualAccountPayment();
      }
      return;
    }

    setShowVA(false);
    if (qrisMethod && donationAnonymous?.payment_method_id !== qrisMethod.id) {
      selectQrisPayment();
    }
  }, [amount, isResolvingFallback, isErrorPayments, isErrorCampaign, qrisMethod, virtualAccountMethod]);

  if (isResolvingFallback) {
    return (
      <div>
        <div className="space-y-2 mb-3">
          <Skeleton className="w-3/6 h-7 rounded-md" />
          <Skeleton className="w-4/6 h-5 rounded-md" />
        </div>
        <div className="w-full rounded-md space-y-3">
          <Skeleton className="w-full h-10 rounded-md" />
          <Skeleton className="w-full h-10 rounded-md" />
          <Skeleton className="w-full h-10 rounded-md" />
          <Skeleton className="w-full h-10 rounded-md" />
          <Skeleton className="w-full h-10 rounded-md" />
        </div>
      </div>
    );
  }

  if (usesFallback && (isErrorPayments || isErrorCampaign)) {
    return (
      <div className="w-full flex flex-col justify-center items-center gap-3">
        <Image src="/assets/payment-error.svg" width={200} height={200} alt="error" />
        <div className="space-y-3 text-center mb-4">
          <Balancer className="text-sm font-bold">Pembayaran Sedang Dalam Perbaikan</Balancer>
          <Balancer className="text-xs ">
            Semua pembayaran sedang tidak bisa gunakan, silakan coba beberapa saat lagi
          </Balancer>
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-4">
      <div className="space-y-3 text-white">
        <p className="text-xs  font-bold">Pilih Metode Pembayaran</p>
        {Object.entries(selectedPayments).map(([key, value]: any) => {
          // Hide QRIS
          if (key === "instant_payment" && amount > NGOPI_QRIS_MAX_AMOUNT) return null;

          // Hide VA
          if (key === "virtual_account" && amount <= NGOPI_QRIS_MAX_AMOUNT && !showVA) return null;

          return (
            <div key={key} className="space-y-2">
              {value?.map((method: IPaymentMethod) => (
                <label
                  key={method.id}
                  className={cn(
                    "flex items-center justify-between border-2 rounded-xl p-4 cursor-pointer ",
                    donationAnonymous?.payment_method_id === method.id
                      ? "border-fesyar-yellow-300 bg-fesyar-yellow-300/20"
                      : "border-white bg-gray-50/20",
                    !method.is_enabled && "bg-gray-300/20 cursor-not-allowed",
                  )}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="space-x-4 flex items-center">
                      <img src={method.logo} alt={method.name} className="max-w-[60px]" />

                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium">{method.name}</span>
                        {method?.variable_fee ? (
                          <span className="text-xs font-medium">
                            Biaya Operasional Pemrosesan Pembayaran : {method?.variable_fee}%
                          </span>
                        ) : null}

                        {key === "virtual_account" || (method?.fixed_fee ?? 0) > 0 ? (
                          <span className="text-xs font-medium">
                            Biaya Operasional Pemrosesan Pembayaran : Rp. {currencyFormater(method?.fixed_fee ?? 0)}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <div>
                      <input
                        name={key}
                        value={method.id}
                        type="radio"
                        checked={donationAnonymous?.payment_method_id === method.id}
                        onChange={() => handleChange(method)}
                        disabled={!method.is_enabled}
                        className="hidden peer"
                      />
                      <div
                        className={cn(
                          "w-5 h-5 rounded-full border flex items-center justify-center peer-checked:before:content-[''] peer-checked:before:w-2.5 peer-checked:before:h-2.5 peer-checked:before:rounded-full ",
                          donationAnonymous?.payment_method_id === method.id
                            ? "border-yellow-500 peer-checked:before:bg-yellow-500"
                            : "peer-checked:before:bg-gray-50 border-gray-50",
                        )}
                      ></div>
                    </div>
                  </div>
                  {!method.is_enabled && <p className="text-gray-400 text-xs">Sedang tidak bisa digunakan</p>}
                </label>
              ))}

              {key === "instant_payment" &&
                amount <= NGOPI_QRIS_MAX_AMOUNT &&
                selectedPayments?.virtual_account?.length > 0 && (
                  <div className="pt-2 pb-1">
                    <div className="flex items-center space-x-2 text-white text-sm w-fit">
                      <Switch
                        checked={showVA}
                        onCheckedChange={(checked) => {
                          const value = !!checked;
                          setShowVA(value);
                          if (!value && donationAnonymous?.paymentMethod?.type !== "instant_payment") {
                            selectQrisPayment();
                          }
                        }}
                        type="button"
                      />
                      <span
                        className="cursor-pointer text-[0.65rem] text-gray-200 italic"
                        onClick={() => {
                          const value = !showVA;
                          setShowVA(value);
                          if (!value && donationAnonymous?.paymentMethod?.type !== "instant_payment") {
                            selectQrisPayment();
                          }
                        }}
                      >
                        Gunakan metode pembayaran VA
                      </span>
                    </div>
                  </div>
                )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default NgopiPaymentMethods;
