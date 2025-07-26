// Axios
import { apiPost, apiPatch, apiDelete } from '../../../../core/apiCall';
import { SBR, FBR } from '../../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  dateMandatory,
  doubleMandatory,
  doubleOptional,
  enumArrayOptional,
  enumMandatory,
  multi_select_optional,
  single_select_mandatory,
  single_select_optional,
  stringOptional,
  getAllEnums,
  doubleOptionalLatLng,
  numberOptional,
} from '../../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../../zod_utils/zod_base_schema';

// Enums
import { Status, YesNo, GPSFuelApproveStatus } from '../../../../core/Enums';

// Other Models
import { MasterVehicle } from '../../../../services/main/vehicle/master_vehicle_service';
import { UserOrganisation } from '../../../../services/main/users/user_organisation_service';
import { MasterDriver } from '../../../../services/main/drivers/master_driver_service';
import { MasterDevice } from '../../../../services/main/devices/master_device_service';
import { User } from '../../../../services/main/users/user_service';

// URL and Endpoints
const URL = 'gps/features/fuel_vehicle_refill';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
};

// Interface
export interface GPSFuelVehicleRefill extends Record<string, unknown> {
  // Primary Fields
  gps_fuel_vehicle_refill_id: string;

  before_refill_fuel_liters: number;
  after_refill_fuel_liters: number;
  gps_refill_liters: number;
  verified_refill_liters: number;
  diff_refill_liters: number;

  admin_verify_status: GPSFuelApproveStatus;
  transporter_verify_status: GPSFuelApproveStatus;

  date_time: string;

  cost_per_liter?: number;
  total_cost?: number;
  refill_details?: string;

  latitude?: number;
  longitude?: number;

  gl?: string;
  lid?: string;
  ll?: string;
  ld?: number;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations
  organisation_id: string;
  UserOrganisation?: UserOrganisation;

  vehicle_id: string;
  MasterVehicle?: MasterVehicle;

  device_id: string;
  MasterDriver?: MasterDriver;

  driver_id?: string;
  MasterDevice?: MasterDevice;

  user_id?: string;
  User?: User;
}

// ✅ GPS Fuel Vehicle Refill Create/Update Schema
export const GPSFuelVehicleRefillSchema = z.object({
  organisation_id: single_select_mandatory('Organisation ID'),
  vehicle_id: single_select_mandatory('Master Vehicle ID'),
  device_id: single_select_mandatory('Device ID'),
  driver_id: single_select_optional('Driver ID'),
  user_id: single_select_optional('User ID'),

  before_refill_fuel_liters: doubleMandatory('Before Refill Fuel Liters'),
  after_refill_fuel_liters: doubleMandatory('After Refill Fuel Liters'),
  gps_refill_liters: doubleMandatory('GPS Refill Liters'),
  verified_refill_liters: doubleMandatory('Verified Refill Liters'),
  diff_refill_liters: doubleOptional('Difference Refill Liters'),
  admin_verify_status: enumMandatory(
    'Admin GPS Fuel Verify Status',
    GPSFuelApproveStatus,
    GPSFuelApproveStatus.Pending,
  ),
  transporter_verify_status: enumMandatory(
    'Transporter GPS Fuel Verify Status',
    GPSFuelApproveStatus,
    GPSFuelApproveStatus.Pending,
  ),
  date_time: dateMandatory('Date Time'),

  cost_per_liter: doubleOptional('Cost Per Liter'),
  total_cost: doubleOptional('Total Cost'),
  refill_details: stringOptional('Refill Details', 0, 300),

  latitude: doubleOptionalLatLng('Latitude'),
  longitude: doubleOptionalLatLng('Longitude'),
  gl: stringOptional('GL', 0, 300),
  lid: stringOptional('LID', 0, 300),
  ll: stringOptional('LL', 0, 300),
  ld: numberOptional('LD'),

  status: enumMandatory('Status', Status, Status.Active),

  time_zone_id: single_select_mandatory('MasterMainTimeZone'),
});
export type GPSFuelVehicleRefillDTO = z.infer<
  typeof GPSFuelVehicleRefillSchema
>;

// ✅ GPS Fuel Vehicle Refill Query Schema
export const GPSFuelVehicleRefillQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('User Organisation IDs'), // ✅ Multi-selection -> UserOrganisation
  user_ids: multi_select_optional('User IDs'), // ✅ Multi-selection -> User
  vehicle_ids: multi_select_optional('Master Vehicle IDs'), // ✅ Multi-selection -> MasterVehicle
  device_ids: multi_select_optional('Master Device IDs'), // ✅ Multi-selection -> Master Device
  driver_ids: multi_select_optional('Master Driver IDs'), // ✅ Multi-selection -> Master Driver
  admin_verify_status: enumArrayOptional(
    'Admin GPS Fuel Verify Status',
    GPSFuelApproveStatus,
    getAllEnums(GPSFuelApproveStatus),
  ),
  transporter_verify_status: enumArrayOptional(
    'Transporter GPS Fuel Verify Status',
    GPSFuelApproveStatus,
    getAllEnums(GPSFuelApproveStatus),
  ),
  from_date: dateMandatory('From Date'),
  to_date: dateMandatory('To Date'),
});
export type GPSFuelVehicleRefillQueryDTO = z.infer<
  typeof GPSFuelVehicleRefillQuerySchema
>;

// Payload Conversions
export const toGPSFuelVehicleRefillPayload = (
  data: GPSFuelVehicleRefill
): GPSFuelVehicleRefillDTO => ({
  organisation_id: data.organisation_id,
  vehicle_id: data.vehicle_id,
  device_id: data.device_id,
  user_id: data.user_id ?? '',
  driver_id: data.driver_id ?? '',

  before_refill_fuel_liters: data.before_refill_fuel_liters,
  after_refill_fuel_liters: data.after_refill_fuel_liters,
  gps_refill_liters: data.gps_refill_liters,
  verified_refill_liters: data.verified_refill_liters,
  diff_refill_liters: data.diff_refill_liters,

  admin_verify_status: data.admin_verify_status,
  transporter_verify_status: data.transporter_verify_status,

  date_time: data.date_time,

  cost_per_liter: data.cost_per_liter ?? 0,
  total_cost: data.total_cost ?? 0,
  refill_details: data.refill_details ?? '',

  latitude: data.latitude ?? 0,
  longitude: data.longitude ?? 0,

  gl: data.gl || '',
  lid: data.lid || '',
  ll: data.ll || '',
  ld: data.ld || 0,

  status: data.status,

  time_zone_id: '',
});

export const newGPSFuelVehicleRefillPayload = (): GPSFuelVehicleRefillDTO => ({
  organisation_id: '',
  vehicle_id: '',
  device_id: '',
  user_id: '',
  driver_id: '',
  before_refill_fuel_liters: 0,
  after_refill_fuel_liters: 0,
  gps_refill_liters: 0,
  verified_refill_liters: 0,
  diff_refill_liters: 0,

  admin_verify_status: GPSFuelApproveStatus.Pending,
  transporter_verify_status: GPSFuelApproveStatus.Pending,

  date_time: '',

  cost_per_liter: 0,
  total_cost: 0,
  refill_details: '',

  latitude: 0,
  longitude: 0,

  gl: '',
  lid: '',
  ll: '',
  ld: 0,

  status: Status.Active,

  time_zone_id: '',
});

// API Methods
export const findGPSFuelVehicleRefills = async (
  data: GPSFuelVehicleRefillQueryDTO
): Promise<FBR<GPSFuelVehicleRefill[]>> => {
  return apiPost<FBR<GPSFuelVehicleRefill[]>, GPSFuelVehicleRefillQueryDTO>(
    ENDPOINTS.find,
    data
  );
};

export const createGPSFuelVehicleRefill = async (
  data: GPSFuelVehicleRefillDTO
): Promise<SBR> => {
  return apiPost<SBR, GPSFuelVehicleRefillDTO>(ENDPOINTS.create, data);
};

export const updateGPSFuelVehicleRefill = async (
  id: string,
  data: GPSFuelVehicleRefillDTO
): Promise<SBR> => {
  return apiPatch<SBR, GPSFuelVehicleRefillDTO>(ENDPOINTS.update(id), data);
};

export const deleteGPSFuelVehicleRefill = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};
