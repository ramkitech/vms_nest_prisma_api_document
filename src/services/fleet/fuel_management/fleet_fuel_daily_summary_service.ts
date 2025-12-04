// Axios
import { apiGet, apiPost, apiPatch, apiDelete } from '../../../core/apiCall';
import { SBR, FBR } from '../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  single_select_mandatory,
  multi_select_optional,
  enumMandatory,
  dateMandatory,
  enumOptional,
  single_select_optional,
  doubleMandatory,
  numberMandatory,
  stringMandatory,
} from '../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../zod_utils/zod_base_schema';

// Enums
import { Status, YesNo } from '../../../core/Enums';

// Other Models
import { UserOrganisation } from '../../main/users/user_organisation_service';
import { User } from 'src/services/main/users/user_service';
import { MasterVehicle } from '../../main/vehicle/master_vehicle_service';
import { MasterDriver } from 'src/services/main/drivers/master_driver_service';
import { MasterDevice } from 'src/services/main/devices/master_device_service';
import { FuelConsumptionMonthly } from 'src/services/gps/reports/gps_models/FuelConsumptionMonthly';

const URL = 'fleet/fuel_management/fleet_fuel_daily_summary';

const ENDPOINTS = {
  find: `${URL}/search`,
  fuel_dashboard: `${URL}/fuel_dashboard`,
  find_monthly: `${URL}/monthly/search`,
  find_vehicle_fuel_summary: `${URL}/vehicle_fuel_summary/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
};

// ✅ FleetFuelDailySummary Interface
export interface FleetFuelDailySummary extends Record<string, unknown> {
  // Primary Fields
  fleet_fuel_daily_summary_id: string;

  start_fuel_liters: number;
  end_fuel_liters: number;
  total_km: number;
  consumed_fuel_liters: number;
  refills_count: number;
  refill_liters: number;
  removals_count: number;
  removal_liters: number;
  mileage_kmpl: number;
  liters_per_100km: number;
  date: string;
  date_f?: string;
  day?: string;

  // Metadata
  status: Status;
  added_date_time: string; // ISO string
  modified_date_time: string; // ISO string

  // Relations
  organisation_id: string;
  UserOrganisation?: UserOrganisation;

  user_id?: string;
  User?: User;

  vehicle_id: string;
  MasterVehicle?: MasterVehicle;
  vehicle_number?: string;
  vehicle_type?: string;

  driver_id?: string;
  MasterDriver?: MasterDriver;
  driver_details?: string;

  device_id: string;
  MasterDevice?: MasterDevice;
  device_identifier?: string;

  // Optional count object (if used in aggregation queries)
  _count?: {
  };
}

// ✅ FleetFuelDailySummary Create/Update Schema
export const FleetFuelDailySummarySchema = z.object({
  organisation_id: single_select_mandatory('UserOrganisation'), // ✅ Single-Selection -> UserOrganisation
  user_id: single_select_optional('User'), // ✅ Single-Selection -> User
  vehicle_id: single_select_mandatory('MasterVehicle'), // ✅ Single-Selection -> MasterVehicle
  driver_id: single_select_optional('MasterDriver'), // ✅ Single-Selection -> MasterDriver
  device_id: single_select_optional('MasterDevice'), // ✅ Single-Selection -> MasterDevice

  date: dateMandatory('Date'),

  start_fuel_liters: doubleMandatory('Start Fuel Liters'),
  end_fuel_liters: doubleMandatory('End Fuel Liters'),
  total_km: doubleMandatory('Total KM'),

  consumed_fuel_liters: doubleMandatory('Consumed Fuel Liters'),

  refills_count: numberMandatory('Refills Count'),
  refill_liters: doubleMandatory('Refill Liters'),
  removals_count: numberMandatory('Removals Count'),
  removal_liters: doubleMandatory('Removal Liters'),

  mileage_kmpl: doubleMandatory('Mileage KMPL'),
  liters_per_100km: doubleMandatory('Liters Per 100 KM'),

  status: enumMandatory('Status', Status, Status.Active),
});
export type FleetFuelDailySummaryDTO = z.infer<
  typeof FleetFuelDailySummarySchema
>;

// ✅ FleetFuelDailySummary Query Schema
export const FleetFuelDailySummaryQuerySchema = BaseQuerySchema.extend({
  fleet_fuel_daily_summary_ids: multi_select_optional('FleetFuelDailySummary'), // ✅ Multi-selection -> FleetFuelDailySummary

  organisation_ids: multi_select_optional('UserOrganisation'), // ✅ Multi-selection -> UserOrganisation
  user_ids: multi_select_optional('User'), // ✅ Multi-selection -> User
  vehicle_ids: multi_select_optional('MasterVehicle'), // ✅ Multi-selection -> MasterVehicle
  driver_ids: multi_select_optional('MasterDriver'), // ✅ Multi-selection -> MasterDriver
  device_ids: multi_select_optional('MasterDevice'), // ✅ Multi-selection -> MasterDevice

  vehicle_summary: enumOptional('Vehicle Summary', YesNo, YesNo.No),
  day_summary: enumOptional('Day Summary', YesNo, YesNo.No),

  from_date: dateMandatory('From Date'),
  to_date: dateMandatory('To Date'),
});
export type FleetFuelDailySummaryQueryDTO = z.infer<
  typeof FleetFuelDailySummaryQuerySchema
>;

// ✅ FleetFuelDailySummaryDashBoard Query Schema
export const FleetFuelDailySummaryDashBoardQuerySchema = BaseQuerySchema.extend(
  {
    organisation_ids: multi_select_optional('UserOrganisation'), // ✅ Multi-Selection -> UserOrganisation
    vehicle_ids: multi_select_optional('MasterVehicle'), // ✅ Multi-Selection -> MasterVehicle

    from_date: dateMandatory('From Date'),
    to_date: dateMandatory('To Date'),
  },
);
export type FleetFuelDailySummaryDashBoardQueryDTO = z.infer<
  typeof FleetFuelDailySummaryDashBoardQuerySchema
>;

// ✅ FleetFuelDailyMonthlySummary Query Schema
export const FleetFuelDailyMonthlySummaryQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('UserOrganisation'), // ✅ Multi-selection -> UserOrganisation
  vehicle_ids: multi_select_optional('MasterVehicle'), // ✅ Multi-selection -> MasterVehicle
  from_date: dateMandatory('From Date'),
  to_date: dateMandatory('To Date'),
});
export type FleetFuelDailyMonthlySummaryQueryDTO = z.infer<
  typeof FleetFuelDailyMonthlySummaryQuerySchema
>;

// ✅ AllVehiclesFuelDailySummary Query Schema

export const AllVehiclesFuelDailySummaryQuerySchema = z.object({
  date: dateMandatory('Date'),
  organisation_utrack_id: stringMandatory('Organisation Utrack ID'),
});
export type AllVehiclesFuelDailySummaryDTO = z.infer<
  typeof AllVehiclesFuelDailySummaryQuerySchema
>;

export interface FuelDashboard {
  vehicle_id: string;
  vehicle_number: string;
  vehicle_type: string;
  refills_count: number;
  removals_count: number;
}

// Convert existing data to a payload structure
export const toFleetFuelDailySummaryPayload = (row: FleetFuelDailySummary): FleetFuelDailySummaryDTO => ({
  organisation_id: row.organisation_id ?? '',
  user_id: row.user_id || '',
  vehicle_id: row.vehicle_id ?? '',
  driver_id: row.driver_id || '',
  device_id: row.device_id || '',

  date: row.date || '',

  start_fuel_liters: row.start_fuel_liters || 0,
  end_fuel_liters: row.end_fuel_liters || 0,
  total_km: row.total_km || 0,
  consumed_fuel_liters: row.consumed_fuel_liters || 0,

  refills_count: row.refills_count || 0,
  refill_liters: row.refill_liters || 0,
  removals_count: row.removals_count || 0,
  removal_liters: row.removal_liters || 0,

  mileage_kmpl: row.mileage_kmpl || 0,
  liters_per_100km: row.liters_per_100km || 0,

  status: row.status,
});

// Generate a new payload with default values
export const newFleetFuelDailySummaryPayload = (): FleetFuelDailySummaryDTO => ({
  organisation_id: '',
  user_id: '',
  vehicle_id: '',
  driver_id: '',
  device_id: '',

  date: '',

  start_fuel_liters: 0,
  end_fuel_liters: 0,
  total_km: 0,

  consumed_fuel_liters: 0,

  refills_count: 0,
  refill_liters: 0,
  removals_count: 0,
  removal_liters: 0,

  mileage_kmpl: 0,
  liters_per_100km: 0,

  status: Status.Active,
});

// API Methods
export const findFleetFuelDailySummary = async (data: FleetFuelDailySummaryQueryDTO): Promise<FBR<FleetFuelDailySummary[]>> => {
  return apiPost<FBR<FleetFuelDailySummary[]>, FleetFuelDailySummaryQueryDTO>(ENDPOINTS.find, data);
};

export const fuel_dashboard = async (data: FleetFuelDailySummaryDashBoardQueryDTO): Promise<FBR<FuelDashboard[]>> => {
  return apiPost<FBR<FuelDashboard[]>, FleetFuelDailySummaryDashBoardQueryDTO>(ENDPOINTS.fuel_dashboard, data);
};

export const findFleetFuelMonthlySummary = async (data: FleetFuelDailyMonthlySummaryQueryDTO): Promise<FBR<FuelConsumptionMonthly[]>> => {
  return apiPost<FBR<FuelConsumptionMonthly[]>, FleetFuelDailyMonthlySummaryQueryDTO>(ENDPOINTS.find_monthly, data);
};

export const findVehicleFuelSummary = async (data: AllVehiclesFuelDailySummaryDTO): Promise<FBR<FleetFuelDailySummary[]>> => {
  return apiPost<FBR<FleetFuelDailySummary[]>, AllVehiclesFuelDailySummaryDTO>(ENDPOINTS.find_vehicle_fuel_summary, data);
};

export const createFleetFuelDailySummary = async (data: FleetFuelDailySummaryDTO): Promise<SBR> => {
  return apiPost<SBR, FleetFuelDailySummaryDTO>(ENDPOINTS.create, data);
};

export const updateFleetFuelDailySummary = async (id: string, data: FleetFuelDailySummaryDTO): Promise<SBR> => {
  return apiPatch<SBR, FleetFuelDailySummaryDTO>(ENDPOINTS.update(id), data);
};

export const deleteFleetFuelDailySummary = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

