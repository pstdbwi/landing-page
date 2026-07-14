import { SUB_DOMAIN } from "@/constant/sub-domain"
import { useEffect, useState } from "react"


export default function useIsSubDomain() {
	const [isSubDomain, setIsSubDomain] = useState(false)
	const [currentDomain, setCurrentDomain] = useState('')

	useEffect(()=>{
		// handle UI & Data if not apps.satuwakaf.id
		if(typeof window){
			const URL = window?.location?.host == 'fesyarsumatra.satuwakaf.id' ? 'fesyarsumatera.satuwakaf.id' : window?.location?.host
			const isSub = SUB_DOMAIN.includes(URL)
			setIsSubDomain(isSub)	
			setCurrentDomain(window?.location?.host)
		}
	},[])

	return {isSubDomain, setIsSubDomain, currentDomain, setCurrentDomain}
}