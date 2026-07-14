"use server";

import { ErrorPage } from "@/components/Error";
import { env } from "@/lib/env";
import { qs } from "@/lib/utils";
import axios from "axios";
import ClientBeneficiary from "./client";

const GetData = async ({ searchParams }: any) => {
  try {
    const [distribution] = await Promise.all([
      axios.get(
        env.NEXT_PUBLIC_BASE_URL2 +
          `/public/report/campaign/distribution?${qs({
            id: "ce7fcf60-7b55-4ee7-9531-9f0d599c7e60", // campaign_id
          })}`
      ),
    ]);

    return {
      distribution: distribution?.data?.data || {},
    };
  } catch (error) {
    console.log({ error });
    return {
      error,
    };
  }
};

const page = async (props: any) => {
  const { distribution, error } = await GetData(props);

  if (error) {
    return <ErrorPage />;
  }

  return (
    <div>
      <ClientBeneficiary distribution={distribution} />
    </div>
  );
};

export default page;
