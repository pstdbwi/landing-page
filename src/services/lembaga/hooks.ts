import { UseQueryResult, useQuery } from "@tanstack/react-query"
import { getLembagaById } from "."

export const useGetLembagaById = ({
    lembagaId,
    staleTime,
    refetchInteval,
    enabled,
}: any): UseQueryResult<any, unknown> => {
    const query = useQuery({
        queryKey: ['lembaga', lembagaId],
        queryFn: () => getLembagaById(lembagaId as string),
        staleTime: staleTime | 600000,
        refetchInterval: refetchInteval | 600000,
        enabled: enabled,
        retry: 3
    })
    return query
}