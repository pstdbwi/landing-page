import { env } from "@/lib/env";
import { qs } from "@/lib/utils";
import axios from "axios";

export const corporateProgram = async ({
  address,
  page = 0,
  size = 1,
  active = "true",
}: {
  address: string;
  page?: number;
  size?: number;
  active?: string;
}) => {
  try {
    const query = qs({
      address,
      page: String(page),
      size: String(size),
      active,
    });

    const result = await axios.get(`${env.NEXT_PUBLIC_BASE_URL2}/corporates/program?${query}`);

    return result?.data?.data?.items;
  } catch (error) {
    console.error("Error cannot GET corporate Program...");
  }
};
