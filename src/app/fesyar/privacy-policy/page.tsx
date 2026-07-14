"use client";

import LayoutFesyar from "@/components/fesyar/layout-fesyar";
import { cn } from "@/lib/utils";
import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const Header = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <h1 className={cn("text-lg font-bold text-white flex items-center gap-2", className)}>
      {children}
      <div className="bg-white h-0.5 rounded-full flex-1"></div>
    </h1>
  );
};

const Paragraph = ({ children }: { children: React.ReactNode }) => {
  return <p className="text-gray-50 text-sm font-medium">{children}</p>;
};

const page = () => {
  const router = useRouter();

  return (
    <LayoutFesyar footer="detail-page">
      <section className="py-8 space-y-4">
        <button type="button" className="flex items-center gap-2" onClick={() => router.back()}>
          <ArrowLeftIcon className="w-6 text-white" />
          <Header className="text-2xl">Kebijakan Privasi</Header>
        </button>

        <div
          className="col-span-7 rounded-2xl p-6 border-gray-50 border-2 space-y-3"
          style={{
            background: "rgba(255, 255, 255, 0.10)",
          }}
        >
          <Paragraph>
            Adanya Kebijakan Privasi ini adalah komitmen nyata dari SATUWAKAF Indonesia untuk menghargai dan melindungi
            setiap data atau informasi pribadi pengguna
          </Paragraph>

          <Header>Pengantar</Header>

          <Paragraph>
            Kebijakan Privasi ini mengatur mengenai landasan dasar bagaimana kami menggunakan informasi Pribadi pengguna
            platform SATUWAKAF Indonesia. Kebijakan Privasi berlaku bagi seluruh Pengguna. Dengan tetap mengakses dan
            menggunakan layanan platform SATUWAKAF Indonesia, pengguna dianggap menyatakan persetujuannya terhadap
            segala ketentuan dalam Kebijakan Privasi ini. Pemberitahuan Privasi berikut ini menjelaskan bagaimana kami
            SATUWAKAF Indonesia mengumpulkan, menyimpan, menggunakan, mengelola, menguasai, mentransfer, mengungkapkan
            dan melindungi informasi Pribadi anda. Sebelum anda menggunakan atau memberikan informasi apapun kepada
            Paltform ini, mohon untuk membaca dan memahami terlebih dahulu mengenai Kebijakan privasi yang telah kami
            buat ini. Kebijakan Privasi ini berlaku apabila pengguna menggunakan layanan atau platform ini.
          </Paragraph>

          <Header>Informasi</Header>

          <Paragraph>
            Kami meminta informasi yang diperlukan agar dapat memenuhi permintaan anda untuk menggunakan platform ini .
            Informasi anda kami simpan dan digunakan sesuai dengan ketentuan Undang-Undang, peraturan, kebijakan dan
            hukum pemerintah yang berlaku. Apabila anda memilih untuk tidak memberikan informasi apapun, kami mungkin
            tidak dapat memenuhi permintaan anda dalam menggunakan Paltform ini . kami menggunakan informasi Pribadi
            anda untuk berbagai keperluan verifikasi, untuk hal tersebut diperlukan agar terdapat kejelasan informasi
            dan tujuan dalam menggunakan platform kami, dan kami menggunakan email yang anda berikan untuk mengirim
            pembaharuan atau pesan dari Paltform kami baik secara berkala maupun saat itu juga . Dalam hal tertentu kami
            menggunakan informasi anda untuk meningkatkan mutu dan pelayanan Platform.
          </Paragraph>

          <Header>Perubahan atas kebijakan ini</Header>

          <Paragraph>
            Kami mengubah Kebijakan Privasi ini dari waktu ke waktu. Kami tidak akan mengurangi hak anda pada Kebijakan
            Privasi ini tanpa persetujuan eksplisit dari anda. Jika terdapat perubahan yang signifikan, kami akan
            memberikan pemberitahuan kepada seluruh pengguna Paltform, bisa melalui email, social media kami, maupun
            melalui Paltform ini secara langsung
          </Paragraph>

          <Header>Hukum</Header>

          <Paragraph>
            Kebijakan Privasi ini diatur sesuai dengan hukum Republik Indonesia. Pengguna setuju bahwa Tindakan hukum
            apapun atau sengketa yang mungkin timbul dari, dengan, atau berada dalam cara apapun berhubungan dengan
            situs dan/atau Kebijakan Privasi ini akan diselesaikan secara eksklusif dalam yurisdiksi Pengadilan Republik
            Indonesia.
          </Paragraph>
        </div>
      </section>
    </LayoutFesyar>
  );
};

export default page;
