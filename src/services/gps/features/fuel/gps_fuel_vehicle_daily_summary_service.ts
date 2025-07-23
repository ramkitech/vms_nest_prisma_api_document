// Axios
import { apiPost, apiPatch, apiDelete } from '../../../../core/apiCall';
import { SBR, FBR } from '../../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  doubleMandatory,
  numberMandatory,
  single_select_mandatory,
  single_select_optional,
  multi_select_optional,
  enumMandatory,
  dateMandatory,
  enumOptional,
} from '../../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../../zod_utils/zod_base_schema';

// Enums
import { Status, YesNo } from '../../../../core/Enums';

// Other Models
import { MasterVehicle } from '../../../../services/main/vehicle/master_vehicle_service';
import { MasterDevice } from '../../../../services/main/devices/master_device_service';
import { MasterDriver } from '../../../../services/main/drivers/master_driver_service';
import { UserOrganisation } from '../../../../services/main/users/user_organisation_service';
import { FuelConsumptionMonthly } from '../../reports/gps_models/FuelConsumptionMonthly';

// URL and Endpoints
const URL = 'gps/features/fuel_vehicle_daily_summary';

const ENDPOINTS = {
  find: `${URL}/search`,
  find_monthly: `${URL}/monthly/search`,
  create: `${URL}`,
  update: (id: string) => `${URL}/${id}`,
  delete: (id: string) => `${URL}/${id}`,
};

// Model Interface
export interface GPSFuelVehicleDailySummary extends Record<string, unknown> {
  gps_fuel_vehicle_daily_summary_id: string;

  start_fuel_liters: number;
  end_fuel_liters: number;
  total_km: number;
  consumed_fuel_liters: number;

  refills_count: number;
  refill_liters: number;
  removals_count: number;
  removal_liters: number;
  mileage: number;
  date: string;

  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations
  organisation_id: string;
  UserOrganisation?: UserOrganisation;

  vehicle_id: string;
  MasterVehicle?: MasterVehicle;

  device_id: string;
  MasterDevice?: MasterDevice;

  driver_id?: string;
  MasterDriver?: MasterDriver;
}

// ✅ GPS Fuel Vehicle Daily Summary Create/Update Schema
export const GPSFuelVehicleDailySummarySchema = z.object({
  organisation_id: single_select_mandatory('Organisation ID'),
  vehicle_id: single_select_mandatory('Master Vehicle ID'),
  driver_id: single_select_optional('Driver ID'),
  device_id: single_select_mandatory('Device ID'),

  // Optional analytics
  start_fuel_liters: doubleMandatory('Start Fuel Liters'),
  end_fuel_liters: doubleMandatory('End Fuel Liters'),
  total_km: doubleMandatory('Total KM'),
  consumed_fuel_liters: doubleMandatory('Consumed Fuel Liters'),

  refills_count: numberMandatory('Refills Count'),
  refills_liters: doubleMandatory('Refills Liters'),
  removals_count: numberMandatory('Removals Count'),
  removals_liters: doubleMandatory('Removals Liters'),
  mileage: doubleMandatory('Mileage'),
  date: dateMandatory('Date'),

  status: enumMandatory('Status', Status, Status.Active),
});
export type GPSFuelVehicleDailySummaryDTO = z.infer<
  typeof GPSFuelVehicleDailySummarySchema
>;

// ✅ GPS Fuel Vehicle Daily Summary Query Schema
export const GPSFuelVehicleDailySummaryQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('User Organisation IDs'), // ✅ Multi-selection -> UserOrganisation
  vehicle_ids: multi_select_optional('Master Vehicle IDs'), // ✅ Multi-selection -> MasterVehicle
  device_ids: multi_select_optional('Master Device IDs'), // ✅ Multi-selection -> Master Device
  driver_ids: multi_select_optional('Master Driver IDs'), // ✅ Multi-selection -> Master Driver
  from_date: dateMandatory('From Date'),
  to_date: dateMandatory('To Date'),
  vehicle_summary: enumOptional('Vehicle Summary', YesNo, YesNo.No),
  day_summary: enumOptional('Vehicle Summary', YesNo, YesNo.No),
});
export type GPSFuelVehicleDailySummaryQueryDTO = z.infer<
  typeof GPSFuelVehicleDailySummaryQuerySchema
>;

// ✅ GPS Fuel Vehicle Monthly Summary Query Schema
export const GPSFuelVehicleMonthlySummaryQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('User Organisation IDs'), // ✅ Multi-selection -> UserOrganisation
  vehicle_ids: multi_select_optional('Master Vehicle IDs'), // ✅ Multi-selection -> MasterVehicle
  from_date: dateMandatory('From Date'),
  to_date: dateMandatory('To Date'),
});
export type GPSFuelVehicleMonthlySummaryQueryDTO = z.infer<
  typeof GPSFuelVehicleMonthlySummaryQuerySchema
>;

// Payload Conversions
export const toPayload = (
  obj: GPSFuelVehicleDailySummary
): GPSFuelVehicleDailySummaryDTO => ({
  organisation_id: obj.organisation_id,
  vehicle_id: obj.vehicle_id,
  device_id: obj.device_id,
  driver_id: obj.driver_id ?? '',

  start_fuel_liters: obj.start_fuel_liters,
  end_fuel_liters: obj.end_fuel_liters,
  total_km: obj.total_km,
  consumed_fuel_liters: obj.consumed_fuel_liters,

  refills_count: obj.refills_count,
  refills_liters: obj.refill_liters,
  removals_count: obj.removals_count,
  removals_liters: obj.removal_liters,
  mileage: obj.mileage,
  date: obj.date,
  status: obj.status,
});

export const newPayload = (): GPSFuelVehicleDailySummaryDTO => ({
  organisation_id: '',
  vehicle_id: '',
  device_id: '',
  driver_id: '',

  start_fuel_liters: 0,
  end_fuel_liters: 0,
  total_km: 0,
  consumed_fuel_liters: 0,

  refills_count: 0,
  refills_liters: 0,
  removals_count: 0,
  removals_liters: 0,
  mileage: 0,
  date: new Date().toISOString(),
  status: Status.Active,
});

// API Methods (CRUD)
export const findGPSFuelVehicleDailySummary = async (
  data: GPSFuelVehicleDailySummaryQueryDTO
): Promise<FBR<GPSFuelVehicleDailySummary[]>> => {
  return apiPost(ENDPOINTS.find, data);
};

export const findGPSFuelVehicleMonthlySummary = async (
  data: GPSFuelVehicleMonthlySummaryQueryDTO
): Promise<FBR<FuelConsumptionMonthly[]>> => {
  return apiPost(ENDPOINTS.find_monthly, data);
};

export const createGPSFuelVehicleDailySummary = async (
  data: GPSFuelVehicleDailySummaryDTO
): Promise<SBR> => {
  return apiPost(ENDPOINTS.create, data);
};

export const updateGPSFuelVehicleDailySummary = async (
  id: string,
  data: GPSFuelVehicleDailySummaryDTO
): Promise<SBR> => {
  return apiPatch(ENDPOINTS.update(id), data);
};

export const deleteGPSFuelVehicleDailySummary = async (
  id: string
): Promise<SBR> => {
  return apiDelete(ENDPOINTS.delete(id));
};
