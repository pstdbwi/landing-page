"use client";

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const page = () => {
  const router = useRouter();

  useEffect(() => {
    router.push(`/report/dana-abadi-pai/national`);
  }, []);

  return <div></div>;
};

export default page;
