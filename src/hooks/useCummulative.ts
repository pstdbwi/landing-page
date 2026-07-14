"use client";

import { env } from "@/lib/env";
import { qs } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

const fetchCummulative = async ({
  date_start,
  date_end,
  programID,
}: {
  date_start: string;
  date_end: string;
  programID: string;
}) => {
  const res = await fetch(
    `https://api.satuwakafindonesia.id/corporates/programs/${programID}/cummulative?${qs({
      date_start,
      date_end,
    })}`,
  );
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

export const useCummulative = (date_start = "", date_end = "", interval = 30000, programID = "") => {
  return useQuery({
    queryKey: ["cummulative", date_start, date_end, programID],
    queryFn: async () => await fetchCummulative({ date_start, date_end, programID }),
    refetchInterval: interval,
    enabled: !!programID,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
};

const fetchCummulativePrograms = async ({
  date_start,
  date_end,
  programIDS,
}: {
  date_start: string;
  date_end: string;
  programIDS: string;
}) => {
  const res = await fetch(
    `${env.NEXT_PUBLIC_BASE_URL}/corporates/programs/cummulative?${qs({
      date_start,
      date_end,
      program_ids: programIDS,
    })}`,
  );
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

export const useCummulativePrograms = (date_start = "", date_end = "", interval = 30000, programIDS = "") => {
  return useQuery({
    queryKey: ["cummulative-programs", date_start, date_end, programIDS],
    queryFn: async () => await fetchCummulativePrograms({ date_start, date_end, programIDS }),
    refetchInterval: interval,
    enabled: !!programIDS,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
};
