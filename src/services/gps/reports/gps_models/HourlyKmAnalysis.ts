export interface HourlyKmAnalysis extends Record<string, unknown> {
  org_id: string;
  v_id: string;
  d_id: string;
  date: string;
  vn_f: string;
  dr_f: string;
  id: string;
  day: string;
  hour: string;
  analysis: {
    dm: number;
    m_on_ts: number;
    m_off_ts: number;
    i_on_ts: number;
    i_off_ts: number;
    i_on_m_off_ts: number;
    ms: number;
    as: number;
    dm_km: string;
    m_on_ts_f: string;
    m_off_ts_f: string;
    i_on_ts_f: string;
    i_off_ts_f: string;
    i_on_m_off_ts_f: string;
  };
}
