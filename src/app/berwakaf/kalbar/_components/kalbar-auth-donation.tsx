"use client";

import { GradientText } from "@/app/berwakaf/_components/gradient-text";
import { notifyError } from "@/components/Toaster";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CampaignTypeKeys, TCampaignType } from "@/lib/typeCampaign";
import { useDonationStore } from "@/store/useDonationStore";
import { Campaign } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import { useRouter as useNavigation } from "next/navigation";
import { Dispatch, Fragment, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { Toaster } from "react-hot-toast";
import { z } from "zod";
import { LoaderPopup } from "../../_components/loader";

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

const KalbarAuthDonation = ({ authModal, setAuthModal, campaign }: Props) => {
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
        <DialogContent className="bg-fesyar-green-500 border-none rounded-xl w-full overflow-hidden max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-center">
              <GradientText>{campaignType} Langsung</GradientText>
            </DialogTitle>
          </DialogHeader>

          <Image src={"/assets/fesyar/wastra.png"} fill alt="wastra" className="absolute top-0 left-0" />
          <Image src="/assets/fesyar/wastra.png" fill alt="wastra" className="absolute top-0 right-0 scale-x-[-1]" />

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 z-40 relative">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">
                      Nama<span className="text-sx text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Masukkan Nama Anda"
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
                name="phone"
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">
                      Email<span className="text-sx text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Masukkan Email Aktif Anda"
                        disabled={isLoading}
                        className="bg-gray-50/20 text-white font-medium placeholder:text-gray-50"
                      />
                    </FormControl>
                    <span className="text-[0.65rem] block text-gray-100 leading-4 italic">
                      *Masukkan email aktif untuk menerima rincian dan update status transaksi.
                    </span>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                className="w-full bg-fesyar-gold text-fesyar-green-700 font-bold relative z-20"
                disabled={isLoading}
              >
                Lanjutkan Ber{campaignType} <ArrowRightIcon className="w-4 ml-1" />
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <Toaster position="bottom-center" />

      {screenLoading ? <LoaderPopup /> : null}
    </Fragment>
  );
};

export default KalbarAuthDonation;
