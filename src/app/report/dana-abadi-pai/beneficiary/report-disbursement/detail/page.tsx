"use server";

import { ErrorPage } from "@/components/Error";
import { env } from "@/lib/env";
import { qs } from "@/lib/utils";
import axios from "axios";
import ClientDetailReportDisbursement from "./client";

const GetData = async ({ searchParams }: any) => {
  try {
    const { id = "" } = searchParams;

    const [distribution] = await Promise.all([
      axios.get(
        env.NEXT_PUBLIC_BASE_URL2 +
          `/public/report/campaign?${qs({
            id,
          })}`
      ),
    ]);

    return {
      distribution: distribution?.data?.data?.items?.[0] || {},
    };
  } catch (error) {
    console.log({ error });
    return {
      error,
    };
  }
};

const page = async (props: any) => {
  const { error, distribution } = await GetData(props);

  if (error) {
    return <ErrorPage />;
  }
  return (
    <div>
      <ClientDetailReportDisbursement distribution={distribution} />
    </div>
  );
};

export default page;
