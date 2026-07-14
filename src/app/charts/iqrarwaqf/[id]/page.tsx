"use client"
import React, { useEffect } from 'react';
import 'moment/locale/id';
import { useCertificateById } from '@/services/donation/hooks';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import bcrypt from "bcryptjs-react";
import currencyFormater from '@/lib/utils';
import moment from 'moment';

export default function AktaIkrarWaqf({
	params
}: {
	params: { id: string }
}) {
		const query = useSearchParams()
    const router = useRouter()
    const token = query.get('token')

		const {
			data: payment,
		} = useCertificateById({
				donationId: params.id,
				enabled: !!params.id
		})

		useEffect(() => {
			if (token) {
					const donationId = `certificate:${params.id}`
					bcrypt.compare(donationId, token, function (err, isMatch) {
							if (err) {
									throw err;
							} else if (!isMatch) {
									router.push('/not-found')
							}
					});
			} else {
					router.push('/not-found')
			}

		}, [params.id]);

		return (
			<div className='relative h-full bg-white inset-x-0 min-h-[100vh]'>
				<img src='/assets/ornament-ikrar/wakaf-kiri-atas.svg' width={100} height={100} className='absolute left-3 top-3' alt='decoration' />
				<img src='/assets/ornament-ikrar/wakaf-kanan-atas.svg' width={100} height={100} className='absolute right-3 top-3' alt='decoration' />
				<img src='/assets/ornament-ikrar/wakaf-kanan-bawah.svg' width={100} height={100} className='absolute right-3 bottom-3' alt='decoration' />
				<img src='/assets/ornament-ikrar/wakaf-kiri-bawah.svg' width={100} height={100} className='absolute left-3 bottom-3' alt='decoration' />
				{/* <img src='/assets/ornament-ikrar/watermark.svg' width={500} height={500} className='absolute z-0  left-[50%] top-[50%] transform: translate-x-[-50%] transform: translate-y-[-50%]' alt='decoration' /> */}

				<div className="flex flex-col justify-center w-full items-center py-10 gap-5 z-50 relative">
				<div className="flex items-center gap-4">
					<img src="/assets/logo.png" width={100} height={100} alt="logo" />
					<img src="/assets/kementrian_agama_logo.png" width={45} height={45} alt="kementrian agama" />
					<img src="/assets/logo-bwi-circle.png" width={45} height={45} alt="BWI" />
				</div>
				<div>
					<h1 className="font-bold text-[22px] text-center">AKTA IKRAR WAKAF</h1>
				</div>
				<div>
					<img src="/assets/ornament-ikrar/bismillah.svg" width={200} height={100} alt="decoration" />
				</div>

				<div className="w-full max-w-xl">
					<table>
						<tbody>
							<tr>
								<td className="px-2 py-1.5 text-sm align-top">Nama Wakif</td>
								<td className="px-2 py-1.5 text-sm align-top">:</td>
								<td className="px-2 py-1.5 text-sm align-top">{payment?.wakif_name}</td>
							</tr>
							<tr>
								<td colSpan={3} className="px-2 py-1.5 text-sm align-top">
									<div className="flex items-center justify-evenly w-full gap-4">
										<p>(1) Perseorangan</p>
										<p>(2) Organisasi</p>
										<p>(3) Badan Hukum</p>
									</div>
								</td>
							</tr>
							<tr>
								<td className="px-2 py-1.5 text-sm align-top">Alamat Wakif</td>
								<td className="px-2 py-1.5 text-sm align-top">:</td>
								<td className="px-2 py-1.5 text-sm align-top">{payment?.wakif_address}</td>
							</tr>

							<tr>
								<td className="px-2 py-1.5 text-sm align-top">No. Identitas Wakif atau</td>
								<td className="px-2 py-1.5 text-sm align-top">:</td>
								<td className="px-2 py-1.5 text-sm align-top"></td>
							</tr>
							<tr>
								<td className="px-2 py-1.5 text-sm align-top">No. Akta Pendirian</td>
								<td className="px-2 py-1.5 text-sm align-top">:</td>
								<td className="px-2 py-1.5 text-sm align-top"></td>
							</tr>
							<tr>
								<td className="px-2 py-1.5 text-sm align-top">No. Rekening</td>
								<td className="px-2 py-1.5 text-sm align-top">:</td>
								<td className="px-2 py-1.5 text-sm align-top"></td>
							</tr>

							<tr>
								<td colSpan={3} className="px-2 py-1.5 text-sm align-top">
									<p className="font-medium">Selanjutnya disebut Wakif, mewakafkan Uang.</p>
								</td>
							</tr>
							<tr>
								<td className="px-2 py-1.5 text-sm align-top">Sejumlah</td>
								<td className="px-2 py-1.5 text-sm align-top">:</td>
								<td className="px-2 py-1.5 text-sm align-top">Rp {currencyFormater(payment?.amount?.amount)}</td>
							</tr>
							<tr>
								<td className="px-2 py-1.5 text-sm align-top">Sumber Dana Setoran Wakaf</td>
								<td className="px-2 py-1.5 text-sm align-top">:</td>
								<td className="px-2 py-1.5 text-sm align-top">
									<div className="grid grid-cols-2 gap-4 justify-between">
										<p>(1) Tabungan Pribadi</p>
										<p>(2) Penjualan Aset</p>
										<p>(3) Hasil Sendiri</p>
										<p>(4) Warisan</p>
										<p>(5) Hibah / Hadiah</p>
										<p>(6) Lainnya.......</p>
									</div>
								</td>
							</tr>
							<tr>
								<td className="px-2 py-1.5 text-sm align-top">Jenis Wakaf Uang</td>
								<td className="px-2 py-1.5 text-sm align-top">:</td>
								<td className="px-2 py-1.5 text-sm align-top">{payment?.campaign.campaign_category.name}</td>
							</tr>
							<tr>
								<td className="px-2 py-1.5 text-sm align-top">Jangka Waktu</td>
								<td className="px-2 py-1.5 text-sm align-top">:</td>
								<td className="px-2 py-1.5 text-sm align-top">
									<div className="flex items-center gap-2 justify-between">
										<p>(1) Selamanya</p>
										<p>(2) Berjangka (.....) tahun</p>
									</div>
								</td>
							</tr>
							<tr>
								<td className="px-2 py-1.5 text-sm align-top">Nazhir</td>
								<td className="px-2 py-1.5 text-sm align-top">:</td>
								<td className="px-2 py-1.5 text-sm align-top">{payment?.campaign?.lembaga?.name}</td>
							</tr>
							<tr>
								<td className="px-2 py-1.5 text-sm align-top">Nazhir ID</td>
								<td className="px-2 py-1.5 text-sm align-top">:</td>
								<td className="px-2 py-1.5 text-sm align-top">{payment?.campaign?.lembaga?.nazhir_id}</td>
							</tr>
							<tr>
								<td className="px-2 py-1.5 text-sm align-top">Alamat Nazhir</td>
								<td className="px-2 py-1.5 text-sm align-top">:</td>
								<td className="px-2 py-1.5 text-sm align-top">{payment?.campaign?.lembaga?.address}</td>
							</tr>
							<tr>
								<td className="px-2 py-1.5 text-sm align-top">
									Untuk dikelola dan di berikan manfaatnya sebagai berikut
								</td>
								<td className="px-2 py-1.5 text-sm align-top">:</td>
								<td className="px-2 py-1.5 text-sm align-top">{payment?.campaign.title}</td>
							</tr>
						</tbody>
					</table>

					<p className="text-right font-semibold text-xs">Jakarta, {moment.unix(payment?.verified).format("LL")}</p>

					<table className="w-full mt-2">
						<thead>
							<tr>
								<th className="px-2 py-1 text-xs border">Pihak</th>
								<th className="px-2 py-1 text-xs border">Wakif</th>
								<th className="px-2 py-1 text-xs border w-[20%]">Saksi 1</th>
								<th className="px-2 py-1 text-xs border w-[20%]">Saksi 2</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td className="px-2 py-1.5 text-xs border">Tanda Tangan</td>
								<td className="px-2 py-1.5 text-xs border"></td>
								<td className="px-2 py-1.5 text-xs border"></td>
								<td className="px-2 py-1.5 text-xs border"></td>
							</tr>
							<tr>
								<td className="px-2 py-1.5 text-xs border">Nama</td>
								<td className="px-2 py-1.5 text-xs border">{payment?.wakif_name}</td>
								<td className="px-2 py-1.5 text-xs border"></td>
								<td className="px-2 py-1.5 text-xs border"></td>
							</tr>
							<tr>
								<td className="px-2 py-1.5 text-xs border">No Identitas</td>
								<td className="px-2 py-1.5 text-xs border"></td>
								<td className="px-2 py-1.5 text-xs border"></td>
								<td className="px-2 py-1.5 text-xs border"></td>
							</tr>
						</tbody>
					</table>
				</div>
				<div>
					<p className="text-[10px] text-[#6A6A6A] text-center px-8 italic max-w-xl">
						Nazhir bertanggung jawab terhadap pengelolaan dana. Bank (LKS-PWU) dilepaskan dari tanggung jawab dan segala
						tuntutan atas pengelolaan dana wakaf
					</p>
				</div>
			</div>
			</div>
		)
}