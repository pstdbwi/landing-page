export interface IDonation {
  id: string;
  verified: number | null;
  status: { id: number; name: string };
  donor: { id: string; name: string };
  wakif_name: string | null;
  wakif_address: string | null;
  amount: {
    total_amount: number;
    amount: number;
    bank_fee: number;
    infak_fee: number;
    unique_amount: number;
  };
  payment_method: { id: string; name: string };
  payment: {
    reference_id: string;
    bank_code: string;
    qr_string: string;
    expired_at: string;
    name: string;
    image: string;
  };
  campaign: {
    id: string;
    title: string;
    banner_url: string;
    total_donation_amount: number;
    donation_target: number;
    expired: number | null;
    location: { district: string; city: string; province: string };
    lembaga: {
      id: string;
      name: string;
      address: string;
    };
    campaign_category: { id: string; name: string };
    corp_id: string | null;
    corp_name: string | null;
    corp_unit_id: string | null;
    corp_unit_name: string | null;
    type: number;
    created_at: string;
    rakornas_kemenag: number;
    is_permanent: number;
    is_nonlogin: number;
    total_donation: number;
    topic: string | null;
    has_voucher: number;
    code: string | null;
    rewards?: {
      id: string;
      name: string;
    }[];
  };
  lkspwu: {
    bank_code: string;
    bank_logo: string | null;
    bank_name: string;
    pic_name: string | null;
    pic_role: string | null;
    pic_signature: string | null;
  };
  lkspwu_no: string | null;
  corp_unit_lvl1_name: string | null;
  corp_unit_lvl2_name: string | null;
  corp_unit_lvl3_name: string | null;
  redeem_code: string | null;
  redeem_on: string | null;
  redeem_by: string | null;
  reward_wanted?: number;
  reward_id?: string | null;
  reward_name?: string | null;
}
