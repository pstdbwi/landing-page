import { UseQueryResult, useQuery } from "@tanstack/react-query";
import {
  getCampaignByLembagaId,
  getCampaignDetail,
  getCampaignList,
  getDonationList,
  getNewerCampaignList,
  getSpecialSectionById,
  getSpecialSectionList,
} from ".";

export const useGetCampaignDetail = ({ campaignId, staleTime, refetchInteval }: any): UseQueryResult<any, unknown> => {
  const query = useQuery({
    queryKey: ["campaign", campaignId],
    queryFn: () => getCampaignDetail(campaignId as string),
    staleTime: staleTime | 60000,
    refetchInterval: refetchInteval | 60000,
    retry: 3,
  });
  return query;
};

export const useGetCampaignList = ({ staleTime, refetchInteval }: any): UseQueryResult<any, unknown> => {
  const query = useQuery({
    queryKey: ["campaign"],
    queryFn: () => getCampaignList(),
    staleTime: staleTime | 60000,
    refetchInterval: refetchInteval | 60000,
    retry: 3,
  });
  return query;
};

export const useGetNewerCampaignList = ({ staleTime, refetchInteval }: any): UseQueryResult<any, unknown> => {
  const query = useQuery({
    queryKey: ["campaign"],
    queryFn: () => getNewerCampaignList(),
    staleTime: staleTime | 60000,
    refetchInterval: refetchInteval | 60000,
    retry: 3,
  });
  return query;
};

export const useGetSpecialSectionList = ({ corpId, staleTime, refetchInteval }: any): UseQueryResult<any, unknown> => {
  const query = useQuery({
    queryKey: ["special-section", corpId],
    queryFn: () => getSpecialSectionList(corpId),
    staleTime: staleTime | 60000,
    refetchInterval: refetchInteval | 60000,
    retry: false,
  });
  return query;
};

export const useGetDonationList = ({ campaignId, staleTime, refetchInteval }: any): UseQueryResult<any, unknown> => {
  const query = useQuery({
    queryKey: ["donation-list", campaignId],
    queryFn: () => getDonationList(campaignId as string),
    staleTime: staleTime | 60000,
    refetchInterval: refetchInteval | 60000,
    retry: 3,
  });
  return query;
};

export const useGetCampaignByLembagaId = ({
  lembagaId,
  staleTime,
  refetchInteval,
}: any): UseQueryResult<any, unknown> => {
  const query = useQuery({
    queryKey: ["campaign-lembaga-", lembagaId],
    queryFn: () => getCampaignByLembagaId(lembagaId as string),
    staleTime: staleTime | 60000,
    refetchInterval: refetchInteval | 60000,
    retry: 3,
  });
  return query;
};

export const useGetSpecialSectionById = ({
  id,
  corp_id,
  priority,
  staleTime,
  refetchInterval,
  date_start,
  date_end,
}: any): UseQueryResult<any, unknown> => {
  const query = useQuery({
    queryKey: ["campaign-lembaga-", id, corp_id, priority, date_start, date_end],
    queryFn: () => getSpecialSectionById(id, corp_id, priority, date_start, date_end),
    staleTime: 0,
    refetchInterval: refetchInterval,
    retry: 3,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  return query;
};
