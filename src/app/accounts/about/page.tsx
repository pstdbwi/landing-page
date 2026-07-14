"use client"
import Image from "next/image";
import Balance from 'react-wrap-balancer'
export default function About() {
    return (
        <section>
            <div className="space-y-2 p-5">
                <h1 className="text-base font-bold">Platform SATUWAKAF (Wakaf Uang, Wakaf Sosial, Wakaf Produktif) yang dikelola Badan Wakaf Indonesia</h1>
                <div className="w-full inline-flex items-start justify-center">
                    <Image src='/assets/logo-vertical.svg' alt="logo" width={200} height={250} />
                </div>
                <p className="text-sm text-gray-500 mt-2"><span className="text-primary-500 font-bold">SATUWAKAF Indonesia</span> berdedikasi untuk menjadi platform yang menjamin setiap wakafmu akan diterima oleh orang-orang yang benar membutuhkan setiap wakafmu.</p>
            </div>
            <div className="space-y-2 p-5">
                <h1 className="text-base font-semibold">Terima kasih telah menjadi Hamba Allah hari ini</h1>
                <p className="text-sm text-gray-500">Terima kasih karena sudah berbagi kebaikan hari ini melalui SATUWAKAF. Banyak orang diluar sana yang akan merasakan efek baik dari Wakaf yang kamu bagikan hari ini. Terima kasih telah menjadi bagian Hamba Allah hari ini.</p>
                <p className="text-sm text-gray-500">Kamu telah menjadi bagian dari sekian banyak Hamba Allah hari ini melalui SATUWAKAF. Jangan lupa berbuat baik lagi esok hari.</p>
            </div>
        </section>
    )
}
