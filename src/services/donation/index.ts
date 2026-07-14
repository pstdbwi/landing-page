import { fetchData } from "@/lib/fetch";
import { getCookie } from "cookies-next";
import { env } from "@/lib/env"
const BASE_URL_PAYMENT = env.NEXT_PUBLIC_BASE_URL_PAYMENT

export const getDonationList = async (
    campaignId: string,
    next?: string
): Promise<any> => {
    let endpoint = `/donations?campaign_id=${campaignId}`
    if (next) endpoint = `${endpoint}&next=${next}`
    try {
        const response = await fetchData(
            endpoint,
            'GET',
            null,
            {},
        );
        return response.data
    } catch (error) {
        throw error
    }
}

export const getUserDonationList = async (
    next?: string,
    sort?: string
): Promise<any> => {
    let endpoint = `/donations/donors?sort=${sort || ''}`
    if (next) endpoint = `${endpoint}&next=${next}`
    try {
        const response = await fetchData(
            endpoint,
            'GET',
            null,
            {
                Authorization: 'Bearer ' + getCookie('user_token')
            },
        );
        return response
    } catch (error) {
        throw error
    }
}


export const getDonorListByCampaignId = async (
    campaignId: string
): Promise<any> => {
    try {
        const response = await fetchData(
            `/donations?campaign_id=${campaignId}`,
            'GET',
            null,
            {},
        );
        return response.data
    } catch (error) {
        throw error
    }
}


export const getDonationById = async (donationId: string) => {
    try {
        const response = await fetchData(
            `/donations/${donationId}`,
            'GET',
            null,
            {},
        );
        return response.data[0]
    } catch (error) {
        console.error('Error:');
    }
};

export const getDonationByIdNonLogin = async (donationId: string) => {
    try {
        const response = await fetchData(
            `/donations/non-login/${donationId}`,
            'GET',
            null,
            {},
        );
        return response.data[0]
    } catch (error) {
        console.error('Error:');
    }
};


export const getCertificateById = async (donationId: string) => {
    try {
        const response = await fetchData(
            `/internal/donations/${donationId}`,
            'GET',
            null,
            {},
            '',
            {
                username: env.NEXT_PUBLIC_BASIC_AUTH_USERNAME,
                password: env.NEXT_PUBLIC_BASIC_AUTH_PASSWORD
            }

        );
        return response.data[0]
    } catch (error) {
        console.error('Error:');
    }
};

export const getDonationPaymentDetailById = async (donationId: string) => {
    try {
        const response = await fetchData(
            `/payments/${donationId}`,
            'GET',
            null,
            {},
            BASE_URL_PAYMENT,
        );
        return response.data[0]
    } catch (error) {
        console.error('Error:');
    }
};




