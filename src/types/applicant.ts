export interface IApplication {
  id: string;
  created_by: Record<string, any>;
  updated_by: Record<string, any>;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
  deleted_at: string | null;
  logs: any[]; // default '[]'::jsonb

  campaign_id: string;
  campaign_title: string;

  donor_id: string;
  donor_name: string;

  organization_information: string | null;
  organization_license_url: string | null;

  applicant_name: string;
  applicant_birth_place: string | null;
  applicant_birth_date: string | null; // date
  applicant_job: string | null;
  applicant_province_id: string | null;
  applicant_province_name: string | null;
  applicant_city_id: string | null;
  applicant_city_name: string | null;
  applicant_address: string | null;
  applicant_phone: string | null;
  applicant_email: string | null;
  reason: string;
  type_of_assistance: string;

  bank_account_name: string | null;
  bank_account_number: string | null;
  bank_name: string | null;

  supporting_doc_url: string | null;
  bank_book_url: string | null;
  id_card_url: string | null;

  status: "waiting" | "approved" | "rejected" | "done";
  approved_by: Record<string, any> | null;

  transfer_amount: string | null;
  transfer_date: string | null;
  transfer_evidence_url: string | null;
  transfer_uploaded_by: Record<string, any> | null;
}
