import { CampaignTypeKeys } from "@/lib/typeCampaign";
import { PaymentMethods } from "./campaign";

export interface ISpecialSection {
  id: string;
  title: string;
  updated_at: number;
  corp_id: null;
  special_section_details: SpecialSectionDetail[];
}

export interface SpecialSectionDetail {
  id: string;
  campaign: Campaign;
}

export interface Campaign {
  id: string;
  title: string;
  banner_url: string;
  total_donation_amount: number;
  donation_target: number;
  expired: number;
  location: Location;
  lembaga: Lembaga;
  type: CampaignTypeKeys;
  created_at: string;
  is_permanent: number;
  qris_nonlogin: { mstring_encoded: string; name: string }[];
  rewards: { id: string; name: string; qty: number }[];
  min_amount: number;
  payment_methods: PaymentMethods;
}

export interface Lembaga {
  id: string;
  name: string;
  type: string;
  is_verified: boolean;
}

export interface Location {
  district: string;
  city: string;
  province: string;
}
