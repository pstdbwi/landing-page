export interface IReportInstitution {
  id: string;
  created_at: null;
  updated_at: null;
  corp_id: string;
  name: string;
  code: string;
  group: string;
  bank_code: null;
  bank_name: null;
  bank_icon: null;
  bank_account_no: null;
  bank_account_name: null;
  unit_id: null;
  region_id: null;
  region_name: null;
  level: number;
  level_parent: null;
  level_nomenclature: string;
  level_parent_name: null;
  province_id: null;
  province_name: null;
  city_id: null;
  city_name: null;
  show_app: number;
  district_id: null;
  district_name: null;
  address: null;
  pic_name: null;
  pic_phone: null;
  pic_email: null;
  pic_identity: null;
  pic_address: null;
  id_simas: null;
  classification: null;
  province_code: null;
  city_code: null;
  district_code: null;
  npsn: null;
  degree: null;
  has_national: number;
  professions: Profession[];
  deleted_at: null;
  donation_net_amount: string;
  total_donors: string;
  has_child: number;
}

export interface Profession {
  id: string;
  name: string;
}
