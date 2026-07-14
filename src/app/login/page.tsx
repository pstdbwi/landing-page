"use client";

import { Button } from "@/components/Button";
import { Checkbox } from "@/components/Checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/Form";
import { Header } from "@/components/Header";
import Lucide from "@/components/Icon/lucide";
import { IcGoogle, TwinCircle } from "@/components/Icon/svg";
import { Input } from "@/components/Input";
import Separtor from "@/components/Separtor";
import { auth } from "@/lib/firebase";
import useSession from "@/lib/use-session";
import { useShareLink } from "@/lib/useShareLink";
import { separatorLink } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Toaster } from "react-hot-toast";
import { z } from "zod";

export default function LoginPage() {
  const router = useRouter();
  const { login, loginGoogle, session } = useSession();
  const [loading, setLoading] = useState<boolean>(false);
  const [loginNotFound, setLoginNotFound] = useState<boolean>(false);
  const [error, setError] = useState("Data registrasi Anda tidak ditemukan");
  const [xForOS, setXForOS] = useState<string | null>(null);
  const { shareLink, setShareLink } = useShareLink();

  const RenderSigninForm = () => {
    const FormSchema = z.object({
      username: z
        .string()
        .min(2, {
          message: "username harus diisi.",
        })
        .email({
          message: "email tidak valid",
        }),
      password: z.string().min(2, {
        message: "password harus diisi.",
      }),
    });

    const form = useForm<z.infer<typeof FormSchema>>({
      resolver: zodResolver(FormSchema),
      defaultValues: {
        username: "",
        password: "",
      },
    });

    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
      setLoading(true);
      const result = (await login({ username: data?.username, password: data?.password })) as any;

      if (result?.error) {
        setError(result?.error?.id);
        setLoginNotFound(true);
        setLoading(false);
      } else {
        if (shareLink) {
          const separator = separatorLink(shareLink);
          window.location.replace(shareLink + separator + "redirect_from=login");
          setShareLink("");
        } else {
          window.location.replace("/");
        }
      }
    };

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
          <div className="border rounded-t-lg px-3 py-2">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-500">Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan nomor ponsel atau email" {...field} />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="border-b border-x rounded-b-lg px-3 py-2">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-500">Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Password" type="password" {...field} />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="inline-flex justify-between items-center w-full my-5">
            <div className="flex items-center space-x-2">
              <Checkbox id="terms2" />
              <label
                htmlFor="terms2"
                className="text-xs text-gray-500 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Ingatkan saya
              </label>
            </div>
            <Link href="/accounts/reset-password" className="text-sm text-gray-500">
              Lupa password?
            </Link>
          </div>
          <Button className="w-full" variant="blue" type="submit">
            Masuk ke akun saya
          </Button>
        </form>
      </Form>
    );
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
        setError(result?.error?.id);
        setLoginNotFound(true);
        setLoading(false);
      } else {
        if (shareLink) {
          const separator = separatorLink(shareLink);
          window.location.replace(shareLink + separator + "redirect_from=login");
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

  useEffect(() => {
    if (typeof window) {
      setXForOS(localStorage.getItem("x-for-os") || null);
    }
  }, []);

  return (
    <section className="relative bg-white pt-16 layout min-h-screen">
      <Header title="Login" className="left-0 top-0" />
      {loading && (
        <div className="absolute top-0 bg-black/30 h-screen w-full flex flex-col items-center justify-center z-40">
          <div className="bg-white rounded-lg p-5 flex flex-col justify-center items-center gap-2">
            <TwinCircle />
            <span>Mohon tunggu</span>
          </div>
        </div>
      )}
      <section className="p-5 space-y-2">
        <div className="space-y-1 mb-3">
          <h1 className="text-base font-bold">Masuk akun SATUWAKAF</h1>
          <p className="text-sm text-gray-500">Masuk untuk nikmati kemudahan wakaf.</p>
        </div>
        <RenderSigninForm />
      </section>
      <Separtor />
      <section className="px-5 pt-4">
        <h1 className="text-center text-sm font-medium w-full text-gray-500">
          Belum punya akun ?{" "}
          <Link href="/register" className="text-secondary-500">
            Daftar
          </Link>
        </h1>
      </section>

      {xForOS !== "ios" && (
        <section className="p-5 space-y-4">
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

      <Toaster position="bottom-center" />
      {loginNotFound ? (
        <div className="fixed bottom-0 w-full rounded-t-2xl bg-white px-5 pb-4 layout z-40">
          <div className="w-full relative mb-8">
            <button onClick={() => setLoginNotFound(false)}>
              <Lucide name="x" size={20} className="absolute left-2 bottom-0" />
            </button>
            <h1 className="text-base font-bold text-center">Informasi Pendaftaran</h1>
          </div>
          <div className="flex flex-col items-center justify-center w-full mb-8 gap-2">
            <Image src="/assets/sorry.svg" height={100} width={100} alt="sorry" />
            <h1 className="text-xl font-bold">{error}</h1>
            <p className="text-sm text-gray-500 text-center">
              Mohon maaf sepertinya pendaftaran akun Anda tidak berhasil.
            </p>
            <button className="text-secondary-500 font-semibold text-sm mt-3" onClick={() => setLoginNotFound(false)}>
              Kirim ulang
            </button>
          </div>
          <Button variant="blue" size="full" onClick={() => router.push("/")}>
            Kembali ke beranda
          </Button>
        </div>
      ) : null}
      {loginNotFound ? <div aria-hidden className="h-screen bg-black/20 w-full absolute top-0"></div> : null}
    </section>
  );
}
