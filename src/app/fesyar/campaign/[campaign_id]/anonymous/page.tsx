"use client";

import { Checkbox } from "@/components/Checkbox";
import { GradientText } from "@/components/fesyar/gradient-text";
import LayoutFesyar from "@/components/fesyar/layout-fesyar";
import PaymentMethods from "@/components/fesyar/payment-methods";
import ReactSelectFesyar from "@/components/fesyar/react-select-fesyar";
import { ScreenLoaderFesyar } from "@/components/fesyar/screen-loader-fesyar";
import { Skeleton } from "@/components/Skeleton";
import { Switch } from "@/components/Switch";
import { notifyError } from "@/components/Toaster";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { MINIMUM_NOMINAL } from "@/constant/config";
import { PROFESI_REQUIRED } from "@/constant/pai";
import { loadOptionsCorpUnitLevel1, loadOptionsCorpUnitLevel2, loadOptionsCorpUnitLevel3 } from "@/lib/async-select";
import { env } from "@/lib/env";
import {
  CampaignTypeKeys,
  personByCampaignType,
  TCampaignType,
  wordingAttentionByCampaignType,
} from "@/lib/typeCampaign";
import currencyFormater, { calculateTotalDonation, cn, phoneNumberFormater } from "@/lib/utils";
import { useGetCampaignDetail } from "@/services/campaign/hooks";
import { useGetCityList, useGetDistrictList, useGetProvinceList } from "@/services/location/hooks";
import { useDonationStore } from "@/store/useDonationStore";
import { IPaymentMethod } from "@/types/payment";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { ArrowLeftIcon, ChevronRight, ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import CurrencyInput from "react-currency-input-field";
import { useForm } from "react-hook-form";
import { Toaster } from "react-hot-toast";
import AsyncSelect from "react-select/async";
import { z } from "zod";

const FormSchema = z
  .object({
    donor_name: z
      .string({ required_error: "Nama pembayar wajib diisi" })
      .min(1, { message: "Nama pembayar wajib diisi" }),
    email: z
      .string({ required_error: "Email wajib diisi" })
      .min(1, { message: "Email wajib diisi" })
      .email("Format email tidak valid"),
    phone_number: z
      .string({ required_error: "Nomor telepon wajib diisi" })
      .min(1, { message: "Nomor telepon wajib diisi" }),
    willing_to_contact_by_lembaga: z.boolean().default(false),
    is_anonymous: z.boolean().default(false),
    campaign_type: z.coerce.number().optional(),
    is_permanent: z.coerce.number().optional(),
    corp_id: z.string().optional(),

    wakif_name: z.string({ required_error: "Nama wajib diisi" }).min(1, { message: "Nama wajib diisi" }),
    wakif_phone: z
      .string({ required_error: "Nomor telepon wajib diisi" })
      .min(1, { message: "Nomor telepon wajib diisi" }),

    program_id: z.string().optional(),
    program_name: z.string().optional(),

    // wakif fields default optional
    wakif_address: z.string().optional(),
    wakif_province: z.string().optional(),
    wakif_city: z.string().optional(),
    // wakif_district: z.string().optional(),
    wakif_type: z.string().optional(),
    wakif_type_id: z.coerce.string().optional(),
    wakif_type_has_corp_unit: z.boolean().optional(),
    has_wakif_types: z.boolean().optional(),

    // INSTITUSI
    corp_unit_lvl1_id: z.string().optional(),
    corp_unit_lvl1_code: z.string().optional(),
    corp_unit_lvl1_name: z.string().optional(),
    corp_unit_lvl1_has_child: z.boolean().optional(),

    corp_unit_lvl2_id: z.string().optional(),
    corp_unit_lvl2_name: z.string().optional(),
    corp_unit_lvl2_has_child: z.boolean().optional(),

    corp_unit_lvl3_id: z.string().optional(),
    corp_unit_lvl3_name: z.string().optional(),

    corp_unit_profession: z.string().optional(),

    corp_has_national: z.boolean().optional(),
    corp_unit_province_code: z.string().optional(),
    corp_unit_city_code: z.string().optional(),
    corp_unit_district_code: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // TIPE WAKAF & TEMPORER REQUIRED FILL THIS FIELD
    if (data.campaign_type == 3) {
      // Mapping field ke pesan error spesifik
      const wakifFieldErrors: Record<string, string> = {
        wakif_name: "Nama wajib diisi",
        wakif_phone: "Nomor telepon wajib diisi",
        wakif_province: "Provinsi harus dipilih",
        wakif_city: "Kota/Kabupaten harus dipilih",
        ...(data?.is_permanent == 0 ? { wakif_address: "Alamat wajib diisi" } : {}), // WAKAF TEMPORARY REQUIRED
      };

      Object.entries(wakifFieldErrors).forEach(([field, errorMsg]) => {
        if (!data[field as keyof typeof data] || String(data[field as keyof typeof data]).trim() === "") {
          ctx.addIssue({
            path: [field],
            code: z.ZodIssueCode.custom,
            message: errorMsg,
          });
        }
      });
    }

    // REQUIRED FILL THIS FIELD WHEN HAS WAKIF TYPES AND NOT FILL INPUT WAKI TYPE
    if (data?.has_wakif_types && !data?.wakif_type) {
      ctx.addIssue({
        path: ["wakif_type"],
        code: z.ZodIssueCode.custom,
        message: "Tipe wakif wajib diisi",
      });
    }
  });

const Page = () => {
  const domainHost = window.location.host;
  const router = useRouter();
  const params = useParams();
  const { donationAnonymous, updateDonationAnonymous } = useDonationStore();
  const { data: campaign, isLoading } = useGetCampaignDetail({ campaignId: params?.campaign_id });

  const [loading, setLoading] = useState(false);
  const [errorMinWakaf, setErrorMinWakaf] = useState(false);
  const [errorMinInfaq, setErrorMinInfaq] = useState(false);
  const [errorPaymentMethod, setErrorPaymentMethod] = useState(false);
  const [openIkrar, setOpenIkrar] = useState(false);
  // LABELING DEPENDENCIES CORP
  const [eula, setEula] = useState(false);
  const [corpLevel1Nomenclature, setCorpLevel1Nomenclature] = useState("");
  const [corpLevel2Nomenclature, setCorpLevel2Nomenclature] = useState("");
  const [corpLevel3Nomenclature, setCorpLevel3Nomenclature] = useState("");
  const [listProfession, setListProfession] = useState([]);

  const [geolocations, setGeolocations] = useState({
    provinces: [],
    cities: [],
    districts: [],

    corp_unit_provinces: [],
    corp_unit_cities: [],
    corp_unit_districts: [],
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      corp_id: campaign?.corp_id || "",
      is_permanent: campaign?.is_permanent || 0,
      has_wakif_types: donationAnonymous?.has_wakif_types || !!campaign?.wakif_types?.length || false, // IF HAS WAKIF TYPES == TRUE
      wakif_type_has_corp_unit: donationAnonymous?.wakif_type_has_corp_unit || false,

      campaign_type: campaign?.type,

      donor_name: donationAnonymous?.donor_name || "",
      wakif_name: donationAnonymous?.wakif_name || donationAnonymous?.donor_name || "",
      wakif_address: donationAnonymous?.wakif_address || "",
      wakif_phone: donationAnonymous?.wakif_phone || donationAnonymous?.phone_number || "",
      phone_number: donationAnonymous?.phone_number || "",
      email: donationAnonymous?.email || "",
      wakif_province: donationAnonymous?.wakif_province || "",
      wakif_city: donationAnonymous?.wakif_city || "",
      wakif_type: donationAnonymous?.wakif_type || "",
      wakif_type_id: donationAnonymous?.wakif_type_id || "",
      willing_to_contact_by_lembaga: donationAnonymous?.willing_to_contact_by_lembaga || false,
      is_anonymous: donationAnonymous?.is_anonymous || false,

      program_id: donationAnonymous?.program_id || "",
      program_name: donationAnonymous?.program_name || "",

      // INSTITUSI
      corp_has_national: donationAnonymous?.corp_has_national || false,
      corp_unit_province_code: donationAnonymous?.corp_unit_province_code || "",
      corp_unit_city_code: donationAnonymous?.corp_unit_city_code || "",
      corp_unit_district_code: donationAnonymous?.corp_unit_district_code || "",

      corp_unit_lvl1_id: donationAnonymous?.corp_unit_lvl1_id || "",
      corp_unit_lvl1_name: donationAnonymous?.corp_unit_lvl1_name || "",
      corp_unit_lvl1_code: donationAnonymous?.corp_unit_lvl1_code || "",
      corp_unit_lvl1_has_child: donationAnonymous?.corp_unit_lvl1_has_child || false,

      corp_unit_lvl2_id: donationAnonymous?.corp_unit_lvl2_id || "",
      corp_unit_lvl2_name: donationAnonymous?.corp_unit_lvl2_name || "",
      corp_unit_lvl2_has_child: donationAnonymous?.corp_unit_lvl2_has_child || false,

      corp_unit_lvl3_id: donationAnonymous?.corp_unit_lvl3_id || "",
      corp_unit_lvl3_name: donationAnonymous?.corp_unit_lvl3_name || "",
      corp_unit_profession: donationAnonymous?.corp_unit_profession || "",
    },
    shouldFocusError: true,
  });

  const isSubmitting = form.formState.isSubmitting;
  const isCampaignWakaf = campaign?.type == 3;
  const personCampaignLabel = personByCampaignType[campaign?.type as CampaignTypeKeys];
  const textTypeCampaign = TCampaignType[campaign?.type as CampaignTypeKeys];
  const showInputCorpsDefault = campaign?.wakif_types?.length
    ? !campaign?.wakif_types?.some((item: any) => item?.has_corp_unit == 1)
    : true;

  const totalDonation = calculateTotalDonation(
    { amount: donationAnonymous?.amount || 0, maintenance_fee: donationAnonymous?.maintenance_fee || 0 },
    donationAnonymous?.paymentMethod
  );

  const paymentType = {
    justQris: campaign?.qris === 1 && campaign?.va === 0,
    justVA: campaign?.qris === 0 && campaign?.va === 1,
    qrisVA: campaign?.qris === 1 && campaign?.va === 1,
  };

  const { data: provinsi, isLoading: isLoadingProvince } = useGetProvinceList({});
  const { data: kota, isLoading: isLoadingCity } = useGetCityList({
    provinceId: form.watch("wakif_province") || "",
    enabled: !!form.watch("wakif_province"),
  });

  const { data: corp_unit_provinces, isLoading: isLoadingUnitProvinces } = useGetProvinceList({});
  const { data: corp_unit_cities, isLoading: isLoadingUnitCities } = useGetCityList({
    provinceId: form.watch("corp_unit_province_code"),
    enabled: !!form.watch("corp_unit_province_code"),
  });
  const { data: corp_unit_districts, isLoading: isLoadingUnitDistricts } = useGetDistrictList({
    cityId: form.watch("corp_unit_city_code"),
    enabled: !!form.watch("corp_unit_city_code"),
  });

  const handleCurrencyInput = (value: string) => {
    // const maintenanceFee = calculateServiceFee(Number(value) || 0); // Command, Req Salahudin 24 Juli 2025

    updateDonationAnonymous({
      amount: value ? Number(value) : 0,
      // maintenance_fee: !maintenanceFeeInput ? maintenanceFee : donationAnonymous?.maintenance_fee, // Command, Req Salahudin 24 Juli 2025
    });

    if (Number(value) < MINIMUM_NOMINAL) {
      setErrorMinWakaf(true);
    } else {
      setErrorMinWakaf(false);
    }
  };

  const handleMaintenanceFeeInput = (value: string) => {
    // setMaintenanceFeeInput(true);

    updateDonationAnonymous({
      maintenance_fee: value ? Math.ceil(Number(value)) : 0,
    });

    if (Number(value) < 0) {
      setErrorMinInfaq(true);
      return;
    } else {
      setErrorMinInfaq(false);
    }
  };

  const updateStateBeforeAction = () => {
    const payload = {
      campaign_id: campaign?.id,
      amount: donationAnonymous?.amount,
      maintenance_fee: donationAnonymous?.maintenance_fee,
      payment_method_id: donationAnonymous?.payment_method_id,
      paymentMethod: donationAnonymous?.paymentMethod,

      is_anonymous: form.getValues("is_anonymous"),
      willing_to_contact_by_lembaga: form.getValues("willing_to_contact_by_lembaga"),
      donor_name: form.getValues("donor_name"),
      wakif_name: form.getValues("wakif_name"),
      wakif_phone: form.getValues("wakif_phone"),
      wakif_address: form.getValues("wakif_address"),
      email: form.getValues("email"),
      phone_number: form.getValues("phone_number"),

      wakif_city: form.getValues("wakif_city"),
      wakif_province: form.getValues("wakif_province"),
      wakif_type: form.getValues("wakif_type") || null,
      wakif_type_id: form.getValues("wakif_type_id") || null,
      wakif_type_has_corp_unit: form.getValues("wakif_type_has_corp_unit") || false,
      has_wakif_types: form.getValues("has_wakif_types") || false,

      program_id: form.getValues("program_id") || null,
      program_name: form.getValues("program_name") || null,

      corp_unit_lvl1_id: form.getValues("corp_unit_lvl1_id") || null,
      corp_unit_lvl1_name: form.getValues("corp_unit_lvl1_name") || null,
      corp_unit_lvl1_code: form.getValues("corp_unit_lvl1_code") || null,
      corp_unit_lvl1_has_child: form.getValues("corp_unit_lvl1_has_child") || false,

      corp_unit_lvl2_id: form.getValues("corp_unit_lvl2_id") || null,
      corp_unit_lvl2_name: form.getValues("corp_unit_lvl2_name") || null,
      corp_unit_lvl2_has_child: form.getValues("corp_unit_lvl2_has_child") || false,

      corp_unit_lvl3_id: form.getValues("corp_unit_lvl3_id") || null,
      corp_unit_lvl3_name: form.getValues("corp_unit_lvl3_name") || null,

      corp_unit_profession: form.getValues("corp_unit_profession") || null,
      corp_unit_province_code: form.getValues("corp_unit_province_code") || null,
      corp_unit_city_code: form.getValues("corp_unit_city_code") || null,
      corp_unit_district_code: form.getValues("corp_unit_district_code") || null,

      ...(form.getValues("corp_unit_lvl1_code") == "Mdp" && {
        corp_unit_lvl3_name: form.getValues("corp_unit_lvl3_id") || null,
        corp_unit_lvl3_id: form.getValues("corp_unit_lvl3_id") || null,
      }),
    };

    updateDonationAnonymous(payload);
  };

  const handleSelectPaymentMethod = (payment: IPaymentMethod) => {
    const payload = {
      campaign_id: campaign?.id,
      amount: donationAnonymous?.amount,
      maintenance_fee: donationAnonymous?.maintenance_fee,
      is_anonymous: form.getValues("is_anonymous"),
      willing_to_contact_by_lembaga: form.getValues("willing_to_contact_by_lembaga"),
      donor_name: form.getValues("donor_name"),
      wakif_name: form.getValues("wakif_name"),
      wakif_phone: form.getValues("wakif_phone"),
      wakif_address: form.getValues("wakif_address"),
      email: form.getValues("email"),
      phone_number: form.getValues("phone_number"),

      wakif_city: form.getValues("wakif_city"),
      wakif_province: form.getValues("wakif_province"),
      wakif_type: form.getValues("wakif_type") || null,
      wakif_type_id: form.getValues("wakif_type_id") || null,
      wakif_type_has_corp_unit: form.getValues("wakif_type_has_corp_unit") || false,
      has_wakif_types: form.getValues("has_wakif_types") || false,

      program_id: form.getValues("program_id") || null,
      program_name: form.getValues("program_name") || null,

      corp_unit_lvl1_id: form.getValues("corp_unit_lvl1_id") || null,
      corp_unit_lvl1_name: form.getValues("corp_unit_lvl1_name") || null,
      corp_unit_lvl1_code: form.getValues("corp_unit_lvl1_code") || null,
      corp_unit_lvl1_has_child: form.getValues("corp_unit_lvl1_has_child") || false,

      corp_unit_lvl2_id: form.getValues("corp_unit_lvl2_id") || null,
      corp_unit_lvl2_name: form.getValues("corp_unit_lvl2_name") || null,
      corp_unit_lvl2_has_child: form.getValues("corp_unit_lvl2_has_child") || false,

      corp_unit_lvl3_id: form.getValues("corp_unit_lvl3_id") || null,
      corp_unit_lvl3_name: form.getValues("corp_unit_lvl3_name") || null,

      corp_unit_profession: form.getValues("corp_unit_profession") || null,
      corp_unit_province_code: form.getValues("corp_unit_province_code") || null,
      corp_unit_city_code: form.getValues("corp_unit_city_code") || null,
      corp_unit_district_code: form.getValues("corp_unit_district_code") || null,

      ...(form.getValues("corp_unit_lvl1_code") == "Mdp" && {
        corp_unit_lvl3_name: form.getValues("corp_unit_lvl3_id") || null,
        corp_unit_lvl3_id: form.getValues("corp_unit_lvl3_id") || null,
      }),

      // PAYMENT METHOD
      payment_method_id: payment?.id,
      paymentMethod: payment,
    };

    updateDonationAnonymous(payload);
  };

  const interceptLoadOptionsCorpUnitLevel1 = async (inputValue: string) => {
    const options: any[] = await loadOptionsCorpUnitLevel1(
      campaign?.corp_id,
      showInputCorpsDefault ? "" : form.watch("wakif_province") || "", // Dont have wakif types dont filter province
      showInputCorpsDefault ? "" : form.watch("wakif_city") || "" // Dont have wakif types dont filter city
    )(inputValue);

    const label = options?.[0]?.level_nomenclature;

    if (label) {
      setCorpLevel1Nomenclature(label);
    } else {
      setCorpLevel1Nomenclature("");
    }

    return options;
  };

  const interceptLoadOptionsCorpUnitLevel2 = async (inputValue: string) => {
    const options: any[] = await loadOptionsCorpUnitLevel2(
      campaign?.corp_id,
      form.watch("corp_unit_lvl1_id") || ""
    )(inputValue);

    const label = options?.[0]?.level_nomenclature;

    if (label) {
      setCorpLevel2Nomenclature(label);
    } else {
      setCorpLevel2Nomenclature("");
    }

    return options;
  };

  const interceptLoadOptionsCorpUnitLevel3 = async (inputValue: string) => {
    const options: any[] = await loadOptionsCorpUnitLevel3(
      campaign?.corp_id,
      form.watch("corp_unit_lvl2_id") || ""
    )(inputValue);

    const label = options?.[0]?.level_nomenclature;

    if (label) {
      setCorpLevel3Nomenclature(label);
    } else {
      setCorpLevel3Nomenclature("");
    }

    return options;
  };

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      const payload = {
        campaign_id: campaign?.id,
        amount: donationAnonymous?.amount || 0,
        maintenance_fee: donationAnonymous?.maintenance_fee,
        payment_method_id: paymentType?.justQris
          ? "c7d3a66e-e9ca-4c7f-a020-ad75da1472b7"
          : donationAnonymous?.payment_method_id || "",
        is_anonymous: values?.is_anonymous,
        willing_to_contact_by_lembaga: values?.willing_to_contact_by_lembaga,
        donor_name: values?.donor_name,
        wakif_name: values?.wakif_name,
        wakif_phone: values?.wakif_phone,
        wakif_address: values?.wakif_address || null,
        email: values?.email,
        phone_number: values?.phone_number,
        wakif_city: values?.wakif_city,
        wakif_province: values?.wakif_province,
        wakif_type: values?.wakif_type || null,
        wakif_type_id: values?.wakif_type_id || null,
        wakif_type_has_corp_unit: values?.wakif_type_has_corp_unit,
        has_wakif_types: values?.has_wakif_types,

        program_id: values?.program_id || null,
        program_name: values?.program_name || null,

        corp_unit_lvl1_id: values?.corp_unit_lvl1_id || null,
        corp_unit_lvl1_name: values?.corp_unit_lvl1_name || null,
        corp_unit_lvl1_code: values?.corp_unit_lvl1_code || null,
        corp_unit_lvl1_has_child: values?.corp_unit_lvl1_has_child || false,

        corp_unit_lvl2_id: values?.corp_unit_lvl2_id || null,
        corp_unit_lvl2_name: values?.corp_unit_lvl2_name || null,
        corp_unit_lvl2_has_child: values?.corp_unit_lvl2_has_child || false,

        corp_unit_lvl3_id: values?.corp_unit_lvl3_id || null,
        corp_unit_lvl3_name: values?.corp_unit_lvl3_name || null,

        corp_unit_profession: values?.corp_unit_profession || null,
        corp_unit_province_code: values?.corp_unit_province_code || null,
        corp_unit_city_code: values?.corp_unit_city_code || null,
        corp_unit_district_code: values?.corp_unit_district_code || null,

        ...(values?.corp_unit_lvl1_code == "Mdp" && {
          corp_unit_lvl3_name: values?.corp_unit_lvl3_id,
          corp_unit_lvl3_id: null, // jadikan null permintaan BE
        }),
      };

      updateDonationAnonymous(payload);

      if (campaign?.rakornas_kemenag === 1 && (showInputCorpsDefault || form.watch("wakif_type_has_corp_unit"))) {
        if (!form.watch("corp_unit_lvl1_id")) {
          form.setError("corp_unit_lvl1_id", { message: `${corpLevel1Nomenclature} wajib diisi` });
          return;
        }
      }

      if (form.watch("wakif_type_has_corp_unit") && !form.watch("corp_unit_lvl1_id")) {
        form.setError("corp_unit_lvl1_id", { message: `${corpLevel1Nomenclature} wajib diisi` });
        return;
      }

      if (form.watch("corp_unit_lvl1_has_child") && !form.watch("corp_unit_lvl2_id")) {
        form.setError("corp_unit_lvl2_id", { message: `${corpLevel2Nomenclature} wajib diisi` });
        return;
      }

      if (form.watch("corp_unit_lvl2_has_child") && !form.watch("corp_unit_lvl3_id")) {
        form.setError("corp_unit_lvl3_id", { message: `${corpLevel3Nomenclature} wajib diisi` });
        return;
      }

      if (
        PROFESI_REQUIRED?.includes(form.watch("corp_unit_lvl1_code")?.toLowerCase() || "") &&
        !form.watch("corp_unit_profession")
      ) {
        form.setError("corp_unit_profession", { message: `Profesi wajib diisi` });
        return;
      }

      if (form.watch("corp_unit_lvl1_code")?.toLowerCase() == "kw") {
        if (!form.watch("corp_unit_province_code")) {
          form.setError("corp_unit_province_code", { message: `Provinsi wajib diisi` });
          return;
        }

        if (!form.watch("corp_unit_city_code")) {
          form.setError("corp_unit_city_code", { message: `Kota wajib diisi` });
          return;
        }

        if (!form.watch("corp_unit_district_code")) {
          form.setError("corp_unit_district_code", { message: `Kecamatan wajib diisi` });
          return;
        }
      }

      if (form.watch("corp_unit_lvl1_code")?.toLowerCase() == "mdp" && !form.watch("corp_unit_lvl3_id")) {
        form.setError("corp_unit_lvl3_id", { message: `Madrasah/Pontren wajib diisi` });
        return;
      }

      if (Number.isNaN(donationAnonymous?.amount) || Number(donationAnonymous?.amount) < MINIMUM_NOMINAL) {
        setErrorMinWakaf(true);
        notifyError(`Nominal wakaf minimal Rp ${MINIMUM_NOMINAL}`);
        return;
      }

      if (!donationAnonymous?.payment_method_id) {
        notifyError("Pilih metode pembayaran terlebih dahulu");
        setErrorPaymentMethod(true);
        return;
      }

      if (campaign?.sub_campaigns?.length && !form.watch("program_id")) {
        form.setError("program_id", { message: `Program belum dipilih` });
        notifyError("Program Belum Dipilih");
        return;
      }

      setOpenIkrar(true);
    } catch (error) {
      console.error(error);
      notifyError("Terjadi kesalahan saat lanjut pembayaran");
    }
  };

  const handleDonate = async () => {
    try {
      setLoading(true);

      const payload = {
        campaign_id: campaign?.id,
        amount: donationAnonymous?.amount,
        maintenance_fee: donationAnonymous?.maintenance_fee,
        payment_method_id: paymentType?.justQris
          ? "c7d3a66e-e9ca-4c7f-a020-ad75da1472b7"
          : donationAnonymous?.payment_method_id || "",
        is_anonymous: form.getValues("is_anonymous"),
        willing_to_contact_by_lembaga: form.getValues("willing_to_contact_by_lembaga"),
        donor_name: form.getValues("donor_name"),
        email: form.getValues("email"),
        phone_number: phoneNumberFormater(form.getValues("phone_number")),

        wakif_name: form.getValues("wakif_name"),
        wakif_phone: phoneNumberFormater(form.getValues("wakif_phone")),

        wakif_address: form.getValues("wakif_address") || null,
        // wakif_district: form.getValues("wakif_district") || null,
        wakif_city: form.getValues("wakif_city") || null,
        wakif_province: form.getValues("wakif_province") || null,
        wakif_type: form.getValues("wakif_type") || null,
        wakif_type_id: form.getValues("wakif_type_id") || null,

        program_id: form.getValues("program_id") || null,
        program_name: form.getValues("program_name") || null,

        corp_unit_lvl1_id: form.getValues("corp_unit_lvl1_id") || null,
        corp_unit_lvl1_name: form.getValues("corp_unit_lvl1_name") || null,
        corp_unit_lvl1_code: form.getValues("corp_unit_lvl1_code") || null,
        corp_unit_lvl2_id: form.getValues("corp_unit_lvl2_id") || null,
        corp_unit_lvl2_name: form.getValues("corp_unit_lvl2_name") || null,
        corp_unit_lvl3_id: form.getValues("corp_unit_lvl3_id") || null,
        corp_unit_lvl3_name: form.getValues("corp_unit_lvl3_name") || null,
        corp_unit_profession: form.getValues("corp_unit_profession") || null,
        corp_unit_province_code: form.getValues("corp_unit_province_code") || null,
        corp_unit_city_code: form.getValues("corp_unit_city_code") || null,
        corp_unit_district_code: form.getValues("corp_unit_district_code") || null,

        ...(form.getValues("corp_unit_lvl1_code") == "Mdp" && {
          corp_unit_lvl3_name: form.getValues("corp_unit_lvl3_id"),
          corp_unit_lvl3_id: null,
        }),

        subdomain: domainHost?.split(".")?.[0],
      };

      let endpoint = "";

      if (donationAnonymous?.paymentMethod?.to_corporate == 1) {
        endpoint = env.NEXT_PUBLIC_BASE_URL2 + `/donations/apps`;
      } else {
        endpoint = env.NEXT_PUBLIC_BASE_URL + `/donations/non-login`;
      }

      await axios
        .post(endpoint, payload)
        .then((response) => {
          const { id, payment } = response?.data?.data?.[0];

          setTimeout(() => {
            if (payment?.name === "QRIS") {
              router.push(`/fesyar/campaign/${params.campaign_id}/anonymous/${id}?type=qris`);
            } else {
              router.push(`/fesyar/campaign/${params.campaign_id}/anonymous/${id}?type=va`);
            }
          }, 800);
          setLoading(false);
          setOpenIkrar(false);
        })
        .catch((error) => {
          const errorMessage = error?.response?.data?.error;
          setLoading(false);
          notifyError("Gagal membuat wakaf " + errorMessage.id);
        });
    } catch (error) {
      console.error(error);
      notifyError("Terjadi kesalahan");
    } finally {
      setOpenIkrar(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (campaign?.id && paymentType?.justQris) {
      updateDonationAnonymous({ payment_method_id: "c7d3a66e-e9ca-4c7f-a020-ad75da1472b7" });
    }

    form.trigger("wakif_address");
    form.trigger("wakif_province");
    form.trigger("wakif_city");
    // form.trigger("wakif_district");
    form.trigger("wakif_type");

    form.trigger("corp_unit_profession");
  }, [campaign]);

  useEffect(() => {
    setGeolocations((prev) => ({
      ...prev,
      provinces: provinsi
        ?.map((item: any) => ({
          ...item,
          value: item?.code,
          label: item?.name,
        }))
        ?.filter((item: any) => item?.code !== "00"),
    }));
  }, [provinsi]);

  useEffect(() => {
    setGeolocations((prev) => ({
      ...prev,
      cities: kota?.map((item: any) => ({
        ...item,
        value: item?.code,
        label: item?.name,
      })),
    }));
  }, [kota, form.watch("wakif_province")]);

  useEffect(() => {
    setGeolocations((prev) => ({
      ...prev,
      corp_unit_provinces: corp_unit_provinces
        ?.map((item: any) => ({
          ...item,
          value: item?.code,
          label: item?.name,
        }))
        ?.filter((item: any) => item?.code !== "00"),
    }));
  }, [corp_unit_provinces]);

  useEffect(() => {
    setGeolocations((prev) => ({
      ...prev,
      corp_unit_cities: corp_unit_cities?.map((item: any) => ({
        ...item,
        value: item?.code,
        label: item?.name,
      })),
    }));
  }, [corp_unit_cities]);

  useEffect(() => {
    setGeolocations((prev) => ({
      ...prev,
      corp_unit_districts: corp_unit_districts?.map((item: any) => ({
        ...item,
        value: item?.code,
        label: item?.name,
      })),
    }));
  }, [corp_unit_districts]);

  return (
    <LayoutFesyar footer="detail-page">
      <section className="py-8 w-full mt-14 relative z-10 space-y-3 max-w-7xl mx-auto">
        <button
          type="button"
          className="flex items-center gap-2"
          onClick={() => router.push(`/fesyar/campaign/${params?.campaign_id}/detail/about`)}
        >
          <ArrowLeftIcon className="w-6 text-white" />
          <Label className="font-bold text-2xl text-white">Tunaikan {textTypeCampaign}</Label>
        </button>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-12 gap-4">
              <div
                className="col-span-full md:col-span-7 rounded-2xl p-4 border-gray-50 border-2 backdrop-blur-[7.5px]"
                style={{
                  background: "linear-gradient(119deg, rgba(255, 255, 255, 0.20) 2.36%, rgba(78, 78, 78, 0.15) 97.64%)",
                }}
              >
                {/* JUDUL CAMPAIGN */}
                {isLoading ? (
                  <div className="p-5">
                    <Skeleton className="w-4/6 h-7 rounded-md mb-2" />
                    <Skeleton className="w-3/6 h-7 rounded-md" />
                  </div>
                ) : (
                  <section className="px-5 pt-2 pb-3">
                    <span className="text-xs text-white">{`Anda akan ber${textTypeCampaign} ke program`}</span>
                    <GradientText className="text-2xl font-bold">{campaign?.title}</GradientText>
                  </section>
                )}

                {/* NOMINAL */}
                {isLoading ? (
                  <div className="px-5 py-2">
                    <Skeleton className="w-full h-20 rounded-md" />
                  </div>
                ) : (
                  <section className="px-5">
                    <div
                      className={cn(
                        "border rounded-lg py-2 px-5 bg-gray-50/20",
                        errorMinWakaf ? "border-danger-500" : ""
                      )}
                    >
                      <span className="text-sm font-normal text-white">Nominal {textTypeCampaign}</span>
                      <div className="relative w-full">
                        <CurrencyInput
                          id="input-amount"
                          name="input-amout"
                          placeholder="0"
                          decimalsLimit={2}
                          defaultValue={donationAnonymous?.amount}
                          className={cn(
                            "w-full p-2 focus:ring-0 focus:outline-none font-bold text-xl focus-visible:ring-0 placeholder:text-lg px-9 bg-transparent text-white placeholder:text-gray-100"
                          )}
                          onValueChange={(value) => {
                            handleCurrencyInput(value!!);
                          }}
                          allowNegativeValue={false}
                        />
                        <Label className="absolute left-0 h-full flex flex-col items-center justify-center top-0 text-xl font-bold text-white">
                          Rp
                        </Label>
                      </div>
                      {errorMinWakaf ? (
                        <span className="text-xs text-danger-500">
                          Nominal {textTypeCampaign} minimal Rp {MINIMUM_NOMINAL}
                        </span>
                      ) : null}
                    </div>
                  </section>
                )}

                {/* INFAQ PEMELIHARAAN */}
                {isLoading ? (
                  <div className="px-5 py-2">
                    <Skeleton className="w-full h-20 rounded-md" />
                  </div>
                ) : (
                  <section className="px-5 mt-2">
                    <div
                      className={cn(
                        "border rounded-lg py-2 px-5 bg-gray-50/20",
                        errorMinInfaq ? "border-danger-500" : ""
                      )}
                    >
                      <span className="text-sm font-normal text-white">Infaq Pemeliharaan</span>
                      <div className="relative w-full">
                        <CurrencyInput
                          id="maintenance_fee"
                          name="maintenance_fee"
                          value={donationAnonymous?.maintenance_fee?.toFixed()}
                          placeholder="0"
                          decimalsLimit={2}
                          className={cn(
                            "w-full p-2 focus:ring-0 focus:outline-none font-bold text-xl focus-visible:ring-0 placeholder:text-lg px-9 bg-transparent text-white placeholder:text-gray-100"
                          )}
                          onValueChange={(value) => {
                            handleMaintenanceFeeInput(value!!);
                          }}
                          allowNegativeValue={false}
                        />
                        <Label className="absolute left-0 h-full flex flex-col items-center justify-center top-0 text-xl font-bold text-white">
                          Rp
                        </Label>
                      </div>

                      {errorMinInfaq ? (
                        <span className="text-xs text-danger-500">Nominal Infaq Pemeliharaan minimal Rp 0</span>
                      ) : null}
                    </div>
                    <span className="text-xs italic text-white">
                      *Jika Anda tidak bersedia Infaq, silahkan untuk mengisi angka 0
                    </span>
                  </section>
                )}

                {/* FORM DONATION */}
                {isLoading ? (
                  <div className="px-5 py-2 space-y-2">
                    <Skeleton className="w-3/6 h-7 rounded-md" />
                    <Skeleton className="w-full h-10 rounded-md" />
                    <Skeleton className="w-full h-10 rounded-md" />
                    <Skeleton className="w-full h-10 rounded-md" />

                    <Separator />

                    <Skeleton className="w-3/6 h-7 rounded-md" />
                    <Skeleton className="w-full h-10 rounded-md" />
                    <Skeleton className="w-full h-10 rounded-md" />
                    <Skeleton className="w-full h-10 rounded-md" />

                    <Separator />

                    <Skeleton className="w-3/6 h-7 rounded-md" />
                    <Skeleton className="w-full h-10 rounded-md" />
                    <Skeleton className="w-full h-10 rounded-md" />
                    <Skeleton className="w-full h-10 rounded-md" />
                  </div>
                ) : (
                  <div className="px-5 mt-4 space-y-4">
                    {/* SUB CAMPAIGN / PROGRAM */}
                    {campaign?.sub_campaigns?.length ? (
                      <div className="space-y-2">
                        <h1 className="text-sm font-semibold text-white">Pilih Program</h1>

                        <FormField
                          control={form.control}
                          name="program_id"
                          render={({ field, fieldState }) => (
                            <FormItem>
                              <FormControl>
                                <ReactSelectFesyar
                                  className="text-xs !bg-gray-50/20"
                                  placeholder="Pilih Program"
                                  name="program_id"
                                  options={campaign?.sub_campaigns?.map((program: any) => ({
                                    ...program,
                                    value: program?.id,
                                    label: program?.title,
                                  }))}
                                  onChange={(value) => {
                                    field.onChange(value?.value);
                                    form.setValue("program_name", value?.label);
                                  }}
                                  maxMenuHeight={150}
                                  fieldState={fieldState}
                                  value={
                                    campaign?.sub_campaigns
                                      ?.map((program: any) => ({
                                        ...program,
                                        value: program?.id,
                                        label: program?.title,
                                      }))
                                      ?.find((item: any) => item?.value == form.watch("program_id")) || null
                                  }
                                  isDisabled={isLoading}
                                />
                              </FormControl>
                              <FormMessage className="!text-red-600 !text-xs font-medium tracking-wider" />
                            </FormItem>
                          )}
                        />
                      </div>
                    ) : null}

                    <Separator />

                    {/* PEMBAYAR */}
                    <div>
                      <h1 className="text- font-semibold text-white my-3">Pembayar</h1>
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="donor_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">
                                Nama<span className="text-sx text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  value={field.value}
                                  placeholder="Masukkan Nama Anda"
                                  disabled={isSubmitting}
                                  className="bg-gray-50/20 text-white font-medium placeholder:text-gray-100"
                                />
                              </FormControl>
                              <FormMessage className="!text-red-600 !text-xs font-medium tracking-wider" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="phone_number"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">
                                No Telepon<span className="text-sx text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="number"
                                  placeholder="Masukkan No Telepon Anda"
                                  disabled={isSubmitting}
                                  className="bg-gray-50/20 text-white font-medium placeholder:text-gray-100"
                                />
                              </FormControl>
                              <FormMessage className="!text-red-600 !text-xs font-medium tracking-wider" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">
                                Email<span className="text-sx text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="Masukkan Email Anda"
                                  disabled={isSubmitting}
                                  className="bg-gray-50/20 text-white font-medium placeholder:text-gray-100"
                                />
                              </FormControl>
                              <FormMessage className="!text-red-600 !text-xs font-medium tracking-wider" />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <Separator />
                    {/* WAKIF */}
                    <div>
                      <h1 className="text-sm font-semibold text-white my-3">{personCampaignLabel}</h1>
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="wakif_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">
                                Nama<span className="text-sx text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder={`Masukkan Nama ${personCampaignLabel}`}
                                  disabled={isSubmitting}
                                  className="bg-gray-50/20 text-white font-medium placeholder:text-gray-100"
                                />
                              </FormControl>
                              <FormMessage className="!text-red-600 !text-xs font-medium tracking-wider" />
                            </FormItem>
                          )}
                        />
                        {/* IS ANONYMOUS WAKIF NAME */}
                        <FormField
                          control={form.control}
                          name="is_anonymous"
                          render={({ field }) => (
                            <FormItem className="flex items-center w-full">
                              <Switch
                                checked={field.value}
                                onCheckedChange={(checked) => {
                                  const value = !!checked;
                                  field.onChange(value);
                                }}
                              />
                              <FormLabel className="text-xs text-gray-200 italic">
                                Sembunyikan nama saya dari publikasi (Daftar{" "}
                                {personByCampaignType[campaign?.type as CampaignTypeKeys]})
                              </FormLabel>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="wakif_phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">
                                No Telepon<span className="text-sx text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="number"
                                  placeholder={`Masukkan No Telepon ${personCampaignLabel}`}
                                  disabled={isSubmitting}
                                  className="bg-gray-50/20 text-white font-medium placeholder:text-gray-100"
                                />
                              </FormControl>
                              <FormMessage className="!text-red-600 !text-xs font-medium tracking-wider" />
                            </FormItem>
                          )}
                        />

                        {/* HAS WAKIF TYPES ON CAMPAIGN */}
                        {campaign?.wakif_types?.length ? (
                          <FormField
                            control={form.control}
                            name="wakif_type"
                            render={({ field, fieldState }) => (
                              <FormItem>
                                <FormLabel className="text-white">Tipe Wakif</FormLabel>
                                <FormControl>
                                  <ReactSelectFesyar
                                    name="type"
                                    maxMenuHeight={150}
                                    className="text-xs"
                                    options={campaign?.wakif_types?.map((item: any) => ({
                                      ...item,
                                      value: item?.name,
                                      label: item?.name,
                                    }))}
                                    placeholder="Pilih Tipe Wakif"
                                    onChange={(value) => {
                                      field.onChange(value?.value);
                                      // form.setValue("corp_unit_profession", value?.value);
                                      form.setValue("wakif_type_id", value?.id);
                                      form.setValue("wakif_type_has_corp_unit", value?.has_corp_unit == 1);

                                      // RESET VALUE
                                      form.setValue("corp_unit_lvl1_id", "");
                                      form.setValue("corp_unit_lvl1_code", "");
                                      form.setValue("corp_unit_lvl1_name", "");
                                      form.setValue("corp_unit_lvl1_has_child", false);

                                      form.setValue("corp_unit_lvl2_id", "");
                                      form.setValue("corp_unit_lvl2_name", "");
                                      form.setValue("corp_unit_lvl2_has_child", false);

                                      form.setValue("corp_unit_lvl3_id", "");
                                      form.setValue("corp_unit_lvl3_name", "");

                                      // TRIGGER
                                      form.trigger("corp_unit_lvl1_id");
                                      form.trigger("corp_unit_lvl1_code");
                                      form.trigger("corp_unit_lvl1_name");

                                      form.trigger("wakif_province");
                                      form.trigger("wakif_city");

                                      form.trigger("wakif_type");
                                    }}
                                    fieldState={fieldState}
                                    value={campaign?.wakif_types
                                      ?.map((item: any) => ({
                                        value: item?.name,
                                        label: item?.name,
                                      }))
                                      ?.find((item: any) => item?.value == form.watch("wakif_type"))}
                                  />
                                </FormControl>
                                <FormMessage className="!text-red-600 !text-xs font-medium tracking-wider" />
                              </FormItem>
                            )}
                          />
                        ) : null}

                        <Separator />

                        <div className="flex flex-col gap-2 rounded z-10">
                          {campaign?.is_permanent == 0 && (
                            <FormField
                              control={form.control}
                              name="wakif_address"
                              render={({ field }) => (
                                <FormItem>
                                  <div>
                                    <FormLabel className="text-white">
                                      Alamat Lengkap{" "}
                                      {isCampaignWakaf && <span className="text-sx text-red-500">*</span>}
                                    </FormLabel>

                                    {isCampaignWakaf && (
                                      <span className="text-xs italic text-gray-50 block">
                                        Alamat {personCampaignLabel} wajib diisi sesuai ketentuan perundang-undangan.
                                      </span>
                                    )}
                                  </div>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      onChange={(event) => {
                                        field.onChange(event);
                                        form.trigger("wakif_address");
                                      }}
                                      placeholder={`Masukkan Alamat ${personCampaignLabel}`}
                                      disabled={isSubmitting}
                                      className="bg-gray-50/20 text-white font-medium placeholder:text-gray-100"
                                    />
                                  </FormControl>

                                  <FormMessage className="!text-red-600 !text-xs font-medium tracking-wider" />
                                </FormItem>
                              )}
                            />
                          )}
                          <FormField
                            control={form.control}
                            name="wakif_province"
                            render={({ field, fieldState }) => (
                              <FormItem>
                                <FormControl>
                                  <ReactSelectFesyar
                                    name="type"
                                    className="text-xs"
                                    placeholder="Pilih Provinsi"
                                    onChange={(value) => {
                                      field.onChange(value?.value);
                                      form.trigger("wakif_province");

                                      form.setValue("corp_unit_lvl1_id", "");
                                      form.setValue("corp_unit_lvl1_code", "");
                                      form.setValue("corp_unit_lvl1_name", "");

                                      form.setValue("wakif_city", "");
                                      // form.setValue("wakif_district", "");

                                      form.trigger("wakif_city");
                                      form.trigger("corp_unit_lvl1_id");
                                    }}
                                    options={geolocations?.provinces}
                                    fieldState={fieldState}
                                    maxMenuHeight={150}
                                    value={
                                      geolocations?.provinces?.find(
                                        (item: any) => item?.value == form.watch("wakif_province")
                                      ) || null
                                    }
                                    isDisabled={isLoadingProvince}
                                  />
                                </FormControl>
                                <FormMessage className="!text-red-600 !text-xs font-medium tracking-wider" />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="wakif_city"
                            render={({ field, fieldState }) => (
                              <FormItem>
                                <FormControl>
                                  <ReactSelectFesyar
                                    name="type"
                                    className="text-xs"
                                    placeholder="Pilih Kab/Kota"
                                    onChange={(value) => {
                                      field.onChange(value?.value);

                                      form.setValue("corp_unit_lvl1_id", "");
                                      form.setValue("corp_unit_lvl1_code", "");
                                      form.setValue("corp_unit_lvl1_name", "");

                                      form.trigger("wakif_city");
                                      form.trigger("corp_unit_lvl1_id");
                                    }}
                                    options={geolocations?.cities}
                                    fieldState={fieldState}
                                    isDisabled={!form.watch("wakif_province") || isLoadingCity}
                                    maxMenuHeight={150}
                                    value={
                                      geolocations?.cities?.find(
                                        (item: any) => item?.value == form.watch("wakif_city")
                                      ) || null
                                    }
                                    isLoading={isLoadingCity && !!form.watch("wakif_province")}
                                  />
                                </FormControl>

                                <FormMessage className="!text-red-600 !text-xs font-medium tracking-wider" />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>

                    {/* INFORMASI INSTITUSI */}
                    {campaign?.rakornas_kemenag === 1 &&
                    (showInputCorpsDefault || form.watch("wakif_type_has_corp_unit")) ? (
                      <Fragment>
                        <h1 className="text-sm font-semibold text-white my-3">Informasi Institusi </h1>

                        <div className="space-y-3 border rounded-xl p-3">
                          {/* CORP LEVEL 1 */}
                          <FormField
                            key={`${form.watch("wakif_type")} ${form.watch("wakif_province")} ${form.watch(
                              "wakif_city"
                            )}`}
                            control={form.control}
                            name="corp_unit_lvl1_id"
                            render={({ field, fieldState }) => (
                              <FormItem>
                                <FormControl>
                                  <AsyncSelect
                                    id="corp_unit_lvl1_id"
                                    cacheOptions
                                    name="corp_unit_lvl1_id"
                                    loadOptions={interceptLoadOptionsCorpUnitLevel1}
                                    defaultOptions
                                    placeholder={`Cari ${corpLevel1Nomenclature}`}
                                    onChange={(val: any) => {
                                      // SET VALUE
                                      field.onChange(val?.value);

                                      form.setValue("corp_unit_lvl1_code", val.code);
                                      form.setValue("corp_unit_lvl1_name", val.name);
                                      form.setValue("corp_unit_lvl1_has_child", val?.has_child == 1);
                                      // HAS & SET PROFESSIONS
                                      setListProfession(
                                        val?.professions?.length
                                          ? val?.professions?.map((item: any) => ({
                                              ...item,
                                              value: item?.name,
                                              label: item?.name,
                                            }))
                                          : []
                                      );

                                      if (val) {
                                        // HAS NATIONAL
                                        if (val?.has_national == 1)
                                          form.setValue("corp_has_national", val?.has_national == 1);

                                        // SET CORP GEO
                                        if (val?.province_code)
                                          form.setValue("corp_unit_province_code", val?.province_code);
                                        if (val?.city_code) form.setValue("corp_unit_city_code", val?.city_code);
                                        if (val?.district_code)
                                          form.setValue("corp_unit_district_code", val?.district_code);
                                      }

                                      // RESET INPUT DEPENDECIES
                                      form.setValue("corp_unit_lvl2_id", "");
                                      form.setValue("corp_unit_lvl2_name", "");
                                      form.setValue("corp_unit_lvl2_has_child", false);

                                      form.setValue("corp_unit_lvl3_id", "");
                                      form.setValue("corp_unit_lvl3_name", "");

                                      form.setValue("corp_unit_profession", "");

                                      // TRIGGER INPUT DEPENDENCIES
                                      form.trigger("corp_unit_lvl1_id");
                                      form.trigger("corp_unit_lvl2_id");
                                      form.trigger("corp_unit_lvl3_id");
                                      form.trigger("corp_unit_province_code");
                                      form.trigger("corp_unit_city_code");
                                      form.trigger("corp_unit_district_code");
                                      form.trigger("corp_unit_profession");
                                    }}
                                    className="w-full text-xs font-light !text-black capitalize placeholder:text-xs"
                                    isDisabled={isLoading || !form.watch("wakif_city")}
                                    maxMenuHeight={150}
                                    value={
                                      form.watch("corp_unit_lvl1_id")
                                        ? {
                                            value: form.watch("corp_unit_lvl1_id"),
                                            label: form.watch("corp_unit_lvl1_name"),
                                          }
                                        : null
                                    }
                                    noOptionsMessage={({ inputValue }) =>
                                      !inputValue
                                        ? `Ketikan ${corpLevel1Nomenclature}`
                                        : `${corpLevel1Nomenclature} tidak ditemukan`
                                    }
                                    styles={{
                                      control: (base) => ({
                                        ...base,
                                        borderWidth: 1,
                                        borderColor: fieldState?.error ? "#dc2626" : "#e5e7eb",
                                        borderRadius: 8,
                                      }),
                                      menu: (provided) => ({ ...provided, zIndex: 999 }),
                                    }}
                                  />
                                </FormControl>
                                <FormMessage>
                                  {fieldState.error?.message === "Required"
                                    ? `${corpLevel1Nomenclature} wajib diisi` // 👈 custom text
                                    : fieldState.error?.message}
                                </FormMessage>
                              </FormItem>
                            )}
                          />

                          {/* CORP LEVEL 2 */}
                          {form.watch("corp_unit_lvl1_has_child") ? (
                            <FormField
                              key={`${form.watch("corp_unit_lvl1_id")}`}
                              control={form.control}
                              name="corp_unit_lvl2_id"
                              render={({ field, fieldState }) => (
                                <FormItem>
                                  <FormControl>
                                    <AsyncSelect
                                      id="corp_unit_lvl2_id"
                                      cacheOptions
                                      name="corp_unit_lvl2_id"
                                      loadOptions={interceptLoadOptionsCorpUnitLevel2}
                                      defaultOptions
                                      placeholder={`Cari ${corpLevel2Nomenclature}`}
                                      onChange={(val: any) => {
                                        // SET VALUE
                                        field.onChange(val?.value);
                                        form.setValue("corp_unit_lvl2_name", val.name);
                                        form.setValue("corp_unit_lvl2_has_child", val?.has_child == 1);

                                        if (val) {
                                          // HAS NATIONAL
                                          if (val?.has_national == 1)
                                            form.setValue("corp_has_national", val?.has_national == 1);

                                          // SET CORP GEO
                                          if (val?.province_code)
                                            form.setValue("corp_unit_province_code", val?.province_code);
                                          if (val?.city_code) form.setValue("corp_unit_city_code", val?.city_code);
                                          if (val?.district_code)
                                            form.setValue("corp_unit_district_code", val?.district_code);
                                        }

                                        // RESET INPUT DEPENDECIES
                                        form.setValue("corp_unit_lvl3_id", "");
                                        form.setValue("corp_unit_lvl3_name", "");

                                        // TRIGGER INPUT DEPENDENCIES
                                        form.trigger("corp_unit_lvl2_id");
                                        form.trigger("corp_unit_lvl3_id");
                                      }}
                                      className="w-full text-xs font-light !text-black capitalize placeholder:text-xs"
                                      isDisabled={isLoading || !form.watch("wakif_city")}
                                      maxMenuHeight={150}
                                      value={
                                        form.watch("corp_unit_lvl2_id")
                                          ? {
                                              value: form.watch("corp_unit_lvl2_id"),
                                              label: form.watch("corp_unit_lvl2_name"),
                                            }
                                          : null
                                      }
                                      noOptionsMessage={({ inputValue }) =>
                                        !inputValue
                                          ? `Ketikan ${corpLevel2Nomenclature}`
                                          : `${corpLevel2Nomenclature} tidak ditemukan`
                                      }
                                      styles={{
                                        control: (base) => ({
                                          ...base,
                                          borderWidth: 1,
                                          borderColor: fieldState?.error ? "#dc2626" : "#e5e7eb",
                                          borderRadius: 8,
                                        }),
                                        menu: (provided) => ({ ...provided, zIndex: 999 }),
                                      }}
                                    />
                                  </FormControl>
                                  <FormMessage className="!text-red-600 !text-xs font-medium tracking-wider" />
                                </FormItem>
                              )}
                            />
                          ) : null}

                          {/* CORP LEVEL 3 */}
                          {form.watch("corp_unit_lvl1_code") == "Mdp" ? (
                            <FormField
                              control={form.control}
                              name="corp_unit_lvl3_id"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      placeholder={"Masukkan Nama Madrasah/Pontren"}
                                      {...field}
                                      value={form.watch("corp_unit_lvl3_id") || form.watch("corp_unit_lvl3_name")}
                                      className="px-3"
                                    />
                                  </FormControl>
                                  <FormMessage className="!text-red-600 !text-xs font-medium tracking-wider" />
                                </FormItem>
                              )}
                            />
                          ) : form.watch("corp_unit_lvl2_has_child") ? (
                            <FormField
                              key={`${form.watch("corp_unit_lvl2_id")}`}
                              control={form.control}
                              name="corp_unit_lvl3_id"
                              render={({ field, fieldState }) => (
                                <FormItem>
                                  <FormControl>
                                    <AsyncSelect
                                      id="corp_unit_lvl3_id"
                                      cacheOptions
                                      name="corp_unit_lvl3_id"
                                      loadOptions={interceptLoadOptionsCorpUnitLevel3}
                                      defaultOptions
                                      placeholder={`Cari ${corpLevel3Nomenclature}`}
                                      onChange={(val: any) => {
                                        // SET VALUE
                                        field.onChange(val?.value);
                                        form.setValue("corp_unit_lvl3_name", val.name);

                                        if (val) {
                                          // HAS NATIONAL
                                          if (val?.has_national == 1)
                                            form.setValue("corp_has_national", val?.has_national == 1);

                                          // SET CORP GEO
                                          if (val?.province_code)
                                            form.setValue("corp_unit_province_code", val?.province_code);
                                          if (val?.city_code) form.setValue("corp_unit_city_code", val?.city_code);
                                          if (val?.district_code)
                                            form.setValue("corp_unit_district_code", val?.district_code);
                                        }

                                        // TRIGGER INPUT DEPENDENCIES
                                        form.trigger("corp_unit_lvl3_id");
                                      }}
                                      className="w-full text-xs font-light !text-black capitalize placeholder:text-xs"
                                      isDisabled={isLoading || !form.watch("wakif_city")}
                                      maxMenuHeight={150}
                                      value={
                                        form.watch("corp_unit_lvl3_id")
                                          ? {
                                              value: form.watch("corp_unit_lvl3_id"),
                                              label: form.watch("corp_unit_lvl3_name"),
                                            }
                                          : null
                                      }
                                      noOptionsMessage={({ inputValue }) =>
                                        !inputValue
                                          ? `Ketikan ${corpLevel3Nomenclature}`
                                          : `${corpLevel3Nomenclature} tidak ditemukan`
                                      }
                                      styles={{
                                        control: (base) => ({
                                          ...base,
                                          borderWidth: 1,
                                          borderColor: fieldState?.error ? "#dc2626" : "#e5e7eb",
                                          borderRadius: 8,
                                        }),
                                        menu: (provided) => ({ ...provided, zIndex: 999 }),
                                      }}
                                    />
                                  </FormControl>
                                  <FormMessage className="!text-red-600 !text-xs font-medium tracking-wider" />
                                </FormItem>
                              )}
                            />
                          ) : null}

                          {/* PROFESSION  */}
                          {listProfession?.length ? (
                            <FormField
                              control={form.control}
                              name="corp_unit_profession"
                              render={({ field, fieldState }) => (
                                <FormItem>
                                  <FormLabel>Profesi</FormLabel>
                                  <FormControl>
                                    <ReactSelectFesyar
                                      name="corp_unit_profession"
                                      className="text-xs"
                                      options={listProfession}
                                      placeholder="Pilih Profesi"
                                      onChange={(value) => {
                                        field.onChange(value?.value);
                                      }}
                                      fieldState={fieldState}
                                      value={
                                        listProfession?.find(
                                          (item: any) => item?.value == form.watch("corp_unit_profession")
                                        ) || null
                                      }
                                    />
                                  </FormControl>
                                  <FormMessage className="!text-red-600 !text-xs font-medium tracking-wider" />
                                </FormItem>
                              )}
                            />
                          ) : null}
                        </div>
                      </Fragment>
                    ) : null}

                    {/* WILAYAH KERJA */}
                    {form.watch("corp_has_national") ? (
                      <Fragment>
                        <h1 className="text-sm font-semibold text-white my-3">Wilayah Kerja</h1>

                        <div className="space-y-3 border rounded-xl p-3">
                          <FormField
                            control={form.control}
                            name="corp_unit_province_code"
                            render={({ field, fieldState }) => (
                              <FormItem>
                                <FormControl>
                                  <ReactSelectFesyar
                                    name="corp_unit_province_code"
                                    className="text-xs"
                                    placeholder="Pilih Provinsi"
                                    onChange={(value) => {
                                      field.onChange(value?.value);

                                      // RESET VALUE
                                      form.setValue("corp_unit_city_code", "");
                                      form.setValue("corp_unit_district_code", "");

                                      // TRIGGER DEPENDENCIES
                                      form.trigger("corp_unit_city_code");
                                      form.trigger("corp_unit_district_code");
                                    }}
                                    options={geolocations?.corp_unit_provinces}
                                    fieldState={fieldState}
                                    maxMenuHeight={150}
                                    value={
                                      geolocations?.corp_unit_provinces?.find(
                                        (item: any) => item?.value == form.watch("corp_unit_province_code")
                                      ) || null
                                    }
                                    isDisabled={isLoadingUnitProvinces}
                                  />
                                </FormControl>
                                <FormMessage className="!text-red-600 !text-xs font-medium tracking-wider" />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="corp_unit_city_code"
                            render={({ field, fieldState }) => (
                              <FormItem>
                                <FormControl>
                                  <ReactSelectFesyar
                                    name="type"
                                    className="text-xs"
                                    placeholder="Pilih Kab/Kota"
                                    onChange={(value) => {
                                      field.onChange(value?.value);

                                      // RESET VALUE
                                      form.setValue("corp_unit_district_code", "");

                                      // TRIGGER DEPENDENCIES
                                      form.trigger("corp_unit_district_code");
                                    }}
                                    options={geolocations?.corp_unit_cities}
                                    fieldState={fieldState}
                                    isDisabled={!form.watch("corp_unit_province_code") || isLoadingUnitCities}
                                    maxMenuHeight={150}
                                    value={
                                      geolocations?.corp_unit_cities?.find(
                                        (item: any) => item?.value == form.watch("corp_unit_city_code")
                                      ) || null
                                    }
                                    isLoading={isLoadingUnitCities && !!form.watch("corp_unit_province_code")}
                                  />
                                </FormControl>

                                <FormMessage className="!text-red-600 !text-xs font-medium tracking-wider" />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="corp_unit_district_code"
                            render={({ field, fieldState }) => (
                              <FormItem>
                                <FormControl>
                                  <ReactSelectFesyar
                                    name="type"
                                    className="text-xs"
                                    placeholder="Pilih Kecamatan"
                                    onChange={(value) => {
                                      field.onChange(value?.value);

                                      // TRIGGER DEPENDENCIES
                                      form.trigger("corp_unit_district_code");
                                    }}
                                    options={geolocations?.corp_unit_districts}
                                    fieldState={fieldState}
                                    isDisabled={!form.watch("corp_unit_city_code") || isLoadingUnitDistricts}
                                    maxMenuHeight={150}
                                    value={
                                      geolocations?.corp_unit_districts?.find(
                                        (item: any) => item?.value == form.watch("corp_unit_district_code")
                                      ) || null
                                    }
                                    isLoading={isLoadingUnitDistricts && !!form.watch("corp_unit_city_code")}
                                  />
                                </FormControl>

                                <FormMessage className="!text-red-600 !text-xs font-medium tracking-wider" />
                              </FormItem>
                            )}
                          />
                        </div>
                      </Fragment>
                    ) : null}
                  </div>
                )}
              </div>

              <div className="col-span-full md:col-span-5 backdrop-blur-[7.5px] h-fit">
                <div
                  className="rounded-2xl py-4 px-5 border-gray-50 border-2 space-y-5"
                  style={{
                    background:
                      "linear-gradient(119deg, rgba(255, 255, 255, 0.20) 2.36%, rgba(78, 78, 78, 0.15) 97.64%)",
                  }}
                >
                  {isLoading ? (
                    <div>
                      <Skeleton className="w-4/6 h-7 rounded-md mb-2" />
                      <Skeleton className="w-3/6 h-7 rounded-md" />
                    </div>
                  ) : (
                    <div className="space-y-2 text-white">
                      <p className="text-xs capitalize">Total Bayar</p>
                      <GradientText className="text-2xl font-bold">
                        Rp.
                        {currencyFormater(totalDonation)}
                      </GradientText>
                    </div>
                  )}

                  <Separator />
                  <PaymentMethods selectPayment={(payment) => handleSelectPaymentMethod(payment)} />
                  <Separator />

                  {/* WILLING CONTRACT */}
                  {isLoading ? (
                    <div>
                      <Skeleton className="w-full h-14 rounded-lg" />
                    </div>
                  ) : (
                    <FormField
                      control={form.control}
                      name="willing_to_contact_by_lembaga"
                      render={({ field }) => (
                        <FormItem>
                          <div className="p-4 w-full inline-flex gap-3 rounded-md border-gray-50 border-2 items-start bg-gray-50/20">
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={(checked) => {
                                const value = !!checked;
                                field.onChange(value);
                              }}
                            />
                            <p className="text-xs text-white tracking-wide">
                              Dengan mengisi kotak ini, Anda setuju untuk dihubungi oleh lembaga yang ada di dalam
                              platform SATUWAKAF untuk tujuan promosi program.
                              <Link
                                href="/fesyar/privacy-policy"
                                className="underline ml-0.5"
                                onClick={() => updateStateBeforeAction()}
                              >
                                (Kebijakan Privasi)
                              </Link>
                            </p>
                          </div>
                          <FormMessage className="!text-red-600 !text-xs font-medium tracking-wider" />
                        </FormItem>
                      )}
                    />
                  )}

                  {isLoading ? (
                    <div>
                      <Skeleton className="w-full h-10 rounded-lg" />
                    </div>
                  ) : (
                    <Button className="w-full bg-fesyar-gold text-fesyar-green-700 font-bold">
                      Lanjutkan Pembayaran <ChevronRight className="w-5" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </Form>

        <Dialog open={openIkrar} onOpenChange={setOpenIkrar}>
          <DialogContent className="bg-fesyar-green-500 border-none rounded-xl w-full overflow-hidden max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-center">
                <GradientText>Ikrar Wakaf</GradientText>
              </DialogTitle>
            </DialogHeader>
            <Image src={"/assets/fesyar/wastra.png"} fill alt="wastra" className="absolute top-0 left-0" />
            <Image src="/assets/fesyar/wastra.png" fill alt="wastra" className="absolute top-0 right-0 scale-x-[-1]" />

            <div className="flex flex-col items-center justify-center w-full mb-5 gap-2 relative z-20">
              <img src="/assets/bismillah.svg" width={250} height={100} alt="decoration" className="invert" />
              <p className="text-sm text-gray-50 text-center font-medium">
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
                onCheckedChange={(checked) => {
                  const value = !!checked;
                  setEula(value);
                }}
              />
              <GradientText className="text-xs">Saya sudah membaca Ikrar {textTypeCampaign}</GradientText>
            </div>

            <Button
              type="button"
              className="bg-fesyar-gold text-fesyar-green-700 font-bold z-20"
              disabled={!eula}
              onClick={handleDonate}
            >
              Lanjutkan <ChevronRightIcon className="w-4" />
            </Button>
          </DialogContent>
        </Dialog>
      </section>

      {loading ? <ScreenLoaderFesyar /> : null}
      <Toaster position="bottom-center" />
    </LayoutFesyar>
  );
};

export default Page;
