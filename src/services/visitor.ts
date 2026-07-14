import { env } from "@/lib/env";
import { SessionData } from "@/lib/session";
import axios from "axios";
import moment from "moment";

interface Props {
	user: SessionData,
	page: 'login'|'home'|'history'|'campaign'|'profile'|'banner'
	campaign?: any;
	store: any
}

/**
 * 
 * @param user Data User
 * @param page Visit From Page
 * @param campaign Data Campaign
 * @param store localstorage
 * 
 * check if today is the same as the data from localstorage
 * 	not hit api visitor return false
 * else
 * 	hit api visitor and return true, for trigger save to localstorage
 * 
 * @returns boolean
 */
export const visitor = async ({user, page, campaign, store}: Props) => {
	const now = moment().format("YYYY-MM-DD");

	if(now == store?.date){
		return false 
	}

	try {
		const payload = {
			"corp_id": user?.corp_id,
			"corp_name": user?.corp_name,
			"corp_unit_id": user?.corp_unit_id,
			"corp_unit_name": user?.corp_unit_name,
			"visitor_id": user?.id,
			"visitor_name": user?.name,
			"visitor_apps": "web", // android, ios, web
			"page": page,
			"campaign_id": campaign?.id || null,
			"campaign_title": campaign?.title || null
		}
		const result = await axios.post(`${env.NEXT_PUBLIC_BASE_URL2}/visitors`, payload)
		console.log(`You have successfully visited the ${page}...`)
		return true
	} catch (error) {
		console.error("Failed visitor...")
		return false
	}
}
	