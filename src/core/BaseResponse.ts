import { FileType, Status } from "./Enums";

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

export interface AWSPresignedUrl {
  presigned_url: string;
  file_url: string;
  file_key: string;
}

// ✅ BaseCommionFile Interface
export interface BaseCommionFile extends Record<string, unknown> {
  // Usage Type
  usage_type?: string;

  // File Details
  file_type: FileType;
  file_url?: string;
  file_key?: string;
  file_name?: string;
  file_description?: string;
  file_size?: number;
  file_metadata?: Record<string, unknown>;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;
}


export const r_log = (data = {}) => {
  return data;
};
