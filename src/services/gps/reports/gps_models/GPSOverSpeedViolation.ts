export interface GPSOverSpeedViolation extends Record<string, unknown> {
  si: number;
  fdt: string;
  tdt: string;
  fdts: number;
  tdts: number;
  ms: number;
  as: number;
  ts: number;
  dm: number;
  dm_km: string;
  fdt_f: string;
  tdt_f: string;

  fdt_f_db: string;
  tdt_f_db: string;

  ts_f: string;
  date_f: string;
  day: string;
  org_id: string;
  vn_f: string;
  vt: string;
  dr_f: string;
  v_id: string;
  d_id: string;

  s_la: number;
  s_lo: number;
  s_gl: string;
  s_lid: string;
  s_ll: string;
  s_ld: number;

  e_la: number;
  e_lo: number;
  e_gl: string;
  e_lid: string;
  e_ll: string;
  e_ld: number;
}
