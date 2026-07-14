import { fetchData } from "@/lib/fetch";

const getProviceList = async () => {
    try {
        const response = await fetchData(
            '/locations/provinces',
            'GET',
            null,
            {},
        );
        return response.data
    } catch (error) {
        console.error('Error:');
    }
};

const getCityList = async (
    provinceId: string
) => {
    try {
        const response = await fetchData(
            `/locations/cities/${provinceId}`,
            'GET',
            null,
            {},
        );
        return response.data
    } catch (error) {
        console.error('Error:');
    }
};

const getDistrictList = async (
    cityId: string
) => {
    try {
        const response = await fetchData(
            `/locations/districts/${cityId}`,
            'GET',
            null,
            {},
        );
        return response.data
    } catch (error) {
        console.error('Error:');
    }
};

export { getProviceList, getCityList, getDistrictList };