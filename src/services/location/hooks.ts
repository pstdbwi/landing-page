import { UseQueryResult, useQuery } from "@tanstack/react-query"
import { getCityList, getDistrictList, getProviceList } from "."


export const useGetProvinceList = ({
    staleTime,
    refetchInteval,
    enabled
}: any): UseQueryResult<any, unknown> => {
    const query = useQuery({
        queryKey: ['province-list'],
        queryFn: () => getProviceList(),
        staleTime: staleTime | 600000,
        refetchInterval: refetchInteval | 600000,
        enabled: enabled,
        retry: 3
    })
    return query
}

export const useGetCityList = ({
    provinceId,
    staleTime,
    refetchInteval,
    enabled,
}: any): UseQueryResult<any, unknown> => {
    const query = useQuery({
        queryKey: ['city-list', provinceId],
        queryFn: () => getCityList(provinceId as string),
        staleTime: staleTime | 600000,
        refetchInterval: refetchInteval | 600000,
        enabled: enabled,
        retry: 3
    })
    return query
}

export const useGetDistrictList = ({
    cityId,
    staleTime,
    refetchInteval,
    enabled,
}: any): UseQueryResult<any, unknown> => {
    const query = useQuery({
        queryKey: ['district-list', cityId],
        queryFn: () => getDistrictList(cityId as string),
        staleTime: staleTime | 600000,
        refetchInterval: refetchInteval | 600000,
        enabled: enabled,
        retry: 3
    })
    return query
}