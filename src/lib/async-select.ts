import axios from "axios";
import { qs } from "./utils";
import { env } from "./env";

type OptionType = {
  label: string;
  value: string;
};

export const createDebouncedFetcher = (fetchFn: (input: string) => Promise<OptionType[]>, delay = 500) => {
  let timeout: NodeJS.Timeout;

  return (input: string): Promise<OptionType[]> =>
    new Promise((resolve) => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(async () => {
        try {
          const result = await fetchFn(input);
          resolve(result);
        } catch {
          resolve([]);
        }
      }, delay);
    });
};

const createFetchCampaigns =
  () =>
  async (input: string): Promise<OptionType[]> => {
    const response = await axios.get(
      env.NEXT_PUBLIC_BASE_URL +
        `/campaigns?${qs({
          sort: "terbaru",
          status: "ACTIVE",
          is_priority_order: "1",
          search: input,
        })}`
    );

    return (
      response?.data?.data?.map((item: any) => ({
        ...item,
        value: item.id || item?.ID,
        label: `${item?.title}`,
      })) ?? []
    );
  };

const createFetchSchools =
  (corp_id: string, province_code: string, city_code: string) =>
  async (input: string): Promise<OptionType[]> => {
    const response = await axios.get(
      env.NEXT_PUBLIC_BASE_URL +
        `/corporates/units?${qs({
          code: "Sch",
          corp_id: corp_id,
          show_apps: "1",
          limit: "20",
          offset: "0",
          city_code: city_code || "",
          province_code: province_code || "",
          search: input,
        })}`
    );

    return (
      response?.data?.data?.map((item: any) => ({
        ...item,
        value: item.id || item?.ID,
        label: `${item?.name}`,
      })) ?? []
    );
  };

const createFetchUniversity =
  (corp_id: string, province_code: string, city_code: string) =>
  async (input: string): Promise<OptionType[]> => {
    const response = await axios.get(
      env.NEXT_PUBLIC_BASE_URL +
        `/corporates/units?${qs({
          code: "Univ",
          corp_id: corp_id,
          show_apps: "1",
          limit: "20",
          offset: "0",
          city_code: city_code || "",
          province_code: province_code || "",
          level: "1",
          search: input,
        })}`
    );

    return (
      response?.data?.data?.map((item: any) => ({
        ...item,
        value: item.id || item?.ID,
        label: `${item?.name}`,
      })) ?? []
    );
  };

const createFetchFaculty =
  (corp_id: string, corp_unit_lvl1_id: string) =>
  async (input: string): Promise<OptionType[]> => {
    const response = await axios.get(
      env.NEXT_PUBLIC_BASE_URL +
        `/corporates/units?${qs({
          code: "Univ",
          corp_id: corp_id,
          show_apps: "1",
          limit: "50",
          offset: "0",
          level_parent: corp_unit_lvl1_id,
          // level: "2",
          search: input,
        })}`
    );

    return (
      response?.data?.data?.map((item: any) => ({
        ...item,
        value: item.id || item?.ID,
        label: `${item?.name}`,
      })) ?? []
    );
  };

const createFetchProdi =
  (corp_id: string, corp_unit_lvl2_id: string) =>
  async (input: string): Promise<OptionType[]> => {
    const response = await axios.get(
      env.NEXT_PUBLIC_BASE_URL +
        `/corporates/units?${qs({
          code: "Univ",
          corp_id: corp_id,
          show_apps: "1",
          limit: "50",
          offset: "0",
          level_parent: corp_unit_lvl2_id,
          // level: "3",
          search: input,
        })}`
    );

    return (
      response?.data?.data?.map((item: any) => ({
        ...item,
        value: item.id || item?.ID,
        label: `${item?.name}`,
      })) ?? []
    );
  };

const createFetchCorpUnitLevel1 =
  (corp_id: string, province_code: string, city_code: string) =>
  async (input: string): Promise<OptionType[]> => {
    const response = await axios.get(
      env.NEXT_PUBLIC_BASE_URL +
        `/corporates/units?${qs({
          corp_id: corp_id,
          show_apps: "1",
          limit: "20",
          offset: "0",
          city_code: city_code || "",
          province_code: province_code || "",
          level: "1",
          search: input,
        })}`
    );

    return (
      response?.data?.data?.map((item: any) => ({
        ...item,
        value: item.id || item?.ID,
        label: `${item?.name}`,
      })) ?? []
    );
  };

const createFetchCorpUnitLevel2 =
  (corp_id: string, corp_unit_lvl1_id: string) =>
  async (input: string): Promise<OptionType[]> => {
    const response = await axios.get(
      env.NEXT_PUBLIC_BASE_URL +
        `/corporates/units?${qs({
          show_apps: "1",
          limit: "50",
          offset: "0",
          level: "2",
          corp_id: corp_id,
          level_parent: corp_unit_lvl1_id,
          search: input,
        })}`
    );

    return (
      response?.data?.data?.map((item: any) => ({
        ...item,
        value: item.id || item?.ID,
        label: `${item?.name}`,
      })) ?? []
    );
  };

const createFetchCorpUnitLevel3 =
  (corp_id: string, corp_unit_lvl2_id: string) =>
  async (input: string): Promise<OptionType[]> => {
    const response = await axios.get(
      env.NEXT_PUBLIC_BASE_URL +
        `/corporates/units?${qs({
          show_apps: "1",
          limit: "50",
          offset: "0",
          level: "3",
          corp_id: corp_id,
          level_parent: corp_unit_lvl2_id,
          search: input,
        })}`
    );

    return (
      response?.data?.data?.map((item: any) => ({
        ...item,
        value: item.id || item?.ID,
        label: `${item?.name}`,
      })) ?? []
    );
  };

export const loadOptionsCampaigns = () => createDebouncedFetcher(createFetchCampaigns());

export const loadOptionsCorpUnitLevel1 = (corp_id: string, province_code: string, city_code: string) =>
  createDebouncedFetcher(createFetchCorpUnitLevel1(corp_id, province_code, city_code));

export const loadOptionsCorpUnitLevel2 = (corp_id: string, corp_unit_lvl1_id: string) =>
  createDebouncedFetcher(createFetchCorpUnitLevel2(corp_id, corp_unit_lvl1_id));

export const loadOptionsCorpUnitLevel3 = (corp_id: string, corp_unit_lvl2_id: string) =>
  createDebouncedFetcher(createFetchCorpUnitLevel3(corp_id, corp_unit_lvl2_id));

export const loadOptionsSchools = (corp_id: string, province_code: string, city_code: string) =>
  createDebouncedFetcher(createFetchSchools(corp_id, province_code, city_code));

export const loadOptionsUniveristies = (corp_id: string, province_code: string, city_code: string) =>
  createDebouncedFetcher(createFetchUniversity(corp_id, province_code, city_code));

export const loadOptionsFaculties = (corp_id: string, corp_unit_lvl1_id: string) =>
  createDebouncedFetcher(createFetchFaculty(corp_id, corp_unit_lvl1_id));

export const loadOptionsProdi = (corp_id: string, corp_unit_lvl2_id: string) =>
  createDebouncedFetcher(createFetchProdi(corp_id, corp_unit_lvl2_id));
