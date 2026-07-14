import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { getActivationUser, getApplicationDetail, getDonorProfile } from ".";

export const useGetDonorProfile = ({
  donorId,
  staleTime,
  enabled = true,
  refetchOnMount = true,
}: any): UseQueryResult<any, unknown> => {
  const query = useQuery({
    queryKey: ["donor", donorId],
    queryFn: () => getDonorProfile(donorId as string),
    staleTime: staleTime | 600000,
    refetchInterval: false,
    enabled: enabled,
    retry: 3,
    refetchOnMount,
  });
  return query;
};

export const useGetActivationCode = ({
  registrationId,
  token,
  staleTime,
  enabled,
}: any): UseQueryResult<any, unknown> => {
  const query = useQuery({
    queryKey: ["activation"],
    queryFn: () => getActivationUser(registrationId, token),
    staleTime: staleTime | 600000,
    refetchInterval: false,
    enabled: enabled,
    refetchOnWindowFocus: false,
    retry: 3,
  });
  return query;
};

export const useGetApplicationDetail = ({
  applicationId,
  staleTime,
  refetchInteval,
}: any): UseQueryResult<any, unknown> => {
  const query = useQuery({
    queryKey: ["applicationDetail", applicationId],
    queryFn: () => getApplicationDetail(applicationId as string),
    staleTime: staleTime | 600000,
    refetchInterval: refetchInteval | 600000,
    retry: 3,
  });
  return query;
};
