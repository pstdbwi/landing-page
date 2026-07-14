"use client";
import { Button } from "@/components/Button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/Form";
import { ScreenLoader } from "@/components/Loader";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Select";
import { Skeleton } from "@/components/Skeleton";
import { notifyError, notifySuccess } from "@/components/Toaster";
import { env } from "@/lib/env";
import useSession from "@/lib/use-session";
import { useGetDonorProfile } from "@/services/donor/hooks";
import { useGetCorporateUnit } from "@/services/unit/hook";
import { visitor } from "@/services/visitor";
import { useVisitorHistory } from "@/store/visitor";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Toaster } from "react-hot-toast";
import * as z from "zod";

const FormSchema = z.object({
  corp_unit_id: z.string({ required_error: "Wajib diisi" }).min(1, { message: "Wajib diisi" }),
  corp_unit_name: z
    .string({ required_error: "Satuan Kerja Wajib diisi" })
    .min(1, { message: "Satuan Kerja Wajib diisi" }),
  group: z.string({ required_error: "Wajib diisi" }).min(1, { message: "Wajib diisi" }),
});

const listGroups = [
  { value: "HQ", label: "Kantor Pusat" },
  { value: "RDN", label: "KPw" },
];

const UserUnit = () => {
  const { session } = useSession();
  const { store, storeVisitorHistory } = useVisitorHistory();
  const params = useSearchParams();
  const userId = params.get("id");

  const { data: profile, isLoading } = useGetDonorProfile({
    donorId: userId,
    enabled: session?.isLoggedIn,
    refetchOnMount: "always",
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      corp_unit_id: session?.corp_unit_id || "",
      corp_unit_name: session?.corp_unit_name || "",
      group: session?.corp_unit_group || "",
    },
  });
  const isSubmitting = form.formState.isSubmitting;
  const watchGroup = form.watch("group");

  const { data: corp_units } = useGetCorporateUnit({
    corp_id: session?.corp_id,
    group: watchGroup,
    enabled: !!watchGroup,
  });


  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      const payload = {
        ...profile,
        corp_unit_group: data?.group,
        corp_unit_id: data?.corp_unit_id,
        corp_unit_name: data?.corp_unit_name,
        corp_id: session?.corp_id,
        corp_name: session?.corp_name,
      };

      // UPDATE SESSION
      await axios.post(`/api/session/update`, payload);

      await axios
        .put(`${env.NEXT_PUBLIC_BASE_URL}/donors`, payload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + getCookie("user_token"),
          },
        })
        .then((response) => {
          if (response.status === 200) {
            notifySuccess("Profil berhasil disimpan");
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

  useEffect(() => {
    form.setValue("group", session?.corp_unit_group);
    form.setValue("corp_unit_id", session?.corp_unit_id);
    form.setValue("corp_unit_name", session?.corp_unit_name);
  }, [session]);

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
    return (
      <div className="p-5">
        <div className="border rounded-md w-full inset-x-0">
          <div className="border-b p-2">
            <Skeleton className="w-2/6 mb-2 h-5 rounded-md" />
            <Skeleton className="w-full h-10 rounded-md" />
          </div>
          <div className="p-2">
            <Skeleton className="w-2/6 mb-2 h-5 rounded-md" />
            <Skeleton className="w-full h-10 rounded-md" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="px-5">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <h1 className="text-base font-bold my-3">Ubah Satuan Kerja</h1>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="group"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      form.setValue("corp_unit_id", "");
                      form.setValue("corp_unit_name", "");
                    }}
                    defaultValue={field.value}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue>
                          {field?.value || "Tingkat Satuan Kerja"}
                          </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="overflow-y-auto max-h-[10rem]">
                      {listGroups?.map((item) => {
                        return (
                          <SelectItem key={item?.value} value={item.value}>
                            {item.label}
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
              name="corp_unit_name"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={(value) => {
                      const parseValue = JSON.parse(value);

                      field.onChange(parseValue?.name);
                      form.setValue("corp_unit_id", parseValue?.ID);
                    }}
                    defaultValue={field.value}
                    disabled={!watchGroup || isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue>{field?.value || "Pilih Satuan Kerja"}</SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="overflow-y-auto max-h-[10rem]">
                      {corp_units?.map((item: Record<string, any>, index: number) => {
                        return (
                          <SelectItem key={index} value={JSON.stringify(item)}>
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
          <Button type="submit" variant="blue" className="w-full mt-4" disabled={isSubmitting}>
            Simpan
          </Button>
        </form>
      </Form>

      {isSubmitting || isLoading ? <ScreenLoader /> : null}
      <Toaster position='bottom-center' />
    </section>
  );
};

export default UserUnit;
