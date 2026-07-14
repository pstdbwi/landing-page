import { SessionOptions } from "iron-session";

export interface SessionData {
  id: string;
  email: string;
  image: string;
  name: string;
  phone_number: string;
  picture: string;
  type: string;
  corp_id: string;
  corp_name: string;
  corp_unit_id: string;
  corp_unit_name: string;
  corp_unit_group: string;
  isLoggedIn: boolean;

  // GEOLOCATION
  province_id: string;
  province_code: string;
  province_name: string;

  city_id: string;
  city_code: string;
  city_name: string;

  district_id: string;
  district_code: string;
  district_name: string;
}

export const defaultSession: SessionData = {
  id: "",
  email: "",
  image: "",
  name: "",
  phone_number: "",
  picture: "",
  type: "",
  corp_id: "",
  corp_name: "",
  corp_unit_id: "",
  corp_unit_name: "",
  corp_unit_group: "",
  isLoggedIn: false,

  // GEOLOCATION
  province_id: "",
  province_code: "",
  province_name: "",

  city_id: "",
  city_code: "",
  city_name: "",

  district_id: "",
  district_code: "",
  district_name: "",
};

export const sessionOptions: SessionOptions = {
  // satuwakaf-cookie-password -> sha256
  password: "02ad4733ddc8073696999b884bd964b0645bcf4a0f83189cc126e4ea251b2402",
  cookieName: "satuwakaf-cookie",
  cookieOptions: {
    // secure only works in `https` environments
    // if your localhost is not on `https`, then use: `secure: process.env.NODE_ENV === "production"`
    secure: true,
    maxAge: 180 * 24 * 60 * 60, // 180 Days
  },
};

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface IUserToken {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  image: string;
  is_social_media_login: boolean;
  is_location_data_completed: boolean;
  share_userdata_agreement: boolean;
  corp_id: string;
  corp_name: string;
  corp_unit_id: null;
  corp_unit_name: null;
  corp_unit_group: null;
  province_id: number;
  city_id: number;
  district_id: number;
  province_code: string;
  city_code: string;
  district_code: string;
  province_name: string;
  city_name: string;
  district_name: string;
  exp: number;
}
