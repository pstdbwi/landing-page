"use client";
import { Button } from "@/components/Button";
import Lucide from "@/components/Icon/lucide";
import { Label } from "@/components/Label";
import { zodResolver } from "@hookform/resolvers/zod";
import CurrencyInput from "react-currency-input-field";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/Avatar";
import { Checkbox } from "@/components/Checkbox";
import { Switch } from "@/components/Switch";
import { ChangeEvent, use, useEffect, useRef, useState } from "react";
import { Header } from "@/components/Header";
import { useCreateDonationStore } from "@/store";
import { useGetCampaignDetail } from "@/services/campaign/hooks";
import axios from "axios";
import { env } from "@/lib/env";
import { notifyError } from "@/components/Toaster";
import { Toaster } from "react-hot-toast";
import { Skeleton } from "@/components/Skeleton";
import { ScreenLoader } from "@/components/Loader";
import { getCookie } from "cookies-next";
import { FormField, FormItem, Form, FormControl, FormMessage } from "@/components/Form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Select";
import React from "react";
import {
  calculateServiceFee,
  calculateTotalTransactionAmountAndServiceFee,
  calculateTotalTransactionWithQRIS,
  cn,
  phoneNumberFormater,
} from "@/lib/utils";
import { useGetCityList, useGetDistrictList, useGetProvinceList } from "@/services/location/hooks";
import jwt from "jsonwebtoken";
import { User2Icon } from "lucide-react";
import { Input } from "@/components/Input";
import {
  CampaignTypeKeys,
  TCampaignType,
  personByCampaignType,
  wordingAttentionByCampaignType,
  wordingByCampaignType,
} from "@/lib/typeCampaign";
import useSession from "@/lib/use-session";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Tab";

type userProps = {
  id: string;
  full_name: string;
  email: string;
  phone_number: number;
  image: string;
  is_social_media_login: boolean;
  is_location_data_completed: boolean;
  share_userdata_agreement: boolean;
  exp: number;
};

export default function Donate({ params }: { params: { campaignId: string } }) {
  const { data: campaign, isLoading } = useGetCampaignDetail({ campaignId: params.campaignId });
  const router = useRouter();
  const token = getCookie("user_token");
  const textTypeCampaign = TCampaignType[campaign?.type as CampaignTypeKeys];
  /**
   * this is user value from token
   */

  console.log({ campaign });

  let user: Partial<userProps> = {};

  if (token !== null) {
    user = jwt.decode(token!!) as Partial<userProps>;
  }

  const { store, storeCreateDonation } = useCreateDonationStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [openIkrar, setOpenIkrar] = useState<boolean>(false);
  const [errorMinWakaf, setErrorMinWakaf] = useState<boolean>(false);
  const [errorMinInfaq, setErrorMinInfaq] = useState(false);

  const { session } = useSession();

  const [wakifName, setWakifName] = useState(session?.name);
  const [errorWakifName, setErrorWakifName] = useState(false);
  const [wakifAddress, setWakifAddress] = useState("");
  const [errorWakifAddress, setErrorWakifAddress] = useState(false);

  const [errorPaymentMethod, setErrorPaymentMethod] = useState(false);
  const [maintenanceFeeInput, setMaintenanceFeeInput] = useState(false);

  const FormSchema = z.object({
    province_code: z
      .string({
        required_error: "Provinsi harus dipilih",
      })
      .optional(),
    city_code: z
      .string({
        required_error: "Kota/Kabupaten harus dipilih",
      })
      .optional(),
    district_code: z
      .string({
        required_error: "Kecamatan harus dipilih",
      })
      .optional(),
    corp_unit_lvl1_id: z
      .string({
        required_error: "Wajib dipilih",
      })
      .optional(),
    corp_unit_lvl1_code: z
      .string({
        required_error: "Wajib dipilih",
      })
      .optional(),
    corp_unit_lvl1_name: z
      .string({
        required_error: "Wajib dipilih",
      })
      .optional(),
    corp_unit_lvl2_id: z
      .string({
        required_error: "Wajib dipilih",
      })
      .optional(),
    corp_unit_lvl2_name: z
      .string({
        required_error: "Wajib dipilih",
      })
      .optional(),
    corp_unit_lvl3_id: z
      .string({
        required_error: "Wajib dipilih",
      })
      .optional(),
    corp_unit_lvl3_name: z
      .string({
        required_error: "Wajib dipilih",
      })
      .optional(),
    corp_unit_profession: z
      .string({
        required_error: "Wajib dipilih",
      })
      .optional(),
    corp_unit_province_code: z
      .string({
        required_error: "Provinsi harus dipilih",
      })
      .optional(),
    corp_unit_city_code: z
      .string({
        required_error: "Kota/Kabupaten harus dipilih",
      })
      .optional(),
    corp_unit_district_code: z
      .string({
        required_error: "Kecamatan harus dipilih",
      })
      .optional(),
    phone_number: z
      .string({
        required_error: "Wajib diisi",
      })
      .optional(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      province_code: "",
      city_code: "",
      district_code: "",
      corp_unit_province_code: "",
      corp_unit_city_code: "",
      corp_unit_district_code: "",
      corp_unit_lvl1_id: "",
      corp_unit_lvl1_name: "",
      corp_unit_lvl1_code: "",
      corp_unit_lvl2_id: "",
      corp_unit_lvl2_name: "",
      corp_unit_lvl3_id: "",
      corp_unit_lvl3_name: "",
      corp_unit_profession: "",
      phone_number: "",
    },
  });

  const watch = form.watch();

  const { data: provinsi, isFetched: isProvinceFetched } = useGetProvinceList({});

  const { data: kota } = useGetCityList({
    provinceId: watch.province_code,
    enabled: watch.province_code !== "",
  });

  const { data: kecamatan } = useGetDistrictList({
    cityId: watch.city_code,
    enabled: watch.city_code !== "",
  });

  const { data: corp_unit_provinsi, isFetched: corp_unit_isProvinceFetched } = useGetProvinceList({});

  const { data: corp_unit_kota } = useGetCityList({
    provinceId: watch.corp_unit_province_code,
    enabled: watch.corp_unit_province_code !== "",
  });

  const { data: corp_unit_kecamatan } = useGetDistrictList({
    cityId: watch.corp_unit_city_code,
    enabled: watch.corp_unit_city_code !== "",
  });

  const handleCurrencyInput = (value: string) => {
    const maintenanceFee = calculateServiceFee(Number(value) || 0);

    storeCreateDonation({
      payloadCreateDonation: {
        ...store.payloadCreateDonation,
        amount: Number(value) || 0,
        maintenance_fee: !maintenanceFeeInput ? maintenanceFee : store.payloadCreateDonation?.maintenance_fee,
      },
    });
    if (Number(value) < 10000) {
      setErrorMinWakaf(true);
    } else {
      setErrorMinWakaf(false);
    }
  };

  const handleMaintenanceFeeInput = (value: string) => {
    setMaintenanceFeeInput(true);
    storeCreateDonation({
      payloadCreateDonation: {
        ...store.payloadCreateDonation,
        maintenance_fee: Math.ceil(Number(value)) || 0,
      },
    });

    if (Number(value) < 0) {
      setErrorMinInfaq(true);
      return;
    } else {
      setErrorMinInfaq(false);
    }
  };

  const handleWakifName = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event?.currentTarget;
    storeCreateDonation({
      payloadCreateDonation: {
        ...store.payloadCreateDonation,
        wakif_name: value,
      },
    });

    setWakifName(value);

    if (!value?.length) {
      setErrorWakifName(true);
    } else {
      setErrorWakifName(false);
    }
  };

  const handleWakifAddress = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event?.currentTarget;
    storeCreateDonation({
      payloadCreateDonation: {
        ...store.payloadCreateDonation,
        wakif_address: value,
      },
    });

    setWakifAddress(value);

    if (!value?.length) {
      setErrorWakifAddress(true);
    } else {
      setErrorWakifAddress(false);
    }
  };

  const handleContinueToPayment = () => {
    const isError = {
      amount: false,
      wakif_name: false,
      wakif_address: false,
      payment_method_id: false,
      phone_number: false,
    };
    if (campaign?.rakornas_kemenag == 1) {
      if (
        !form.getValues("corp_unit_lvl1_id") ||
        !form.getValues("corp_unit_lvl2_id") ||
        !form.getValues("corp_unit_lvl3_id") ||
        !form.getValues("corp_unit_profession")
      ) {
        notifyError("Silahkan Lengkapi Asal Institusi");
        return;
      }
      if (
        form.getValues("corp_unit_lvl1_code") != "Kp" &&
        (!form.getValues("corp_unit_province_code") ||
          !form.getValues("corp_unit_city_code") ||
          !form.getValues("corp_unit_district_code"))
      ) {
        notifyError("Silahkan Lengkapi Wilayah Kerja");
        return;
      }
    }
    if (!user.phone_number && !form.getValues("phone_number")) {
      form.setError("phone_number", { message: "Nomor Telepon Wajib Diisi" });
      return;
    }
    if (Number.isNaN(store?.payloadCreateDonation?.amount) || Number(store?.payloadCreateDonation?.amount) < 10000) {
      isError["amount"] = true;
      setErrorMinWakaf(true);
    }
    if (!wakifName) {
      isError["wakif_name"] = true;
      setErrorWakifName(true);
    }

    if (!wakifAddress) {
      isError["wakif_address"] = true;
      setErrorWakifAddress(true);
    }

    if (!store?.payloadCreateDonation?.payment_method_id && campaign?.rakornas_kemenag == 1) {
      isError["payment_method_id"] = true;
      setErrorPaymentMethod(true);
    }

    if (isError?.amount || isError?.wakif_name || isError?.wakif_address || isError?.payment_method_id) {
      return;
    }
    setOpenIkrar(true);
  };

  const handleSelectPaymentMethode = () => {
    router.push(`/campaign/${params.campaignId}/payment-method`);
  };

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setLoading(true);
    // console.log(data)
    if (!wakifName) {
      setLoading(false);
      setErrorWakifName(true);
      return;
    }

    if (!wakifAddress) {
      setLoading(false);
      setErrorWakifAddress(true);
      return;
    }

    const requestBody = {
      ...store.payloadCreateDonation,
      ...(session?.type === "facebook" || session?.type === "google" ? data : {}),
      ...data,
      wakif_name: wakifName,
      wakif_address: wakifAddress,
      ...(data.corp_unit_lvl1_code == "Mdp" && {
        corp_unit_lvl3_name: data.corp_unit_lvl3_id,
        corp_unit_lvl3_id: null,
      }),
      ...(campaign?.rakornas_kemenag == 1 && {
        payment_method_id: "c7d3a66e-e9ca-4c7f-a020-ad75da1472b7",
      }),
      ...(data.phone_number
        ? {
            phone_number: phoneNumberFormater(data.phone_number),
          }
        : {
            phone_number: user.phone_number,
          }),
    };

    try {
      await axios
        .post(`${env.NEXT_PUBLIC_BASE_URL}/donations`, requestBody, {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
        .then((response) => {
          const { id, payment } = response?.data?.data[0];

          setTimeout(() => {
            if (payment?.name === "QRIS") {
              router.push(`/campaign/${params.campaignId}/donate/${id}?type=qris`);
            } else {
              router.push(`/campaign/${params.campaignId}/donate/${id}?type=va`);
            }
          }, 800);
          setLoading(false);
          setOpenIkrar(false);

          storeCreateDonation({
            selectedPaymentMethode: {
              id: "",
              name: "",
              bank_code: "",
              type: "",
              is_enabled: false,
              fixed_fee: 0,
              logo: "",
            },
            payloadCreateDonation: {
              campaign_id: "",
              amount: 0,
              is_anonymous: false,
              willing_to_contact_by_lembaga: false,
              payment_method_id: "",
              wakif_name: "",
              wakif_address: "",
              maintenance_fee: 0,
            },
            createDonationResponse: {
              ...response?.data?.data[0],
            },
          });
        })
        .catch((error) => {
          const errorMessage = error?.response?.data?.error;
          setLoading(false);
          notifyError("Gagal membuat wakaf " + errorMessage.id);
        });
    } catch (error) {
      setLoading(false);
    }
  };

  const RenderMetodePembayaran = (name: string, total: number) => {
    if (!name) return <span>QRIS, Virtual Account</span>;

    const isExceed = calculateTotalTransactionAmountAndServiceFee(
      Number(store?.payloadCreateDonation?.amount),
      Number(store?.payloadCreateDonation?.maintenance_fee),
      name
    );

    return (
      <div className="flex flex-col items-start gap-1">
        <span>{name}</span>
        {isExceed ? (
          <div
            style={{
              fontSize: "0.6rem",
            }}
          >
            <span className="block text-red-500">Total donasi menggunakan Qris harus kurang dari Rp 10.000.000</span>
            <span className="block text-red-500">(Biaya Operasional Pemrosesan Pembayaran & Infak pemeliharaan)</span>
          </div>
        ) : null}
      </div>
    );
  };

  useEffect(() => {
    storeCreateDonation({
      payloadCreateDonation: {
        ...store.payloadCreateDonation,
        campaign_id: params.campaignId,
        ...(campaign?.rakornas_kemenag == 1 && {
          payment_method_id: "c7d3a66e-e9ca-4c7f-a020-ad75da1472b7",
        }),
      },
    });
  }, []);

  useEffect(() => {
    setWakifName(session?.name);
  }, [session]);

  const validationSocialMediaLogin = watch.city_code === "" || watch.district_code === "" || watch.province_code === "";
  const validateSocialMediaLogin = !user?.is_location_data_completed && validationSocialMediaLogin;

  return (
    <section className="pt-16 relative layout bg-white min-h-screen">
      <Header inverted title={`Tunaikan ${textTypeCampaign}`} className="left-0 top-0" />
      {campaign?.rakornas_kemenag == 1 ? (
        <section className="p-5">
          <KemenagInfo />
        </section>
      ) : (
        ""
      )}

      {isLoading ? (
        <div className="p-5">
          <Skeleton className="w-4/6 h-7 rounded-md mb-2" />
          <Skeleton className="w-3/6 h-7 rounded-md" />
        </div>
      ) : (
        <section className="px-5 pt-2 pb-3">
          <span className="text-xs text-gray-500">{`Anda akan ber${textTypeCampaign} ke program`}</span>
          <h1 className="text-base font-semibold">{campaign?.title}</h1>
        </section>
      )}
      <section className="px-5">
        <div className={cn("border rounded-lg py-2 px-5", errorMinWakaf ? "border-danger-500" : "")}>
          <span className="text-base font-normal text-gray-500">Nominal {textTypeCampaign}</span>
          <div className="relative w-full">
            <CurrencyInput
              id="input-amount"
              name="input-amout"
              defaultValue={store.payloadCreateDonation?.amount}
              placeholder="0"
              decimalsLimit={2}
              className={cn(
                "w-full p-2 focus:ring-0 focus:outline-none font-bold text-xl focus-visible:ring-0 placeholder:text-lg px-9"
              )}
              onValueChange={(value) => {
                handleCurrencyInput(value!!);
              }}
              allowNegativeValue={false}
            />
            <Label className="absolute left-0 h-full flex flex-col items-center justify-center top-0 text-xl font-bold">
              Rp
            </Label>
          </div>
          {errorMinWakaf ? (
            <span className="text-xs text-danger-500">Nominal {textTypeCampaign} minimal Rp 10.000</span>
          ) : null}
        </div>
      </section>
      <section className="px-5 mt-2">
        <div className={cn("border rounded-lg py-2 px-5", errorMinInfaq ? "border-danger-500" : "")}>
          <span className="text-base font-normal text-gray-500">Infaq Pemeliharaan</span>
          <div className="relative w-full">
            <CurrencyInput
              id="maintenance_fee"
              name="maintenance_fee"
              value={store.payloadCreateDonation?.maintenance_fee?.toFixed()}
              placeholder="0"
              decimalsLimit={2}
              className={cn(
                "w-full p-2 focus:ring-0 focus:outline-none font-bold text-xl focus-visible:ring-0 placeholder:text-lg px-9"
              )}
              onValueChange={(value) => {
                handleMaintenanceFeeInput(value!!);
              }}
              allowNegativeValue={false}
            />
            <Label className="absolute left-0 h-full flex flex-col items-center justify-center top-0 text-xl font-bold">
              Rp
            </Label>
          </div>
          {errorMinInfaq ? (
            <span className="text-xs text-danger-500">Nominal Infaq Pemeliharaan minimal Rp 0</span>
          ) : null}
        </div>
      </section>
      {campaign?.rakornas_kemenag == 1 ? (
        <section className="p-5 pb-0">
          <h1 className="text-sm font-semibold">Pilih Metode Pembayaran</h1>
          <div>
            <div className={cn("border rounded-lg p-3 mt-3")}>
              <div className="w-full inline-flex items-center justify-between pt-2">
                <div className="inline-flex items-center space-x-2">
                  <img
                    src={"https://storage.googleapis.com/ziswaf-asset-prod/images/payment-methods/qris.png"}
                    alt="QRIS"
                    width={50}
                    height={50}
                    fetchPriority="high"
                  />
                  QRIS
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="p-5 pb-0">
          <h1 className="text-sm font-semibold">Pilih Metode Pembayaran</h1>
          {isLoading ? (
            <Skeleton className="w-full h-16 rounded-md my-3" />
          ) : (
            <div>
              <div
                className={cn("border rounded-lg p-3 mt-3", errorPaymentMethod ? "border-danger-500" : "")}
                role="button"
                onClick={() => handleSelectPaymentMethode()}
              >
                {!store.selectedPaymentMethode ? (
                  <div className="w-full inline-flex items-center justify-between">
                    <span>QRIS, Virtual Account</span>
                    <Lucide name="chevron-right" size={18} />
                  </div>
                ) : (
                  <div className="w-full inline-flex items-center justify-between pt-2">
                    <div className="inline-flex items-center space-x-2">
                      {store?.selectedPaymentMethode.logo ? (
                        <img
                          src={store.selectedPaymentMethode.logo}
                          alt={store.selectedPaymentMethode.name}
                          width={50}
                          height={50}
                          fetchPriority="high"
                        />
                      ) : null}
                      {RenderMetodePembayaran(
                        store?.selectedPaymentMethode.name || "",
                        store?.payloadCreateDonation?.amount || 0
                      )}
                      {/* <span>{store?.selectedPaymentMethode.name ? `${store?.selectedPaymentMethode.name}sss` : 'QRIS, Virtual Account'}</span> */}
                    </div>
                    <span className="text-primary-500">Ubah</span>
                  </div>
                )}
                {errorPaymentMethod ? (
                  <span className="text-xs text-danger-500">Pilih metode pembayaran terlebih dahulu.</span>
                ) : null}
              </div>
            </div>
          )}
          {session?.isLoggedIn ? null : (
            <div className="my-3">
              <p>
                Silahkan{" "}
                <Link href="/login" className="text-primary-500 font-semibold">
                  Login
                </Link>{" "}
                dahulu untuk melanjutkan wakaf
              </p>
            </div>
          )}
        </section>
      )}
      <section className="px-5 pb-32">
        {session?.isLoggedIn ? (
          <React.Fragment>
            <h1 className="text-sm font-semibold my-3">Pembayar</h1>
            <div className="my-3">
              <div className="border rounded-xl mb-3">
                <div className="inline-flex items-center space-x-2 w-full p-3">
                  <Avatar>
                    <AvatarImage src={session?.image || ""} />
                    <AvatarFallback>{session?.name?.substring(0, 1)}</AvatarFallback>
                  </Avatar>
                  <div className="w-full">
                    <h1 className="text-sm">{session?.name}</h1>
                    <div className="inline-flex w-full justify-between">
                      <h2 className="text-sm">{session?.email}</h2>
                      <span className="text-sm">{session?.phone_number}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </React.Fragment>
        ) : null}

        {/* {session?.type === 'facebook' || session?.type === 'google' ? <h1 className="text-sm font-semibold mb-2">Mohon Lengkapi Informasi Alamat Anda</h1> : null} */}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            {!user?.is_location_data_completed ? (
              <React.Fragment>
                <div className="flex flex-col gap-2 bg-gray-100 p-1 rounded z-10">
                  <h1 className="text-sm font-semibold">Alamat Domisili</h1>
                  <FormField
                    control={form.control}
                    name="province_code"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={(e) => {
                            field.onChange(e);
                          }}
                          defaultValue={field.value}
                          disabled={!isProvinceFetched}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih Provinsi" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="overflow-y-auto max-h-[10rem]">
                            {provinsi?.map((item: Record<string, any>, index: number) => {
                              return (
                                <SelectItem key={index} value={item.code}>
                                  {item.name}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="city_code"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={(e) => {
                            field.onChange(e);
                          }}
                          defaultValue={field.value}
                          disabled={watch.province_code === ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih Kota/Kabupaten" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="overflow-y-auto max-h-[10rem]">
                            {kota?.map((item: Record<string, any>, index: number) => {
                              return (
                                <SelectItem key={index} value={item.code}>
                                  {item.name}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="district_code"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={(e) => {
                            field.onChange(e);
                          }}
                          defaultValue={field.value}
                          disabled={watch.city_code === ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih Kecamatan" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="overflow-y-auto max-h-[10rem]">
                            {kecamatan?.map((item: Record<string, any>, index: number) => {
                              return (
                                <SelectItem key={index} value={item.code}>
                                  {item.name}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* {
                                        !user.phone_number ? <FormField
                                            control={form.control}
                                            name='phone_number'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <Input placeholder="Masukkan Nomor Telepon" className="px-2" {...field} />
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        /> : ""
                                    } */}
                </div>
              </React.Fragment>
            ) : null}
            {!user.phone_number ? (
              <div className="flex flex-col gap-2 bg-gray-100 p-2 rounded z-10">
                <h1 className="text-sm font-semibold">Nomor Telepon</h1>
                <FormField
                  control={form.control}
                  name="phone_number"
                  render={({ field }) => (
                    <FormItem>
                      <Input
                        {...field}
                        type="number"
                        onChange={(e) => {
                          field.onChange(e);
                          form.trigger("phone_number");
                        }}
                        placeholder="Masukkan Nomor Telepon"
                        className="px-2"
                        onWheel={(e) => e.currentTarget.blur()}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ) : (
              ""
            )}
            {session?.isLoggedIn ? (
              <React.Fragment>
                <h1 className="text-sm font-semibold my-3 capitalize">
                  {personByCampaignType[campaign?.type as CampaignTypeKeys]}
                </h1>
                <div className="my-3">
                  <div className={cn("border rounded-xl mb-3", errorWakifName ? "border-danger-500" : "")}>
                    <div className="inline-flex items-center space-x-2 w-full p-3">
                      <Avatar className="border rounded-full grid place-items-center">
                        <User2Icon className="w-6 h-6" />
                      </Avatar>
                      <div className="w-full">
                        <h1 className="text-sm">Nama {personByCampaignType[campaign?.type as CampaignTypeKeys]}</h1>
                        <Input
                          name=""
                          type="text"
                          value={wakifName || ""}
                          placeholder={`Masukan Nama ${personByCampaignType[campaign?.type as CampaignTypeKeys]}`}
                          className={cn("border px-2 bg-gray-50", errorWakifName ? "border-danger-500" : "")}
                          onChange={(e) => handleWakifName(e)}
                        />
                        {errorWakifName ? (
                          <span className="text-xs text-danger-500">
                            Nama {personByCampaignType[campaign?.type as CampaignTypeKeys]} Wajib diisi.
                          </span>
                        ) : null}
                      </div>
                    </div>
                    <div className="w-full px-3 pb-3">
                      <h1 className="text-sm">Alamat {personByCampaignType[campaign?.type as CampaignTypeKeys]}</h1>
                      <Input
                        name=""
                        type="text"
                        value={wakifAddress || ""}
                        placeholder={`Masukan Alamat ${personByCampaignType[campaign?.type as CampaignTypeKeys]}`}
                        className={cn("border px-2 bg-gray-50", errorWakifAddress ? "border-danger-500" : "")}
                        onChange={(e) => handleWakifAddress(e)}
                      />
                      {errorWakifAddress ? (
                        <span className="text-xs text-danger-500">
                          Alamat {personByCampaignType[campaign?.type as CampaignTypeKeys]} Wajib diisi.
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              </React.Fragment>
            ) : null}
            {campaign?.rakornas_kemenag == 1 ? (
              <React.Fragment>
                <div className="flex flex-col gap-2 bg-gray-100 p-2 rounded">
                  <h1 className="text-sm font-semibold mb-2">Informasi Institusi</h1>
                  <FormField
                    control={form.control}
                    name="corp_unit_lvl1_id"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={(e: any) => {
                            const unit = campaign.units.find((val: any) => val.ID == e);
                            field.onChange(e);
                            form.setValue("corp_unit_lvl1_code", unit.code);
                            form.setValue("corp_unit_lvl1_name", unit.name);
                            form.setValue("corp_unit_lvl2_id", "");
                            form.setValue("corp_unit_lvl3_id", "");
                            form.setValue("corp_unit_lvl2_name", "");
                            form.setValue("corp_unit_lvl3_name", "");
                            form.setValue("corp_unit_profession", "");
                          }}
                          defaultValue={field.value}
                          disabled={!isProvinceFetched}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={
                                  "Pilih " +
                                  `${
                                    campaign.units.filter((value: any) => value.level == 1)[0]?.level_nomenclature ||
                                    "Asal Satuan Kerja"
                                  }`
                                }
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="overflow-y-auto max-h-[10rem]">
                            {campaign.units
                              .filter((value: any) => value.level == 1)
                              ?.map((item: Record<string, any>, index: number) => {
                                return (
                                  <SelectItem key={index} value={item.ID}>
                                    {item.name}
                                  </SelectItem>
                                );
                              })}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {form.getValues("corp_unit_lvl1_id") ? (
                    <FormField
                      control={form.control}
                      name="corp_unit_lvl2_id"
                      render={({ field }) => (
                        <FormItem>
                          <Select
                            onValueChange={(e) => {
                              const unit = campaign.units.find((val: any) => val.ID == e);
                              form.setValue("corp_unit_lvl2_name", unit.name);
                              field.onChange(e);
                              form.setValue("corp_unit_lvl3_id", "");
                            }}
                            value={field.value}
                            disabled={!isProvinceFetched}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={
                                    "Pilih " +
                                    campaign.units.find(
                                      (value: any) =>
                                        value.level == 2 && value.level_parent == form.getValues("corp_unit_lvl1_id")
                                    )?.level_nomenclature
                                  }
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="overflow-y-auto max-h-[10rem]">
                              {campaign.units
                                .filter(
                                  (value: any) =>
                                    value.level == 2 && value.level_parent == form.getValues("corp_unit_lvl1_id")
                                )
                                ?.map((item: Record<string, any>, index: number) => {
                                  return (
                                    <SelectItem key={index} value={item.ID}>
                                      {item.name}
                                    </SelectItem>
                                  );
                                })}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : (
                    ""
                  )}
                  {form.getValues("corp_unit_lvl2_id") ? (
                    <React.Fragment>
                      {form.getValues("corp_unit_lvl1_code") == "Mdp" ? (
                        <FormField
                          control={form.control}
                          name="corp_unit_lvl3_id"
                          render={({ field }) => (
                            <FormItem>
                              <Input placeholder={"Masukkan Nama Madrasah/Pontren"} {...field} className="px-3" />
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ) : (
                        <FormField
                          control={form.control}
                          name="corp_unit_lvl3_id"
                          render={({ field }) => (
                            <FormItem>
                              <Select
                                onValueChange={(e) => {
                                  field.onChange(e);
                                  const unit = campaign.units.find((val: any) => val.ID == e);
                                  form.setValue("corp_unit_lvl3_name", unit.name);
                                }}
                                value={field.value}
                                disabled={!isProvinceFetched}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue
                                      placeholder={
                                        campaign.units.find(
                                          (value: any) =>
                                            value.level == 3 &&
                                            value.level_parent == form.getValues("corp_unit_lvl2_id")
                                        )?.level_nomenclature
                                      }
                                    />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="overflow-y-auto max-h-[10rem]">
                                  {campaign.units
                                    .filter(
                                      (value: any) =>
                                        value.level == 3 && value.level_parent == form.getValues("corp_unit_lvl2_id")
                                    )
                                    ?.map((item: Record<string, any>, index: number) => {
                                      return (
                                        <SelectItem key={index} value={item.ID}>
                                          {item.name}
                                        </SelectItem>
                                      );
                                    })}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      <FormField
                        control={form.control}
                        name="corp_unit_profession"
                        render={({ field }) => (
                          <FormItem>
                            <Select
                              onValueChange={(e) => {
                                field.onChange(e);
                              }}
                              value={field.value}
                              disabled={!isProvinceFetched}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Pilih Profesi" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="overflow-y-auto max-h-[10rem]">
                                {(["Kp", "Kw", "Kk"].includes(form.getValues("corp_unit_lvl1_code")!)
                                  ? campaign.professions.ditjen
                                  : form.getValues("corp_unit_lvl1_code") == "Mdp"
                                  ? campaign.professions.pesantren
                                  : campaign.professions.university
                                )?.map((item: Record<string, any>, index: number) => {
                                  return (
                                    <SelectItem key={index} value={item.name}>
                                      {item.name}
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </React.Fragment>
                  ) : (
                    ""
                  )}
                </div>
              </React.Fragment>
            ) : (
              ""
            )}
            {campaign?.rakornas_kemenag == 1 &&
            form.getValues("corp_unit_lvl1_id") &&
            form.getValues("corp_unit_lvl1_code") != "Kp" ? (
              <React.Fragment>
                <div className="flex flex-col gap-2 bg-gray-100 p-2 rounded z-10">
                  <h1 className="text-sm font-semibold">Wilayah Kerja</h1>
                  <FormField
                    control={form.control}
                    name="corp_unit_province_code"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={!corp_unit_isProvinceFetched}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Provinsi" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="overflow-y-auto max-h-[10rem]">
                            {corp_unit_provinsi?.map((item: Record<string, any>, index: number) => {
                              return (
                                <SelectItem key={index} value={item.code}>
                                  {item.name}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="corp_unit_city_code"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={watch.corp_unit_province_code === ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih Kota/Kabupaten" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="overflow-y-auto max-h-[10rem]">
                            {corp_unit_kota?.map((item: Record<string, any>, index: number) => {
                              return (
                                <SelectItem key={index} value={item.code}>
                                  {item.name}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="corp_unit_district_code"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={watch.corp_unit_city_code === ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih Kecamatan" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="overflow-y-auto max-h-[10rem]">
                            {corp_unit_kecamatan?.map((item: Record<string, any>, index: number) => {
                              return (
                                <SelectItem key={index} value={item.code}>
                                  {item.name}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </React.Fragment>
            ) : (
              ""
            )}

            {session?.isLoggedIn ? (
              <React.Fragment>
                <div className="bg-blue-100 p-2 w-full inline-flex gap-3 rounded-md">
                  <Checkbox
                    defaultChecked={user?.share_userdata_agreement}
                    onCheckedChange={(value) =>
                      storeCreateDonation({
                        payloadCreateDonation: {
                          ...store.payloadCreateDonation,
                          willing_to_contact_by_lembaga: !!value,
                        },
                      })
                    }
                  />
                  <p className="text-xs">
                    Dengan mengisi kotak ini, Anda setuju untuk dihubungi oleh lembaga yang ada di dalam platform
                    SATUWAKAF untuk tujuan promosi program.
                    <a href="/accounts/privacy-policy">(Kebijakan Privasi)</a>
                  </p>
                </div>
                <div className="inline-flex items-center justify-between w-full">
                  <h1 className="text-xs font-bold">
                    Sembunyikan nama saya ({personByCampaignType[campaign?.type as CampaignTypeKeys]})
                  </h1>
                  <Switch
                    defaultChecked={store?.payloadCreateDonation?.is_anonymous}
                    onCheckedChange={(value) => {
                      storeCreateDonation({
                        payloadCreateDonation: {
                          ...store.payloadCreateDonation,
                          is_anonymous: value,
                        },
                      });
                    }}
                  />
                </div>
              </React.Fragment>
            ) : null}

            <div className="fixed bottom-0 inset-x-0 border-t p-3 layout bg-white">
              <Button
                size="full"
                variant="default"
                className="text-bold text-white"
                onClick={() => handleContinueToPayment()}
                type="button"
                disabled={errorMinWakaf || validateSocialMediaLogin}
              >
                Lanjut pembayaran
              </Button>
            </div>
            {openIkrar ? (
              <div className="fixed bottom-0 inset-x-0 w-full rounded-t-2xl bg-white px-5 pb-4 layout z-40">
                <div className="w-full relative mb-8">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setOpenIkrar(false);
                    }}
                  >
                    <Lucide name="x" size={20} className="absolute left-2 bottom-0" />
                  </button>
                  <h1 className="text-base font-bold text-center">
                    {wordingByCampaignType[campaign?.type as CampaignTypeKeys]}
                  </h1>
                </div>
                <div className="flex flex-col items-center justify-center w-full mb-5 gap-2">
                  <img src="/assets/bismillah.svg" width={150} height={100} alt="decoration" />
                  <p className="text-sm text-gray-500 text-center">
                    {wordingAttentionByCampaignType({
                      type: campaign?.type as CampaignTypeKeys,
                      lembaga: campaign?.lembaga?.name,
                      program: campaign?.title,
                      amount: store?.payloadCreateDonation?.amount!!,
                    })}
                  </p>
                </div>
                <Button variant="default" size="full" type="submit">
                  Saya sudah baca {wordingByCampaignType[campaign?.type as CampaignTypeKeys]} dan lanjutkan
                </Button>
              </div>
            ) : null}
          </form>
        </Form>
      </section>
      {loading ? <ScreenLoader /> : null}
      {openIkrar ? <div aria-hidden className="h-full bg-black/20 w-full absolute top-0"></div> : null}
      <Toaster position="bottom-center" />
    </section>
  );
}

const KemenagInfo = () => {
  const [view, setView] = useState("info");
  return (
    <div className="">
      <h2 className="text-center font-bold">Informasi Wakaf ASN Kemenag</h2>
      <p className="text-sm">
        Gerakan wakaf uang ASN Kemenag mencakup jenis wakaf uang temporer atau permanen dengan ketentuan sebagai
        berikut:{" "}
      </p>
      {view == "info" ? (
        <React.Fragment>
          <table className="w-full table-fixed text-xs mt-2">
            <thead>
              <tr className="border">
                <th className="text-start border-x p-1">Item</th>
                <th className="text-start border-x p-1">Wakaf Temporer</th>
                <th className="text-start border-x p-1">Wakaf Permanen</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  item: "Nama Program",
                  temporer: "Wakaf Uang",
                  permanen: "Wakaf Uang",
                },
                {
                  item: "Periode waktu",
                  temporer: "Minimal 1 tahun",
                  permanen: "Selamanya",
                },
                {
                  item: "Wakaf Minimal",
                  temporer: "Rp 1.000.000,-",
                  permanen: "Tidak ada minimal",
                },
                {
                  item: "Nama Deposito",
                  temporer: "Wakif",
                  permanen: "Nazhir (BWI)",
                },
                {
                  item: "AIW < Rp 1 juta",
                  temporer: "Tidak ada",
                  permanen: "Atas nama wakif",
                },
                {
                  item: "SWU < Rp 1 juta",
                  temporer: "Tidak ada",
                  permanen: "Tidak ada",
                },
                {
                  item: "Perolehan AIW/SWU",
                  temporer: "Langsung via Aplikasi",
                  permanen: "Langsung via Aplikasi",
                },
                {
                  item: "Bentuk AIW/SWU",
                  temporer: "PDF",
                  permanen: "PDF",
                },
              ].map((value) => (
                <tr key={value.item} className="border">
                  <td className="border-x p-1">{value.item}</td>
                  <td className="border-x p-1">{value.temporer}</td>
                  <td className="border-x p-1">{value.permanen}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* <Button onClick={() => setView("statistics")} className="w-full mt-2" size='sm' variant="outline">Lihat Hasil Pengumuman Sementara</Button> */}
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Tabs defaultValue="satker" className="w-full text-sm">
            <TabsList className="w-full border-none bg-transparent p-1 border h-fit">
              <TabsTrigger value="satker" className="w-full border text-xs data-[state=active]:bg-gray-200">
                Asal Satker
              </TabsTrigger>
              <TabsTrigger value="ditjen" className="w-full border text-xs data-[state=active]:bg-gray-200">
                Ditjen
              </TabsTrigger>
              <TabsTrigger value="pegtinggi" className="w-full border text-xs data-[state=active]:bg-gray-200">
                Perg.Tinggi
              </TabsTrigger>
              <TabsTrigger value="provinsi" className="w-full border text-xs data-[state=active]:bg-gray-200">
                Provinsi
              </TabsTrigger>
              <TabsTrigger value="kabkot" className="w-full border text-xs data-[state=active]:bg-gray-200">
                Kab/Kota
              </TabsTrigger>
            </TabsList>
            <TabsContent value="satker">
              <div className="">
                <table className="w-full table-fixed text-xs">
                  <thead>
                    <tr className="border">
                      <th className="text-start border-x p-1">Unit</th>
                      <th className="text-start border-x p-1">Wakif</th>
                      <th className="text-start border-x p-1">Jumlah</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[].map((value: any) => (
                      <tr key={value.item} className="border">
                        <td className="border-x p-1">{value.item}</td>
                        <td className="border-x p-1">{value.temporer}</td>
                        <td className="border-x p-1">{value.permanen}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
          <Button onClick={() => setView("info")} className="w-full mt-2" size="sm" variant="outline">
            Kembali
          </Button>
        </React.Fragment>
      )}
    </div>
  );
};
