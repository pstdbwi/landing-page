import axios, { AxiosRequestConfig } from "axios";
import { getCookie } from "cookies-next";
import { env } from "./env";

const axiosInstance = axios.create({
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + getCookie("user_token"),
  },
  baseURL: env.NEXT_PUBLIC_BASE_URL,
});

export const fetchData = async (
  url: string,
  method = "GET",
  data = null,
  headers = {},
  baseUrl?: string,
  basicAuth?: { username: string; password: string }
) => {
  try {
    const requestConfig: AxiosRequestConfig = {
      url: baseUrl ? `${baseUrl}${url}` : url,
      method,
      data,
      headers,
    };

    if (basicAuth) {
      requestConfig.auth = basicAuth;
    }

    const response = await axiosInstance(requestConfig);

    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      throw new Error(`Request failed with status ${response.status}`);
    }
  } catch (error) {
    throw error;
  }
};
