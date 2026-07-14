import Separtor from "@/components/Separtor";
import axios from "axios";
import Image from "next/image";
import Information from "./information";

const  getData = async () => {
	const response = await axios.get("https://api2.satuwakafindonesia.id/contacts")
	return {
		data:  response?.data?.data
	}
}

export default async function Contact() {
		const { data } = await getData()

    return (
        <>
            <section className="space-y-2 p-5">
                <div className="inline-flex justify-center items-center w-full">
                    <Image width={100} height={100} alt="wakif" src='/assets/wakif.svg' />
                </div>
                <h1 className="text-base font-semibold text-center">Butuh Bantuan?</h1>
                <p className="text-sm text-gray-500 text-center">Jangan sungkan untuk menghubungi Kami jika Anda memiliki pertanyaan, kendala, atau saran tentang SATUWAKAF.</p>
            </section>
            <Separtor />
           <Information data={data} />
        </>
    )
}
