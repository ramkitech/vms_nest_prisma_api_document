import { AxiosInstance } from 'axios';

let axiosInstance: AxiosInstance;

export const setAxiosInstance = (instance: AxiosInstance) => {
    axiosInstance = instance;
};

export const getAxiosInstance = (): AxiosInstance => {
    if (!axiosInstance) {
        throw new Error('❌ Axios instance not configured. Call setupSdk() first.');
    }
    return axiosInstance;
};
