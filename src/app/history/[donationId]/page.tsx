"use client"
import { Badge } from "@/components/Badge";
import { Button, buttonVariants } from "@/components/Button";
import { CampaignCard } from "@/components/CampaignCard";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/Form";
import { Header } from "@/components/Header";
import Lucide from "@/components/Icon/lucide";
import { Input } from "@/components/Input";
import { Label } from "@/components/Label";
import Separtor from "@/components/Separtor";
import { Skeleton, VerticalCardSkeleton } from "@/components/Skeleton";
import { notifyError, notifySuccess } from "@/components/Toaster";
import { env } from "@/lib/env";
import { CampaignTypeKeys, TCampaignType, personByCampaignType, proofByCampaignType } from "@/lib/typeCampaign";
import currencyFormater from "@/lib/utils";
import { useGetDonationById } from "@/services/donation/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { getCookie } from "cookies-next";
import { FileTextIcon, PencilLineIcon, XIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import React, { Fragment, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Toaster } from "react-hot-toast";
import Balancer from 'react-wrap-balancer';
import * as z from "zod";

export default function MyDonation({
    params,
}: {
    params: { donationId: string }
}) {
    const router = useRouter()
    const [openUpdateWakifName, setOpenUpdateWakifName] = useState(false)

    const {
        data: payment,
        isLoading,
        isError,
        refetch
    } = useGetDonationById({
        donationId: params.donationId,
        enabled: !!params.donationId
    })
    const nameBasedOnType = personByCampaignType[payment?.campaign?.type as CampaignTypeKeys]

    const FormSchema = z.object({
        wakif_name: z.string().min(1, {
            message: `Nama ${nameBasedOnType} wajib diisi`
        }),
    })

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            wakif_name: payment?.wakif_name || '',
        }
    })
    const isSubmitting = form.formState.isSubmitting;

    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        const body = {
            "donation_id": params?.donationId,
            "wakif_name": data?.wakif_name
        }
        try {
            await axios.put(`${env.NEXT_PUBLIC_BASE_URL}/donations/wakif_name`, body, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + getCookie('user_token')
                }
            }).then(response => {
                if (response.status === 200) {
                    notifySuccess(`Berhasil merubah nama ${nameBasedOnType} di bukti penerimaan`)
                    setOpenUpdateWakifName(false)
                    refetch()
                }
            }).catch(fallback => {
                const { error } = fallback.response.data
                notifyError(error.id)
            })
        } catch (error) {
            throw Error
        }
    }

    const openCertificate = async (): Promise<any> => {
        router.push(`/history/certificate?id=${params.donationId}`)
    }

    const openIkrar = async () => {
        router.push(`/history/charts/iqrarwaqf?id=${params?.donationId}`)
    }

    const renderStatus = () => {
        switch (payment?.status?.name) {
            case 'PENDING':
                return 'Belum dibayar'
            case 'CANCELLED':
                return 'Dibatalkan'
            case 'VERIFIED':
                return 'Sudah dibayar'
            default:
                return 'Belum dibayar'
        }
    }

    const renderBadgeStyle = () => {
        switch (payment?.status?.name) {
            case 'PENDING':
                return 'border-warning-200 bg-warning-300/30 text-warning-500 text-xs font-normal'
            case 'CANCELLED':
                return 'border-danger-200 bg-danger-300/30 text-danger-500 text-xs font-normal'
            case 'VERIFIED':
                return 'border-primary-200 bg-primary-300/30 text-primary-500 text-xs font-normal'
            default:
                return 'border-primary-200 bg-primary-300/30 text-primary-500 text-xs font-normal'
        }
    }

    useEffect(() => {
        form.setValue('wakif_name', payment?.wakif_name)
    }, [payment])

    return (
        <section className="layout bg-white min-h-screen relative">
            <Header title={payment?.campaign?.title} className="left-0 top-0" backTo="/history" />
            {isLoading || isError ? (
                <div className="inline-flex justify-between items-center w-full p-5 mt-16">
                    <Skeleton className="w-2/6 h-5 rounded-md" />
                    <Skeleton className="w-2/6 h-5 rounded-md" />
                </div>
            ) : (
                <div className="p-5 inline-flex justify-between items-center w-full mt-16">
                    <span className="font-semibold">Status {payment?.campaign?.campaign_category?.name}</span>
                    <Badge className={renderBadgeStyle()}>{renderStatus()}</Badge>
                </div>
            )}
            <div className="px-5 space-y-2 mb-4">
                {isLoading || isError ? <VerticalCardSkeleton /> : (
                    <CampaignCard
                        className="border-none"
                        title={payment?.campaign?.title}
                        donationAmount={payment?.campaign?.total_donation_amount}
                        cover={payment?.campaign?.banner_url}
                        expired={payment?.campaign?.expired}
                        donationTarget={payment.campaign?.donation_target}
                        campaignId={payment?.campaign?.id}
                        location={`${payment?.campaign?.location?.district} , ${payment?.campaign?.location?.city}`}
                        campaigner={payment?.campaign?.lembaga}
                        campaignType={payment?.campaign?.type} 
                        isPermanent={payment?.campaign?.is_permanent}
                        />
                )}
                <Button variant='blue' className="w-full font-semibold" onClick={() => router.push(`/campaign/${payment?.campaign?.id}?title=${payment?.campaign?.title}`)}>Tunaikan {TCampaignType[payment?.campaign?.type as CampaignTypeKeys]} lagi</Button>
            </div>
            <Separtor />
            <div className="p-5 space-y-3">
                <div className="inline-flex justify-between items-center w-full">
                    <h3 className="text-sm text-gray-500">ID {TCampaignType[payment?.campaign?.type as CampaignTypeKeys]}</h3>
                    <span className="text-sm text-gray-500 text-right max-w-[200px]">#{payment?.id}</span>
                </div>
                <div className="inline-flex justify-between items-center w-full">
                    <h3 className="text-sm text-gray-500">Nama {personByCampaignType[payment?.campaign?.type as CampaignTypeKeys]}</h3>
                    <span className="text-sm text-gray-500">{payment?.wakif_name}</span>
                </div>
                <div className="inline-flex justify-between items-center w-full">
                    <h3 className="text-sm text-gray-500">Metode Pembayaran</h3>
                    <span className="text-sm text-gray-500">{payment?.payment_method?.name}</span>
                </div>
                <div className="inline-flex justify-between items-center w-full">
                    <h3 className="text-sm text-gray-500">Nominal {TCampaignType[payment?.campaign?.type as CampaignTypeKeys]}</h3>
                    <span className="text-sm text-gray-500">RP {currencyFormater(payment?.amount?.amount)}</span>
                </div>
                <div className="inline-flex justify-between items-center w-full pb-3">
                    <h3 className="text-sm text-gray-500">Biaya Operasional Pemrosesan Pembayaran</h3>
                    <span className="text-sm text-gray-500">RP {currencyFormater(payment?.amount?.bank_fee)}</span>
                </div>
                <div className="inline-flex justify-between items-center w-full border-b pb-3">
                    <h3 className="text-sm text-gray-500">Infak pemeliharaan</h3>
                    <span className="text-sm text-gray-500">RP {currencyFormater(payment?.amount?.infak_fee)}</span>
                </div>
                <div className="inline-flex justify-between items-center w-full">
                    <h3 className="text-sm text-gray-500">Jumlah Dibayar</h3>
                    <span className="text-sm text-gray-500 font-semibold">RP {currencyFormater(payment?.amount?.total_amount)}</span>
                </div>
            </div>
            <Separtor />
            {payment?.status?.name === 'VERIFIED' ? (
                <div className="p-5 space-y-2">
                    <div className="w-full flex items-center gap-1">
                        <Link href={`/history/receipt?id=${params.donationId}`} target="_blank"
                            className={buttonVariants({ variant: 'outline', className: "w-full py-4 font-semibold border-secondary-400 text-secondary-400" })}
                        >
                            Lihat bukti penerimaan {TCampaignType[payment?.campaign?.type as CampaignTypeKeys]}
                        </Link>
                        <Button
                            size="icon"
                            variant="outline"
                            className="py-4 font-semibold border-secondary-400 text-secondary-400"
                            type="button"
                            onClick={() => setOpenUpdateWakifName(true)}
                        >
                            <PencilLineIcon className="w-4 h-4" />
                        </Button>
                    </div>
                    {
                        payment?.campaign?.type == 3 ?
                            <Fragment>
                                <Link
																		href={`/history/charts/iqrarwaqf?id=${params?.donationId}`}
                                    className={buttonVariants({className: "w-full font-semibold border-secondary-400 text-white", variant: "blue"})}
																		target="_blank"
																		>
                                    {proofByCampaignType[payment?.campaign?.type as CampaignTypeKeys]}
                                    {
                                        (+payment?.amount?.amount < 1000000) ? <span className="inline-flex items-center ml-2 text-xs bg-white text-blue-600 px-2 py-0.5 rounded-md"><FileTextIcon className="w-3 h-3" />Draft</span> : ""
                                    }
                                </Link>
                                {
                                    (+payment?.amount?.amount >= 1000000)  ? <Link
																				href={`/history/certificate?id=${params.donationId}`}
                                        className={buttonVariants({className: "w-full font-semibold border-secondary-400 text-white", variant: 'orange'})}
																				target="_blank"
																				>
                                        Sertifikat Wakaf Uang (SWU)
                                    </Link>
                                        : null
                                }
                            </Fragment>
                            : null
                    }

                </div>
            ) : null}

            {payment?.status?.name === 'VERIFIED' ? (
                <div className="px-5">
                    <div className="bg-secondary-100/50 w-full rounded-md p-5 inline-flex ">
                        <div>
                            <Balancer className="text-lg mb-2 font-bold">Terimakasih untuk {TCampaignType[payment?.campaign?.type as CampaignTypeKeys]}mu</Balancer>
                            <p className="text-sm text-gray-500">Pembayaran {TCampaignType[payment?.campaign?.type as CampaignTypeKeys]}mu telah kami terima dan akan kami salurkan segera! Semoga berkah selalu & jadi amal jariyah, aamiin,</p>
                        </div>
                        <Image src='/assets/thankyou.svg' alt='thankyou' width={100} height={100} />
                    </div>
                </div>
            ) : (
                <React.Fragment>
                    {payment?.status?.name === 'CANCELLED' ? null : (
                        <section className="px-5 pt-5">
                            <h1 className="text-base font-bold mb-2">Berbuat baik jangan ditunda tunda</h1>
                            <p className="text-sm text-gray-500">Segera selesaikan {TCampaignType[payment?.campaign?.type as CampaignTypeKeys]} Anda dengan transfer sesuai instruksi pembayaran dibawah ini</p>
                            <button onClick={() => router.push(`/campaign/${payment?.campaign?.id}/donate/${params.donationId}?type=${payment?.payment?.bank_code === 'QRIS' ? 'qris' : 'va'}`)} className="w-full mt-5 rounded-md bg-gray-100 p-3 cursor-pointer inline-flex justify-between items-center">
                                <span className="text-base">Instruksi pembayaran</span>
                                <Lucide name='chevron-right' size={30} className="text-primary-500" />
                            </button>
                        </section>
                    )}
                </React.Fragment>
            )}

            {openUpdateWakifName ? (
                <div className="fixed inset-0 layout w-full z-40 grid place-items-center px-6">
                    <div className="bg-white w-full p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                            <Label>Ubah nama {personByCampaignType[payment?.campaign?.type as CampaignTypeKeys]} di bukti penerimaan</Label>
                            <button type="button" onClick={() => setOpenUpdateWakifName(false)}>
                                <XIcon className="w-4 h-4" />
                            </button>
                        </div>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-2 mt-4">
                                <FormField
                                    control={form.control}
                                    name="wakif_name"
                                    render={({ field }) => (
                                        <FormItem className="border rounded-lg p-3">
                                            <FormLabel>Nama {personByCampaignType[payment?.campaign?.type as CampaignTypeKeys]}</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        {...field}
                                                        placeholder={`Masukan nama ${nameBasedOnType}`}
                                                        disabled={isSubmitting}
                                                    />

                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button disabled={isSubmitting} variant='blue' className="w-full font-semibold">Ubah</Button>
                            </form>
                        </Form>

                    </div>
                </div>
            ) : null}
            {openUpdateWakifName ? <div aria-hidden className="h-full bg-black/20 w-full absolute top-0 z-20"></div> : null}
            <Toaster position='bottom-center' />
        </section>
    )
}
