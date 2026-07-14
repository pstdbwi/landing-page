import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { produce } from "immer"
interface createDonationResponseInterface {
    id: string
    total_amount: number
    amount: {
        total_amount: number
        amount: number
        charge_fee: number
    }
    payment: {
        name?: string
        image?: string
        account_number?: number
        qr_link?: string
    },
    expired_at: string
}
interface selectedPaymentMethodeInterface {
    id: string
    name: string
    bank_code: string
    type: string
    is_enabled: boolean
    fixed_fee: number
    logo: string
}

interface payloadCreateDonationInterface {
    campaign_id: string
    amount: number
    is_anonymous: boolean
    willing_to_contact_by_lembaga: boolean
    payment_method_id: string
		wakif_name: string
		wakif_address: string
		maintenance_fee: number
}

interface interfaceState {
    loading: boolean
}

interface CreatePaymentInterface {
    selectedPaymentMethode: Partial<selectedPaymentMethodeInterface>
    payloadCreateDonation: Partial<payloadCreateDonationInterface>
    createDonationResponse: Partial<createDonationResponseInterface>
    interfaceState: Partial<interfaceState>
}

interface CreateDonationProps {
    store: Partial<CreatePaymentInterface>
    storeCreateDonation: (data: Partial<CreatePaymentInterface>) => void
    reset: () => void
}


interface profileInterface {
    id: string
    full_name: string
    email: string
    phone_number: number
    image: string
    is_social_media_login: boolean
    is_location_data_completed: boolean
    exp: number
}
interface authStore {
    profile: Partial<profileInterface>
    storeProfile: (data: Partial<profileInterface>) => void
    reset: () => void
}


const useCreateDonationStore = create<CreateDonationProps>()(
    persist((set) => ({
        store: {
            selectedPaymentMethode: {
                id: '',
                name: '',
                bank_code: '',
                type: '',
                is_enabled: false,
                fixed_fee: 0,
                logo: ''
            },
            payloadCreateDonation: {
                campaign_id: '',
                amount: 0,
                is_anonymous: false,
                willing_to_contact_by_lembaga: false,
                payment_method_id: '',
								wakif_name: '',
								wakif_address: '',
								maintenance_fee: 0
            },
            createDonationResponse: {
                id: '',
                total_amount: 0,
                amount: {
                    total_amount: 0,
                    amount: 0,
                    charge_fee: 0
                },
                payment: {
                    name: '',
                    image: '',
                    account_number: 0,
                    qr_link: '',
                },
                expired_at: '',
            },
        },
        storeCreateDonation: (data) => set((state) => ({
            ...state,
            store: {
                ...state.store,
                ...data
            },
        })),
        reset: () => {
            useCreateDonationStore.persist.clearStorage()
        },
    }),
        {
            name: "createDonation",
        }
    )
);


export { useCreateDonationStore }