import { AxiosInstance } from 'axios';

const KEY = '__vms_axios_instance__';

export const setAxiosInstance = (instance: AxiosInstance) => {
  (globalThis as any)[KEY] = instance;
  console.log('✅ Axios instance set globally');
};

export const getAxiosInstance = (): AxiosInstance => {
  const instance = (globalThis as any)[KEY];
  if (!instance) {
    throw new Error('❌ Axios instance not configured. Call setAxiosInstance() first.');
  }
  return instance;
};
