export interface Last24HoursKmReport extends Record<string, unknown> {
  o_id: string;
  v_id: string;
  vn_f: string;
  vt: string;
  dr_f: string;
  dr_id: string;

  dm: number;
  m_on_ts: number;
  m_off_ts: number;
  i_on_ts: number;
  i_off_ts: number;
  as: number;
  ms: number;

  dm_km: string;
  m_on_ts_f: string;
  m_off_ts_f: string;
  i_on_ts_f: string;
  i_off_ts_f: string;
}
