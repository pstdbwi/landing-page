import { fetchData } from "@/lib/fetch";

export const getNewsListHome = async (): Promise<any> => {
  try {
    const response = await fetchData(
      "/contents?status_ids=1&type_ids=3&campaign_id=null&pagination=true&size=10",
      "GET",
      null,
      {}
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getNewsList = async (sort: string, next: string): Promise<any> => {
  let endpoint = `/contents?status_ids=1&type_ids=3&campaign_id=null`;
  if (sort || next) endpoint = sort ? `${endpoint}&sort=${sort}&next=${next}` : `${endpoint}&next=${next}`;
  try {
    const response = await fetchData(endpoint, "GET", null, {});

    return response;
  } catch (error) {
    throw error;
  }
};

export const getNewsListByCampaignId = async (sort: string, next: string, campaign_id: string): Promise<any> => {
  let endpoint = `/contents?status_ids=1&type_ids=3&campaign_id=${campaign_id}`;
  if (sort || next) endpoint = sort ? `${endpoint}&sort=${sort}&next=${next}` : `${endpoint}&next=${next}`;
  try {
    const response = await fetchData(endpoint, "GET", null, {});
    return response;
  } catch (error) {
    throw error;
  }
};

export const getNewsDetail = async (id: string): Promise<any> => {
  let endpoint = `/contents?id=${id}`;

  try {
    const response = await fetchData(endpoint, "GET", null, {});
    return response;
  } catch (error) {
    throw error;
  }
};
