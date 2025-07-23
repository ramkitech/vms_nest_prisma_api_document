export interface GpsSensor extends Record<string, unknown> {
  si: number;

  v_id: string;

  o_id: string;

  db_index: string;

  db_instance: string;

  // From Date Time
  fdt: string;
  fdts: number;

  // To Date Time
  tdt: string;
  tdts: number;

  // Duration -> seconds
  s: number;

  // Distance -> Meters
  me: number;

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
  t: string; // Stoppage, Ignition, Genset, Door

  // Motion
  m: boolean;

  // Ignition
  i: boolean;

  // Sensor Door
  s_d: boolean;

  // Sensor Genset
  s_g: boolean;

  // processed fields
  s_f: string;
  fdt_f: string;
  tdt_f: string;
  vn_f: string;
  vt: string;
}
