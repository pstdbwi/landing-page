'use client'
import Lucide from "@/components/Icon/lucide";
import useIsSubDomain from "@/lib/isSubDomain";
import Link from "next/link";

interface InformationProps {
	data: any;
}

const Information = ({data} : InformationProps) => {
	const { currentDomain } = useIsSubDomain()
	const info = data[currentDomain?.split(".")[0]]

	const email = info?.email ? `mailto:${info?.email}` : null;
	const phone = info?.phone ? `wa.me/${info?.phone}` : null
	const address = info?.address ? `https://www.google.com/maps/search/${info?.address}` : null

	return (
		<section className="p-5">
		<div className="space-y-2">
			{email && (
				<Link href={email} className="inline-flex justify-between space-x-2 w-full border-b py-4" target="_blank" rel="noopener noreferrer">
					<div className="inline-flex items-center space-x-3">
							<div className="w-10 h-10 rounded-full bg-primary-500 shrink-0 flex flex-col items-center justify-center">
									<Lucide name='mail' size={24} className="shrink-0" color="white" />
							</div>
							<div className="space-y-1">
									<h1 className="text-base font-medium">Hubungi kami melalui email</h1>
									<p className="text-gray-500 text-sm">Ajukan pertanyaan atau saranmu melalui email</p>
							</div>
					</div>
					<Lucide name='chevron-right' size={24} className="shrink-0" />
				</Link>
			)}
			
			{phone && (
				<Link href={phone} className="inline-flex justify-between space-x-2 w-full border-b py-4" target="_blank" rel="noopener noreferrer">
						<div className="inline-flex items-center space-x-3">
								<div className="w-10 h-10 rounded-full bg-primary-500 shrink-0 flex flex-col items-center justify-center">
									<Lucide name='phone' size={24} className="shrink-0" color="white" />
								</div>
								<div className="space-y-1">
										<h1 className="text-base font-medium">Hubungi kami lewat WhatsApp</h1>
										<p className="text-gray-500 text-sm">Ajukan pertanyaan atau saranmu melalui chat WhatsApp</p>
								</div>
						</div>
						<Lucide name='chevron-right' size={24} className="shrink-0" />
				</Link>
			)}
				
			{address && (
				<Link href={address} className="inline-flex justify-between space-x-2 w-full border-b py-4" target="_blank" rel="noopener noreferrer" >
					<div className="inline-flex items-center space-x-3">
							<div className="w-10 h-10 rounded-full bg-primary-500 shrink-0 flex flex-col items-center justify-center">
									<Lucide name='map' size={24} className="shrink-0" color="white" />
							</div>
							<div className="space-y-1">
									<h1 className="text-base font-medium">Alamat Kantor</h1>
									<p className="text-gray-500 text-sm">{info?.address}</p>
							</div>
					</div>
					<Lucide name='chevron-right' size={24} className="shrink-0" />
				</Link>
			)}
			
		</div>
</section>
	)
}

export default Information