import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getNewsDetail } from ".";

export const useGetNewsDetail = ({ newsId, staleTime, refetchInteval }: any): UseQueryResult<any, unknown> => {
  const query = useQuery({
    queryKey: ["news", "detail", newsId],
    queryFn: () => getNewsDetail(newsId as string),
    staleTime: staleTime | 600000,
    refetchInterval: refetchInteval | 600000,
    retry: 3,
  });
  return query;
};
