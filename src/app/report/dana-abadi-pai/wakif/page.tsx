"use server";

import { env } from "@/lib/env";
import { qs } from "@/lib/utils";
import axios from "axios";
import ReportDanaAbadiWakifClient from "./client";
import { ErrorPage } from "@/components/Error";

const GetData = async ({ searchParams }: any) => {
  try {
    const {
      page = "0",
      size = "10",
      search = "",
      corp_unit_lvl1_id = "",
      corp_unit_profession = "",
      wakif_province_id = "",
      wakif_city_id = "",
      payment_date_start = "",
      payment_date_end = "",
    } = searchParams;

    const filters = {
      page,
      size,
      search,
      corp_unit_lvl1_id,
      corp_unit_profession,
      wakif_province_id,
      wakif_city_id,
      payment_date_start,
      payment_date_end,
    };

    const [reports, professions] = await Promise.all([
      axios.get(
        env.NEXT_PUBLIC_BASE_URL2 +
          `/public/report/corp_unit/donation/histories?${qs({
            ...filters,
            corp_id: "SPAI070520250000004",
            campaign_id: "ce7fcf60-7b55-4ee7-9531-9f0d599c7e60",
            type: "province",
            pagination: "true",
            show_app: "1",
            order_by: "payment_verified_at",
            order_type: "desc",
          })}`
      ),
      axios.get(
        env.NEXT_PUBLIC_BASE_URL2 +
          `/corporates/unit/kemenag/profession?${qs({
            corp_id: "SPAI070520250000004",
          })}`
      ),
    ]);

    return {
      typesWakif: professions?.data?.data?.pai || [],
      table: {
        ...reports?.data?.data,
        filters,
        size,
        page,
        total_pages: reports?.data?.data?.total_pages || 1,
      },
    };
  } catch (error) {
    console.log({ error });
    return {
      error,
    };
  }
};

const page = async (props: any) => {
  const { table, typesWakif, error } = await GetData(props);

  if (error) {
    return <ErrorPage />;
  }

  return <ReportDanaAbadiWakifClient table={table} typesWakif={typesWakif} />;
};

export default page;
