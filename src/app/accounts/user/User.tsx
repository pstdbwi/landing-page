"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/Avatar";
import { Button } from "@/components/Button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/Form";
import { Input } from "@/components/Input";
import { Label } from "@/components/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Select";
import Separtor from "@/components/Separtor";
import { ProfileSkeleton } from "@/components/Skeleton";
import { Switch } from "@/components/Switch";
import { notifyError, notifySuccess } from "@/components/Toaster";
import { env } from "@/lib/env";
import useSession from "@/lib/use-session";
import { phoneNumberFormater } from "@/lib/utils";
import { useGetDonorProfile } from "@/services/donor/hooks";
import { useGetCityList, useGetDistrictList, useGetProvinceList } from "@/services/location/hooks";
import { visitor } from "@/services/visitor";
import { useVisitorHistory } from "@/store/visitor";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { getCookie } from "cookies-next";
import { ChevronRightIcon, LockIcon } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Toaster } from "react-hot-toast";
import * as z from "zod";

const FormSchema = z.object({
  avatar: z.string().optional(),
  fullname: z.string().optional(),
  phone_number: z.string().optional(),
  email: z.string().optional(),
  willing_to_contact_by_lembaga: z.boolean().optional(),
  province_code: z.string({ required_error: "Provinsi harus dipilih" }).optional(),
  city_code: z.string({ required_error: "Kota/Kabupaten harus dipilih" }).optional(),
  district_code: z.string({ required_error: "Kecamatan harus dipilih" }).optional(),
});

export default function User() {
  const router = useRouter();
  const { session } = useSession();
  const { store, storeVisitorHistory } = useVisitorHistory();
  const params = useSearchParams();
  const userId = params.get("id");

  const [avatar, setAvatar] = useState("");
  const [isChangeAvatar, setIsChangeAvatar] = useState<boolean>(false);

  const { data: profile, isLoading } = useGetDonorProfile({
    donorId: userId,
    enabled: session?.isLoggedIn,
    refetchOnMount: "always",
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      city_code: profile?.city_code || "",
      district_code: profile?.district_code || "",
      province_code: profile?.province_code || "",
      willing_to_contact_by_lembaga: profile?.share_userdata_agreement,
      fullname: profile?.full_name || "",
      phone_number: profile?.phone_number || "",
      email: profile?.email || "",
    },
  });

  const watch = form.watch();
  const { data: provinsi } = useGetProvinceList({});

  const { data: kota } = useGetCityList({
    provinceId: watch.province_code,
    enabled: watch.province_code !== "",
  });

  const { data: kecamatan } = useGetDistrictList({
    cityId: watch.city_code,
    enabled: watch.city_code !== "",
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const body = {
      ...session,
      ...data,
      image_url: isChangeAvatar ? avatar : "",
      phone_number: data?.phone_number ? phoneNumberFormater(data?.phone_number) : null,
    };

    try {
      await axios
        .put(`${env.NEXT_PUBLIC_BASE_URL}/donors`, body, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + getCookie("user_token"),
          },
        })
        .then((response) => {
          if (response.status === 200) {
            notifySuccess("Profil berhasil disimpan");

            setTimeout(() => {
              router.push(`/accounts`);
            }, 800);
          }
        })
        .catch((fallback) => {
          const { error } = fallback.response.data;
          notifyError(error.id);
        });
    } catch (error) {
      throw Error;
    }
  };

  const handleChangeImages = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = event.target.files ? event.target.files[0] : null;
      const response = await axios.post(
        `${env.NEXT_PUBLIC_BASE_URL}/images/upload`,
        {
          image: files,
          domain_image: "donor_temp",
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + getCookie("user_token"),
          },
        }
      );
      if (response.status === 200) {
        notifySuccess("Berhasil ubah foto");
        setIsChangeAvatar(true);
        setAvatar(response.data.data[0].full_url);
      }
    } catch (error) {
      notifyError("Gagal ubah foto");
    }
  };

  useEffect(() => {
    setAvatar(profile?.profile_picture);
    form.setValue("fullname", profile?.full_name);
    form.setValue("phone_number", profile?.phone_number);
    form.setValue("email", profile?.email);
  }, [profile]);

  useEffect(() => {
    async function runVisit() {
      const result = await visitor({ user: session, page: "profile", store });
      if (result) {
        storeVisitorHistory({ page: "profile" });
      }
    }

    if (session?.corp_id) {
      runVisit();
    }
  }, [session]);

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  return (
    <section className="px-5">
      <section className="p-5 space-y-4 w-full flex flex-col justify-center items-center">
        <Avatar className="w-[80px] h-[80px]">
          <AvatarImage src={avatar} />
          <AvatarFallback>{session?.name?.substring(1, 0)}</AvatarFallback>
        </Avatar>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="picture" className="text-sm font-semibold text-secondary-500 text-center">
            Ubah foto profil
          </Label>
          <Input
            className="hidden"
            id="picture"
            type="file"
            multiple
            accept="image/*"
            onChange={(event) => handleChangeImages(event)}
          />
        </div>
      </section>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full pb-10">
          <div className="border rounded-lg">
            <FormField
              control={form.control}
              name="fullname"
              render={({ field }) => (
                <FormItem className="p-3 border-b">
                  <FormLabel className="text-gray-500 text-xs">Nama lengkap</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input {...field} placeholder={profile?.full_name} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem className="p-3 border-b">
                  <FormLabel className="text-gray-500 text-xs">Nomor ponsel atau WhatsApp</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input {...field} placeholder={profile?.phone_number} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="p-3 border-b">
                  <FormLabel className="text-gray-500 text-xs">Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input {...field} placeholder={profile?.email} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="willing_to_contact_by_lembaga"
              render={({ field }) => (
                <FormItem className="p-3 border-b">
                  <FormLabel className="text-gray-500 text-xs">Bersedia dihubungi</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <div className="inline-flex items-center justify-between w-full">
                        <p className="text-xs">Saya berseda dihubungi oleh lembaga pembuat program</p>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Link href="/accounts/user/user-reset" className="p-3 py-5 inline-flex justify-between items-center w-full">
              <div className="inline-flex space-x-2 items-center">
                <LockIcon size={14} />
                <span>Ubah kata sandi</span>
              </div>
              <ChevronRightIcon size={14} />
            </Link>
          </div>
          <Separtor isAbsolute />
          <h1 className="text-base font-bold my-3 pt-10">Informasi Alamat</h1>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="province_code"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={profile?.province ? profile?.province : "Pilih Provinsi"} />
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
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={watch.province_code === ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={profile?.city ? profile?.city : "Pilih Kota/Kabupaten"} />
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
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={watch.city_code === ""}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={profile?.district ? profile?.district : "Pilih Kecamatan"} />
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
          </div>
          <Button type="submit" variant="blue" className="w-full mt-4">
            Simpan
          </Button>
        </form>
      </Form>
      <Toaster position="bottom-center" />
    </section>
  );
}
