import { fetchData } from "@/lib/fetch";

export const getDonorProfile = async (donorsId: string): Promise<any> => {
  try {
    const response = await fetchData(`/donors/${donorsId}`, "GET", null, {});
    return response.data[0];
  } catch (error) {
    throw error;
  }
};

export const registerDonor = async (body: any): Promise<any> => {
  try {
    const response = await fetchData("/registration", "POST", body, {
      "Content-Type": "application/json",
    });
    return response.data[0];
  } catch (error) {
    throw error;
  }
};

export const getActivationUser = async (registrationId: string, token: string): Promise<any> => {
  try {
    const response = await fetchData(`/registration/${registrationId}/activation/${token}`, "GET", null, {});
    return response.data[0];
  } catch (error) {
    throw error;
  }
};

export const getApplicationListByDonorId = async ({
  donor_id,
  next,
  status,
}: {
  next: string;
  donor_id: string;
  status?: string;
}): Promise<any> => {
  let endpoint = `/beneficiary-applications?donor_id=${donor_id}`;

  if (next) {
    endpoint += `&next=${next}`;
  }

  if (status) {
    endpoint += `&status=${status}`;
  }

  try {
    const response = await fetchData(endpoint, "GET", null, {});
    return response;
  } catch (error) {
    throw error;
  }
};

export const getApplicationById = async ({ id }: { id: string }): Promise<any> => {
  let endpoint = `/beneficiary-applications?id=${id}`;

  try {
    const response = await fetchData(endpoint, "GET", null, {});
    return response;
  } catch (error) {
    throw error;
  }
};

export const getApplicationDetail = async (applicationId: string): Promise<any> => {
  try {
    const response = await fetchData(`/beneficiary-applications?id=${applicationId}`, "GET", null, {});

    return response?.data?.[0] || {};
  } catch (error) {
    throw error;
  }
};
