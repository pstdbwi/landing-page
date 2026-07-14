"use client"
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Balance from 'react-wrap-balancer'

export default function Privacy() {
	const [currentDomain, setCurrentDomain] = useState('')

	useEffect(()=>{
		// handle UI & Data if not apps.satuwakaf.id
		if(typeof window){
			setCurrentDomain(window.location.host)
		}
	},[])

    return (
        <section>
            <div className="space-y-2 p-5">
                <Balance className="text-base font-bold">Kebijakan Privasi</Balance>
                <Balance className="text-sm text-gray-500 mt-2">
                    Adanya Kebijakan Privasi ini adalah komitmen nyata dari SATUWAKAF Indonesia untuk menghargai dan melindungi setiap data atau informasi pribadi pengguna situs <Link href={`${currentDomain}`}>{currentDomain}</Link>.
                </Balance>
                <Balance className="text-base text-gray-500 mt-2 font-bold">
                    Pengantar
                </Balance>
                <Balance className="text-sm text-gray-500 mt-2">
                    Kebijakan Privasi ini mengatur mengenai landasan dasar bagaimana kami menggunakan informasi Pribadi pengguna platform SATUWAKAF Indonesia. Kebijakan Privasi berlaku bagi seluruh Pengguna. Dengan tetap mengakses dan menggunakan layanan platform SATUWAKAF Indonesia, pengguna dianggap menyatakan persetujuannya terhadap segala ketentuan dalam Kebijakan Privasi ini.
                    Pemberitahuan Privasi berikut ini menjelaskan bagaimana kami SATUWAKAF Indonesia mengumpulkan, menyimpan, menggunakan, mengelola, menguasai, mentransfer, mengungkapkan dan melindungi informasi Pribadi anda.
                    Sebelum anda menggunakan atau memberikan informasi apapun kepada Paltform ini, mohon untuk membaca dan memahami terlebih dahulu mengenai Kebijakan privasi yang telah kami buat ini.
                    Kebijakan Privasi ini berlaku apabila pengguna menggunakan layanan atau platform ini.
                </Balance>
                <Balance className="text-base text-gray-500 mt-2 font-bold">
                    Informasi
                </Balance>
                <Balance className="text-sm text-gray-500 mt-2">
                    Kami meminta informasi yang diperlukan agar dapat memenuhi permintaan anda untuk menggunakan platform ini . Informasi anda kami simpan dan digunakan sesuai dengan ketentuan Undang-Undang, peraturan, kebijakan dan hukum pemerintah yang berlaku. Apabila anda memilih untuk tidak memberikan informasi apapun, kami mungkin tidak dapat memenuhi permintaan anda dalam menggunakan Paltform ini .
                    kami menggunakan informasi Pribadi anda untuk berbagai keperluan verifikasi, untuk hal tersebut diperlukan agar terdapat kejelasan informasi dan tujuan dalam menggunakan platform kami, dan kami menggunakan email yang anda berikan untuk mengirim pembaharuan atau pesan dari Paltform kami baik secara berkala maupun saat itu juga . Dalam hal tertentu kami menggunakan informasi anda untuk meningkatkan mutu dan pelayanan Paltform .
                </Balance>
                <Balance className="text-base text-gray-500 mt-2 font-bold">
                    Perubahan atas kebijakan ini
                </Balance>
                <Balance className="text-sm text-gray-500 mt-2">
                    Kami mengubah Kebijakan Privasi ini dari waktu ke waktu. Kami tidak akan mengurangi hak anda pada Kebijakan Privasi ini tanpa persetujuan eksplisit dari anda. Jika terdapat perubahan yang signifikan, kami akan memberikan pemberitahuan kepada seluruh pengguna Paltform, bisa melalui email, social media kami, maupun melalui Paltform ini secara langsung
                </Balance>
                <Balance className="text-base text-gray-500 mt-2 font-bold">
                    Hukum
                </Balance>
                <Balance className="text-sm text-gray-500 mt-2">
                    Kebijakan Privasi ini diatur sesuai dengan hukum Republik Indonesia. Pengguna setuju bahwa Tindakan hukum apapun atau sengketa yang mungkin timbul dari, dengan, atau berada dalam cara apapun berhubungan dengan situs dan/atau Kebijakan Privasi ini akan diselesaikan secara eksklusif dalam yurisdiksi Pengadilan Republik Indonesia.
                </Balance>
            </div>
        </section >
    )
}
