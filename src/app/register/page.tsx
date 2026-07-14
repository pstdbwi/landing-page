"use client";

import { Button } from "@/components/Button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/Form";
import { Header } from "@/components/Header";
import Lucide from "@/components/Icon/lucide";
import { IcGoogle, TwinCircle } from "@/components/Icon/svg";
import { Input } from "@/components/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Select";
import Separtor from "@/components/Separtor";
import { notifyError } from "@/components/Toaster";
import { env } from "@/lib/env";
import { auth } from "@/lib/firebase";
import useIsSubDomain from "@/lib/isSubDomain";
import useSession from "@/lib/use-session";
import { useShareLink } from "@/lib/useShareLink";
import { getSubDomain, phoneNumberRegex } from "@/lib/utils";
import { useGetCityList, useGetDistrictList, useGetProvinceList } from "@/services/location/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Toaster } from "react-hot-toast";
import { z } from "zod";

export default function Register() {
  const { isSubDomain, currentDomain } = useIsSubDomain();
  const { loginGoogle } = useSession();
  const router = useRouter();

  const [isLoading, setLoading] = useState(false);
  const [succesRegister, setSuccessRegister] = useState(false);
  const { shareLink, setShareLink } = useShareLink();

  const FormSchema = z
    .object({
      fullname: z.string().min(1, {
        message: "Nama lengkap harus diisi",
      }),
      phone_number: z
        .string()
        .min(1, {
          message: "nomor harus diisi",
        })
        .max(14, {
          message: "masukan nomor yang valid.",
        })
        .regex(phoneNumberRegex, {
          message: "masukan nomor yang valid dengan awalan 0 atau 62.",
        }),
      email: z
        .string({
          required_error: "Nomor ponsel harus diisi.",
        })
        .min(1, {
          message: "Email harus diisi.",
        })
        .email({
          message: "Email tidak valid.",
        }),
      province_code: z
        .string({
          required_error: "Provinsi harus dipilih",
        })
        .min(1, { message: "Provinsi harus dipilih" }),
      city_code: z
        .string({
          required_error: "Kota/Kabupaten harus dipilih",
        })
        .min(1, { message: "Kota/Kabupaten harus dipilih" }),
      district_code: z
        .string({
          required_error: "Kecamatan harus dipilih",
        })
        .min(1, { message: "Kecamatan harus dipilih" }),
      password: z.string().min(2, {
        message: "Kata sandi harus diisi.",
      }),
      confirm_password: z.string({
        required_error: "Konfirmasi kata sandi harus diisi",
      }),
    })
    .refine((data) => data.password === data.confirm_password, {
      message: "password tidak sama",
      path: ["confirm_password"],
    });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      fullname: "",
      email: "",
      phone_number: "",
      password: "",
      confirm_password: "",
      province_code: "",
      city_code: "",
      district_code: "",
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
    try {
      setLoading(true);
      const payload = {
        ...data,
        email: data.email.toLowerCase(),
        phone_number: data?.phone_number?.replace(/^0/, "62"),
        subdomain: getSubDomain(currentDomain)?.toLowerCase(),
      };
      await axios
        .post(`${env.NEXT_PUBLIC_BASE_URL}/registration`, payload, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          setLoading(false);
          setSuccessRegister(true);
          form.reset();
        })
        .catch((fallback) => {
          setLoading(false);
          const { error } = fallback.response.data;
          notifyError(error.id);
        });
    } catch (error) {
      throw Error;
    }
  };

  const handleSigninByGoogle = () => {
    router.push("/login");
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      const google_sso: { user: any } = await signInWithPopup(auth as any, provider);

      const body = {
        username: google_sso.user.email,
        fullname: google_sso.user.displayName,
        firebase_uid: google_sso.user.uid,
      };

      let result = (await loginGoogle({ ...body })) as any;

      if (result?.error) {
        notifyError(result?.error?.id);
        setLoading(false);
      } else {
        if (shareLink) {
          const separator = shareLink.includes("?") ? "&" : "?";
          window.location.replace(shareLink + separator + "redirect_from=register");
          setShareLink("");
        } else {
          window.location.replace("/");
        }
        setLoading(false);
      }
    } catch (error: any) {
      console.log("error", error);
      setLoading(false);
    }
  };

  const handleSigninByFacebook = () => {
    router.push("/login");
  };

  return (
    <main className="relative bg-white pt-16 layout pb-16">
      <Header title="Register" className="left-0 top-0" />
      {isLoading ? (
        <div className="absolute top-0 bg-black/30 h-full w-full flex flex-col items-center justify-center z-40">
          <div className="bg-white rounded-lg p-5 flex flex-col justify-center items-center gap-2">
            <TwinCircle />
            <span>Mohon tunggu</span>
          </div>
        </div>
      ) : null}
      <section className="p-5 space-y-2">
        <div className="space-y-1 mb-3">
          <h1 className="text-base font-bold">Daftar dan Jadi Bagian SATUWAKAF</h1>
          <p className="text-sm text-gray-500">
            Bergabung sekarang dan nikmati kemudahan menunaikan wakaf dan akses fitur lainnya.
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
            <div className="border rounded-t-lg px-3 py-2">
              <FormField
                control={form.control}
                name="fullname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-500">Nama lengkap</FormLabel>
                    <FormControl>
                      <Input placeholder="Nama lengkap*" {...field} />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="border-b border-x px-3 py-2">
              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-500">Nomor ponsel atau WhatsApp</FormLabel>
                    <FormControl>
                      <Input placeholder="Nomor ponsel atau WhatsApp*" {...field} />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="border-x border-b px-3 py-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-500">Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email*" {...field} />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="border-x border-b px-3 py-2">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-500">Password</FormLabel>
                    <FormControl>
                      <Input placeholder="Password*" type="password" {...field} />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="border-x border-b px-3 py-2">
              <FormField
                control={form.control}
                name="confirm_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-500">Konfirmasi Password</FormLabel>
                    <FormControl>
                      <Input placeholder="Konfirmasi Password*" type="password" {...field} />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <h1 className="text-base font-bold my-3">Informasi Alamat</h1>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="province_code"
                render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                      onValueChange={field.onChange}
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
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={watch.city_code === ""}>
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
            </div>
            <Button className="w-full mt-3" variant="blue" type="submit">
              Daftar sekarang
            </Button>
          </form>
        </Form>
      </section>
      <Separtor />
      <section className="p-5">
        <h1 className="text-center text-sm font-medium w-full text-gray-500">
          Sudah punya akun ?{" "}
          <Link href="/login" className="text-secondary-500">
            Masuk
          </Link>
        </h1>
      </section>
      {isSubDomain ? null : (
        <section className="px-5 space-y-4">
          <p className="text-sm text-gray-500 text-center">atau lebih cepat</p>
          {/* <Button onClick={() => handleSigninByFacebook()} className="w-full border-text-500 bottom-2 font-semibold text-sm text-gray-500 border-text-gray-500 inline-flex items-center gap-3" variant='outline'>
										<IcFacebok />
										<span>Sign In with Facebook</span>
								</Button> */}
          <Button
            onClick={() => signInWithGoogle()}
            className="w-full border-text-500 bottom-2 font-semibold text-sm text-gray-500 border-text-gray-500 inline-flex items-center gap-3"
            variant="outline"
          >
            <IcGoogle />
            <span>Sign In with Google</span>
          </Button>
        </section>
      )}

      {succesRegister ? (
        <div className="fixed bottom-0 w-full rounded-t-2xl bg-white px-5 pb-4 layout z-40">
          <div className="w-full relative mb-8">
            <button onClick={() => setSuccessRegister(false)}>
              <Lucide name="x" size={20} className="absolute left-2 bottom-0" />
            </button>
            <h1 className="text-base font-bold text-center">Konfirmasi Email</h1>
          </div>
          <div className="flex flex-col items-center justify-center w-full mb-8 gap-2">
            <Image src="/assets/success.svg" height={100} width={100} alt="sorry" />
            <h1 className="text-xl font-bold">Aktivasi segera akun Anda</h1>
            <p className="text-sm text-gray-500 text-center">
              Silahkan cek email Anda untuk melanjutkan proses pendaftaran. Kemudian klik link yang kami kirimkan untuk
              aktivasi akun.
            </p>
          </div>
          <Button variant="blue" size="full" onClick={() => router.push("/")}>
            Kembali ke beranda
          </Button>
        </div>
      ) : null}
      <Toaster position="bottom-center" />
      {succesRegister ? <div aria-hidden className="h-screen bg-black/20 w-full absolute top-0"></div> : null}
    </main>
  );
}
