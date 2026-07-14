"use client";

import InputFiles from "@/components/Input/input-file";
import ReactSelect2 from "@/components/Select/react-select";
import { Skeleton } from "@/components/Skeleton";
import { notifyError, notifySuccess } from "@/components/Toaster";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { BANK } from "@/constant/bank";
import { env } from "@/lib/env";
import useSession from "@/lib/use-session";
import { makeid, sanitizeTitle, urlImageStoreGoogle } from "@/lib/utils";
import { useGetCampaignDetail } from "@/services/campaign/hooks";
import { useGetCityList, useGetProvinceList } from "@/services/location/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Toaster } from "react-hot-toast";
import { z } from "zod";

const FormSchema = z.object({
  // applicant
  applicant_name: z.string({ required_error: "Nama Calon wajib diisi" }).min(1, { message: "Nama Calon wajib diisi" }),
  applicant_birth_place: z
    .string({ required_error: "Tampat Lahir wajib diisi" })
    .min(1, { message: "Tampat Lahir wajib diisi" }),
  applicant_birth_date: z
    .string({ required_error: "Tanggal Lahir wajib diisi" })
    .min(1, { message: "Tanggal Lahir wajib diisi" }),
  applicant_job: z.string({ required_error: "Pekerjaan wajib diisi" }).min(1, { message: "Pekerjaan wajib diisi" }),
  applicant_phone: z
    .string()
    .optional()
    .nullable()
    .transform((v) => (typeof v === "string" ? v.trim() : v))
    .refine((v) => v == null || v === "" || /^(62|08)\d+$/.test(v.replace(/[\s-]/g, "")), {
      message: "No. HP harus diawali 62 atau 08 dan hanya berisi angka",
    })
    .refine(
      (v) => {
        if (!v) return true;
        const digits = v.replace(/\D/g, "");
        return digits.length >= 10 && digits.length <= 15;
      },
      { message: "No. HP tidak valid (panjang 10–15 digit)" },
    ),
  applicant_email: z.string().optional().nullable(),
  applicant_province_id: z
    .string({ required_error: "Provinsi wajib diisi" })
    .min(1, { message: "Provinsi wajib diisi" }),
  applicant_province_name: z.string().optional().nullable(),
  applicant_city_id: z.string({ required_error: "Kota wajib diisi" }).min(1, { message: "Kota wajib diisi" }),
  applicant_city_name: z.string().optional().nullable(),
  applicant_address: z.string({ required_error: "Alamat wajib diisi" }).min(1, { message: "Alamat wajib diisi" }),
  reason: z.string({ required_error: "Alasan wajib diisi" }).min(1, { message: "Alasan wajib diisi" }),
  type_of_assistance: z
    .string({ required_error: "Jenis bantuan wajib diisi" })
    .min(1, { message: "Jenis bantuan wajib diisi" }),
  // bank
  bank_account_name: z
    .string({ required_error: "Nama Pemilik wajib diisi" })
    .min(1, { message: "Nama Pemilik wajib diisi" }),
  bank_account_number: z
    .string({ required_error: "Nama Rekening wajib diisi" })
    .min(1, { message: "Nama Rekening wajib diisi" }),
  bank_name: z.string({ required_error: "Nama Bank wajib diisi" }).min(1, { message: "Nama Bank wajib diisi" }),
  // organization
  organization_information: z.string().optional().nullable(),
  // upload
  organization_license_url: z.string().optional().nullable(),
  supporting_doc_url: z.string().optional().nullable(),
  bank_book_url: z.string().optional().nullable(),
  id_card_url: z.string().optional().nullable(),
});

type FormType = z.infer<typeof FormSchema>;

const StepOne = ({ campaignId }: { campaignId: string }) => {
  const { session } = useSession();
  const router = useRouter();
  // const { applicantDetail } = useStepperStore();
  const { data: campaign, isLoading } = useGetCampaignDetail({ campaignId });

  const form = useForm<FormType>({
    resolver: zodResolver(FormSchema),
    // defaultValues: {
    //   // applicant
    //   applicant_name: applicantDetail?.applicant_name || "",
    //   applicant_birth_place: applicantDetail?.applicant_birth_place || "",
    //   applicant_birth_date: applicantDetail?.applicant_birth_date || "",
    //   applicant_job: applicantDetail?.applicant_job || "",
    //   applicant_phone: applicantDetail?.applicant_phone || "",
    //   applicant_email: applicantDetail?.applicant_email || "",
    //   applicant_province_id: applicantDetail?.applicant_province_id || "",
    //   applicant_province_name: applicantDetail?.applicant_province_name ?? null,
    //   applicant_city_id: applicantDetail?.applicant_city_id || "",
    //   applicant_city_name: applicantDetail?.applicant_city_name ?? null,
    //   applicant_address: applicantDetail?.applicant_address || "",
    //   reason: applicantDetail?.reason || "",
    //   // bank
    //   bank_account_name: applicantDetail?.bank_account_name || "",
    //   bank_account_number: applicantDetail?.bank_account_number || "",
    //   bank_name: applicantDetail?.bank_name || "",
    //   // organization
    //   organization_information: applicantDetail?.organization_information || "",
    //   // upload
    //   organization_license_url: applicantDetail?.organization_license_url ?? null,
    //   supporting_doc_url: applicantDetail?.supporting_doc_url ?? null,
    //   bank_book_url: applicantDetail?.bank_book_url ?? null,
    //   id_card_url: applicantDetail?.id_card_url ?? null,
    // },
  });

  const { data: provinsi, isLoading: isLoadingProvince } = useGetProvinceList({});
  const { data: kota, isLoading: isLoadingCity } = useGetCityList({
    provinceId: form.watch("applicant_province_id") || "",
    enabled: !!form.watch("applicant_province_id"),
  });

  const [organizationLicenseUrl, setOrganizationLicenseUrl] = useState([
    {
      id: makeid(),
      pic: "",
      error: "",
    },
  ]);
  const [supportingDocUrl, setSupportingDocUrl] = useState([
    {
      id: makeid(),
      pic: "",
      error: "",
    },
  ]);
  const [bankBookUrl, setBankBookUrl] = useState([
    {
      id: makeid(),
      pic: "",
      error: "",
    },
  ]);
  const [idCardUrl, setIdCardUrl] = useState([
    {
      id: makeid(),
      pic: "",
      error: "",
    },
  ]);
  const [geolocations, setGeolocations] = useState({
    provinces: [],
    cities: [],
    districts: [],

    corp_unit_provinces: [],
    corp_unit_cities: [],
    corp_unit_districts: [],
  });

  const isSubmitting = form.formState.isSubmitting;

  async function uploadData(payload: any) {
    try {
      const response = await axios.post(
        `${env.NEXT_PUBLIC_BASE_URL}/external/utilities/assets/upload-multi-ext`,
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          auth: {
            username: "satuwakafid",
            password: "simplebasicauth",
          },
        },
      );

      if (response?.data?.status != "success") throw { error_message: "Terjadi Kesalahan Ketika Upload" };

      return response?.data;
    } catch (error: any) {
      notifyError(error);
      return error;
    }
  }

  async function onSubmit(values: FormType) {
    try {
      const organizationUrl = organizationLicenseUrl
        .map((item: any) => item?.pic)
        .filter((item) => item)
        .map((item) => urlImageStoreGoogle(item))[0];
      const supportingUrl = supportingDocUrl
        .map((item: any) => item?.pic)
        .filter((item) => item)
        .map((item) => urlImageStoreGoogle(item))[0];
      const bankUrl = bankBookUrl
        .map((item: any) => item?.pic)
        .filter((item) => item)
        .map((item) => urlImageStoreGoogle(item))[0];
      const idUrl = idCardUrl
        .map((item: any) => item?.pic)
        .filter((item) => item)
        .map((item) => urlImageStoreGoogle(item))[0];

      if (!supportingUrl || supportingUrl === undefined) {
        notifyError("Bukti Pendukung wajib diupload");
        return;
      }

      if (!bankUrl || bankUrl === undefined) {
        notifyError("Buku Rekening wajib diupload");
        return;
      }

      if (!idUrl || idUrl === undefined) {
        notifyError("Identitas Diri wajib diupload");
        return;
      }

      const payload = {
        ...values,
        donor_id: session?.id,
        donor_name: session?.name,
        campaign_id: campaign?.id,
        campaign_title: campaign?.title,
        supporting_doc_url: supportingUrl,
        bank_book_url: bankUrl,
        id_card_url: idUrl,
        organization_license_url: organizationUrl ? organizationUrl : null,
        organization_information: values?.organization_information ? values?.organization_information : null,
        applicant_phone: values?.applicant_phone ?? null,
        applicant_email: values?.applicant_email ?? null,
        applicant_province_id: values?.applicant_province_id ? values?.applicant_province_id : null,
        applicant_city_id: values?.applicant_city_id ? values?.applicant_city_id : null,
      };

      await axios
        .post(`${env.NEXT_PUBLIC_BASE_URL}/beneficiary-applications`, payload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + getCookie("user_token"),
          },
        })
        .then((response) => {
          if (response.status === 200) {
            notifySuccess("Pengajuan berhasil dibuat");

            form.reset();

            setTimeout(() => {
              router.push(`/campaign/${campaignId}?title=${sanitizeTitle(campaign?.title)}`);
            }, 800);
          }
        })
        .catch((fallback) => {
          const { error } = fallback.response.data;
          notifyError(error?.message || error?.error_message || "Terjadi Kesalahan");
        });
    } catch (error: any) {
      notifyError(error?.message || error?.error_message || "Terjadi Kesalahan");
      return error;
    }
  }

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
  }, [kota, form.watch("applicant_province_id")]);

  return (
    <div>
      {/* JUDUL CAMPAIGN */}
      {isLoading ? (
        <div className="p-5">
          <Skeleton className="w-4/6 h-7 rounded-md mb-2" />
          <Skeleton className="w-3/6 h-7 rounded-md" />
        </div>
      ) : (
        <section className="p-3 border rounded-lg bg-white shadow-sm">
          <h2 className="text-sm font-medium text-gray-600 mb-1">Formulir Pengajuan Calon Penerima Manfaat</h2>
          <h1 className="text-lg font-semibold text-gray-800 leading-snug">{campaign?.title}</h1>
          <p className="mt-2 text-xs text-gray-500">
            Silakan lengkapi data berikut untuk mengajukan calon penerima manfaat.
          </p>
        </section>
      )}

      <Form {...form}>
        <form className="mt-4 space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <section className="p-3 border rounded-lg bg-white shadow-sm space-y-4">
            <h2 className="text-base font-semibold text-gray-800">Informasi Calon Penerima Manfaat</h2>

            <FormField
              control={form.control}
              name="applicant_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Nama <span className="text-xs text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value} placeholder="Masukkan Nama " disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="applicant_birth_place"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Tempat Lahir <span className="text-xs text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value} placeholder="Masukkan Tempat Lahir" disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="applicant_birth_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Tanggal Lahir <span className="text-xs text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="date"
                      value={field.value}
                      placeholder="Masukkan Tanggal Lahir"
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="applicant_job"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Pekerjaan <span className="text-xs text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value} placeholder="Masukkan Pekerjaan" disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="applicant_phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Nomor ponsel atau WhatsApp{" "}
                    <span className="ml-1 text-xs font-normal text-gray-500">(opsional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      value={field.value || ""}
                      placeholder="Masukkan Nomor"
                      disabled={isSubmitting}
                      onWheel={(e) => e.currentTarget.blur()}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="applicant_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Email <span className="ml-1 text-xs font-normal text-gray-500">(opsional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      value={field.value || ""}
                      placeholder="Masukkan Email"
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="applicant_province_id"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>
                    Provinsi <span className="text-xs text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <ReactSelect2
                      name="type"
                      className="text-xs"
                      placeholder="Pilih Provinsi"
                      onChange={(value) => {
                        field.onChange(value?.value);
                        form.setValue("applicant_province_name", value?.name);
                        form.trigger("applicant_province_id");

                        form.setValue("applicant_city_name", "");
                        form.setValue("applicant_city_id", "");
                        // form.setValue("wakif_district", "");

                        form.trigger("applicant_city_id");
                      }}
                      options={geolocations?.provinces}
                      fieldState={fieldState}
                      maxMenuHeight={150}
                      value={
                        geolocations?.provinces?.find(
                          (item: any) => item?.value == form.watch("applicant_province_id"),
                        ) || null
                      }
                      isDisabled={isLoadingProvince || isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="applicant_city_id"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>
                    Kab/Kota <span className="text-xs text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <ReactSelect2
                      name="type"
                      className="text-xs"
                      placeholder="Pilih Kab/Kota"
                      onChange={(value) => {
                        field.onChange(value?.value);
                        form.setValue("applicant_city_name", value?.name);

                        form.trigger("applicant_city_id");
                      }}
                      options={geolocations?.cities}
                      fieldState={fieldState}
                      maxMenuHeight={150}
                      value={
                        geolocations?.cities?.find((item: any) => item?.value == form.watch("applicant_city_id")) ||
                        null
                      }
                      isDisabled={!form.watch("applicant_province_id") || isLoadingCity || isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="applicant_address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Alamat Lengkap <span className="text-xs text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value}
                      placeholder="Masukkan Alamat Lengkap"
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type_of_assistance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Jenis Bantuan <span className="text-xs text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value}
                      placeholder="Masukkan Jenis Bantuan"
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Alasan Mengajukan Bantuan <span className="text-xs text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value}
                      placeholder="Masukkan Alasan Mengajukan Bantuan"
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="organization_information"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Informasi Institusi Terkait{" "}
                    <span className="ml-1 text-xs font-normal text-gray-500">(opsional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ""}
                      placeholder="Masukkan Informasi Institusi"
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </section>

          <section className="p-3 border rounded-lg bg-white shadow-sm space-y-4">
            <h2 className="text-base font-semibold text-gray-800">Informasi Rekening Bank</h2>

            <FormField
              control={form.control}
              name="bank_account_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Nama Pemilik Rekening <span className="text-xs text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value}
                      placeholder="Masukkan Nama Rekening"
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bank_account_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Nomor Rekening Rekening <span className="text-xs text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      value={field.value}
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
              name="bank_name"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>
                    Bank <span className="text-xs text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <ReactSelect2
                      name="type"
                      className="text-xs"
                      placeholder="Pilih Bank"
                      onChange={(value) => {
                        field.onChange(value?.value);
                      }}
                      options={BANK}
                      fieldState={fieldState}
                      maxMenuHeight={150}
                      value={BANK?.find((item: any) => item?.value == field.value) || null}
                      isDisabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </section>

          <section className="p-3 border rounded-lg bg-white shadow-sm space-y-4">
            <h2 className="text-base font-semibold text-gray-800">Upload Dokumen</h2>

            <FormField
              control={form.control}
              name="supporting_doc_url"
              render={({ field }) => {
                const label = (
                  <>
                    Upload Bukti Pendukung{" "}
                    <span className="ml-1 text-xs font-normal text-gray-500">(KIP/SKTM/KIS dsb)</span>
                  </>
                );

                return (
                  <FormItem>
                    <FormControl>
                      <InputFiles
                        label={label}
                        isRequired={false}
                        multiplePics={false}
                        pics={supportingDocUrl}
                        setPics={(val: any) => {
                          setSupportingDocUrl(val);
                          field.onChange(val?.[0]?.pic || "");
                        }}
                        options={{
                          size: 5,
                          location: "beneficiary/application",
                        }}
                        accept="all"
                        uploadData={uploadData}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="bank_book_url"
              render={({ field }) => {
                const label = (
                  <>
                    Upload Buku Rekening{" "}
                    <span className="ml-1 text-xs font-normal text-gray-500">
                      (tampak nomor dan nama pemilik rekening)
                    </span>{" "}
                  </>
                );

                return (
                  <FormItem>
                    <FormControl>
                      <InputFiles
                        label={label}
                        isRequired={false}
                        multiplePics={false}
                        pics={bankBookUrl}
                        setPics={(val: any) => {
                          setBankBookUrl(val);
                          field.onChange(val?.[0]?.pic || "");
                        }}
                        options={{
                          size: 5,
                          location: "beneficiary/application",
                        }}
                        accept="all"
                        uploadData={uploadData}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="id_card_url"
              render={({ field }) => {
                const label = (
                  <>
                    Upload Identitas Diri
                    <span className="ml-1 text-xs font-normal text-gray-500">(KTP)</span>{" "}
                  </>
                );

                return (
                  <FormItem>
                    <FormControl>
                      <InputFiles
                        label={label}
                        isRequired={false}
                        multiplePics={false}
                        pics={idCardUrl}
                        setPics={(val: any) => {
                          setIdCardUrl(val);
                          field.onChange(val?.[0]?.pic || "");
                        }}
                        options={{
                          size: 5,
                          location: "beneficiary/application",
                        }}
                        accept="all"
                        uploadData={uploadData}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="organization_license_url"
              render={({ field }) => {
                const label = (
                  <>
                    Upload Izin Institusi{" "}
                    <span className="ml-1 text-xs font-normal text-gray-500">(Jika Bantuan Untuk Institusi)</span>{" "}
                  </>
                );

                return (
                  <FormItem>
                    <FormControl>
                      <InputFiles
                        label={label}
                        isRequired={false}
                        multiplePics={false}
                        pics={organizationLicenseUrl}
                        setPics={(val: any) => {
                          setOrganizationLicenseUrl(val);
                          field.onChange(val?.[0]?.pic || "");
                        }}
                        options={{
                          size: 5,
                          location: "beneficiary/application",
                        }}
                        accept="all"
                        uploadData={uploadData}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </section>

          <div className="w-full ">
            <div className="mb-3 rounded-lg bg-yellow-50 border border-yellow-200 p-3 text-sm text-yellow-800">
              ⚠️ Pastikan semua data yang diisi sudah benar sebelum diajukan.
            </div>

            <Button className="w-full py-3" disabled={isSubmitting}>
              Ajukan
            </Button>
          </div>
        </form>
      </Form>

      <Toaster position="bottom-center" />
    </div>
  );
};

export default StepOne;
