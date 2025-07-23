export interface OverSpeedViolationDailyData extends Record<string, unknown> {
  dm: number;
  i_c: number;
  ts: number;
  dm_km: string;
  ts_f: string;
}

export interface OverSpeedSummaryData extends Record<string, unknown> {
  org_id: string;
  v_id: string;
  vn_f: string;
  vt: string;
  d_id: string;
  dr_f: string;

  i_c: number;
  ts: number;
  dm: number;
  ts_f: string;
  dm_km: string;
}

export interface OverSpeedViolationMonthly extends Record<string, unknown> {
  '01': OverSpeedViolationDailyData;
  '02': OverSpeedViolationDailyData;
  '03': OverSpeedViolationDailyData;
  '04': OverSpeedViolationDailyData;
  '05': OverSpeedViolationDailyData;
  '06': OverSpeedViolationDailyData;
  '07': OverSpeedViolationDailyData;
  '08': OverSpeedViolationDailyData;
  '09': OverSpeedViolationDailyData;
  '10': OverSpeedViolationDailyData;
  '11': OverSpeedViolationDailyData;
  '12': OverSpeedViolationDailyData;
  '13': OverSpeedViolationDailyData;
  '14': OverSpeedViolationDailyData;
  '15': OverSpeedViolationDailyData;
  '16': OverSpeedViolationDailyData;
  '17': OverSpeedViolationDailyData;
  '18': OverSpeedViolationDailyData;
  '19': OverSpeedViolationDailyData;
  '20': OverSpeedViolationDailyData;
  '21': OverSpeedViolationDailyData;
  '22': OverSpeedViolationDailyData;
  '23': OverSpeedViolationDailyData;
  '24': OverSpeedViolationDailyData;
  '25': OverSpeedViolationDailyData;
  '26': OverSpeedViolationDailyData;
  '27': OverSpeedViolationDailyData;
  '28': OverSpeedViolationDailyData;
  '29': OverSpeedViolationDailyData;
  '30': OverSpeedViolationDailyData;
  '31': OverSpeedViolationDailyData;

  org_id: string;
  v_id: string;
  vn_f: string;
  vt: string;
  d_id: string;
  dr_f: string;
  year_month: string;
}
