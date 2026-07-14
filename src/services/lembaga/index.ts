import { env } from "@/lib/env";
import { fetchData } from "@/lib/fetch";

const BASE_URL = env.NEXT_PUBLIC_BASE_URL

export const getLembagaById = async (lembagaId: string): Promise<any> => {
    try {
        const response = await fetchData(
            `/lembagas/${lembagaId}`,
            'GET',
            null,
            {},
            BASE_URL
        );
        return response.data[0]
    } catch (error) {
        throw error
    }
}

