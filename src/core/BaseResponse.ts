export interface PageData {
  total_count: number;
  page_count: number;
  next_page: boolean;
  page_index: number;
}

export interface SBR {
  status: boolean;
  message: string;
  error?: string;
}

export interface BR<T> {
  status: boolean;
  message: string;
  error?: string;
  data?: T;
}

export interface FBR<T> {
  status: boolean;
  message: string;
  error?: string;
  page_data: PageData;
  data?: T;
  summary_vehicle_data?: [];
  summary_driver_data?: [];
  summary_day_data?: [];
  summary_data?: SummaryData;
}

export interface SummaryData {
  dm: number;
  m_on_ts: number;
  m_off_ts: number;
  i_on_ts: number;
  i_off_ts: number;
  ms: number;
  as: number;
  dm_km: string;
  m_on_ts_f: string;
  m_off_ts_f: string;
  i_on_ts_f: string;
  i_off_ts_f: string;
}


export const r_log = (data = {}) => {
  return data;
};
