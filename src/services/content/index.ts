import { env } from "@/lib/env";
import { fetchData } from "@/lib/fetch";
import { qs } from "@/lib/utils";
import { INews } from "@/types/news";

const BASE_URL = env.NEXT_PUBLIC_BASE_URL;

export const getBannerContent = async (corpId?: string): Promise<any> => {
  try {
    const response = await fetchData(`/content/banners?corp_id=${corpId}`, "GET", null, {}, BASE_URL);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPromotionalBannerContent = async (corpId: string, corpProgramId: string): Promise<any> => {
  try {
    const response = await fetchData(
      `/content/banners?type=PROMOTION&corp_id=${corpId}&corp_program_id=${corpProgramId}`,
      "GET",
      null,
      {},
      BASE_URL
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPresReleaseList = async (next: string): Promise<any> => {
  let endpoint = `/content/press-releases?sort=terbaru`;
  if (next) endpoint = `${endpoint}&next=${next}`;
  try {
    const response = await fetchData(endpoint, "GET", null, {});
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPresReleaseById = async (pressReleaseId: string): Promise<any> => {
  try {
    const response = await fetchData(`/content/press-releases/${pressReleaseId}`, "GET", null, {}, BASE_URL);
    return response.data[0];
  } catch (error) {
    throw error;
  }
};

export const getFaqs = async (): Promise<any> => {
  try {
    const response = await fetchData(`/faqs`, "GET", null, {}, BASE_URL);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getHeroBanner = async (corpId?: string, corpProgramId?: string): Promise<any> => {
  try {
    const response = await fetchData(
      `/campaigns/heros?corp_id=${corpId}&corp_program_id=${corpProgramId}`,
      "GET",
      null,
      {},
      BASE_URL
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export interface IQueryContents {
  special_section_id?: string;
  status_ids?: string;
  type_ids?: string;
  limit?: string;
  offset?: string;
  sort?: string;
  next?: string;
  refetchInterval?: number | false;
}

export const getContents = async ({
  special_section_id = "",
  status_ids = "1",
  type_ids = "",
  limit = "",
  offset = "",
  sort = "",
  next = "",
}: IQueryContents): Promise<INews> => {
  try {
    const filters = qs({
      special_section_id,
      status_ids,
      type_ids,
      limit,
      offset,
      sort,
      ...(next ? { next } : {}),
    });

    let endpoint = `/contents?${filters}`;

    const response = await fetchData(endpoint, "GET", null, {});

    return response;
  } catch (error) {
    throw error;
  }
};

export const getContentDetail = async (id: string): Promise<INews> => {
  try {
    const response = await fetchData(`/contents?id=${id}`, "GET", null, {});

    return response.data;
  } catch (error) {
    throw error;
  }
};
