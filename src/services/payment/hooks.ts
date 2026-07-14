import { UseQueryResult, useQuery } from "@tanstack/react-query"
import { getPaymentmetList } from "."

export const useGetPaymentList = ({
    staleTime,
    refetchInteval,
    enabled
}: any): UseQueryResult<any, unknown> => {
    const query = useQuery({
        queryKey: ['payment-list'],
        queryFn: () => getPaymentmetList(),
        staleTime: staleTime | 600000,
        refetchInterval: refetchInteval | 600000,
        enabled: enabled,
        retry: 3
    })
    return query
}