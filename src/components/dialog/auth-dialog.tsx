"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { CampaignTypeKeys, TCampaignType } from "@/lib/typeCampaign";
import { useDonationStore } from "@/store/useDonationStore";
import { Campaign } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { useRouter as useNavigation } from "next/navigation";
import { Dispatch, Fragment, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { Toaster } from "react-hot-toast";
import { z } from "zod";
import { Button } from "../Button";
import { notifyError } from "../Toaster";
import { Input } from "../ui/input";
import { ScreenLoader } from "../Loader";

interface Props {
  authModal: boolean;
  setAuthModal: Dispatch<SetStateAction<boolean>>;
  campaign: Campaign;
}

const formSchema = z.object({
  name: z.string({ required_error: "Nama wajib diisi" }).min(1, { message: "Nama wajib diisi" }),
  phone: z.string({ required_error: "No Telpon wajib diisi" }).min(1, { message: "No Telpon wajib diisi" }),
  email: z
    .string({ required_error: "Email wajib diisi" })
    .min(1, { message: "Email wajib diisi" })
    .email({ message: "Format email tidak valid" }),
});

const AuthDialog = ({ authModal, setAuthModal, campaign }: Props) => {
  const { updateDonationAnonymous } = useDonationStore();
  const navigation = useNavigation();
  const [screenLoading, setScreenLoading] = useState(false);

  const campaignType = TCampaignType[campaign?.type as CampaignTypeKeys];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
    },
  });
  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setScreenLoading(true);

      const payload = {
        campaign_id: campaign?.id,
        donor_name: values?.name,
        phone_number: values?.phone,
        email: values?.email,
      };

      updateDonationAnonymous(payload);

      navigation.push(`/campaign/${campaign?.id}/anonymous`);
    } catch (error) {
      console.error(error);
      notifyError("Terjadi Kesalahan");
    }
  };

  return (
    <Fragment>
      <Dialog open={authModal} onOpenChange={setAuthModal}>
        <DialogContent className="layout max-w-sm">
          <DialogHeader className="border-b pb-2">
            <DialogTitle className="text-sm">{campaignType} Tanpa Akun</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Nama<span className="text-sx text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Masukkan Nama Anda" disabled={isLoading} />
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
                    <FormLabel>
                      No Telepon<span className="text-sx text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} type="number" placeholder="Masukkan No Telepon Anda" disabled={isLoading} />
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
                      <Input {...field} placeholder="Masukkan Email Aktif Anda" disabled={isLoading} />
                    </FormControl>
                    <span className="text-[0.65rem] block text-gray-600 leading-4 italic">
                      *Masukkan email aktif untuk menerima rincian dan update status transaksi.
                    </span>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button className="w-full" disabled={isLoading}>
                Lanjutkan Ber{campaignType} <ArrowRightIcon className="w-4 ml-1" />
              </Button>

              <div className="w-full h-0.5 border border-gray-100"></div>

              <section className="px-5">
                <h1 className="text-center text-sm font-medium w-full text-gray-500">
                  Sudah punya akun ?
                  <div className="flex items-center justify-center gap-2">
                    <Link href="/login" className="text-secondary-500">
                      Login
                    </Link>

                    <span className="text-xs">atau</span>

                    <Link href="/register" className="text-secondary-500">
                      Daftar
                    </Link>
                  </div>
                </h1>
              </section>

              <div className="w-full">
                <span className="text-[0.65rem] block !text-center text-gray-600 leading-4 italic">
                  *berwakaf lebih baik dengan memiliki akun, karena anda akan dapat memperoleh AIW & Serifikat Wakaf
                  langsung di akun anda.
                </span>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <Toaster position="bottom-center" />

      {screenLoading ? <ScreenLoader /> : null}
    </Fragment>
  );
};

export default AuthDialog;
