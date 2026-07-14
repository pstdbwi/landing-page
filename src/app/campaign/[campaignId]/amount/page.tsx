"use client"
import { Header } from "@/components/Header";
import Lucide from "@/components/Icon/lucide";
import { Label } from "@/components/Label";
import { amountList } from "@/constant/pick-amount";
import { useRouter } from "next/navigation";
import * as StorageFactory from '@/lib/storage'
import { useSearchParams } from 'next/navigation'
import currencyFormater from "@/lib/utils";
import { useCreateDonationStore } from "@/store";

export default function Amount({
    params,
}: {
    params: {
        campaignId: string
    },
}) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { storeCreateDonation } = useCreateDonationStore()

    const localFactory = StorageFactory.local

    // const redirectToDonationPage = (amount: string) => {
    //     if (amount) {
    //         localFactory.setItem('donationAmount', amount)
    //         storeCreateDonation({
    //             amount: Number(amount)
    //         })
    //         router.push(`/campaign/${params.campaignId}/donate`)
    //     }
    // }

    return (
        <div className="pt-16 layout bg-white h-screen">
            <Header className="left-0 top-0" title={`Pilih Nominal Wakaf`} />
            <section className="p-5 bg-warning-50">
                <p className="text-xs italic text-gray-500">“Sesungguhnya orang - orang yang bersedekah baik laki-laki maupun perempuan dan meminjamkan kepada Allah dengan pinjaman yang baik, akan dilipatgandakan (Balasannya) bagi mereka; dan mereka akan mendepat pahala yang mulia.” (QS. Al-Hadid:18)</p>
            </section>
            <section className="p-5">
                <h1 className="text-base font-medium text-gray-500">Pilih Nominal Wakaf</h1>
                <div className="mt-3 space-y-3">
                    {/* {amountList.map((items, index) => {
                        return (
                            <button className="inline-flex justify-between items-center p-4 rounded-lg border cursor-pointer w-full" key={index} onClick={() => redirectToDonationPage(String(items.amount))}>
                                <Label className="text-base font-bold">Rp {currencyFormater(items.amount)}</Label>
                                <Lucide name='chevron-right' size={18} color="#44A846" />
                            </button>
                        )
                    })} */}
                </div>
            </section>
        </div>
    )
}
