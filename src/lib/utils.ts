import { IPaymentDonor, IPaymentMethod } from "@/types/payment";
import clsx, { ClassValue } from "clsx";
import moment from "moment";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getFileName = (rawname: string) => {
  const raw = rawname?.split("/");
  const lengtRaw = raw?.length;

  return raw?.[lengtRaw - 1];
};

export function makeid() {
  let text = "";
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < 5; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

export const phoneNumberRegex = /^(0|62)\d{9,15}$/;

const currencyFormater = (value: number) => {
  if (!value) {
    return "0";
  }

  if (typeof Intl !== "undefined") {
    return Intl.NumberFormat("id-ID").format(value);
  }

  return value
    .toString()
    .replace(/^0+/, "")
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    .replace(/[A-Za-z]/g, "");
};

export default currencyFormater;

export const urlImageStoreGoogle = (url: string) => {
  if (!url) return "/";

  if (url.includes("https")) {
    return url;
  }

  return `https://storage.googleapis.com/ziswaf-asset-prod/` + url;
};

export function calculateDonationPercent(finalDonationAmount: number, donationTarget: number): number {
  if (donationTarget <= 0) {
    return 0;
  }

  const percent = (finalDonationAmount / donationTarget) * 100;
  return percent;
}

export function qs(query: Record<string, string>) {
  const newQuery = new URLSearchParams(query).toString();
  return newQuery;
}

export const toMoney = (money: any): string => {
  if (!money) {
    return "0";
  }

  return Number(money).toLocaleString("id-ID");
};

export const formatRupiah = (amount: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(amount);

export function cleanedUrl(url: string): string {
  if (!url) return "";

  return url.replace(/^https?:\/\//, "");
}

export function getSubDomain(url: string): string {
  if (!url) return "";

  const domain = url.split(".");

  if (domain[0] !== "app") {
    return domain[0].toUpperCase();
  } else {
    return "SATUWAKAF";
  }
}

export const calculateTotalTransactionWithQRIS = (total: number, type: string): boolean => {
  if (type?.toLowerCase() !== "qris") return false;

  const bank_fee = 0.7 / 100;
  const service_fee = 4 / 100;
  const max_service_fee = 25000;
  const max_value = 10000000;

  const total_bank_fee = Number(total) * bank_fee;
  const calculate_service_fee = Number(total) * service_fee;
  const total_service_fee = calculate_service_fee > 25000 ? max_service_fee : calculate_service_fee;

  const grand_total = total + total_bank_fee + total_service_fee;

  if (grand_total > max_value) {
    return true;
  }

  return false;
};

export const calculateTotalTransactionAmountAndServiceFee = (amount: number, service_fee: number, type: string) => {
  if (type?.toLowerCase() !== "qris") return false;
  return amount + service_fee > 10000000;
};

export const calculateServiceFee = (total: number) => {
  const rate_service_fee = 4 / 100; // 4%
  const min_service_fee = 1000;
  const max_service_fee = 25000;

  const bruto = total * rate_service_fee;

  if (bruto < min_service_fee) {
    return min_service_fee;
  } else if (bruto > max_service_fee) {
    return max_service_fee;
  }

  return bruto;
};

export const unixTimeNow = () => {
  return Math.floor(new Date().getTime() / 1000);
};

export const sanitizeTitle = (title: string) => {
  return title?.trim()?.replaceAll(/'|\s+/g, "-").toLowerCase();
};

export const phoneNumberFormater = (phone: string) => {
  phone = phone.trim();
  phone = phone.replace(/-/g, "");
  phone = phone.replace(/ /g, "");
  phone = phone.replace(/\+/g, "");
  if (phone.substring(0, 1) == "0") {
    phone = "62" + phone.substring(1);
  } else if (phone.substring(0, 2) == "62") {
    phone = phone;
  } else if (phone.substring(0, 1) != "0") {
    phone = "62" + phone;
  }
  return phone;
};

export const timestamp = (date: string | Date | null | undefined) => {
  if (!date) return "";
  return moment(date).format("YYYY-MM-DD HH:mm:ss");
};
export const NameOfPayment = ({
  payment,
  excludeText,
  paymentMethodType,
}: {
  payment: IPaymentDonor;
  excludeText?: string;
  paymentMethodType?: string;
}) => {
  if (!payment) return "";
  // Jika bukan instant_payment, langsung return Virtual Account
  if (paymentMethodType !== "instant_payment") {
    return `Virtual Account ${payment.bank_code || ""}`;
  }

  let cleanedName = payment.paid_qr_mname?.toLowerCase() || "";

  // Ganti "bwi merchant" dengan "QRIS NO :"
  cleanedName = cleanedName.replace(/bwi merchant/gi, "QRIS NO :");

  // Jika ada excludeText, hapus dari paid_qr_mname
  if (excludeText) {
    cleanedName = cleanedName.replace(new RegExp(`\\b${excludeText.toLowerCase()}\\b`, "gi"), "");
  }

  // Hapus semua karakter "|"
  cleanedName = cleanedName.replace(/\|/g, "").trim();

  // Tambahkan (STATIC) atau (DYNAMIC) berdasarkan paid_qr_static
  const qrType = payment.paid_qr_static ? "" : "(DYNAMIC)";

  return cleanedName
    ? `${cleanedName} - ${payment.bank || ""} ${qrType}`.trim()
    : `${payment.bank_code || ""} ${payment.bank || ""} ${qrType}`.trim();
};

export const GenerateBackgroundSpecialSection = (background: string, index: number): React.CSSProperties => {
  if (!background)
    return index % 2 === 1 ? { backgroundColor: "rgb(239, 248, 255)" } : { backgroundColor: "rgb(255, 255, 255)" };

  if (background.includes("https"))
    return { backgroundImage: `url('${background}')`, backgroundSize: "cover", backgroundPosition: "center" };

  if (background.startsWith("#")) return { backgroundColor: background };

  return index % 2 === 1 ? { backgroundColor: "rgb(239, 248, 255)" } : { backgroundColor: "rgb(255, 255, 255)" };
};

export const separatorLink = (link: string) => (link.includes("?") ? "&" : "?");

type Donation = {
  amount?: number | string;
  maintenance_fee?: number | string;
};

export function calculateTotalDonation(donation: Donation, paymentMethod?: IPaymentMethod | null): number {
  const amount = Number(donation.amount || 0);
  const maintenance = Number(donation.maintenance_fee || 0);
  const baseTotal = amount + maintenance;

  if (!paymentMethod?.fixed_fee && !paymentMethod?.variable_fee) return baseTotal;

  const additionalFee =
    paymentMethod.bank_code?.toLowerCase() === "qris" ? baseTotal * 0.007 : paymentMethod?.fixed_fee;

  return baseTotal + additionalFee;
}

export function formatUnixTimestamp(timestamp: number): string {
  // Ubah dari detik ke milidetik
  const date = new Date(timestamp * 1000);

  const hari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const bulan = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const namaHari = hari[date.getDay()];
  const tanggal = date.getDate();
  const namaBulan = bulan[date.getMonth()];
  const tahun = date.getFullYear();

  return `${namaHari}, ${tanggal} ${namaBulan} ${tahun}`;
}

export function addYearsToNow(years: number) {
  const date = new Date();
  date.setFullYear(date.getFullYear() + years);
  return date.toISOString().split("T")[0];
}
