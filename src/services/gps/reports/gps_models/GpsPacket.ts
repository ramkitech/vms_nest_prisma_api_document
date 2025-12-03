import { GPSSource } from "src/core/Enums";

export interface GpsPacket extends Record<string, unknown> {
  // Primary
  _id?: string;

  // Primary
  o_id: string; // Orgnaisation ID
  db_i: string; // DB Instance
  db_g: string; // DB Group
  v_id: string; // Vehicle ID

  g_s: GPSSource; // GPS Source

  // Main
  attributes: object;
  fuel_values: object;
  raw: string;
  protocol: string;
  api_code: string;

  // Time
  st: string;
  dt: string;
  ft: string;
  sts: number;
  dts: number;
  fts: number;

  // Primary Fields
  la: number;
  lo: number;
  al: number;
  s: number;
  b: number;
  c: number;
  i: boolean;
  m: boolean;
  os: boolean;
  p: boolean;
  v: boolean;
  b_r: string;

  // Sensor
  f1_r: string;
  f2_r: string;
  f1: number;
  f2: number;
  t1_r: string;
  t2_r: string;
  t1: number;
  t2: number;

  // Advanced Sensor
  s_r_l: boolean;
  s_d_l: boolean;
  s_d: boolean;
  s_g: boolean;

  // Location
  gl: string;
  lid: string;
  ll: string;
  ld: number;

  // processed fields
  si?: number;
  c_d?: number;
  dt_f?: string;
  f1_f?: string;
  t_f?: string;

  // Obd Values
  gear_ratio_f?: string;
  coolant_temp_f?: string;
  ad_blue_f?: string;
  engine_oil_f?: string;
  obd_fuel_f?: string;
}
