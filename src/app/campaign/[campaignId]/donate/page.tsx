"use client";
import { Button } from "@/components/Button";
import { Checkbox } from "@/components/Checkbox";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/Form";
import { Header } from "@/components/Header";
import { Label } from "@/components/Label";
import { ScreenLoader } from "@/components/Loader";
import { RadioGroup, RadioGroupItem } from "@/components/Radio";
import ReactSelect2 from "@/components/Select/react-select";
import { Skeleton } from "@/components/Skeleton";
import { Switch } from "@/components/Switch";
import { notifyError } from "@/components/Toaster";
import IkrarDialog from "@/components/dialog/ikrar-dialog";
import KemenagInfo from "@/components/kemenag-info";
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { BANK } from "@/constant/bank";
import { MINIMUM_NOMINAL, TIPE_WAKAF } from "@/constant/config";
import { PROFESI_REQUIRED } from "@/constant/pai";
import { TEMPORER_DUE_DATE } from "@/constant/temporer-due-date";
import { loadOptionsCorpUnitLevel1, loadOptionsCorpUnitLevel2, loadOptionsCorpUnitLevel3 } from "@/lib/async-select";
import { env } from "@/lib/env";
import { IUserToken } from "@/lib/session";
import { CampaignTypeKeys, TCampaignType, personByCampaignType } from "@/lib/typeCampaign";
import useSession from "@/lib/use-session";
import {
  addYearsToNow,
  calculateTotalTransactionAmountAndServiceFee,
  cn,
  phoneNumberFormater,
  toMoney,
} from "@/lib/utils";
import { useGetCampaignDetail } from "@/services/campaign/hooks";
import { useGetCityList, useGetDistrictList, useGetProvinceList } from "@/services/location/hooks";
import { useFeatureFlag } from "@/store/feature-flag-context";
import { IDonationAnonymous, useDonationStore } from "@/store/useDonationStore";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { getCookie } from "cookies-next";
import jwt from "jsonwebtoken";
import { ChevronRight, Wallet2Icon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import CurrencyInput from "react-currency-input-field";
import { useForm } from "react-hook-form";
import { Toaster } from "react-hot-toast";
import AsyncSelect from "react-select/async";
import { z } from "zod";

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

/**
 * how to parsing data user from token
 * this is user value from token
 *
 * const token = getCookie("user_token");
 *
 * let user: Partial<userProps> = {};
 * if (token !== null) {
 *  user = jwt.decode(token!!) as Partial<userProps>;
 * }
 */

const FormSchema = z
  .object({
    donor_name: z.string().optional(),
    email: z.string().optional(),
    phone_number: z.string().optional(),
    willing_to_contact_by_lembaga: z.boolean().default(false),
    is_anonymous: z.boolean().default(false),
    campaign_type: z.coerce.number().optional(),
    is_permanent: z.coerce.number().optional(),
    campaign_is_permanent: z.coerce.string().optional().nullable(),
    corp_id: z.string().optional(),
    category_waqaf: z.coerce.number().optional(), // Jenis wakaf, Wakaf Melalui Uang | Wakaf Uang
    wakif_temporer_due_date: z.coerce.string().optional(),

    wakif_name: z.string({ required_error: "Nama wajib diisi" }).min(1, { message: "Nama wajib diisi" }),
    wakif_phone: z.string().optional(),

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

    wakif_identity: z.string().optional(),
    wakif_bank: z.string().optional(),
    wakif_bank_name: z.string().optional(),
    wakif_bank_account_no: z.string().optional(),
    wakif_bank_account_name: z.string().optional(),

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

    corp_has_national: z.boolean().optional(),
    corp_unit_profession: z.string().optional(),
    corp_unit_province_code: z.string().optional(),
    corp_unit_city_code: z.string().optional(),
    corp_unit_district_code: z.string().optional(),
    wakif_pray: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // TIPE WAKAF & TEMPORER REQUIRED FILL THIS FIELD
    if (data.campaign_type == 3) {
      // Mapping field ke pesan error spesifik
      const wakifFieldErrors: Record<string, string> = {
        wakif_name: "Nama wajib diisi",
        // wakif_phone: "Nomor telepon wajib diisi",
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

export default function Donate({ params }: { params: { campaignId: string } }) {
  const { currentDomain } = useFeatureFlag();
  const isAppsDomain = currentDomain?.split(".")?.[0] == "apps";
  const isCampaignBWIRequest = params?.campaignId == "d41c661c-3968-4c6d-93b3-87b1cf2e816e";
  const MIN_NOMINAL_UPDATE = isCampaignBWIRequest ? 1_000_000 : MINIMUM_NOMINAL;

  const token = getCookie("user_token");

  const { data: campaign, isLoading } = useGetCampaignDetail({ campaignId: params.campaignId });
  const router = useRouter();

  let user: Partial<IUserToken> = {};

  if (token !== null) {
    user = jwt.decode(token!!) as Partial<IUserToken>;
  }

  const { session } = useSession();
  const { donation, updateDonation } = useDonationStore();

  const [loading, setLoading] = useState(false);
  const [errorMinWakaf, setErrorMinWakaf] = useState(false);
  const [errorMinInfaq, setErrorMinInfaq] = useState(false);
  const [errorPaymentMethod, setErrorPaymentMethod] = useState(false);
  // const [maintenanceFeeInput, setMaintenanceFeeInput] = useState(false);
  const [openIkrar, setOpenIkrar] = useState(false);
  // LABELING DEPENDENCIES CORP
  const [corpLevel1Nomenclature, setCorpLevel1Nomenclature] = useState("");
  const [corpLevel2Nomenclature, setCorpLevel2Nomenclature] = useState("");
  const [corpLevel3Nomenclature, setCorpLevel3Nomenclature] = useState("");
  const [listProfession, setListProfession] = useState([]);
  const [campaignIsPermanent, setCampaignIsPermanent] = useState(0);

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
      is_permanent: campaign?.is_permanent == 0 ? 0 : 1,
      campaign_is_permanent:
        donation?.campaign_is_permanent != null
          ? donation?.campaign_is_permanent
          : campaign?.is_permanent == 0
            ? "0"
            : "1",
      has_wakif_types: donation?.has_wakif_types || !!campaign?.wakif_types?.length || false, // IF HAS WAKIF TYPES == TRUE
      wakif_type_has_corp_unit: donation?.wakif_type_has_corp_unit || false,
      category_waqaf: donation?.category_waqaf || campaign?.is_waqaf_money == 1 ? 1 : 0,
      wakif_temporer_due_date: donation?.wakif_temporer_due_date || "",

      campaign_type: campaign?.type,
      donor_name: session?.name || donation?.donor_name || "",
      wakif_name: session?.name || donation?.wakif_name || donation?.donor_name || "",
      wakif_address: donation?.wakif_address || "",
      wakif_phone: session?.phone_number || donation?.wakif_phone || donation?.phone_number || "",
      phone_number: session?.phone_number || donation?.phone_number || "",
      email: session?.email || donation?.email || "",
      wakif_province: donation?.wakif_province || "",
      wakif_city: donation?.wakif_city || "",
      // wakif_district: donationAnonymous?.wakif_district || "",
      wakif_type: donation?.wakif_type || "",
      wakif_type_id: donation?.wakif_type_id || "",
      willing_to_contact_by_lembaga: donation?.willing_to_contact_by_lembaga || false,
      is_anonymous: donation?.is_anonymous || false,

      wakif_identity: donation?.wakif_identity || "",
      wakif_bank: donation?.wakif_bank || "",
      wakif_bank_name: donation?.wakif_bank_name || "",
      wakif_bank_account_no: donation?.wakif_bank_account_no || "",
      wakif_bank_account_name: donation?.wakif_bank_account_name || "",

      program_id: donation?.program_id || "",
      program_name: donation?.program_name || "",

      // INSTITUSI
      corp_has_national: donation?.corp_has_national || false,
      corp_unit_province_code: donation?.corp_unit_province_code || "",
      corp_unit_city_code: donation?.corp_unit_city_code || "",
      corp_unit_district_code: donation?.corp_unit_district_code || "",

      corp_unit_lvl1_id: donation?.corp_unit_lvl1_id || "",
      corp_unit_lvl1_name: donation?.corp_unit_lvl1_name || "",
      corp_unit_lvl1_code: donation?.corp_unit_lvl1_code || "",
      corp_unit_lvl1_has_child: donation?.corp_unit_lvl1_has_child || false,

      corp_unit_lvl2_id: donation?.corp_unit_lvl2_id || "",
      corp_unit_lvl2_name: donation?.corp_unit_lvl2_name || "",
      corp_unit_lvl2_has_child: donation?.corp_unit_lvl2_has_child || false,

      corp_unit_lvl3_id: donation?.corp_unit_lvl3_id || "",
      corp_unit_lvl3_name: donation?.corp_unit_lvl3_name || "",
      corp_unit_profession: donation?.corp_unit_profession || "",
      wakif_pray: donation?.wakif_pray || "",
    },
    shouldFocusError: true,
  });

  const isSubmitting = form.formState.isSubmitting;
  const isCampaignWakaf = campaign?.type == 3;
  const isCampaignWafafMoney = campaign?.is_waqaf_money == 1 || campaign?.is_waqaf_thru_money == 1;
  const personCampaignLabel = personByCampaignType[campaign?.type as CampaignTypeKeys];
  const textTypeCampaign = TCampaignType[campaign?.type as CampaignTypeKeys];
  const showInputCorpsDefault = campaign?.wakif_types?.length
    ? !campaign?.wakif_types?.some((item: any) => item?.has_corp_unit == 1)
    : true;

  const paymentType = {
    justQris: campaign?.qris === 1 && campaign?.va === 0,
    justVA: campaign?.qris === 0 && campaign?.va === 1,
    qrisVA: campaign?.qris === 1 && campaign?.va === 1,
  };

  const { data: provinsi, isLoading: isLoadingProvince } = useGetProvinceList({});
  const { data: kota, isLoading: isLoadingCity } = useGetCityList({
    provinceId: form.watch("wakif_province"),
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

    updateDonation({
      amount: value ? Number(value) : 0,
      // maintenance_fee: !maintenanceFeeInput ? maintenanceFee : donationAnonymous?.maintenance_fee, // Command, Req Salahudin 24 Juli 2025
    });

    if (Number(value) < MIN_NOMINAL_UPDATE) {
      setErrorMinWakaf(true);
    } else {
      setErrorMinWakaf(false);
    }
  };

  const handleMaintenanceFeeInput = (value: string) => {
    // setMaintenanceFeeInput(true);

    updateDonation({
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
      amount: donation?.amount,
      maintenance_fee: donation?.maintenance_fee,
      payment_method_id: donation?.payment_method_id,
      campaign_is_permanent: donation?.campaign_is_permanent,
      is_anonymous: form.getValues("is_anonymous"),
      willing_to_contact_by_lembaga: form.getValues("willing_to_contact_by_lembaga"),
      donor_name: form.getValues("donor_name"),
      wakif_name: form.getValues("wakif_name"),
      wakif_phone: form.getValues("wakif_phone"),
      wakif_address: form.getValues("wakif_address"),
      email: form.getValues("email"),
      phone_number: form.getValues("phone_number"),
      category_waqaf: form.getValues("category_waqaf"),
      wakif_temporer_due_date: form.getValues("wakif_temporer_due_date") || null,

      wakif_city: form.getValues("wakif_city"),
      wakif_province: form.getValues("wakif_province"),
      wakif_type: form.getValues("wakif_type"),
      wakif_type_id: form.getValues("wakif_type_id") || null,
      wakif_type_has_corp_unit: form.getValues("wakif_type_has_corp_unit") || false,
      has_wakif_types: form.getValues("has_wakif_types") || false,

      wakif_identity: form.getValues("wakif_identity"),
      wakif_bank: form.getValues("wakif_bank"),
      wakif_bank_name: form.getValues("wakif_bank_name"),
      wakif_bank_account_no: form.getValues("wakif_bank_account_no"),
      wakif_bank_account_name: form.getValues("wakif_bank_account_name"),

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
      wakif_pray: form.getValues("wakif_pray") || null,

      ...(form.getValues("corp_unit_lvl1_code") == "Mdp" && {
        corp_unit_lvl3_name: form.getValues("corp_unit_lvl3_id"),
        corp_unit_lvl3_id: null,
      }),
    };

    updateDonation(payload);
  };

  const handleSelectPaymentMethod = () => {
    updateStateBeforeAction();

    router.push(`/campaign/${params?.campaignId}/payment-method`);
  };

  const interceptLoadOptionsCorpUnitLevel1 = async (inputValue: string) => {
    const options: any[] = await loadOptionsCorpUnitLevel1(
      campaign?.corp_id,
      showInputCorpsDefault ? "" : form.watch("wakif_province") || "", // Dont have wakif types dont filter province
      showInputCorpsDefault ? "" : form.watch("wakif_city") || "", // Dont have wakif types dont filter city
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
      form.watch("corp_unit_lvl1_id") || "",
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
      form.watch("corp_unit_lvl2_id") || "",
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
        amount: donation?.amount || 0,
        maintenance_fee: donation?.maintenance_fee,
        payment_method_id: paymentType?.justQris
          ? "c7d3a66e-e9ca-4c7f-a020-ad75da1472b7"
          : donation?.payment_method_id || "",
        is_anonymous: values?.is_anonymous,
        willing_to_contact_by_lembaga: values?.willing_to_contact_by_lembaga,
        donor_name: values?.donor_name,
        wakif_name: values?.wakif_name,
        wakif_phone: values?.wakif_phone,
        wakif_address: values?.wakif_address,
        email: values?.email,
        phone_number: values?.phone_number,

        wakif_city: values?.wakif_city,
        wakif_province: values?.wakif_province,
        wakif_type: values?.wakif_type || null,
        wakif_type_id: values?.wakif_type_id || null,
        wakif_type_has_corp_unit: values?.wakif_type_has_corp_unit,
        has_wakif_types: values?.has_wakif_types,
        campaign_is_permanent: values?.campaign_is_permanent,
        category_waqaf: values?.category_waqaf,
        wakif_temporer_due_date: values?.wakif_temporer_due_date || null,

        wakif_identity: values?.wakif_identity || null,
        wakif_bank: values?.wakif_bank || null,
        wakif_bank_name: values?.wakif_bank_name || null,
        wakif_bank_account_no: values?.wakif_bank_account_no || null,
        wakif_bank_account_name: values?.wakif_bank_account_name || null,

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
        wakif_pray: values?.wakif_pray || null,

        ...(values?.corp_unit_lvl1_code == "Mdp" && {
          corp_unit_lvl3_name: values?.corp_unit_lvl3_id,
          corp_unit_lvl3_id: null, // jadikan null permintaan BE
        }),
      };

      updateDonation(payload);

      if (isAppsDomain && isCampaignWafafMoney && values?.campaign_is_permanent == "0") {
        if (values?.campaign_is_permanent == "0" && isCampaignWafafMoney && !values?.wakif_temporer_due_date) {
          form.setError("wakif_temporer_due_date", { message: `Jangka waktu wajib diisi untuk tipe wakaf temporer` });
          notifyError("Jangka waktu wajib diisi untuk tipe wakaf temporer");
          return;
        }

        if (!values?.wakif_identity) {
          form.setError("wakif_identity", { message: `Nomor KTP wajib diisi` });
          notifyError("Nomor KTP wajib diisi");
          return;
        }

        if (!values?.wakif_bank) {
          form.setError("wakif_bank", { message: `Bank wajib diisi` });
          notifyError("Bank wajib diisi");
          return;
        }

        if (!values?.wakif_bank_account_no) {
          form.setError("wakif_bank_account_no", { message: `Nomor Rekening wajib diisi` });
          notifyError("Nomor Rekening wajib diisi");
          return;
        }

        if (!values?.wakif_bank_account_name) {
          form.setError("wakif_bank_account_name", { message: `Nama Pemilik Rekening wajib diisi` });
          notifyError("Nama Pemilik Rekening wajib diisi");
          return;
        }
      }

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

      if (isCampaignBWIRequest && !form.watch("wakif_phone")) {
        form.setError("wakif_phone", { message: `No Telepon wajib diisi` });
        notifyError("No Telepon wajib diisi");
        return;
      }

      if (Number.isNaN(donation?.amount) || Number(donation?.amount) < MIN_NOMINAL_UPDATE) {
        setErrorMinWakaf(true);
        notifyError(`Nominal wakaf minimal Rp ${toMoney(MIN_NOMINAL_UPDATE)}`);
        return;
      }

      if (!donation?.payment_method_id) {
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
        donor_id: user?.id,

        campaign_id: campaign?.id,
        amount: donation?.amount,
        maintenance_fee: donation?.maintenance_fee,
        payment_method_id: paymentType?.justQris
          ? "c7d3a66e-e9ca-4c7f-a020-ad75da1472b7"
          : donation?.payment_method_id || "",
        is_anonymous: form.getValues("is_anonymous"),
        willing_to_contact_by_lembaga: form.getValues("willing_to_contact_by_lembaga"),
        donor_name: form.getValues("donor_name"),
        email: form.getValues("email"),
        phone_number: form.getValues("phone_number") ? phoneNumberFormater(form.getValues("phone_number")!) : "",
        campaign_is_permanent: Number(form.getValues("campaign_is_permanent")),
        is_waqaf_money: form.getValues("category_waqaf") == 1 ? 1 : 0, // WAKAF UANG
        is_waqaf_thru_money: form.getValues("category_waqaf") == 1 ? 0 : 1, // WAKAF MELALUI UANG
        wakif_temporer_due_date: form.getValues("wakif_temporer_due_date")
          ? addYearsToNow(Number(form.getValues("wakif_temporer_due_date")))
          : null,

        wakif_name: form.getValues("wakif_name"),
        wakif_phone: phoneNumberFormater(form.getValues("wakif_phone") ?? "0"),

        wakif_address: form.getValues("wakif_address") || null,
        // wakif_district: form.getValues("wakif_district") || null,
        wakif_city: form.getValues("wakif_city") || null,
        wakif_province: form.getValues("wakif_province") || null,
        wakif_type: form.getValues("wakif_type") || null,
        wakif_type_id: form.getValues("wakif_type_id") || null,

        wakif_identity: form.getValues("wakif_identity") || null,
        wakif_bank: form.getValues("wakif_bank") || null,
        wakif_bank_name: form.getValues("wakif_bank_name") || null,
        wakif_bank_account_no: form.getValues("wakif_bank_account_no") || null,
        wakif_bank_account_name: form.getValues("wakif_bank_account_name") || null,

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
        wakif_pray: form.getValues("wakif_pray") || null,

        ...(form.getValues("corp_unit_lvl1_code") == "Mdp" && {
          corp_unit_lvl3_name: form.getValues("corp_unit_lvl3_id"),
          corp_unit_lvl3_id: null,
        }),

        subdomain: currentDomain?.split(".")?.[0],
      };

      let endpoint = "";

      if (donation?.paymentMethod?.to_corporate == 1) {
        endpoint = env.NEXT_PUBLIC_BASE_URL2 + `/donations/apps`;
      } else {
        endpoint = env.NEXT_PUBLIC_BASE_URL + `/donations`;
      }

      await axios
        .post(endpoint, payload, {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
        .then((response) => {
          const { id, payment } = response?.data?.data?.[0];

          setTimeout(() => {
            if (payment?.name === "QRIS") {
              router.push(`/campaign/${params.campaignId}/donate/${id}?type=qris`);
            } else {
              router.push(`/campaign/${params.campaignId}/donate/${id}?type=va`);
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
      updateDonation({ payment_method_id: "c7d3a66e-e9ca-4c7f-a020-ad75da1472b7" });
    }

    form.trigger("phone_number");
    form.trigger("wakif_phone");
    form.trigger("wakif_address");
    form.trigger("wakif_province");
    form.trigger("wakif_city");
    // form.trigger("wakif_district");
    form.trigger("wakif_type");

    form.trigger("corp_unit_profession");
    setCampaignIsPermanent(campaign?.is_permanent);
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
    <section className="pt-16 relative layout bg-white min-h-screen">
      <Header inverted title={`Tunaikan ${textTypeCampaign}`} className="left-0 top-0" />

      {/* TABLE ASN KEMENAG */}
      {campaign?.rakornas_kemenag == 1 && campaign?.corp_id == "KMAG111120240000002" ? (
        <section className="p-5">
          <KemenagInfo />
        </section>
      ) : null}

      {/* JUDUL CAMPAIGN */}
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

      {/* NOMINAL */}
      <section className="px-5">
        <div className={cn("border rounded-lg py-2 px-5", errorMinWakaf ? "border-danger-500" : "")}>
          <span className="text-base font-normal text-gray-500">Nominal {textTypeCampaign}</span>
          <div className="relative w-full">
            <CurrencyInput
              id="input-amount"
              name="input-amout"
              placeholder="0"
              decimalsLimit={2}
              defaultValue={donation?.amount}
              className={cn(
                "w-full p-2 focus:ring-0 focus:outline-none font-bold text-xl focus-visible:ring-0 placeholder:text-lg px-9",
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
            <span className="text-xs text-danger-500">
              Nominal {textTypeCampaign} minimal Rp {toMoney(MIN_NOMINAL_UPDATE)}
            </span>
          ) : null}
        </div>
      </section>

      {/* INFAQ PEMELIHARAAN */}
      {!isAppsDomain && (
        <section className="px-5 mt-2">
          <div className={cn("border rounded-lg py-2 px-5", errorMinInfaq ? "border-danger-500" : "")}>
            <span className="text-base font-normal text-gray-500">Infaq Pemeliharaan</span>
            <div className="relative w-full">
              <CurrencyInput
                id="maintenance_fee"
                name="maintenance_fee"
                value={donation?.maintenance_fee?.toFixed()}
                placeholder="0"
                decimalsLimit={2}
                className={cn(
                  "w-full p-2 focus:ring-0 focus:outline-none font-bold text-xl focus-visible:ring-0 placeholder:text-lg px-9",
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
            <span className="text-[0.65rem] italic">
              *apabila anda tidak bersedia infaq anda dapat memasukan angka Rp 0
            </span>

            {errorMinInfaq ? (
              <span className="text-xs text-danger-500">Nominal Infaq Pemeliharaan minimal Rp 0</span>
            ) : null}
          </div>
        </section>
      )}

      {/* PAYMENT TYPE HANYA QRIS */}
      {paymentType?.justQris ? (
        <section className="p-5 pb-0">
          <h1 className="text-sm font-semibold">Pilih Metode Pembayaran</h1>
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
        </section>
      ) : null}

      {/* PAYMENT TYPE HANYA VIRTUAL ACCOUNT */}
      {paymentType?.justVA ? (
        <section className="p-5 pb-0">
          <h1 className="text-sm font-semibold">Pilih Metode Pembayaran</h1>
          {isLoading ? (
            <Skeleton className="w-full h-16 rounded-md my-3" />
          ) : (
            <div>
              <div
                className={cn("border rounded-lg p-3 mt-3", errorPaymentMethod ? "border-danger-500" : "")}
                role="button"
                onClick={() => handleSelectPaymentMethod()}
              >
                {!donation?.paymentMethod ? (
                  <div className="w-full inline-flex items-center justify-between">
                    <span className="text-xs">TERSEDIA Virtual Account</span>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-primary-600">Pilih Metode</span>
                      <ChevronRight size={18} className="text-primary-600" />
                    </div>
                  </div>
                ) : (
                  <div className="w-full inline-flex items-center justify-between pt-2">
                    <div className="inline-flex items-center space-x-2">
                      {donation?.paymentMethod ? (
                        <img
                          src={donation?.paymentMethod?.logo}
                          alt={donation?.paymentMethod?.name}
                          width={50}
                          height={50}
                          fetchPriority="high"
                        />
                      ) : (
                        <Wallet2Icon className="w-6 h-6" />
                      )}
                      <RenderMetodePembayaran donationAnonymous={donation} paymentType={paymentType} />
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-primary-600">Ubah Metode</span>
                      <ChevronRight size={18} className="text-primary-600" />
                    </div>
                  </div>
                )}
                {errorPaymentMethod ? (
                  <span className="text-xs text-danger-500">Pilih metode pembayaran terlebih dahulu.</span>
                ) : null}
              </div>
            </div>
          )}
        </section>
      ) : null}

      {/* PAYMENT TYPE QRIS DAN VIRTUAL ACCOUNT */}
      {paymentType?.qrisVA ? (
        <section className="p-5 pb-0">
          <h1 className="text-sm font-semibold">Pilih Metode Pembayaran</h1>
          {isLoading ? (
            <Skeleton className="w-full h-16 rounded-md my-3" />
          ) : (
            <div>
              <div
                className={cn("border rounded-lg p-3 mt-3", errorPaymentMethod ? "border-danger-500" : "")}
                role="button"
                onClick={() => handleSelectPaymentMethod()}
              >
                {!donation.paymentMethod ? (
                  <div className="w-full inline-flex items-center justify-between">
                    <span className="text-xs">TERSEDIA QRIS & Virtual Account</span>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-primary-600">Pilih Metode</span>
                      <ChevronRight size={18} className="text-primary-600" />
                    </div>
                  </div>
                ) : (
                  <div className="w-full inline-flex items-center justify-between pt-2">
                    <div className="inline-flex items-center space-x-2">
                      {donation?.paymentMethod ? (
                        <img
                          src={donation?.paymentMethod?.logo}
                          alt={donation?.paymentMethod?.name}
                          width={50}
                          height={50}
                          fetchPriority="high"
                        />
                      ) : null}

                      <RenderMetodePembayaran donationAnonymous={donation} paymentType={paymentType} />
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-primary-600">Ubah Metode</span>
                      <ChevronRight size={18} className="text-primary-600" />
                    </div>
                  </div>
                )}
                {errorPaymentMethod ? (
                  <span className="text-xs text-danger-500">Pilih metode pembayaran terlebih dahulu.</span>
                ) : null}
              </div>
            </div>
          )}
        </section>
      ) : null}

      {/* FORM DONATION */}
      <div className="px-5 pb-32 mt-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            {/* TIPE WAKAF FOR IS PERMANENT == 2 */}
            {isCampaignWakaf && campaign?.is_permanent == 2 ? (
              <div className="space-y-2">
                <h1 className="text-sm font-semibold">Pilih Tipe Wakaf</h1>

                <FormField
                  control={form.control}
                  name="campaign_is_permanent"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormControl>
                        <ReactSelect2
                          className="text-xs"
                          placeholder="Pilih Tipe Wakaf"
                          name="campaign_is_permanent"
                          options={TIPE_WAKAF}
                          onChange={(value) => {
                            field.onChange(value?.value);
                            form.setValue("is_permanent", value?.value);
                            setCampaignIsPermanent(value?.value);

                            form.setValue("wakif_temporer_due_date", "");
                            form.setValue("wakif_identity", "");
                            form.setValue("wakif_bank", "");
                            form.setValue("wakif_bank_name", "");
                            form.setValue("wakif_bank_account_name", "");
                            form.setValue("wakif_bank_account_no", "");

                            form.trigger("wakif_temporer_due_date");
                            form.trigger("wakif_identity");
                            form.trigger("wakif_bank");
                            form.trigger("wakif_bank_name");
                            form.trigger("wakif_bank_account_name");
                            form.trigger("wakif_bank_account_no");
                          }}
                          maxMenuHeight={150}
                          fieldState={fieldState}
                          value={
                            TIPE_WAKAF?.find((item: any) => item?.value == form.watch("campaign_is_permanent")) || null
                          }
                          isDisabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ) : null}

            {(campaignIsPermanent == 0 || form.watch("campaign_is_permanent") == "0") && isCampaignWafafMoney ? (
              <FormField
                control={form.control}
                name="wakif_temporer_due_date"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>
                      Jangka Waktu<span className="text-sx text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <ReactSelect2
                        name="type"
                        maxMenuHeight={150}
                        className="text-xs"
                        options={TEMPORER_DUE_DATE}
                        placeholder="Pilih Jangka Waktu"
                        onChange={(value) => {
                          field.onChange(value?.value);

                          form.trigger("wakif_temporer_due_date");
                        }}
                        fieldState={fieldState}
                        value={TEMPORER_DUE_DATE?.find(
                          (item: any) => item?.value == form.watch("wakif_temporer_due_date"),
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : null}

            {/* JENIS WAKIF */}
            {campaign?.is_waqaf_money && campaign?.is_waqaf_thru_money ? (
              <div className="space-y-2">
                <h1 className="text-sm font-semibold">Jenis Wakaf</h1>

                <FormField
                  control={form.control}
                  name="category_waqaf"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormControl>
                        <RadioGroup
                          onValueChange={(value) => {
                            field.onChange(value);
                          }}
                          defaultValue={String(field.value)}
                          className="flex items-center gap-4"
                        >
                          <FormItem className="flex items-center gap-3">
                            <FormControl>
                              <RadioGroupItem value="1" />
                            </FormControl>
                            <FormLabel className="font-normal">Uang</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center gap-3">
                            <FormControl>
                              <RadioGroupItem value="0" />
                            </FormControl>
                            <FormLabel className="font-normal">Melalui Uang</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ) : null}

            {/* SUB CAMPAIGN / PROGRAM */}
            {((campaign?.show_sub_campaign_for_waqaf_money && form.watch("category_waqaf") == 1) ||
              (campaign?.show_sub_campaign_for_waqaf_thru_money && form.watch("category_waqaf") == 0)) &&
            campaign?.sub_campaigns?.length ? (
              <div className="space-y-2">
                <h1 className="text-sm font-semibold">Pilih Program</h1>

                <FormField
                  control={form.control}
                  name="program_id"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormControl>
                        <ReactSelect2
                          className="text-xs"
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ) : null}

            {/* PEMBAYAR */}
            {!isAppsDomain && (
              <div>
                <h1 className="text-sm font-semibold my-3">Pembayar</h1>
                <div className="space-y-3 border rounded-xl p-3">
                  <FormField
                    control={form.control}
                    name="donor_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Nama<span className="text-sx text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value} placeholder="Masukkan Nama Anda" disabled />
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
                        <FormLabel>
                          Email<span className="text-sx text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Masukkan Email Anda" disabled />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          No Telepon<span className="text-sx text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            placeholder="Masukkan No Telepon Anda"
                            disabled={isSubmitting}
                            onWheel={(e) => e.currentTarget.blur()}
                            onChange={(event) => {
                              field.onChange(event);
                              form.trigger("phone_number");

                              // miroring value to wakif phone
                              form.setValue("wakif_phone", event?.currentTarget?.value);
                              form.trigger("wakif_phone");
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {/* WAKIF */}
            <div>
              <h1 className="text-sm font-semibold my-3">{personCampaignLabel}</h1>
              <div className="space-y-3 border rounded-xl p-3">
                <FormField
                  control={form.control}
                  name="wakif_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Nama<span className="text-sx text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={`Masukkan Nama ${personCampaignLabel}`}
                          disabled={isSubmitting}
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
                      <FormLabel>
                        No Telepon {!isCampaignBWIRequest && "(Opsional)"}{" "}
                        {!isCampaignBWIRequest && <span className="text-sx text-red-500">*</span>}{" "}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder={`Masukkan No Telepon ${personCampaignLabel} ${!isCampaignBWIRequest ? "(Opsional)" : ""}`}
                          disabled={isSubmitting}
                          onWheel={(e) => e.currentTarget.blur()}
                          onChange={(event) => {
                            field.onChange(event);
                            form.trigger("wakif_phone");
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* WAKIF UANG TEMPORER */}
                {form.watch("campaign_is_permanent") == "0" && isCampaignWafafMoney && isAppsDomain ? (
                  <Fragment>
                    <FormField
                      control={form.control}
                      name="wakif_identity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Nomor KTP<span className="text-sx text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              placeholder={`Masukkan Nomor KTP`}
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="wakif_bank"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormLabel>
                            Bank<span className="text-sx text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <ReactSelect2
                              name="type"
                              maxMenuHeight={150}
                              className="text-xs"
                              options={BANK}
                              placeholder="Pilih Bank"
                              onChange={(value) => {
                                field.onChange(value?.value);
                                form.setValue("wakif_bank_name", value?.label);

                                form.trigger("wakif_bank");
                              }}
                              fieldState={fieldState}
                              value={BANK?.find((item: any) => item?.value == form.watch("wakif_bank"))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="wakif_bank_account_no"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Nomor Rekening<span className="text-sx text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              placeholder="Masukkan Nomor Rekening"
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="wakif_bank_account_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Nama Pemilik Rekening<span className="text-sx text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Masukkan Nama Pemilik Rekening" disabled={isSubmitting} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </Fragment>
                ) : null}

                {/* HAS WAKIF TYPES ON CAMPAIGN */}
                {campaign?.wakif_types?.length ? (
                  <FormField
                    control={form.control}
                    name="wakif_type"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>Tipe Wakif</FormLabel>
                        <FormControl>
                          <ReactSelect2
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
                              form.setValue("wakif_type_id", value?.id);
                              // form.setValue("corp_unit_profession", value?.value);
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : null}

                {campaignIsPermanent == 0 || form.watch("campaign_is_permanent") == "0" ? (
                  <FormField
                    control={form.control}
                    name="wakif_address"
                    render={({ field }) => (
                      <FormItem>
                        <div>
                          <FormLabel>
                            Alamat {isCampaignWakaf && <span className="text-sx text-red-500">*</span>}
                          </FormLabel>

                          {isCampaignWakaf && (
                            <span className="text-[0.625rem] text-gray-600 block">
                              alamat {personCampaignLabel} wajib diisi sesuai ketentuan perundang-undangan.
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
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : null}

                <div className="flex flex-col gap-2 rounded z-10">
                  <Label>Wilayah</Label>
                  <FormField
                    control={form.control}
                    name="wakif_province"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormControl>
                          <ReactSelect2
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
                                (item: any) => item?.value == form.watch("wakif_province"),
                              ) || null
                            }
                            isDisabled={isLoadingProvince}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="wakif_city"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormControl>
                          <ReactSelect2
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
                              geolocations?.cities?.find((item: any) => item?.value == form.watch("wakif_city")) || null
                            }
                            isLoading={isLoadingCity && !!form.watch("wakif_province")}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* INFORMASI INSTITUSI */}
            {campaign?.rakornas_kemenag === 1 && (showInputCorpsDefault || form.watch("wakif_type_has_corp_unit")) ? (
              <Fragment>
                <h1 className="text-sm font-semibold my-3">Informasi Institusi </h1>

                <div className="space-y-3 border rounded-xl p-3">
                  {/* CORP LEVEL 1 */}
                  <FormField
                    key={`${form.watch("wakif_type")} ${form.watch("wakif_province")} ${form.watch("wakif_city")}`}
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
                                  : [],
                              );

                              // SET CORP GEO
                              if (val) {
                                // HAS NATIONAL
                                if (val?.has_national == 1) form.setValue("corp_has_national", val?.has_national == 1);

                                if (val?.province_code) form.setValue("corp_unit_province_code", val?.province_code);
                                if (val?.city_code) form.setValue("corp_unit_city_code", val?.city_code);
                                if (val?.district_code) form.setValue("corp_unit_district_code", val?.district_code);
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
                                  if (val?.province_code) form.setValue("corp_unit_province_code", val?.province_code);
                                  if (val?.city_code) form.setValue("corp_unit_city_code", val?.city_code);
                                  if (val?.district_code) form.setValue("corp_unit_district_code", val?.district_code);
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
                          <FormMessage />
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
                          <FormMessage />
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
                                  if (val?.province_code) form.setValue("corp_unit_province_code", val?.province_code);
                                  if (val?.city_code) form.setValue("corp_unit_city_code", val?.city_code);
                                  if (val?.district_code) form.setValue("corp_unit_district_code", val?.district_code);
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
                          <FormMessage />
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
                            <ReactSelect2
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
                                  (item: any) => item?.value == form.watch("corp_unit_profession"),
                                ) || null
                              }
                            />
                          </FormControl>
                          <FormMessage />
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
                <h1 className="text-sm font-semibold my-3">Wilayah Kerja</h1>

                <div className="space-y-3 border rounded-xl p-3">
                  <FormField
                    control={form.control}
                    name="corp_unit_province_code"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormControl>
                          <ReactSelect2
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
                                (item: any) => item?.value == form.watch("corp_unit_province_code"),
                              ) || null
                            }
                            isDisabled={isLoadingUnitProvinces}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="corp_unit_city_code"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormControl>
                          <ReactSelect2
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
                                (item: any) => item?.value == form.watch("corp_unit_city_code"),
                              ) || null
                            }
                            isLoading={isLoadingUnitCities && !!form.watch("corp_unit_province_code")}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="corp_unit_district_code"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormControl>
                          <ReactSelect2
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
                                (item: any) => item?.value == form.watch("corp_unit_district_code"),
                              ) || null
                            }
                            isLoading={isLoadingUnitDistricts && !!form.watch("corp_unit_city_code")}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </Fragment>
            ) : null}

            {/* DOA */}
            <FormField
              control={form.control}
              name="wakif_pray"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold">Doa (Opsional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Tuliskan doa Anda di sini" {...field} className="px-3" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* WILLING CONTRACT */}
            <FormField
              control={form.control}
              name="willing_to_contact_by_lembaga"
              render={({ field }) => (
                <FormItem>
                  <div className="bg-blue-100 p-2 w-full inline-flex gap-3 rounded-md">
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        const value = !!checked;
                        field.onChange(value);
                      }}
                    />
                    <p className="text-xs">
                      Dengan mengisi kotak ini, Anda setuju untuk dihubungi oleh lembaga yang ada di dalam platform
                      SATUWAKAF untuk tujuan promosi program.
                      <Link
                        href="/accounts/privacy-policy"
                        className="underline ml-0.5"
                        onClick={() => updateStateBeforeAction()}
                      >
                        (Kebijakan Privasi)
                      </Link>
                    </p>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* IS ANONYMOUS WAKIF NAME */}
            <FormField
              control={form.control}
              name="is_anonymous"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between w-full">
                  <FormLabel className="text-xs font-bold">
                    Sembunyikan nama saya dari publikasi (Daftar{" "}
                    {personByCampaignType[campaign?.type as CampaignTypeKeys]})
                  </FormLabel>
                  <Switch
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      const value = !!checked;
                      field.onChange(value);
                    }}
                  />
                </FormItem>
              )}
            />

            <div className="fixed bottom-0 inset-x-0 border-t p-3 layout bg-white">
              <Button
                size="full"
                variant="default"
                className="text-bold text-white"
                type="submit"
                disabled={isSubmitting}
              >
                Lanjut pembayaran
              </Button>
            </div>
          </form>
        </Form>
      </div>

      {loading ? <ScreenLoader /> : null}

      <IkrarDialog
        campaign={campaign}
        open={openIkrar}
        setOpen={setOpenIkrar}
        amount={donation?.amount}
        onDonate={handleDonate}
      />
      {loading ? <ScreenLoader /> : null}
      <Toaster position="bottom-center" />
    </section>
  );
}

const RenderMetodePembayaran = ({
  donationAnonymous,
  paymentType,
}: {
  donationAnonymous: IDonationAnonymous;
  paymentType: { justQris: boolean; justVA: boolean; qrisVA: boolean };
}) => {
  if (!donationAnonymous?.paymentMethod?.name && paymentType?.justVA) return <span>Virtual Account</span>;
  if (!donationAnonymous?.paymentMethod?.name && paymentType?.qrisVA) return <span>QRIS, Virtual Account</span>;

  const isExceed = calculateTotalTransactionAmountAndServiceFee(
    Number(donationAnonymous?.amount),
    Number(donationAnonymous?.maintenance_fee),
    donationAnonymous?.paymentMethod?.name || "",
  );

  return (
    <div className="flex flex-col items-start gap-1">
      <span className="text-sm">{donationAnonymous?.paymentMethod?.name}</span>
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
