import { getAxiosInstance } from "sdk-config";

export const apiGet = async <T>(url: string, params?: Record<string, unknown>): Promise<T> => {
  const response = await getAxiosInstance().get<T>(url, { params });
  return response.data;
};

export const apiPost = async <T, D>(url: string, data: D): Promise<T> => {
  const response = await getAxiosInstance().post<T>(url, data);
  return response.data;
};

export const apiPatch = async <T, D>(url: string, data: D): Promise<T> => {
  const response = await getAxiosInstance().patch<T>(url, data);
  return response.data;
};

export const apiDelete = async <T>(url: string): Promise<T> => {
  const response = await getAxiosInstance().delete<T>(url);
  return response.data;
};
