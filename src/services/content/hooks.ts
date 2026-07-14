"use client";

import { useQuery, UseQueryResult } from "@tanstack/react-query";
import {
  getBannerContent,
  getContentDetail,
  getContents,
  getFaqs,
  getHeroBanner,
  getPresReleaseById,
  getPromotionalBannerContent,
  IQueryContents,
} from ".";

export const useGetBannerContent = ({
  corpId,
  staleTime,
  refetchInteval,
  enabled,
}: any): UseQueryResult<any, unknown> => {
  const query = useQuery({
    queryKey: ["banner list", corpId],
    queryFn: () => getBannerContent(corpId),
    staleTime: staleTime | 600000,
    refetchInterval: refetchInteval | 600000,
    enabled: enabled,
    retry: 3,
  });
  return query;
};

export const useGetPromotionalBannerContent = ({
  corpId,
  corpProgramId,
  staleTime,
  refetchInteval,
  enabled,
}: any): UseQueryResult<any, unknown> => {
  const query = useQuery({
    queryKey: ["promotional-banner-list", corpId, corpProgramId],
    queryFn: () => getPromotionalBannerContent(corpId, corpProgramId),
    staleTime: staleTime | 600000,
    refetchInterval: refetchInteval | 600000,
    enabled: enabled,
    retry: 3,
  });
  return query;
};

export const useGetFaqs = ({ staleTime, refetchInteval }: any): UseQueryResult<any, unknown> => {
  const query = useQuery({
    queryKey: ["faqs"],
    queryFn: () => getFaqs(),
    staleTime: staleTime | 600000,
    refetchInterval: refetchInteval | 600000,
    retry: 3,
  });
  return query;
};

export const usePressReleaseById = ({
  pressReleaseId,
  staleTime,
  refetchInteval,
}: any): UseQueryResult<any, unknown> => {
  const query = useQuery({
    queryKey: ["pressRelease", pressReleaseId],
    queryFn: () => getPresReleaseById(pressReleaseId as string),
    staleTime: staleTime | 600000,
    refetchInterval: refetchInteval | 600000,
    retry: 3,
  });
  return query;
};

export const useGetHeroBanner = ({
  corpId,
  corpProgramId,
  staleTime,
  refetchInteval,
  enabled,
}: any): UseQueryResult<any, unknown> => {
  const query = useQuery({
    queryKey: ["banner list", corpId, corpProgramId],
    queryFn: () => getHeroBanner(corpId, corpProgramId),
    staleTime: staleTime | 600000,
    refetchInterval: refetchInteval | 600000,
    enabled: enabled,
    retry: 3,
  });
  return query;
};

export const useGetContents = (query: IQueryContents): UseQueryResult<any, unknown> => {
  return useQuery({
    queryKey: ["content", query],
    queryFn: () => getContents(query),
    retry: 3,
    enabled: true,
  });
};

export const useGetContentDetail = ({ id, staleTime, refetchInteval, enabled }: any): UseQueryResult<any, unknown> => {
  const query = useQuery({
    queryKey: ["content detail", id],
    queryFn: () => getContentDetail(id),
    staleTime: staleTime || 600000,
    refetchInterval: refetchInteval || 600000,
    enabled: enabled,
    retry: 3,
  });

  return query;
};
