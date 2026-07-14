import { env } from "@/lib/env";
import { fetchData } from "@/lib/fetch";

const BASE_URL_PAYMENT = env.NEXT_PUBLIC_BASE_URL_PAYMENT

const getPaymentmetList = async () => {
    try {
        const response = await fetchData(
            '/payment-methods',
            'GET',
            null, {},
            BASE_URL_PAYMENT
        );
        return response.data[0]
    } catch (error) {
        console.error('Error:');
    }
};

export { getPaymentmetList };