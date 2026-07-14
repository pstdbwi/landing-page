"use client"
import currencyFormater from "@/lib/utils"
import { Avatar, AvatarImage, AvatarFallback } from "../Avatar"
import moment from "moment"
import 'moment/locale/id';
import { Fragment } from "react";

interface Props {
    avatar: string
    name: string
    donationAmount: number
    donationTime: number
		donor?: any
}
const DonorCard: React.FC<Props> = ({
    avatar,
    name,
    donationAmount,
    donationTime,
		donor
}) => {
    let unixTimestamp = donationTime
    let momentObj = moment.unix(unixTimestamp);
    let timeAgo = momentObj.fromNow();
    return (
        <div className="inline-flex items-center space-x-3 mt-2 bg-[#F2F3F4]/50 w-full p-3 rounded-lg">
            <Avatar>
                <AvatarImage src={avatar} />
                <AvatarFallback>{name?.substring(1, 0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
                <h1 className="text-sm font-bold">{name}</h1>
								<div className="text-[0.625rem] flex flex-wrap gap-x-1">
									{[
										donor?.corp_unit_lvl1_name && <span key="lvl1" className="font-bold">{donor.corp_unit_lvl1_name}</span>,
										donor?.corp_unit_lvl2_name && <span key="lvl2" className="font-semibold">{donor.corp_unit_lvl2_name}</span>,
										donor?.corp_unit_lvl3_name && <span key="lvl3" className="font-medium">{donor.corp_unit_lvl3_name}</span>,
									]
										.filter(Boolean) // Hapus nilai falsy (undefined, null, "")
										.map((item, index, arr) => (
											<Fragment key={index}>
												{item}
												{index !== arr.length - 1 && " | "}
											</Fragment>
										))}
								</div>
								<div className="text-[0.625rem] flex flex-wrap gap-x-1">
									{[donor?.corp_unit_province_name, donor?.corp_unit_city_name, donor?.corp_unit_district_name]
										.filter(Boolean) // Hapus nilai falsy (undefined, null, "")
										.map((item, index, arr) => (
											<Fragment key={index}>
												{item}
												{index !== arr.length - 1 && ", "}
											</Fragment>
										))
									}
								</div>
                <div className="inline-flex space-x-1 mt-1">
                    <h1 className="text-sm">Berwakaf sebesar</h1>
                    <h2 className="text-sm font-semibold">Rp {currencyFormater(donationAmount)}</h2>
                </div>
                { }
                <span className="text-xs text-gray-500">{timeAgo}</span>
            </div>
        </div>
    )
}


export { DonorCard }