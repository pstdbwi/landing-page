import { fetchData } from "@/lib/fetch";
import { qs } from "@/lib/utils";

const PUBLIC_API_BASE_URL = "https://api.satuwakafindonesia.id";

export const getCampaignDetail = async (campaignId: string): Promise<any> => {
  try {
    const response = await fetchData(`/campaigns/${campaignId}`, "GET", null, {});

    return response?.data?.[0] || {};
  } catch (error) {
    throw error;
  }
};

export const getCampaignList = async (): Promise<any> => {
  try {
    const response = await fetchData("/campaigns", "GET", null, {});
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getSearchCampaignList = async (
  campaignName: string,
  corpId?: string,
  corpProgramId?: string,
): Promise<any> => {
  try {
    const response = await fetchData(
      `/campaigns?search=${campaignName}&status=ACTIVE&corp_id=${corpId}&corp_program_id=${corpProgramId}`,
      "GET",
      null,
      {},
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getSearchLembagaList = async (lembagaName: string): Promise<any> => {
  try {
    const response = await fetchData(`/lembagas?query=${lembagaName}`, "GET", null, {});
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getNewerCampaignList = async (
  corp_id?: string,
  corp_program_id?: string,
  isHighlighted?: "1" | "0",
  next?: string,
): Promise<any> => {
  let endpoint = `/campaigns?sort=terbaru&status=ACTIVE&corp_program_id=${corp_program_id || ""}&corp_id=${
    corp_id || ""
  }&is_highlighted=${isHighlighted}&is_priority_order=1`;
  if (next) endpoint = `${endpoint}&next=${next}`;
  try {
    const response = await fetchData(endpoint, "GET", null, {});
    return response;
  } catch (error) {
    throw error;
  }
};

export const getSpecialSectionList = async (corpId: string): Promise<any> => {
  try {
    const response = await fetchData(
      `/special-sections?${qs({
        corp_id: corpId || "",
        is_priority_order: "1",
      })}`,
      "GET",
      null,
      {},
    );

    return response.data[0];
  } catch (error) {
    throw error;
  }
};

export const getCampaignByLembagaId = async (lembagaId: string): Promise<any> => {
  try {
    const response = await fetchData(`/campaigns?lembaga_id=${lembagaId}`, "GET", null, {});
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getDonationList = async (campaignId: string, next?: string): Promise<any> => {
  let endpoint = `/donations?campaign_id=${campaignId}`;
  if (next) endpoint = `${endpoint}&next=${next}`;
  try {
    const response = await fetchData(endpoint, "GET", null, {});
    return response;
  } catch (error) {
    throw error;
  }
};

export const getDonationPraysList = async (campaignId: string, next?: string): Promise<any> => {
  let endpoint = `/donations/wakif/prays?campaign_id=${campaignId}`;
  if (next) endpoint = `${endpoint}&next=${next}`;
  try {
    const response = await fetchData(endpoint, "GET", null, {});
    return response;
  } catch (error) {
    throw error;
  }
};

export const getCampaignBasedTypeList = async (
  category: string,
  sort: string,
  next: string,
  corpId?: string,
  corpProgramId?: string,
): Promise<any> => {
  let endpoint = `/campaigns?category=${category}&status=ACTIVE&corp_id=${corpId}&corp_program_id=${corpProgramId}`;
  if (next) endpoint = sort ? `${endpoint}&sort=${sort}&next=${next}` : `${endpoint}&next=${next}`;
  try {
    const response = await fetchData(endpoint, "GET", null, {});
    return response;
  } catch (error) {
    throw error;
  }
};

export const getSpecialSectionById = async (
  id: string,
  corp_id: string,
  priority?: string,
  date_start?: string,
  date_end?: string,
): Promise<any> => {
  if (!id) return null;

  const endpoint = `/special-sections/${encodeURIComponent(id)}?${qs({
    corp_id: corp_id || "",
    priority: priority || "",
    ...(date_start && { date_start }),
    ...(date_end && { date_end }),
  })}`;

  try {
    const response = await fetchData(endpoint, "GET", null, {}, PUBLIC_API_BASE_URL);

    return response.data;
  } catch (error: any) {
    // If your fetchData throws AxiosError-like objects:
    const status = error?.response?.status ?? error?.status;
    if (status === 404) {
      // Treat 404 as "not found" to prevent noisy errors/retries
      return null;
    }
    throw error;
  }
};

export const getCorporateUnit = async (corp_id: string): Promise<any> => {
  try {
    const response = await fetchData(`/coporates/units?corp_id=${corp_id}`, "GET", null, {});
    return response.data[0];
  } catch (error) {
    throw error;
  }
};
