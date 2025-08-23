import { AlertSubType, AlertType, Module } from "src/core/Enums";

export interface GpsAlert extends Record<string, unknown> {
  // Primary
  o_id: string; // Orgnaisation ID
  db_i: string; // DB Instance
  db_g: string; // DB Group

  u_id: string; // User ID
  u_f?: string; // User Details

  v_id: string; // Vehicle ID
  vn_f?: string;
  vt?: string;

  d_id: string; // Driver ID
  dr_f?: string; 

  g_id: string; // Geofence ID
  ge_n?: string;
  ge_t?: string;

  // Type
  module: Module;
  alert_type: AlertType;
  alert_sub_type: AlertSubType;

  // Date Time
  dt: string;
  dt_f?: string;
  dts: number;

  // Location
  la: number;
  lo: number;
  gl: string;
  lid: string;
  ll: string;
  ld: number;

  // Content
  message: string;
  html_message: string;

  // Additional Info
  key_1?: string;
  key_2?: string;
  key_3?: string;
  key_4?: string;
  key_5?: string;
  key_6?: string;
}
