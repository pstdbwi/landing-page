import { qs } from "@/lib/utils";
import axios from "axios";

const PUBLIC_API2_BASE_URL = "https://api2.satuwakafindonesia.id";

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

    const result = await axios.get(`${PUBLIC_API2_BASE_URL}/corporates/program?${query}`);

    return result?.data?.data?.items;
  } catch (error) {
    console.error("Error cannot GET corporate Program...");
  }
};
