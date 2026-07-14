"use client";

import SharedAnonymousReceiptPage from "@/app/berwakaf/_components/shared-anonymous-receipt-page";

const ReceiptPage = ({
  params,
}: {
  params: {
    campaign_id: string;
    id: string;
  };
}) => {
  return <SharedAnonymousReceiptPage params={params} />;
};

export default ReceiptPage;
