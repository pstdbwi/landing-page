"use client";

import { Checkbox } from "@/components/Checkbox";
import { GradientText } from "@/components/fesyar/gradient-text";
import NgopiPaymentMethods from "@/components/ngopi/ngopi-payment-methods";
import { ScreenLoaderNgopi } from "@/components/ngopi/screen-loader-ngopi";
import { Label } from "@/components/Label";
import { Switch } from "@/components/Switch";
import { Textarea } from "@/components/TextArea";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useActiveProgram } from "@/hooks/useActiveProgram";
import { env } from "@/lib/env";
import {
  CampaignTypeKeys,
  personByCampaignType,
  TCampaignType,
  wordingAttentionByCampaignType,
} from "@/lib/typeCampaign";
import { calculateTotalDonation, cn, phoneNumberFormater, toMoney } from "@/lib/utils";
import { useDonationStore } from "@/store/useDonationStore";
import { useFeatureFlag } from "@/store/feature-flag-context";
import { Campaign } from "@/types";
import { IPaymentMethod } from "@/types/payment";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dispatch, Fragment, SetStateAction, useEffect, useMemo, useState } from "react";
import CurrencyInput from "react-currency-input-field";
import { useForm } from "react-hook-form";
import { z } from "zod";

const DEFAULT_MINIMUM_NOMINAL = 10_000;

interface Props {
  authModal: boolean;
  setAuthModal: Dispatch<SetStateAction<boolean>>;
  campaign: Campaign;
}

const formSchema = z
  .object({
    name: z.string({ required_error: "Nama wajib diisi" }).min(1, { message: "Nama wajib diisi" }),
    is_anonymous: z.boolean().default(false),
    phone: z.string().optional(),
    email: z.string().optional(),
    is_wakif_others: z.boolean().default(false),
    wakif_name: z.string().optional(),
    wakif_phone: z.string().optional(),
    wakif_pray: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.is_wakif_others && (!data.wakif_name || data.wakif_name.trim() === "")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Nama wakif wajib diisi",
        path: ["wakif_name"],
      });
    }
  });

const FesyarAuthDonation = ({ authModal, setAuthModal, campaign }: Props) => {
  const router = useRouter();
  const { updateDonationAnonymous, donationAnonymous } = useDonationStore();
  const [screenLoading, setScreenLoading] = useState(false);
  const [errorMinWakaf, setErrorMinWakaf] = useState(false);
  const [errorPaymentMethod, setErrorPaymentMethod] = useState(false);
  const [eula, setEula] = useState(false);
  const [manualError, setManualError] = useState<string | null>(null);
  const { programPayload, activeProgram } = useActiveProgram();
  const { paymentMethods: programPaymentMethods } = useFeatureFlag();

  const resolvedPaymentMethods = programPaymentMethods ?? campaign?.payment_methods ?? undefined;

  const campaignType = TCampaignType[campaign?.type as CampaignTypeKeys];
  const textTypeCampaign = TCampaignType[campaign?.type as CampaignTypeKeys];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      is_anonymous: donationAnonymous?.is_anonymous || false,
      is_wakif_others: false,
      wakif_name: "",
      wakif_phone: "",
      wakif_pray: "",
    },
  });
  const isLoading = form.formState.isSubmitting;

  const minNominal = useMemo(() => {
    if (activeProgram?.min_amount && activeProgram.min_amount > 0) {
      return activeProgram.min_amount;
    }
    return DEFAULT_MINIMUM_NOMINAL;
  }, [activeProgram?.min_amount]);

  const handleCurrencyInput = (value: string) => {
    const amount = value ? Number(value) : 0;

    updateDonationAnonymous({
      amount,
      ...(amount <= 10_000_000
        ? {
            payment_method_id: "c7d3a66e-e9ca-4c7f-a020-ad75da1472b7",
            paymentMethod: {
              id: "c7d3a66e-e9ca-4c7f-a020-ad75da1472b7",
              name: "QRIS",
              bank_code: "QRIS",
              type: "instant_payment",
              is_enabled: true,
              variable_fee: 0,
              logo: "https://storage.googleapis.com/ziswaf-asset-prod/images/payment-methods/qris.png",
              fixed_fee: 0,
              to_corporate: 0,
            },
          }
        : {
            payment_method_id: "",
            paymentMethod: null,
          }),
    });

    setErrorMinWakaf(amount < minNominal);
  };

  const handleSelectPaymentMethod = (payment: IPaymentMethod) => {
    updateDonationAnonymous({
      payment_method_id: payment?.id,
      paymentMethod: payment,
    });
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setManualError(null);

      if (Number.isNaN(donationAnonymous?.amount) || Number(donationAnonymous?.amount) < minNominal) {
        setErrorMinWakaf(true);
        setManualError(`Nominal wakaf minimal Rp ${toMoney(minNominal)}`);
        return;
      }

      if (!donationAnonymous?.payment_method_id) {
        setErrorPaymentMethod(true);
        setManualError("Pilih metode pembayaran terlebih dahulu");
        return;
      }

      setScreenLoading(true);

      const payload = {
        campaign_id: campaign?.id,
        amount: donationAnonymous?.amount || 0,
        maintenance_fee: 0,
        payment_method_id: donationAnonymous?.payment_method_id,
        is_anonymous: values?.is_anonymous,
        willing_to_contact_by_lembaga: false,
        donor_name: values?.name,
        email: values?.email || `${window.location.host?.split(".")?.[0]}@satuwakaf.id`,
        phone_number: values?.phone ? phoneNumberFormater(values?.phone) : "",
        wakif_name: values?.is_wakif_others ? values?.wakif_name : values?.name,
        wakif_pray: values?.wakif_pray || null,
        is_wakif_others: values?.is_wakif_others ? 1 : 0,
        wakif_phone: values?.is_wakif_others
          ? values?.wakif_phone
            ? phoneNumberFormater(values?.wakif_phone)
            : null
          : null,
        wakif_address: null,
        wakif_city: null,
        wakif_province: null,
        wakif_type: null,
        wakif_type_id: null,
        program_id: null,
        program_name: null,
        corp_unit_lvl1_id: null,
        corp_unit_lvl1_name: null,
        corp_unit_lvl1_code: null,
        corp_unit_lvl2_id: null,
        corp_unit_lvl2_name: null,
        corp_unit_lvl3_id: null,
        corp_unit_lvl3_name: null,
        corp_unit_profession: null,
        corp_unit_province_code: null,
        corp_unit_city_code: null,
        corp_unit_district_code: null,
        subdomain: window.location.host,

        campaign_is_permanent: campaign?.is_permanent,
        corp_program_id: programPayload?.corp_program_id || null,
        corp_program_title: programPayload?.corp_program_title || null,
      };

      const endpoint =
        donationAnonymous?.paymentMethod?.to_corporate == 1
          ? env.NEXT_PUBLIC_BASE_URL2 + `/donations/apps`
          : env.NEXT_PUBLIC_BASE_URL + `/donations/non-login`;

      await axios
        .post(endpoint, payload)
        .then((response) => {
          const { id, payment } = response?.data?.data?.[0];

          setTimeout(() => {
            if (payment?.name === "QRIS") {
              router.push(`/fesyar/campaign/${campaign?.id}/anonymous/${id}?type=qris`);
            } else {
              router.push(`/fesyar/campaign/${campaign?.id}/anonymous/${id}?type=va`);
            }
          }, 800);
        })
        .catch((error) => {
          const errorMessage = error?.response?.data?.error;
          setManualError("Gagal membuat wakaf " + (errorMessage?.id || ""));
        });
    } catch (error) {
      console.error(error);
      setManualError("Terjadi Kesalahan");
    } finally {
      setScreenLoading(false);
    }
  };

  useEffect(() => {
    updateDonationAnonymous({
      payment_method_id: "c7d3a66e-e9ca-4c7f-a020-ad75da1472b7",
      paymentMethod: {
        id: "c7d3a66e-e9ca-4c7f-a020-ad75da1472b7",
        name: "QRIS",
        bank_code: "QRIS",
        type: "instant_payment",
        is_enabled: true,
        variable_fee: 0,
        logo: "https://storage.googleapis.com/ziswaf-asset-prod/images/payment-methods/qris.png",
        fixed_fee: 0,
        to_corporate: 0,
      },
    });
  }, []);

  return (
    <Fragment>
      <Dialog
        open={authModal}
        onOpenChange={(open) => {
          setAuthModal(open);
          if (!open) {
            setManualError(null);
            setErrorPaymentMethod(false);
            setErrorMinWakaf(false);
            setEula(false);
          }
        }}
      >
        <DialogContent className="bg-[#071c3d] bg-[radial-gradient(circle_at_top,_#205398_0%,_#071c3d_70%)] border-none rounded-xl w-full max-w-lg max-h-[90vh] overflow-auto [&_[data-slot=dialog-close]]:text-white [&_[data-slot=dialog-close]]:opacity-100">
          <DialogHeader>
            <DialogTitle className="text-center z-10">
              <GradientText>{campaignType} Sekarang</GradientText>
            </DialogTitle>
          </DialogHeader>

          <Image
            src="/assets/wakafein/flower.png"
            width={1200}
            height={600}
            alt=""
            className="pointer-events-none absolute left-0 top-0 h-auto w-[35%] max-w-[360px] opacity-65 scale-y-[-1]"
          />
          <Image
            src="/assets/wakafein/flower.png"
            width={1200}
            height={600}
            alt=""
            className="pointer-events-none absolute right-0 top-0 h-auto w-[35%] max-w-[360px] scale-x-[-1] scale-y-[-1] opacity-65"
          />

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 z-40 relative">
              <section>
                <div
                  className={cn("border rounded-lg py-2 px-5 bg-gray-50/20", errorMinWakaf ? "border-danger-500" : "")}
                >
                  <span className="text-sm font-normal text-white">Nominal {textTypeCampaign}</span>
                  <div className="relative w-full">
                    <CurrencyInput
                      id="input-amount"
                      name="input-amount"
                      placeholder="0"
                      decimalsLimit={2}
                      defaultValue={0}
                      className="w-full p-2 focus:ring-0 focus:outline-none font-bold text-xl focus-visible:ring-0 placeholder:text-lg px-9 bg-transparent text-white placeholder:text-gray-100"
                      onValueChange={(value) => handleCurrencyInput(value || "")}
                      allowNegativeValue={false}
                    />
                    <Label className="absolute left-0 h-full flex flex-col items-center justify-center top-0 text-xl font-bold text-white">
                      Rp
                    </Label>
                  </div>
                  {errorMinWakaf ? (
                    <span className="text-xs text-danger-500">
                      Nominal {textTypeCampaign} minimal Rp {toMoney(minNominal)}
                    </span>
                  ) : null}
                </div>
              </section>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white text-xs">
                      Nama Anda<span className="text-sx text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Masukkan Nama Anda"
                        disabled={isLoading}
                        className="bg-gray-50/20 text-gray-100 font-medium placeholder:text-gray-50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white text-xs">No. HP Anda (Opsional)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="08..."
                        disabled={isLoading}
                        className="bg-gray-50/20 text-gray-100 font-medium placeholder:text-gray-50 text-xs"
                        type="number"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white text-xs">Email Anda (Opsional)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Masukkan email anda"
                        disabled={isLoading}
                        className="bg-gray-50/20 text-gray-100 font-medium placeholder:text-gray-50 text-xs"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {!form.watch("is_wakif_others") && (
                <FormField
                  control={form.control}
                  name="is_anonymous"
                  render={({ field }) => (
                    <FormItem className="flex items-center w-full">
                      <Switch
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(!!checked)}
                        type="button"
                      />
                      <FormLabel className="text-[0.65rem] text-gray-200 italic">
                        Sembunyikan nama saya dari publikasi (Daftar{" "}
                        {personByCampaignType[campaign?.type as CampaignTypeKeys]})
                      </FormLabel>
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="is_wakif_others"
                render={({ field }) => (
                  <FormItem className="flex items-center w-full gap-2">
                    <Switch
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(!!checked)}
                      type="button"
                    />
                    <FormLabel className="text-[0.65rem] text-gray-200 italic">Wakaf untuk orang lain</FormLabel>
                  </FormItem>
                )}
              />

              {form.watch("is_wakif_others") && (
                <>
                  <FormField
                    control={form.control}
                    name="wakif_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white text-xs">
                          Nama Wakif<span className="text-xs text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Masukkan Nama Wakif"
                            disabled={isLoading}
                            className="bg-gray-50/20 text-white font-medium placeholder:text-gray-50"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="wakif_phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white text-xs">No. HP Wakif (Opsional)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="0812..."
                            disabled={isLoading}
                            className="bg-gray-50/20 text-gray-100 font-medium placeholder:text-gray-50 text-xs"
                            type="number"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="is_anonymous"
                    render={({ field }) => (
                      <FormItem className="flex items-center w-full">
                        <Switch
                          checked={field.value}
                          onCheckedChange={(checked) => field.onChange(!!checked)}
                          type="button"
                        />
                        <FormLabel className="text-[0.65rem] text-gray-200 italic">
                          Sembunyikan nama wakif dari publikasi (Daftar{" "}
                          {personByCampaignType[campaign?.type as CampaignTypeKeys]})
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                </>
              )}

              <div className="pt-4 border-t border-white/20 space-y-2 text-justify">
                <p className="text-[10px] text-gray-200 leading-tight">
                  <span className="font-bold">1. Tujuan Pengumpulan:</span> memastikan profil wakif dapat diverifikasi
                  dengan informasi yang valid agar syarat sah berwakaf terpenuhi sesuai aturan syariat dan
                  perundang-undangan
                </p>
                <p className="text-[10px] text-gray-200 leading-tight">
                  <span className="font-bold">2. Komitmen:</span> SatuWakaf berkomitmen penuh bahwa segala data terkait
                  pribadi yang dikumpulkan akan dikelola dan dijaga dengan tata kelola data sesuai aturan sebaik-baiknya
                  dari akses ilegal, preventif kebocoran data, atau penyalahgunaan
                </p>
              </div>

              <FormField
                control={form.control}
                name="wakif_pray"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white text-xs">Doa & Harapan (Opsional)</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Tuliskan doa & harapan anda"
                        disabled={isLoading}
                        className="bg-gray-50/20 text-white font-medium placeholder:text-gray-50 min-h-[75px] text-xs"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <NgopiPaymentMethods
                selectPayment={(payment) => {
                  handleSelectPaymentMethod(payment);
                  setErrorPaymentMethod(false);
                }}
                paymentMethods={resolvedPaymentMethods}
              />
              {errorPaymentMethod ? (
                <span className="text-xs text-danger-500">Pilih metode pembayaran terlebih dahulu</span>
              ) : null}

              <div className="text-sm font-semibold text-gray-50">
                Total yang harus dibayar : Rp.
                {toMoney(
                  calculateTotalDonation(
                    { amount: donationAnonymous?.amount, maintenance_fee: 0 },
                    donationAnonymous?.paymentMethod,
                  ),
                )}
              </div>

              <div className="flex flex-col items-center justify-center w-full mb-5 gap-2 relative z-20">
                <img src="/assets/bismillah.svg" width={167} height={66} alt="decoration" className="invert" />
                <p className="text-[0.65rem] text-gray-50 text-center font-medium">
                  {wordingAttentionByCampaignType({
                    type: campaign?.type as CampaignTypeKeys,
                    lembaga: campaign?.lembaga?.name,
                    program: campaign?.title,
                    amount: donationAnonymous?.amount,
                  })}
                </p>
              </div>

              <div className="w-full flex items-center gap-2 relative z-20">
                <Checkbox
                  className={cn(eula ? "bg-fesyar-yellow-600" : "")}
                  checked={eula}
                  onCheckedChange={(checked) => setEula(!!checked)}
                />
                <GradientText className="text-xs">Saya sudah membaca Ikrar {textTypeCampaign}</GradientText>
              </div>

              <Button
                className="w-full bg-fesyar-gold text-fesyar-green-700 font-bold relative z-20"
                disabled={isLoading || !eula}
              >
                Lanjutkan Ber{campaignType} <ArrowRightIcon className="w-4 ml-1" />
              </Button>

              {manualError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative z-20 text-xs text-center animate-in fade-in slide-in-from-top-1">
                  {manualError}
                </div>
              )}
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {screenLoading ? <ScreenLoaderNgopi /> : null}
    </Fragment>
  );
};

export default FesyarAuthDonation;
