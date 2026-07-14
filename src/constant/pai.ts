export const SCHOOL_REQUIRED = ["siswa", "guru pai", "orang tua siswa", "alumni"];
export const PROFESI_REQUIRED = ["kp", "kw", "kk", "mdp"];

export interface IReportProvince {
  id: string;
  code: string;
  name: string;
  donation_net_amount: number;
  total_donors: string;
}

export interface IReportSchool {
  id: string;
  corp_id: string;
  name: string;
  code: string;
  group: string;
  region_id: null;
  region_name: null;
  level: number;
  level_parent: null;
  level_nomenclature: null;
  level_parent_name: null;
  id_simas: null;
  province_id: null;
  province_name: null;
  city_id: null;
  city_name: null;
  district_id: null;
  district_name: null;
  show_app: number;
  donation_net_amount: number;
  total_donors: string;
}

export interface IDonor {
  id: string;
  donor_id: string;
  donation_id: string;
  lembaga_id: string;
  lembaga_name: string;
  donor_name: string;
  donor_phone: null;
  donor_email: null;
  donor_corp_id: null;
  donor_corp_name: null;
  donor_unit_id: null;
  donor_unit_name: null;
  donation_status_id: string;
  donation_net_amount: number;
  campaign_id: string;
  campaign_title: string;
  program_name: null;
  campaign_banner_url: string;
  campaign_corp_id: string;
  campaign_corp_unit_id: null;
  campaign_corp_unit_name: null;
  payment_provider: string;
  payment_method_bank: string;
  payment_method_type: string;
  payment_account_no: null;
  payment_account_name: null;
  payment_verified_by: null;
  payment_verified_at: Date;
  wakif_type: string;
  wakif_name: string;
  wakif_phone: null;
  wakif_email: null;
  wakif_address: null;
  wakif_province_id: null;
  wakif_province_name: null;
  wakif_city_id: null;
  wakif_city_name: null;
  wakif_district_id: null;
  wakif_district_name: null;
  corp_program_id: null;
  corp_program_title: null;
  corp_unit_lvl1_id: string;
  corp_unit_lvl1_name: string;
  corp_unit_lvl2_id: null;
  corp_unit_lvl2_name: null;
  corp_unit_lvl3_id: null;
  corp_unit_lvl3_name: null;
  corp_unit_profession: null;
  corp_unit_province_id: null;
  corp_unit_province_name: null;
  corp_unit_city_id: null;
  corp_unit_city_name: null;
  corp_unit_district_id: null;
  corp_unit_district_name: null;
  creator_type: string;
  created_by: null;
  file_payment_received: null;
  lembaga_received_bank: null;
  lembaga_received_bank_account: null;
  lembaga_received_bank_account_name: null;
  admin_logs: null;
  charge_fee: number;
  platform_fee: number;
  total_amount: number;
  payment: Payment;
  redeem_code: string;
  redeem_on: string;
  reward_wanted: number;
  reward_id: string;
  reward_name: string;
}

export interface Payment {
  id: string;
  donor_name: string;
  bank_code: string;
  bank: string;
  amount: number;
  status_id: string;
  va_number: null;
  paid_at: Date;
  paid_qr_msource: string;
  paid_qr_mname: string;
  paid_qr_static: number;
  paid_invoice_no: string;
}

export interface IDisbursementCampaign {
  id: string;
  purposes: IDisbursementCampaignPurpose[];
  total_revenue: string;
  total_amount_disbursed: string;
}

export interface IDisbursementCampaignPurpose {
  id: number;
  name: string;
  amount: number;
  report_count: number;
}

export interface IDistributionReports {
  id: string;
  created_at: string;
  updated_at: null;
  campaign_id: string;
  campaign_title: string;
  campaign_banner_url: string;
  lembaga_id: string;
  lembaga_name: string;
  report_date: string;
  report_topic: string;
  report_title: string;
  report_description: string;
  report_images: string[] | null;
  report_files: string[] | null;
  corp_id: string;
  corp_name: string;
  reporter_id: string;
  reporter_name: string;
  published: boolean;
  deleted_at: null;
  deleted_by: null;
  purpose: { id: number; name: string };
  amount_disbursed: string;
  beneficiary_file: string;
}
