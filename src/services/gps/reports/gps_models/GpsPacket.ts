export interface GpsPacket extends Record<string, unknown> {
  attributes: string;
  raw: string;

  st: string;
  dt: string;
  ft: string;
  sts: number;
  dts: number;
  fts: number;

  la: number;
  lo: number;
  al: number;
  s: number;
  b: number;
  c: number;
  i: boolean;
  m: boolean;
  p: boolean;
  v: boolean;
  b_r: string;

  f1_r: string;
  f2_r: string;
  f1: number;
  f2: number;
  t1_r: string;
  t2_r: string;
  t1: number;
  t2: number;

  gl: string;
  lid: string;
  ll: string;
  ld: number;

  s_r_l: boolean;
  s_d_l: boolean;
  s_d: boolean;
  s_g: boolean;

  g_s: string;

  vehicle_id: string;

  org_id: string;

  db_index: number;

  db_instance: string;

  // processed fields
  c_d: number;
  dt_f: string;
}
