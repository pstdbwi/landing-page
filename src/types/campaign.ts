export interface ICampaign {
  id: string;
  title: string;
  banner_url: string;
  total_donation_amount: number;
  donation_target: number;
  short_description: string;
  description: string;
  expired: number;
  location: Location;
  campaign_category: CampaignCategory;
  lembaga: Lembaga;
  campaign_status: CampaignStatus;
  corp_id: string;
  corp_name: string;
  type: number;
  corp_unit_id: null;
  corp_unit_name: null;
  corp_program_id: null;
  corp_program_title: null;
  prospectus: string;
  pg_type: string;
  pg_banks: null;
  gads_script: null;
  pixel_script: null;
  rakornas_kemenag: number;
  is_permanent: number;
  is_nonlogin: number;
  total_donation: number;
  va: number;
  qris: number;
  qris_type: string;
  shortlink: string;
  payment_methods: PaymentMethods;
  wakif_types: WakifType[];
  professions: Professions;
  sub_campaigns: any[];
}

export interface CampaignCategory {
  id: string;
  name: string;
}

export interface CampaignStatus {
  id: number;
  name: string;
}

export interface Lembaga {
  id: string;
  name: string;
  image: string;
  status: Status;
}

export interface Status {
  name: string;
}

export interface Location {
  district: string;
  city: string;
  province: string;
}

export interface PaymentMethods {
  instant_payment: any[];
  virtual_account: VirtualAccount[];
}

export interface VirtualAccount {
  bank_code: string;
  fixed_fee: number;
  id: string;
  is_enabled: boolean;
  logo: string;
  name: string;
  to_corporate: number;
  type: string;
}

export interface Professions {
  ditjen: Status[];
  university: Status[];
  pesantren: Status[];
  pai: Status[];
  univ_pai: Status[];
}

export interface WakifType {
  has_corp_unit: number;
  id: string;
  name: string;
}
