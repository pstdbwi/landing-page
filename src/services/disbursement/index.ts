import { fetchData } from "@/lib/fetch";

export const getDisbursmentByCampaignId = async (
  sort: string,
  next: string,
  campaign_id: string,
  topic = "withdrawal",
): Promise<any> => {
  let endpoint = `/campaigns/reports?campaign_id=${campaign_id}&topic=${topic}`;
  if (sort || next) endpoint = sort ? `${endpoint}&sort=${sort}&next=${next}` : `${endpoint}&next=${next}`;
  try {
    const response = await fetchData(endpoint, "GET", null, {});

    return response;
  } catch (error) {
    throw error;
  }
};
