import { IDonor, IReportProvince } from "@/constant/pai";
import { ITable } from "@/types";
import { ICampaign } from "@/types/campaign";
import { IReportCampaignDistribution } from "@/types/report";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import {
  getListReportCampaignPrograms,
  getListWakifReportCorpUnit,
  getReportByCampaignID,
  getReportCampaignDetail,
  getReportCampaignDistribution,
  getReportCorpUnit,
  getReportDisbursementDetail,
  getReportDonationNational,
  getReportDonationWakif,
  getReportInstitution,
  getReportInstitutionRegion,
  getReportKemenagKanwil,
  getReportKemenagKanwilDonation,
  getReportProgramDonationHistories,
  getReportPrograms,
  IQueryReportDisbursementDetail,
  IQueryReportDistribution,
  IQueryReportDonationNational,
  IQueryReportDonationWakif,
  IQueryReportInstitution,
  IQueryReportInstitutionRegion,
  IQueryReportPrograms,
} from ".";

export const useGetReportKemenagKanwil = ({
  staleTime = 60000,
  refetchInterval = 60000,
  enabled,
  queryString,
}: {
  staleTime?: number;
  refetchInterval?: number;
  enabled?: boolean;
  queryString?: string;
}): UseQueryResult<any, unknown> => {
  const query = useQuery({
    queryKey: ["kemenag-kanwil", queryString],
    queryFn: () => getReportKemenagKanwil(queryString),
    staleTime: staleTime | 600000,
    refetchInterval: refetchInterval | 600000,
    enabled: enabled,
    retry: 3,
  });
  return query;
};

export const useGetReportKemenagKanwilDonation = ({
  staleTime = 60000,
  refetchInterval = 60000,
  enabled,
  queryString,
}: {
  staleTime?: number;
  refetchInterval?: number;
  enabled?: boolean;
  queryString?: string;
}): UseQueryResult<any, unknown> => {
  const query = useQuery({
    queryKey: ["kemenag-kanwil-donation", queryString],
    queryFn: () => getReportKemenagKanwilDonation(queryString),
    staleTime: staleTime | 600000,
    refetchInterval: refetchInterval | 600000,
    enabled: enabled,
    retry: 3,
  });
  return query;
};

export const useGetReportByCampaign = ({
  staleTime = 60000,
  refetchInterval = 60000,
  enabled,
  queryString,
}: {
  staleTime?: number;
  refetchInterval?: number;
  enabled?: boolean;
  queryString?: string;
}): UseQueryResult<any, unknown> => {
  const query = useQuery({
    queryKey: ["report-campaign", queryString],
    queryFn: () => getReportByCampaignID(queryString),
    staleTime: staleTime | 600000,
    refetchInterval: refetchInterval | 600000,
    enabled: enabled,
    retry: 3,
  });
  return query;
};

export const useGetReportProgramDonationHistories = ({
  staleTime = 60000,
  refetchInterval = 60000,
  enabled,
  queryString,
}: {
  staleTime?: number;
  refetchInterval?: number;
  enabled?: boolean;
  queryString?: string;
}): UseQueryResult<any, unknown> => {
  const query = useQuery({
    queryKey: ["report-program-donation-histories", queryString],
    queryFn: () => getReportProgramDonationHistories(queryString),
    staleTime: staleTime | 600000,
    refetchInterval: refetchInterval | 600000,
    enabled: enabled,
    retry: 3,
  });

  return query;
};

export const useGetListReportCampaignPrograms = ({
  staleTime = 60000,
  refetchInterval = 60000,
  enabled,
}: {
  staleTime?: number;
  refetchInterval?: number;
  enabled?: boolean;
}): UseQueryResult<any, unknown> => {
  const query = useQuery({
    queryKey: ["list-report-campaign-programs"],
    queryFn: () => getListReportCampaignPrograms(),
    staleTime: staleTime | 600000,
    refetchInterval: refetchInterval | 600000,
    enabled: enabled,
    retry: 3,
  });

  return query;
};

export const useGetReportCorpUnit = ({
  staleTime = 60000,
  refetchInterval = 60000,
  enabled,
  queryString,
}: {
  staleTime?: number;
  refetchInterval?: number;
  enabled?: boolean;
  queryString?: string;
}): UseQueryResult<any, unknown> => {
  const query = useQuery({
    queryKey: ["report-corp-unit", queryString],
    queryFn: () => getReportCorpUnit(queryString),
    staleTime: staleTime | 600000,
    refetchInterval: refetchInterval | 600000,
    enabled: enabled,
    retry: 3,
  });

  return query;
};

export const useGetListReportWakifCorpUnit = ({
  staleTime = 60000,
  refetchInterval = 60000,
  enabled,
  queryString,
}: {
  staleTime?: number;
  refetchInterval?: number;
  enabled?: boolean;
  queryString?: string;
}): UseQueryResult<any, unknown> => {
  const query = useQuery({
    queryKey: ["wakif-report-corp-unit", queryString],
    queryFn: () => getListWakifReportCorpUnit(queryString),
    staleTime: staleTime | 600000,
    refetchInterval: refetchInterval | 600000,
    enabled: enabled,
    retry: 3,
  });

  return query;
};

// NEW

export const useReportCampaignDetail = ({
  campaign_id,
  staleTime = 600000,
  refetchInterval = false,
}: {
  campaign_id: string;
  staleTime?: number;
  refetchInterval?: number | false;
}): UseQueryResult<ICampaign, unknown> => {
  const query = useQuery({
    queryKey: ["campaign", campaign_id],
    queryFn: () => getReportCampaignDetail(campaign_id as string),
    enabled: !!campaign_id, // only run when campaign_id is defined
    staleTime: staleTime,
    refetchInterval,
    retry: 3,
  });
  return query;
};

export const useReportCampaignDistribution = (
  query: IQueryReportDistribution
): UseQueryResult<IReportCampaignDistribution, unknown> => {
  return useQuery({
    queryKey: ["campaign-distribution", query],
    queryFn: () => getReportCampaignDistribution(query),
    enabled: !!query?.campaign_id, // only run when campaign_id is defined
    refetchInterval: query?.refetchInterval,
  });
};

export const useReportDonationNational = (
  query: IQueryReportDonationNational
): UseQueryResult<ITable<IReportProvince>, unknown> => {
  return useQuery({
    queryKey: ["report-donation-national", query],
    queryFn: () => getReportDonationNational(query),
    enabled: !!query?.campaign_id, // only run when campaign_id is defined
    refetchInterval: query?.refetchInterval,
    staleTime: 5 * 60 * 1000,
  });
};

export const useReportDonationWakif = (query: IQueryReportDonationWakif): UseQueryResult<ITable<IDonor>, unknown> => {
  return useQuery({
    queryKey: ["report-donation-wakif", query],
    queryFn: () => getReportDonationWakif(query),
    enabled: !!query?.campaign_id, // only run when campaign_id is defined
    refetchInterval: query?.refetchInterval,
    retry: 3,
  });
};

export const useReportPrograms = (query: IQueryReportPrograms): UseQueryResult<any, unknown> => {
  return useQuery({
    queryKey: ["report-programs", query],
    queryFn: () => getReportPrograms(query),
    enabled: !!query?.campaign_id, // only run when campaign_id is defined
    refetchInterval: query?.refetchInterval,
    retry: 3,
  });
};

export const useReportInstitution = (query: IQueryReportInstitution): UseQueryResult<any, unknown> => {
  return useQuery({
    queryKey: ["report-institution", query],
    queryFn: () => getReportInstitution(query),
    enabled: !!query?.campaign_id && !!query?.corp_id, // only run when campaign_id is defined
    refetchInterval: query?.refetchInterval,
    retry: 3,
  });
};

export const useReportInstitutionRegion = (query: IQueryReportInstitutionRegion) => {
  return useQuery({
    queryKey: ["report-institution-region", query],
    queryFn: () => getReportInstitutionRegion(query),
    enabled:
      !!query?.campaign_id && (!!query?.corp_unit_lvl1_id || !!query?.corp_unit_lvl2_id || !!query?.corp_unit_lvl3_id), // only run when campaign_id is defined
    refetchInterval: query?.refetchInterval,
    retry: 3,
  });
};

export const useReportDisbursementDetail = (query: IQueryReportDisbursementDetail): UseQueryResult<any, unknown> => {
  return useQuery({
    queryKey: ["report-disbursement-detail", query],
    queryFn: () => getReportDisbursementDetail(query),
    enabled: !!query?.disbursement_id,
    refetchInterval: query?.refetchInterval,
    retry: 3,
  });
};
