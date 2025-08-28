export interface GpsAnalytics extends Record<string, unknown> {
  org_id: string;
  v_id: string;
  d_id: string;
  db_group: string;
  db_instance: string;
  vn: string;
  date: string;
  day: string;
  device: Device;
  driver: Driver;
  gps_count: number;
  count: number;
  dm_km: string;
  analytics_full: AnalyticsFull;
  hourly_analysis: HourlyAnalysis[];
  night_driving: NightDriving;

  // processed fields
  si: number;
  date_f: string;
  vn_f: string;
  vt: string;
  dr_f: string;
  night_driving_final: NightDrivingData;
}

export interface Device extends Record<string, unknown> {
  id: string;
  imei: string;
  make_id: string;
  model_id: string;
  type_id: string;
  make: string;
  model: string;
  type: string;
}

export interface Driver extends Record<string, unknown> {
  d_id: string;
  name: string;
  number: string;
}

export interface HourlyAnalysis extends Record<string, unknown> {
  id: string;
  day: string;
  hour: string;
  analytics_mini: AnalyticsMini;
}

export interface NightDriving extends Record<string, unknown> {
  Night_Driving_8PM_4AM: NightDrivingData;
  Night_Driving_8PM_5AM: NightDrivingData;
  Night_Driving_8PM_6AM: NightDrivingData;
  Night_Driving_10PM_2AM: NightDrivingData;
  Night_Driving_10PM_4AM: NightDrivingData;
  Night_Driving_10PM_5AM: NightDrivingData;
  Night_Driving_10PM_6AM: NightDrivingData;
}

export interface NightDrivingData extends Record<string, unknown> {
  day: AnalyticsMini;
  night: AnalyticsMini;
}

export interface AnalyticsFull extends Record<string, unknown> {

  dm: number;
  m_on_ts: number;
  m_off_ts: number;
  i_on_ts: number;
  i_off_ts: number;

  i_on_m_off_ts: number;
  i_off_m_on_ts: number;
  i_off_m_on_dm: number;
  s_d_on_ts: number;
  s_d_off_ts: number;
  s_g_on_ts: number;
  s_g_off_ts: number;
  sa: number;
  sd: number;
  ms: number;
  as: number;
  os: OverSpeed;

  // processed fields
  dm_km: string;
  u_p: string;
  m_on_ts_f: string;
  m_off_ts_f: string;
  i_on_ts_f: string;
  i_off_ts_f: string;

  i_on_m_off_ts_f: string;
  i_off_m_on_ts_f: string;
  i_off_m_on_dm_km: string;
  os_f: OverSpeedChild;
}

export interface AnalyticsMini extends Record<string, unknown> {
  dm: number;
  m_on_ts: number;
  m_off_ts: number;
  i_on_ts: number;
  i_off_ts: number;
  i_on_m_off_ts: number;
  ms: number;
  as: number;

  // processed fields
  dm_km: string;
  m_on_ts_f: string;
  m_off_ts_f: string;
  i_on_ts_f: string;
  i_off_ts_f: string;
  i_on_m_off_ts_f: string;
}

export interface OverSpeed extends Record<string, unknown> {
  Over_Speed_60KM: OverSpeedChild;
  Over_Speed_70KM: OverSpeedChild;
  Over_Speed_80KM: OverSpeedChild;
  Over_Speed_90KM: OverSpeedChild;
  Over_Speed_100KM: OverSpeedChild;
  Over_Speed_110KM: OverSpeedChild;
  Over_Speed_120KM: OverSpeedChild;
  Over_Speed_130KM: OverSpeedChild;
}

export interface OverSpeedChild extends Record<string, unknown> {
  i_c: number;
  dm: number;
  ts: number;
  i: OverSpeedIncidents[];

  // processed fields
  dm_km: string;
  ts_f: string;
}

export interface OverSpeedIncidents extends Record<string, unknown> {
  fdt: string;
  tdt: string;
  fdts: number;
  tdts: number;
  ms: number;
  as: number;
  ts: number;
  dm: number;
}
