export interface FuelConsumptionDailyData extends Record<string, unknown> {
  total_km: number;
  consumed_fuel_liters: number;
  refills_count: number;
  refills_liters: number;
}

export interface FuelConsumptionMonthly extends Record<string, unknown> {
  '01': FuelConsumptionDailyData;
  '02': FuelConsumptionDailyData;
  '03': FuelConsumptionDailyData;
  '04': FuelConsumptionDailyData;
  '05': FuelConsumptionDailyData;
  '06': FuelConsumptionDailyData;
  '07': FuelConsumptionDailyData;
  '08': FuelConsumptionDailyData;
  '09': FuelConsumptionDailyData;
  '10': FuelConsumptionDailyData;
  '11': FuelConsumptionDailyData;
  '12': FuelConsumptionDailyData;
  '13': FuelConsumptionDailyData;
  '14': FuelConsumptionDailyData;
  '15': FuelConsumptionDailyData;
  '16': FuelConsumptionDailyData;
  '17': FuelConsumptionDailyData;
  '18': FuelConsumptionDailyData;
  '19': FuelConsumptionDailyData;
  '20': FuelConsumptionDailyData;
  '21': FuelConsumptionDailyData;
  '22': FuelConsumptionDailyData;
  '23': FuelConsumptionDailyData;
  '24': FuelConsumptionDailyData;
  '25': FuelConsumptionDailyData;
  '26': FuelConsumptionDailyData;
  '27': FuelConsumptionDailyData;
  '28': FuelConsumptionDailyData;
  '29': FuelConsumptionDailyData;
  '30': FuelConsumptionDailyData;
  '31': FuelConsumptionDailyData;

  v_id: string;
  vn_f: string;
  d_id: string;
  dr_f: string;
}
