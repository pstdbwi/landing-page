import { IPaymentMethod } from "@/types/payment";

export const NGOPI_QRIS_MAX_AMOUNT = 20_000_000;

export const NGOPI_DEFAULT_QRIS_PAYMENT_METHOD: IPaymentMethod = {
  id: "c7d3a66e-e9ca-4c7f-a020-ad75da1472b7",
  name: "QRIS",
  bank_code: "QRIS",
  type: "instant_payment",
  is_enabled: true,
  variable_fee: 0,
  logo: "https://storage.googleapis.com/ziswaf-asset-prod/images/payment-methods/qris.png",
  fixed_fee: 0,
  to_corporate: 0,
};
