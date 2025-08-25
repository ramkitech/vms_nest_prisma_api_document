export interface GpsSensor extends Record<string, unknown> {
   // Primary
  _id?: string;

  // Primary
  o_id: string; // Orgnaisation ID
  db_i: string; // DB Instance
  db_g: string; // DB Group
  v_id: string; // Vehicle ID
  d_id: string; // Driver ID

  // From Date Time
  fdt: string;
  fdts: number;

  // To Date Time
  tdt: string;
  tdts: number;

  // Duration -> seconds
  s: number;
  ts: number;

  // Distance -> Meters
  me: number;
  dm: number;
  dmc: boolean;

  // Start Location
  s_la: number;
  s_lo: number;
  s_gl: string;
  s_lid: string;
  s_ll: string;
  s_ld: number;

  // End Location
  e_la: number;
  e_lo: number;
  e_gl: string;
  e_lid: string;
  e_ll: string;
  e_ld: number;

  // Type
  t: string; // OverSpeed, Stoppage, Ignition, Genset, Door

  // OverSpeed
  os: boolean;

  // Motion
  m: boolean;

  // Ignition
  i: boolean;

  // Sensor Door
  s_d: boolean;

  // Sensor Genset
  s_g: boolean;

  // processed fields
  si?: number;
  s_f?: string;
  fdt_f?: string;
  tdt_f?: string;
  vn_f?: string;
  vt?: string;
  dr_f?: string;
}
