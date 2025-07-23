// Axios
import { apiPost, apiPatch, apiDelete } from 'core/apiCall';
import { SBR, FBR } from 'core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  doubleMandatory,
  doubleOptional,
  enumMandatory,
  enumArrayOptional,
  getAllEnums,
  multi_select_optional,
  single_select_mandatory,
  single_select_optional,
  stringOptional,
  dateMandatory,
  doubleOptionalLatLng,
  numberOptional,
} from 'zod/zod_utils';
import { BaseQuerySchema } from 'zod/zod_base_schema';

// Enums
import { Status, YesNo, GPSFuelApproveStatus } from 'core/Enums';

// Other Models
import { MasterVehicle } from 'services/main/vehicle/master_vehicle_service';
import { MasterDevice } from 'services/main/devices/master_device_service';
import { MasterDriver } from 'services/main/drivers/master_driver_service';
import { User } from 'services/main/users/user_service';
import { UserOrganisation } from 'services/main/users/user_organisation_service';

const URL = 'gps/features/fuel_vehicle_removal';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
};

// Master Interface
export interface GPSFuelVehicleRemoval extends Record<string, unknown> {
  // Primary Fields
  gps_fuel_vehicle_removal_summary_id: string;
  before_remove_fuel_liters: number;
  after_remove_fuel_liters: number;
  gps_removal_liters: number;
  verified_removal_liters: number;
  diff_removal_liters: number;
  verified: YesNo;
  approved: GPSFuelApproveStatus;
  date_time: string;
  cost_per_liter?: number;
  total_cost?: number;
  removal_details?: string;

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
  MasterDevice?: MasterDevice;
  driver_id?: string;
  MasterDriver?: MasterDriver;
  user_id?: string;
  User?: User;
}

// ✅ GPS Fuel Vehicle Removal Create/Update Schema
export const GPSFuelVehicleRemovalSchema = z.object({
  organisation_id: single_select_mandatory('Organisation ID'),
  vehicle_id: single_select_mandatory('Master Vehicle ID'),
  device_id: single_select_mandatory('Device ID'),
  user_id: single_select_optional('User ID'),
  driver_id: single_select_optional('Driver ID'),

  before_remove_fuel_liters: doubleMandatory('Before Remove Fuel Liters'),
  after_remove_fuel_liters: doubleMandatory('Before Remove Fuel Liters'),
  gps_removal_liters: doubleMandatory('GPS Removal Liters'),
  verified_removal_liters: doubleMandatory('Verified Removal Liters'),
  verified: enumMandatory('Verified', YesNo, YesNo.Yes),
  approved: enumMandatory(
    'GPS Fuel Approve Status',
    GPSFuelApproveStatus,
    GPSFuelApproveStatus.Pending
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
});
export type GPSFuelVehicleRemovalDTO = z.infer<
  typeof GPSFuelVehicleRemovalSchema
>;

// ✅ GPS Fuel Vehicle Removal Query Schema
export const GPSFuelVehicleRemovalQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('User Organisation IDs'), // ✅ Multi-selection -> UserOrganisation
  user_ids: multi_select_optional('User IDs'), // ✅ Multi-selection -> User
  vehicle_ids: multi_select_optional('Master Vehicle IDs'), // ✅ Multi-selection -> MasterVehicle
  device_ids: multi_select_optional('Master Device IDs'), // ✅ Multi-selection -> Master Device
  driver_ids: multi_select_optional('Master Driver IDs'), // ✅ Multi-selection -> Master Driver
  approved: enumArrayOptional(
    'Approved',
    GPSFuelApproveStatus,
    getAllEnums(GPSFuelApproveStatus)
  ),
  verified: enumArrayOptional('Verified', YesNo, getAllEnums(YesNo)),
  from_date: dateMandatory('From Date'),
  to_date: dateMandatory('To Date'),
});
export type GPSFuelVehicleRemovalQueryDTO = z.infer<
  typeof GPSFuelVehicleRemovalQuerySchema
>;

// ✅ Payload Conversions
export const toGPSFuelVehicleRemovalPayload = (
  item: GPSFuelVehicleRemoval
): GPSFuelVehicleRemovalDTO => ({
  organisation_id: item.organisation_id,
  vehicle_id: item.vehicle_id,
  device_id: item.device_id,
  user_id: item.user_id ?? '',
  driver_id: item.driver_id ?? '',
  before_remove_fuel_liters: item.before_remove_fuel_liters,
  after_remove_fuel_liters: item.after_remove_fuel_liters,
  gps_removal_liters: item.gps_removal_liters,
  verified_removal_liters: item.verified_removal_liters,
  verified: item.verified,
  approved: item.approved,
  date_time: item.date_time,
  cost_per_liter: item.cost_per_liter ?? 0,
  total_cost: item.total_cost ?? 0,
  refill_details: item.removal_details ?? '',

  latitude: item.latitude ?? 0,
  longitude: item.longitude ?? 0,

  gl: item.gl || '',
  lid: item.lid || '',
  ll: item.ll || '',
  ld: item.ld || 0,

  status: item.status,
});

export const newGPSFuelVehicleRemovalPayload =
  (): GPSFuelVehicleRemovalDTO => ({
    organisation_id: '',
    vehicle_id: '',
    device_id: '',
    user_id: '',
    driver_id: '',
    before_remove_fuel_liters: 0,
    after_remove_fuel_liters: 0,
    gps_removal_liters: 0,
    verified_removal_liters: 0,
    verified: YesNo.Yes,
    approved: GPSFuelApproveStatus.Pending,
    date_time: new Date().toISOString(),
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
  });

// ✅ API Methods
export const findGPSFuelVehicleRemovals = async (
  data: GPSFuelVehicleRemovalQueryDTO
): Promise<FBR<GPSFuelVehicleRemoval[]>> => {
  return apiPost<FBR<GPSFuelVehicleRemoval[]>, GPSFuelVehicleRemovalQueryDTO>(
    ENDPOINTS.find,
    data
  );
};

export const createGPSFuelVehicleRemoval = async (
  data: GPSFuelVehicleRemovalDTO
): Promise<SBR> => {
  return apiPost<SBR, GPSFuelVehicleRemovalDTO>(ENDPOINTS.create, data);
};

export const updateGPSFuelVehicleRemoval = async (
  id: string,
  data: GPSFuelVehicleRemovalDTO
): Promise<SBR> => {
  return apiPatch<SBR, GPSFuelVehicleRemovalDTO>(ENDPOINTS.update(id), data);
};

export const deleteGPSFuelVehicleRemoval = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};
