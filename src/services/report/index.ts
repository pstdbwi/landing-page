import { IDonor } from "@/constant/pai";
import { env } from "@/lib/env";
import { qs } from "@/lib/utils";
import { ITable } from "@/types";
import { ICampaign } from "@/types/campaign";
import { IReportCampaignDistribution } from "@/types/report";
import axios from "axios";

// NEW
export const getReportCampaignDetail = async (campaignId: string): Promise<ICampaign> => {
  try {
    const response = await axios.get(env.NEXT_PUBLIC_BASE_URL + `/campaigns/${campaignId}`);

    return response?.data?.data?.[0] || {};
  } catch (error) {
    throw error;
  }
};

export interface IQueryReportDonationNational {
  campaign_id: string;
  type: "province" | "city" | string;
  wakif_type_id?: string;
  province_id?: string;
  province_code?: string;
  city_code?: string;
  payment_date_start?: string;
  payment_date_end?: string;
  page?: string;
  size?: string;
  search?: string;
  refetchInterval?: number | false;
}

export const getReportDonationNational = async ({
  campaign_id,
  type = "province",
  wakif_type_id = "",
  province_id = "",
  province_code = "",
  city_code = "",
  payment_date_start = "",
  payment_date_end = "",
  page = "0",
  size = "10",
  search = "",
}: IQueryReportDonationNational): Promise<ITable<IReportCampaignDistribution>> => {
  try {
    const filters = qs({
      // id: campaign_id,
      campaign_id,
      type,
      wakif_type_id,
      province_id,
      province_code,
      city_code,
      payment_date_start,
      payment_date_end,
      pagination: "true",
      page,
      size,
      search,
    });

    const response = await axios.get(env.NEXT_PUBLIC_BASE_URL2 + `/public/report/donation/national?${filters}`);

    return response?.data?.data || {};
  } catch (error) {
    throw error;
  }
};

export interface IQueryReportDistribution {
  campaign_id: string;
  start_date?: string;
  end_date?: string;
  refetchInterval?: number | false;
}

export const getReportCampaignDistribution = async ({
  campaign_id,
  start_date = "",
  end_date = "",
}: IQueryReportDistribution): Promise<IReportCampaignDistribution> => {
  try {
    const filters = qs({
      id: campaign_id,
      start_date,
      end_date,
    });

    const response = await axios.get(env.NEXT_PUBLIC_BASE_URL2 + `/public/report/campaign/distribution?${filters}`);

    return response?.data?.data || {};
  } catch (error) {
    throw error;
  }
};

export interface IQueryReportDonationWakif {
  campaign_id: string;
  wakif_province_id?: string;
  wakif_city_id?: string;
  wakif_type_id?: string;
  corp_unit_lvl1_id?: string;
  corp_unit_lvl2_id?: string;
  corp_unit_lvl3_id?: string;
  corp_unit_profession?: string;
  corp_unit_province_id?: string;
  corp_unit_city_id?: string;
  corp_unit_district_id?: string;
  program_id?: string;
  program_name?: string;
  payment_date_start?: string;
  payment_date_end?: string;
  page?: string;
  size?: string;
  search?: string;
  order_by?: string;
  order_type?: string;
  refetchInterval?: number | false;
}

export const getReportDonationWakif = async ({
  campaign_id,
  wakif_province_id = "",
  wakif_city_id = "",
  wakif_type_id = "",
  corp_unit_lvl1_id = "",
  corp_unit_lvl2_id = "",
  corp_unit_lvl3_id = "",
  corp_unit_profession = "",
  corp_unit_province_id = "",
  corp_unit_city_id = "",
  corp_unit_district_id = "",
  program_id = "",
  program_name = "",
  payment_date_start = "",
  payment_date_end = "",
  page = "0",
  size = "10",
  search = "",
  order_by = "payment_verified_at",
  order_type = "desc",
}: IQueryReportDonationWakif): Promise<IDonor> => {
  try {
    const filters = qs({
      campaign_id,
      wakif_province_id,
      wakif_city_id,
      wakif_type_id,
      corp_unit_lvl1_id,
      corp_unit_lvl2_id,
      corp_unit_lvl3_id,
      corp_unit_profession,
      corp_unit_province_id,
      corp_unit_city_id,
      corp_unit_district_id,
      program_id,
      program_name,
      order_by,
      order_type,
      payment_date_start,
      payment_date_end,
      page,
      size,
      pagination: "true",
      search,
    });

    const response = await axios.get(
      env.NEXT_PUBLIC_BASE_URL2 + `/public/report/corp_unit/donation/histories?${filters}`
    );

    return response?.data?.data || {};
  } catch (error) {
    throw error;
  }
};

export interface IQueryReportPrograms {
  campaign_id: string;
  date_start?: string;
  date_end?: string;
  page?: string;
  size?: string;
  search?: string;
  order_by?: string;
  order_type?: string;
  refetchInterval?: number | false;
}

export const getReportPrograms = async ({
  campaign_id = "",
  date_start = "",
  date_end = "",
  search = "",
  order_by = "payment_verified_at",
  order_type = "desc",
}: IQueryReportPrograms) => {
  try {
    const filters = qs({
      campaign_id,
      order_by,
      order_type,
      date_start,
      date_end,
      pagination: "true",
      search,
    });

    const response = await axios.get(env.NEXT_PUBLIC_BASE_URL2 + `/public/report/programs?${filters}`);
    return response?.data;
  } catch (error) {
    console.error("Error:", error);
  }
};

export interface IQueryReportInstitution {
  campaign_id: string;
  corp_id: string;
  level_parent?: string;
  level?: string;
  show_app?: string;
  page?: string;
  size?: string;
  search?: string;
  order_by?: string;
  order_type?: string;
  date_start?: string;
  date_end?: string;
  refetchInterval?: number | false;
}
export const getReportInstitution = async ({
  campaign_id = "",
  corp_id = "",
  level_parent = "",
  level = "1",
  show_app = "",
  page = "0",
  size = "10",
  date_start = "",
  date_end = "",
  search = "",
}: IQueryReportInstitution) => {
  try {
    const filters = qs({
      campaign_id,
      corp_id,
      level_parent,
      level,
      show_app,
      page,
      size,
      date_start,
      date_end,
      pagination: "true",
      search,
    });

    const response = await axios.get(env.NEXT_PUBLIC_BASE_URL2 + `/public/report/corp_unit/lvl1?${filters}`);

    return response?.data?.data;
  } catch (error) {
    console.error("Error:", error);
  }
};

export interface IQueryReportInstitutionRegion {
  campaign_id: string;
  type: "province" | "city" | string;
  corp_unit_lvl1_id?: string;
  corp_unit_lvl2_id?: string;
  corp_unit_lvl3_id?: string;
  province_code?: string;
  city_code?: string;
  wakif_type_id?: string;
  payment_date_start?: string;
  payment_date_end?: string;
  corp_unit_profession?: string;
  page?: string;
  size?: string;
  search?: string;
  refetchInterval?: number | false;
}
export const getReportInstitutionRegion = async ({
  campaign_id = "",
  type = "province",
  corp_unit_lvl1_id = "",
  corp_unit_lvl2_id = "",
  corp_unit_lvl3_id = "",
  province_code = "",
  city_code = "",
  wakif_type_id = "",
  page = "0",
  size = "10",
  payment_date_start = "",
  payment_date_end = "",
  search = "",
}: IQueryReportInstitutionRegion) => {
  try {
    const filters = qs({
      campaign_id,
      type,
      corp_unit_lvl1_id,
      corp_unit_lvl2_id,
      corp_unit_lvl3_id,
      province_code,
      city_code,
      wakif_type_id,
      payment_date_start,
      payment_date_end,
      page,
      size,
      pagination: "true",
      search,
    });

    const response = await axios.get(
      env.NEXT_PUBLIC_BASE_URL2 + `/public/report/donation/corp_unit/national?${filters}`
    );

    return response?.data?.data;
  } catch (error) {
    console.error("Error:", error);
  }
};

export interface IQueryReportDisbursementDetail {
  disbursement_id: string;
  refetchInterval?: number | false;
}

export const getReportDisbursementDetail = async ({ disbursement_id = "" }: IQueryReportDisbursementDetail) => {
  try {
    const filters = qs({
      id: disbursement_id,
    });

    const response = await axios.get(env.NEXT_PUBLIC_BASE_URL2 + `/public/report/campaign?${filters}`);
    return response?.data?.data?.items?.[0] || {};
  } catch (error) {
    console.error("Error:", error);
  }
};

// === OLD ====
const getReportKemenagKanwil = async (query?: string) => {
  try {
    const response = await axios.get(`https://api2.satuwakafindonesia.id/public/report/kemenag_kanwil?${query}`);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
  }
};

const getReportKemenagKanwilDonation = async (query?: string) => {
  try {
    const response = await axios.get(
      `https://api2.satuwakafindonesia.id/public/report/kemenag_kanwil/donation/histories?${query}`
    );
    return response.data;
  } catch (error) {
    console.error("Error:", error);
  }
};

const getReportByCampaignID = async (query?: string) => {
  try {
    const response = await axios.get(`https://api2.satuwakafindonesia.id/public/report/programs?${query}`);
    return response?.data;
  } catch (error) {
    console.error("Error:", error);
  }
};

const getReportProgramDonationHistories = async (query?: string) => {
  try {
    const response = await axios.get(
      `https://api2.satuwakafindonesia.id/public/report/programs/donation/histories?${query}`
    );

    return response?.data;
  } catch (error) {
    console.error("Error:", error);
  }
};

const getListReportCampaignPrograms = async (query?: string) => {
  try {
    const response = await axios.get(`https://api2.satuwakafindonesia.id/public/campaigns/programs?${query}`);

    return response?.data;
  } catch (error) {
    console.error("Error", error);
  }
};

// DANA ABADI MASJID
const getReportCorpUnit = async (query?: string) => {
  try {
    const response = await axios.get(`https://api2.satuwakafindonesia.id/public/report/corp_unit?${query}`);

    return response?.data;
  } catch (error) {
    console.error("Error", error);
  }
};

const getListWakifReportCorpUnit = async (query?: string) => {
  try {
    const response = await axios.get(
      `https://api2.satuwakafindonesia.id//public/report/corp_unit/donation/histories?${query}`
    );

    return response?.data;
  } catch (error) {
    console.error("Error", error);
  }
};

export {
  getListReportCampaignPrograms,
  getListWakifReportCorpUnit,
  getReportByCampaignID,
  getReportCorpUnit,
  getReportKemenagKanwil,
  getReportKemenagKanwilDonation,
  getReportProgramDonationHistories,
};
