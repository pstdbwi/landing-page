"use client";
import { TwinCircle } from "@/components/Icon/svg";
import currencyFormater, { cn } from "@/lib/utils";
import { useGetDonationById } from "@/services/donation/hooks";
import moment from "moment";
import "moment/locale/id";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function Certificate() {
	const searchParams = useSearchParams();
	const donationId = searchParams.getAll("id");

	const { data: payment, isLoading } = useGetDonationById({
		donationId: donationId,
		enabled: !!donationId,
	});

	if(isLoading){
		return 	<div className="relative h-full bg-white inset-x-0">
					<img src="/assets/top-left.svg" width={100} height={100} className="absolute left-3 top-3" alt="decoration" />
					<img src="/assets/top-right.svg" width={100} height={100} className="absolute right-3 top-3" alt="decoration" />
					<img
						src="/assets/bottom-right.svg"
						width={100}
						height={100}
						className="absolute right-3 bottom-3"
						alt="decoration"
					/>
					<img
						src="/assets/bottom-left.svg"
						width={100}
						height={100}
						className="absolute left-3 bottom-3"
						alt="decoration"
					/>
					{/* <img
						src="/assets/certificate-bg.png"
						width={500}
						height={500}
						className="absolute z-0 left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]"
						alt="decoration"
					/> */}

						<div className="absolute top-0 bg-black/30 h-screen w-full flex flex-col items-center justify-center z-40">
							<div className="bg-white rounded-lg p-5 flex flex-col justify-center items-center gap-2">
								<TwinCircle />
								<span>Mohon tunggu</span>
							</div>
						</div>

				</div>
	}

	return (
		<div className="relative h-full bg-white inset-x-0">
			<img src="/assets/top-left.svg" width={100} height={100} className="absolute left-3 top-3" alt="decoration" />
			<img src="/assets/top-right.svg" width={100} height={100} className="absolute right-3 top-3" alt="decoration" />
			<img
				src="/assets/bottom-right.svg"
				width={100}
				height={100}
				className="absolute right-3 bottom-3"
				alt="decoration"
			/>
			<img
				src="/assets/bottom-left.svg"
				width={100}
				height={100}
				className="absolute left-3 bottom-3"
				alt="decoration"
			/>
			<img
				src="/assets/certificate-bg.png"
				width={500}
				height={500}
				className="absolute z-0 left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]"
				alt="decoration"
			/>

			<div className="flex flex-col justify-center w-full items-center py-10 gap-5 z-50 relative">
				<div className={cn("flex items-center max-w-md w-full", payment?.lkspwu?.bank_logo ? "justify-between" : "justify-center")}>
					<div className="flex items-center gap-4">
						<img src="/assets/logo.png" width={100} height={100} alt="logo" />
						{payment?.campaign?.rakornas_kemenag == 1 && (
						<img src="/assets/kementrian_agama_logo.png" width={45} height={45} alt="kementrian agama" />
						)}
						<img src="/assets/logo-bwi-circle.png" width={45} height={45} alt="BWI" />
					</div>

						{payment?.lkspwu?.bank_logo && (
						<div>
							<img src={payment?.lkspwu?.bank_logo} width={100} height={100} alt="bsi" />
							{/* <img src="/assets/bsi_logo.png" width={100} height={100} alt="bsi" /> */}
						</div>
						)}
				</div>
				<div>
					<h1 className="font-bold text-[24px] text-center">SERTIFIKAT WAKAF UANG</h1>
					<p className="text-[12px] text-center">No. Sertifikat : {payment?.lkspwu_no}</p>
				</div>
				<div className="flex flex-col items-center justify-center">
					<img src="/assets/bismillah.svg" width={150} height={75} alt="bismillah" />
					<p className="text-[0.65rem] text-[#6A6A6A] text-center max-w-[30rem]">
						“Kamu sekali-kali tidak sampai kepada kebaikan (yang sempurna), sebelum kamu menafkahkan sebagian harta yang
						kamu cintai. Dan apa saja yang kamu nafkahkan maka sesungguhnya Allah mengetahuinya.” (QS. Ali Imran: 92)
					</p>
				</div>

				<div className="space-y-2">
					<div>
						<h1 className="text-[12px] text-[#6A6A6A] text-center">Diberikan Kepada</h1>
						<h2 className="text-[16px] font-semibold text-center">{payment?.wakif_name}</h2>
					</div>
					<div>
						<h1 className="text-[12px] text-[#6A6A6A] text-center">Alamat Wakif</h1>
						<h2 className="text-[16px] font-semibold text-center">{payment?.wakif_address || "-"}</h2>
					</div>
					<div>
						<h1 className="text-[12px] text-[#6A6A6A] text-center">Dengan jumlah</h1>
						<h2 className="text-[16px] font-semibold text-center">Rp{currencyFormater(payment?.amount?.amount)}</h2>
					</div>
					<div>
						<h1 className="text-[12px] text-[#6A6A6A] text-center">
							{payment?.lkspwu?.bank_name ? 
								<span>MELALUI {payment?.lkspwu?.bank_name}, Tbk UNTUK JENIS WAKAF UANG:</span>
							: 	<span>UNTUK JENIS WAKAF UANG:</span> }
						</h1>
						<h2 className="text-[16px] font-semibold text-center">{payment?.campaign?.campaign_category?.name}</h2>
					</div>
					<div>
						<h1 className="text-[12px] text-[#6A6A6A] text-center">Jangka Waktu</h1>
						<h2 className="text-[16px] font-semibold text-center">{payment?.campaign?.is_permanent ? "Selamanya" : "Temporer"}</h2>
					</div>
					<div>
						<p className="text-[12px] text-[#6A6A6A] text-center">
							Untuk dikelola dan diberikan manfaatnya sebagai berikut
						</p>
						<h1 className="font-bold text-[16px] text-center text-[#D7B56D]">{payment?.campaign.title}</h1>
					</div>
					<div className="max-w-[30rem]">
						<h1 className="text-[12px] text-[#6A6A6A] text-center">Nama Nazhir</h1>
						<h2 className="text-[16px] font-semibold text-center">{payment?.campaign.lembaga.name?.toUpperCase()}</h2>
						<h1 className="text-[12px] text-[#6A6A6A] text-center">Alamat Nazhir</h1>
						<h2 className="text-[16px] font-semibold text-center">{payment?.campaign?.lembaga?.address}</h2>
						<h1 className="text-[12px] text-[#6A6A6A] text-center mt-2">
							NAZHIR ID : {payment?.campaign?.lembaga?.nazhir_id}
						</h1>
					</div>
				</div>
				<p className="text-[12px] text-center">Jakarta, {moment.unix(payment?.verified).format("LL")}</p>
				<div className="grid place-items-center -ml-[125px]">
					<div className={cn(payment?.lkspwu?.pic_signature ? "" : "h-[20px]")}>
						{payment?.lkspwu?.pic_signature && (
							<img src={payment?.lkspwu?.pic_signature} width={300} alt="logo" />	
						)}
						{/* <img src="/assets/ttd-bsi.png" width={300} alt="logo" /> */}
					</div>
				</div>
				<h1 className="text-[12px] text-[#6A6A6A] text-center">{payment?.lkspwu?.pic_name}</h1>
				<div>
					<p className="text-[10px] text-[#6A6A6A] text-center max-w-md px-8 italic">
						Nazhir bertanggung jawab terhadap pengelolaan dana. Bank (LKS-PWU) dilepaskan dari tanggung jawab dan segala
						tuntutan atas pengelolaan dana wakaf
					</p>
				</div>
			</div>
		</div>
	);
}

export default function CertificatePage() {
	return (
		<Suspense>
			<Certificate />
		</Suspense>
	);
}
