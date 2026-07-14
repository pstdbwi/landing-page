import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { getCorporateUnit } from ".";

export const useGetCorporateUnit = ({
  corp_id,
  group,
  staleTime = 600000,
  refetchInterval = 600000,
  enabled = true,
}: {
  corp_id: string;
  group: string;
  staleTime?: number;
  refetchInterval?: number;
  enabled?: boolean;
}): UseQueryResult<any, unknown> => {
  const query = useQuery({
    queryKey: ["corporate-unit", corp_id, group],
    queryFn: () => getCorporateUnit({ corp_id, group }),
    staleTime,
    refetchInterval,
    enabled,
    retry: 3,
  });
  return query;
};
