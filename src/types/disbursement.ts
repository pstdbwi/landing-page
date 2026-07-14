export interface IDisbursementCampaign {
  id: string;
  created_at: string;
  updated_at: any;
  deleted_at: any;
  campaign_id: string;
  campaign_title: string;
  campaign_banner_url: string;
  lembaga_id: string;
  lembaga_name: string;
  report_date: string;
  report_topic: string;
  report_title: string;
  report_description: string;
  report_images: string[];
  report_files: string[];
  corp_id: any;
  corp_name: any;
  amount_disbursed: any;
  beneficiary_file: string;
}
