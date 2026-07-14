import { UseQueryResult, useQuery } from "@tanstack/react-query"
import { getCertificateById, getDonationById, getDonationByIdNonLogin, getDonationPaymentDetailById, getDonorListByCampaignId } from "."

export const useGetDonorListByCampaignId = ({
    campaignId,
    staleTime,
    refetchInteval,
    enabled
}: any): UseQueryResult<any, unknown> => {
    const query = useQuery({
        queryKey: ['donation-list', campaignId],
        queryFn: () => getDonorListByCampaignId(campaignId as string),
        staleTime: staleTime | 600000,
        refetchInterval: refetchInteval | 600000,
        enabled: enabled,
        retry: 3
    })
    return query
}

export const useGetDonationById = ({
    donationId,
    staleTime,
    refetchInteval,
    enabled
}: any): UseQueryResult<any, unknown> => {
    const query = useQuery({
        queryKey: ['donation-', donationId],
        queryFn: () => getDonationById(donationId as string),
        staleTime: staleTime | 600000,
        refetchInterval: refetchInteval | 600000,
        enabled: enabled,
        retry: 3
    })
    return query
}

export const useGetDonationByIdNonLogin = ({
    donationId,
    staleTime,
    refetchInteval,
    enabled
}: any): UseQueryResult<any, unknown> => {
    const query = useQuery({
        queryKey: ['donation-non-login-', donationId],
        queryFn: () => getDonationByIdNonLogin(donationId as string),
        staleTime: staleTime | 600000,
        refetchInterval: refetchInteval | 600000,
        enabled: enabled,
        retry: 3
    })
    return query
}

export const useCertificateById = ({
    donationId,
    staleTime,
    refetchInteval,
    enabled
}: any): UseQueryResult<any, unknown> => {
    const query = useQuery({
        queryKey: ['certificate-', donationId],
        queryFn: () => getCertificateById(donationId as string),
        staleTime: staleTime | 600000,
        refetchInterval: refetchInteval | 600000,
        enabled: enabled,
        retry: 3
    })
    return query
}

export const UseGetDonationPaymentDetailById = ({
    donationId,
    staleTime,
    refetchInteval,
    enabled
}: any): UseQueryResult<any, unknown> => {
    const query = useQuery({
        queryKey: ['donation-payment', donationId],
        queryFn: () => getDonationPaymentDetailById(donationId as string),
        staleTime: staleTime | 600000,
        refetchInterval: refetchInteval | 600000,
        enabled: enabled,
        retry: 3
    })
    return query
}
