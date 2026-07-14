import { IPaymentMethod } from "@/types/payment";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface IDonationAnonymous {
  campaign_id: string;
  amount: number;
  maintenance_fee?: number | null;
  payment_method_id: string;
  is_anonymous: boolean;
  campaign_is_permanent: string | null;
  willing_to_contact_by_lembaga: boolean;
  donor_name: string;
  wakif_name: string;
  wakif_phone: string;
  wakif_address: string | null;
  email: string;
  phone_number: string;
  wakif_district: string;
  wakif_city: string;
  wakif_province: string;
  wakif_type: string | null;
  wakif_type_id: string | null;
  wakif_type_has_corp_unit: boolean;
  has_wakif_types: boolean;
  category_waqaf: number;
  wakif_temporer_due_date: string | null;
  wakif_identity: string | null;
  wakif_bank: string | null;
  wakif_bank_name: string | null;
  wakif_bank_account_no: string | null;
  wakif_bank_account_name: string | null;

  paymentMethod: IPaymentMethod | null;

  program_id: string | null;
  program_name: string | null;
  corp_program_id: string | null;
  corp_program_title: string | null;

  // INSTITUSI
  corp_has_national: boolean;
  corp_unit_province_code: string | null;
  corp_unit_city_code: string | null;
  corp_unit_district_code: string | null;

  corp_unit_lvl1_id: string | null;
  corp_unit_lvl1_name: string | null;
  corp_unit_lvl1_code: string | null;
  corp_unit_lvl1_has_child: boolean;

  corp_unit_lvl2_id: string | null;
  corp_unit_lvl2_name: string | null;
  corp_unit_lvl2_has_child: boolean;

  corp_unit_lvl3_id: string | null;
  corp_unit_lvl3_name: string | null;
  corp_unit_profession: string | null;
  wakif_pray?: string | null;
}

type State = {
  donation: IDonationAnonymous;
  updateDonation: (data: Partial<IDonationAnonymous>) => void;

  donationAnonymous: IDonationAnonymous;
  updateDonationAnonymous: (data: Partial<IDonationAnonymous>) => void;

  resetDonation: () => void;
  resetDonationAnonymous: () => void;
};

export const defaultIDonationAnonymous: IDonationAnonymous = {
  campaign_id: "",
  amount: 0,
  maintenance_fee: 0,
  payment_method_id: "",
  is_anonymous: false,
  campaign_is_permanent: null,
  willing_to_contact_by_lembaga: false,
  category_waqaf: 1,
  wakif_temporer_due_date: "",
  donor_name: "",
  wakif_name: "",
  wakif_phone: "",
  wakif_address: "",
  email: "",
  phone_number: "",
  wakif_district: "",
  wakif_city: "",
  wakif_province: "",
  wakif_type: null,
  wakif_type_id: null,
  wakif_type_has_corp_unit: false,
  has_wakif_types: false,

  wakif_identity: "",
  wakif_bank: "",
  wakif_bank_name: "",
  wakif_bank_account_no: "",
  wakif_bank_account_name: "",

  paymentMethod: null,

  program_id: null,
  program_name: null,
  corp_program_id: null,
  corp_program_title: null,

  corp_has_national: false,
  corp_unit_province_code: null,
  corp_unit_city_code: null,
  corp_unit_district_code: null,

  corp_unit_lvl1_id: null,
  corp_unit_lvl1_name: null,
  corp_unit_lvl1_code: null,
  corp_unit_lvl1_has_child: false,

  corp_unit_lvl2_id: null,
  corp_unit_lvl2_name: null,
  corp_unit_lvl2_has_child: false,

  corp_unit_lvl3_id: null,
  corp_unit_lvl3_name: null,
  corp_unit_profession: null,
  wakif_pray: "",
};

export const useDonationStore = create<State>()(
  persist(
    (set) => ({
      donation: defaultIDonationAnonymous,
      updateDonation: (data) =>
        set((state) => ({
          donation: {
            ...state.donation,
            ...data,
          },
        })),

      donationAnonymous: defaultIDonationAnonymous,
      updateDonationAnonymous: (data) =>
        set((state) => ({
          donationAnonymous: {
            ...state.donationAnonymous,
            ...data,
          },
        })),

      resetDonation: () => set({ donation: defaultIDonationAnonymous }),
      resetDonationAnonymous: () => set({ donationAnonymous: defaultIDonationAnonymous }),
    }),

    {
      name: "donation-store",
    },
  ),
);
