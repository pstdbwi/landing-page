import currencyFormater from "./utils";

export const typeCampaign = [
	{
		id: "1",
		name: 'Zakat'
	},
	{
		id: "2",
		name: 'Infaq Shadaqah'
	},
	{
		id: "3",
		name: 'Wakaf'
	}
]

export type CampaignTypeKeys = keyof typeof TCampaignType;


export const TCampaignType = {
	"1": 'Zakat',
	"2": 'Infaq Shadaqah',
	"3": "Wakaf"
}

export const colorBadgeByCampaignType: any = {
	"1": 'gradient-purple',
	"2": 'gradient-green',
	"3": 'gradient-blue'
}

export const wordingByCampaignType = {
	"1": 'Niat Zakat',
	"2": 'Niat Infaq',
	"3": "Ikrar Wakaf"
}

export const proofByCampaignType = {
	"1": 'Bukti Penerimaan Zakat',
	"2": 'Bukti Penerimaan Infaq & Shadaqah',
	"3": "Akta Ikrar Wakaf Uang (AIWU)"
}

export const personByCampaignType = {
	"1": 'Muzakki',
	"2": 'Munfiq',
	"3": "Wakif"
}

export const wordingAttentionByCampaignType = (
	{type, lembaga, program, amount}:
	{type: CampaignTypeKeys, lembaga: any, program: any, amount: any}
	) =>{

	switch (String(type)) {
		case '1':
				return `Saya berniat mengeluarkan zakat harta dari diri sendiri karena Allah Ta'ala. Zakat saya bayarkan ${amount ? `senilai Rp ${currencyFormater(amount)}` : ``} melalui Zakat Muqaayyad Program ${program} oleh Amil ${lembaga}.`
		case '2':
				return `Dengan ini saya berniat berinfaq/bersedekah melalui SATUWAKAF Indonesia untuk Program ${program} ${amount ? `sebesar Rp ${currencyFormater(amount)}` : ``} semata-mata karena Allah Ta'ala demi mendekatkan diri kepada Allah dan memohon keridha-an Allah SWT agar menerima infaq/shadaqah saya ini. Rabbanā taqabbal minnā innaka antas samī'ul 'alīm.`
		case '3':
				return `Dengan ini saya sebagai Wakif telah mengikrarkan Wakaf kepada ${lembaga} untuk program ${program} ${amount ? `sebesar Rp ${currencyFormater(amount)}` : ``} dalam bentuk Wakaf`
	}
}