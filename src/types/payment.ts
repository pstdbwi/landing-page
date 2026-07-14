export interface IPaymentDonor {
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

export interface IPaymentMethod {
  id: string;
  name: string;
  bank_code: string;
  type: string;
  is_enabled: boolean;
  fixed_fee: number;
  variable_fee?: number;
  logo: string;
  to_corporate: string | number | null;
}

export interface IPaymentDonation {
  id: string;
  verified: number;
  status: {
    id: number;
    name: string;
  };
  donor: {
    id: string;
    name: string;
  };
  wakif_name: string;
  wakif_address: null;
  amount: {
    total_amount: number;
    amount: number;
    bank_fee: number;
    infak_fee: number;
    unique_amount: number;
  };
  payment_method: {
    id: string;
    name: string;
  };
  payment: {
    reference_id: string;
    bank_code: string;
    qr_string: string;
    expired_at: Date;
    name: string;
    image: string;
  };
  campaign: {
    id: string;
    title: string;
    banner_url: string;
    total_donation_amount: number;
    donation_target: number;
    expired: number;
    location: {
      district: string;
      city: string;
      province: string;
    };
    lembaga: {
      id: string;
      name: string;
      leader_name: string;
      nazhir_id: string;
    };
    campaign_category: {
      id: string;
      name: string;
    };
    corp_id: null;
    corp_name: null;
    corp_unit_id: null;
    corp_unit_name: null;
    type: number;
    created_at: string;
    rakornas_kemenag: number;
    is_permanent: number;
    is_nonlogin: number;
    total_donation: number;
  };
  lkspwu: {
    bank_code: string;
    bank_logo: null;
    bank_name: string;
    pic_name: null;
    pic_role: null;
    pic_signature: null;
  };
  lkspwu_no: null;
  corp_unit_lvl1_name: null;
  corp_unit_lvl2_name: null;
  corp_unit_lvl3_name: null;
}
