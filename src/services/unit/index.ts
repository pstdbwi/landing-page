import { env } from "@/lib/env";
import { fetchData } from "@/lib/fetch";
import { qs } from "@/lib/utils";

const BASE_URL = env.NEXT_PUBLIC_BASE_URL;

export const getCorporateUnit = async ({ corp_id, group = "HQ" }: { corp_id: string; group: string }): Promise<any> => {
  try {
    const response = await fetchData(
      `/corporates/units?${qs({ corp_id, group, sort_by: "name", sort_type: "ASC" })}`,
      "GET",
      null,
      {},
      BASE_URL,
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};
