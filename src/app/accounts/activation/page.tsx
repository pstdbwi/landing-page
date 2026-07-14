"use client"
import { Button } from "@/components/Button";
import { Header } from "@/components/Header";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/Skeleton";
import { Suspense, useEffect, useState } from "react";
import axios from "axios";
import { env } from "@/lib/env";

const Wrapper = ({children}: {children: React.ReactNode}) => {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState<boolean>(true)

	const params = useSearchParams();
	const registrationId = params.get('registration_id') || '';
	const token = params.get('token') || '';

	useEffect(() => {
			const activateRegistration = async () => {
					try {
							const response = await axios.get(`${env.NEXT_PUBLIC_BASE_URL}/registration/${registrationId}/activation/${token}`);
							setIsLoading(false);
					} catch (error) {
							setIsLoading(false);
					}
			};

			if (registrationId && token) {
					activateRegistration();
			}
	}, [registrationId, token]);


					if (isLoading) {
							return (
									<div className="space-y-2 p-5 min-h-screen bg-white w-full max-w-[480px] mx-auto relative">
											<Skeleton className="w-5/12 h-10 rounded-md" />
											<Skeleton className="w-full h-10 rounded-md" />
											<Skeleton className="w-full h-10 rounded-md" />
									</div>
							)
					}


					return (
							<section className="min-h-screen bg-white w-full max-w-[480px] mx-auto relative">
									<Header title="Aktivasi Akun" className="left-0 top-0" />
									<div className="p-5">
											<div className="flex flex-col items-center justify-center w-full mb-8 gap-2">
													{children}
											</div>
									</div>
							</section>
					)



}

export default function Activation() {
	const router = useRouter()

    const RenderSuccessResponse = () => {
        return (
            <div>
                <h1 className="text-xl font-bold mb-3">Assalamualaikum</h1>
                <p className="text-gray-500">
                    Proses aktivasi akun Anda telah berhasil. Silahkan tutup halaman ini dan login dari mobile app di smartphone Anda.
                </p>
                <br />
                <p className="text-gray-500">Terima kasih, <br />
                    Wassalamualaikum</p>
                <Button variant='blue' size='full' className='mt-5' onClick={() => router.push('/')}>Kembali Ke Home</Button>
            </div>
        )
    }

    const RenderFailed = () => {
        return (
            <div>
                <h1 className="text-xl font-bold text-center">Terjadi kesalahan</h1>
                <p className="text-gray-500 text-center">
                    Data registrasi anda tidak ditemukan
                </p>
                <Button variant='blue' size='full' className='mt-5' onClick={() => router.push('/')}>Kembali Ke Home</Button>
            </div>
        )
    }

    return (
			<Suspense>
        <Wrapper>
            <RenderSuccessResponse />
        </Wrapper>
			</Suspense>
    )
}