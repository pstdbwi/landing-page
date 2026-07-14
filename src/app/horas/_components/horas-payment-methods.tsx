"use client";

import { Skeleton } from "@/components/Skeleton";
import currencyFormater, { cn } from "@/lib/utils";
import { useGetPaymentList } from "@/services/payment/hooks";
import { useDonationStore } from "@/store/useDonationStore";
import { PaymentMethods } from "@/types/campaign";
import { IPaymentMethod } from "@/types/payment";
import Image from "next/image";
import Balancer from "react-wrap-balancer";

interface Props {
  selectPayment: (payment: IPaymentMethod) => void;
  defaultValue?: string;
  paymentMethods?: PaymentMethods | null;
}

const HorasPaymentMethods = ({ selectPayment, defaultValue, paymentMethods }: Props) => {
  const { donationAnonymous } = useDonationStore();
  const usesFallback = !paymentMethods;
  const { data: fallbackPayments, isLoading, isError } = useGetPaymentList({ enabled: usesFallback });

  if (usesFallback && isLoading) {
    return (
      <div>
        <div className="space-y-2 mb-3">
          <Skeleton className="w-3/6 h-7 rounded-md" />
        </div>
        <div className="w-full rounded-md space-y-3">
          <Skeleton className="w-full h-10 rounded-md" />
          <Skeleton className="w-full h-10 rounded-md" />
          <Skeleton className="w-full h-10 rounded-md" />
        </div>
      </div>
    );
  }

  if (usesFallback && isError) {
    return (
      <div className="w-full flex flex-col justify-center items-center gap-3">
        <Image src="/assets/payment-error.svg" width={200} height={200} alt="error" />
        <div className="space-y-3 text-center mb-4">
          <Balancer className="text-sm font-bold">Pembayaran Sedang Dalam Perbaikan</Balancer>
          <Balancer className="text-xs">
            Semua pembayaran sedang tidak bisa gunakan, silakan coba beberapa saat lagi
          </Balancer>
        </div>
      </div>
    );
  }

  const source = paymentMethods ?? fallbackPayments;
  const selectedPayments = {
    ...(source?.instant_payment?.length > 0 && { instant_payment: source.instant_payment }),
    ...(source?.virtual_account?.length > 0 && { virtual_account: source.virtual_account }),
  };

  const handleChange = (payment: any) => {
    selectPayment(payment);
  };

  return (
    <section className="space-y-4">
      <div className="space-y-3 text-white">
        <p className="text-xs font-bold">Metode Pembayaran</p>
        {Object.entries(selectedPayments).map(([key, value]: any) => {
          // Hide QRIS
          if (key === "instant_payment" && donationAnonymous?.amount > 10_000_000) return null;

          // Hide VA
          if (key === "virtual_account" && donationAnonymous?.amount < 10_000_001) return null;

          return (
            <div key={key} className="space-y-2">
              {value?.map((method: IPaymentMethod) => (
                <label
                  key={method.id}
                  className={cn(
                    "flex items-center justify-between border-2 rounded-xl p-4 cursor-pointer ",
                    donationAnonymous?.payment_method_id === method.id || method?.id == defaultValue
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
                            Biaya Operasional Pemrosesan Pembayaran : Rp. {currencyFormater(method?.fixed_fee)}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <div>
                      <input
                        name={key}
                        value={method.id}
                        type="radio"
                        checked={donationAnonymous?.payment_method_id === method.id || method?.id == defaultValue}
                        onChange={() => handleChange(method)}
                        disabled={!method.is_enabled}
                        className="hidden peer"
                      />
                      <div
                        className={cn(
                          "w-5 h-5 rounded-full border flex items-center justify-center peer-checked:before:content-[''] peer-checked:before:w-2.5 peer-checked:before:h-2.5 peer-checked:before:rounded-full ",
                          donationAnonymous?.payment_method_id === method.id || method?.id == defaultValue
                            ? "border-yellow-500 peer-checked:before:bg-yellow-500"
                            : "peer-checked:before:bg-gray-50 border-gray-50",
                        )}
                      ></div>
                    </div>
                  </div>
                  {!method.is_enabled && <p className="text-gray-400 text-xs">Sedang tidak bisa digunakan</p>}
                </label>
              ))}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default HorasPaymentMethods;
