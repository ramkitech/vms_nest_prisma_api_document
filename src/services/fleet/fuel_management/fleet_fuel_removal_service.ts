// Axios
import { apiPost, apiPatch, apiDelete } from '../../../core/apiCall';
import { SBR, FBR, AWSPresignedUrl, BR, BaseCommionFile } from '../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  single_select_mandatory,
  multi_select_optional,
  enumMandatory,
  dateMandatory,
  enumOptional,
  single_select_optional,
  enumArrayOptional,
  getAllEnums,
  doubleOptionalLatLng,
  stringOptional,
  doubleOptional,
  numberOptional,
  nestedArrayOfObjectsOptional,
} from '../../../zod_utils/zod_utils';
import { BaseFileSchema, BaseQuerySchema, FilePresignedUrlDTO } from '../../../zod_utils/zod_base_schema';

// Enums
import { FileType, GPSFuelApproveStatus, RefillEntrySource, Status } from '../../../core/Enums';

// Other Models
import { UserOrganisation } from '../../main/users/user_organisation_service';
import { User } from 'src/services/main/users/user_service';
import { MasterVehicle } from '../../main/vehicle/master_vehicle_service';
import { MasterDriver } from 'src/services/main/drivers/master_driver_service';
import { MasterDevice } from 'src/services/main/devices/master_device_service';
import { MasterMainLandmark } from 'src/services/master/main/master_main_landmark_service';
import { MasterVehicleFuelType } from 'src/services/master/vehicle/master_vehicle_fuel_type_service';
import { MasterVehicleFuelUnit } from 'src/services/master/vehicle/master_vehicle_fuel_unit_service';
import { MasterVehicleFuelRemovalReason } from 'src/services/master/vehicle/master_vehicle_fuel_removal_reason_service';

const URL = 'fleet/fuel_management/fleet_fuel_removal';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
  presigned_url: `${URL}/presigned_url`,
  create_file: `${URL}/create_file`,
  remove_file: (id: string): string => `${URL}/remove_file/${id}`,
};

// ✅ FleetFuelRemoval Interface
export interface FleetFuelRemoval extends Record<string, unknown> {
  // Primary Fields
  fleet_fuel_removal_id: string;

  // Quantities
  before_removal_quantity: number;
  after_removal_quantity: number;
  removal_quantity: number;
  verified_removal_quantity: number;
  diff_removal_quantity: number;

  odometer_reading?: number;

  // Event Time
  date_time: string;
  date?: string;
  date_f?: string;
  date_time_f?: string;

  // Verification
  admin_verify_status: GPSFuelApproveStatus;
  transporter_verify_status: GPSFuelApproveStatus;

  // Cost Info
  cost_per_unit?: number;
  total_cost?: number;

  // Removal Reason
  fuel_removal_reason_id?: string;
  MasterVehicleFuelRemovalReason?: MasterVehicleFuelRemovalReason;
  removal_reason?: string;
  removal_details?: string;

  // Source Details
  entry_source: RefillEntrySource;
  source_reference_id?: string;
  source_notes?: string;

  // Location Details
  latitude?: number;
  longitude?: number;
  google_location?: string;

  landmark_id?: string;
  MasterMainLandmark?: MasterMainLandmark;
  landmark_location?: string;
  landmark_distance?: number;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

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

  vehicle_fuel_type_id?: string;
  MasterVehicleFuelType?: MasterVehicleFuelType;
  fuel_type?: string;

  vehicle_fuel_unit_id?: string;
  MasterVehicleFuelUnit?: MasterVehicleFuelUnit;
  fuel_unit?: string;

  // Child Relations
  FleetFuelRemovalFile?: FleetFuelRemovalFile[];

  // Optional Count
  _count?: {
    FleetFuelRemovalFile?: number;
  };
}

// ✅ FleetFuelRemovalFile Interface
export interface FleetFuelRemovalFile extends BaseCommionFile {
  // Primary Fields
  fleet_fuel_removal_file_id: string;

  // Parent
  fleet_fuel_removal_id: string;

  // Organisation Id
  organisation_id: string;
}

// ✅ FleetFuelRemovalFile Schema
export const FleetFuelRemovalFileSchema = BaseFileSchema.extend({
  organisation_id: single_select_optional('UserOrganisation'), // ✅ Single-Selection -> UserOrganisation
  fleet_fuel_removal_id: single_select_optional('FleetFuelRemoval'), // ✅ Single-Selection -> FleetFuelRemoval
});
export type FleetFuelRemovalFileDTO = z.infer<
  typeof FleetFuelRemovalFileSchema
>;

// ✅ FleetFuelRemoval Create/Update Schema
export const FleetFuelRemovalSchema = z.object({
  organisation_id: single_select_mandatory('UserOrganisation'), // ✅ Single-Selection -> UserOrganisation
  user_id: single_select_optional('User'), // ✅ Single-Selection -> User
  vehicle_id: single_select_mandatory('MasterVehicle'), // ✅ Single-Selection -> MasterVehicle
  driver_id: single_select_optional('MasterDriver'), // ✅ Single-Selection -> MasterDriver
  device_id: single_select_optional('MasterDevice'), // ✅ Single-Selection -> MasterDevice
  vehicle_fuel_type_id: single_select_optional('MasterVehicleFuelType'), // ✅ Single-Selection -> MasterVehicleFuelType
  vehicle_fuel_unit_id: single_select_optional('MasterVehicleFuelUnit'), // ✅ Single-Selection -> MasterVehicleFuelUnit
  fuel_removal_reason_id: single_select_optional(
    'MasterVehicleFuelRemovalReason',
  ),
  // ✅ Single-Selection -> MasterVehicleFuelRemovalReason

  // Removal Quantity
  before_removal_quantity: doubleOptional('Before Remove Quantity'),
  after_removal_quantity: doubleOptional('After Remove Quantity'),
  removal_quantity: doubleOptional('Removal Quantity'),
  verified_removal_quantity: doubleOptional('Verified Removal Quantity'),
  diff_removal_quantity: doubleOptional('Difference Removal Quantity', -100),

  odometer_reading: numberOptional('Odometer Reading'),

  // Event Time
  date_time: dateMandatory('Date Time'),

  // Verification
  admin_verify_status: enumMandatory(
    'Admin Fuel Verify Status',
    GPSFuelApproveStatus,
    GPSFuelApproveStatus.Pending,
  ),
  transporter_verify_status: enumMandatory(
    'Transporter Fuel Verify Status',
    GPSFuelApproveStatus,
    GPSFuelApproveStatus.Pending,
  ),

  removal_details: stringOptional('Removal Details', 0, 300),

  // Cost Details
  cost_per_unit: doubleOptional('Cost Per Unit'),
  total_cost: doubleOptional('Total Cost'),

  // Source Details
  entry_source: enumOptional(
    'Entry Source',
    RefillEntrySource,
    RefillEntrySource.Manual,
  ),
  source_reference_id: stringOptional('Source Reference ID', 0, 100),
  source_notes: stringOptional('Source Notes', 0, 500),

  // Location Details
  latitude: doubleOptionalLatLng('Latitude'),
  longitude: doubleOptionalLatLng('Longitude'),
  google_location: stringOptional('Google Location', 0, 500),

  status: enumMandatory('Status', Status, Status.Active),
  time_zone_id: single_select_mandatory('MasterMainTimeZone'),

  FleetFuelRemovalFile: nestedArrayOfObjectsOptional(
    'FleetFuelRemovalFile',
    FleetFuelRemovalFileSchema,
    [],
  ),
});
export type FleetFuelRemovalDTO = z.infer<typeof FleetFuelRemovalSchema>;

// ✅ FleetFuelRemoval Query Schema
export const FleetFuelRemovalQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('UserOrganisation'), // ✅ Multi-selection -> UserOrganisation
  user_ids: multi_select_optional('User'), // ✅ Multi-selection -> User
  vehicle_ids: multi_select_optional('MasterVehicle'), // ✅ Multi-selection -> MasterVehicle
  driver_ids: multi_select_optional('MasterDriver'), // ✅ Multi-selection -> MasterDriver
  device_ids: multi_select_optional('MasterDevice'), // ✅ Multi-selection -> MasterDevice
  vehicle_fuel_type_ids: multi_select_optional('MasterVehicleFuelType'), // ✅ Multi-selection -> MasterVehicleFuelType
  vehicle_fuel_unit_ids: multi_select_optional('MasterVehicleFuelUnit'), // ✅ Multi-selection -> MasterVehicleFuelUnit
  fuel_removal_reason_ids: multi_select_optional(
    'MasterVehicleFuelRemovalReason',
  ), // ✅ Multi-selection -> MasterVehicleFuelRemovalReason

  entry_source: enumArrayOptional(
    'Entry Source',
    RefillEntrySource,
    getAllEnums(RefillEntrySource),
  ),
  admin_verify_status: enumArrayOptional(
    'Admin Fuel Verify Status',
    GPSFuelApproveStatus,
    getAllEnums(GPSFuelApproveStatus),
  ),
  transporter_verify_status: enumArrayOptional(
    'Transporter Fuel Verify Status',
    GPSFuelApproveStatus,
    getAllEnums(GPSFuelApproveStatus),
  ),

  from_date: dateMandatory('From Date'),
  to_date: dateMandatory('To Date'),
});
export type FleetFuelRemovalQueryDTO = z.infer<
  typeof FleetFuelRemovalQuerySchema
>;

// Convert existing data to a payload structure
export const toFleetFuelRemovalPayload = (row: FleetFuelRemoval): FleetFuelRemovalDTO => ({
  organisation_id: row.organisation_id ?? '',
  user_id: row.user_id || '',
  vehicle_id: row.vehicle_id ?? '',
  driver_id: row.driver_id || '',
  device_id: row.device_id || '',
  vehicle_fuel_type_id: row.vehicle_fuel_type_id || '',
  vehicle_fuel_unit_id: row.vehicle_fuel_unit_id || '',
  fuel_removal_reason_id: row.fuel_removal_reason_id || '',

  before_removal_quantity: row.before_removal_quantity,
  after_removal_quantity: row.after_removal_quantity,
  removal_quantity: row.removal_quantity,
  verified_removal_quantity: row.verified_removal_quantity,
  diff_removal_quantity: row.diff_removal_quantity ?? 0,

  odometer_reading: row.odometer_reading ?? 0,

  date_time: row.date_time,
  removal_details: row.removal_details || '',

  cost_per_unit: row.cost_per_unit ?? 0,
  total_cost: row.total_cost ?? 0,

  entry_source: row.entry_source ?? RefillEntrySource.Manual,
  source_reference_id: row.source_reference_id || '',
  source_notes: row.source_notes || '',

  admin_verify_status: row.admin_verify_status,
  transporter_verify_status: row.transporter_verify_status,

  latitude: row.latitude ?? 0,
  longitude: row.longitude ?? 0,
  google_location: row.google_location || '',

  status: row.status,

  time_zone_id: '', // provide from context

  // map child files -> DTO shape
  FleetFuelRemovalFile:
    row.FleetFuelRemovalFile?.map((file) => ({
      organisation_id: file.organisation_id ?? '',
      fleet_fuel_removal_id: file.fleet_fuel_removal_id ?? '',
      fleet_fuel_removal_file_id: file.fleet_fuel_removal_file_id ?? '',
      usage_type: file.usage_type,
      file_type: file.file_type,
      file_url: file.file_url || '',
      file_key: file.file_key || '',
      file_name: file.file_name || '',
      file_description: file.file_description || '',
      file_size: file.file_size ?? 0,
      file_metadata: file.file_metadata ?? {},
      status: file.status,
    })) ?? [],
});

// Generate a new payload with default values
export const newFleetFuelRemovalPayload = (): FleetFuelRemovalDTO => ({
  // Relations
  organisation_id: '',
  user_id: '',
  vehicle_id: '',
  driver_id: '',
  device_id: '',
  vehicle_fuel_type_id: '',
  vehicle_fuel_unit_id: '',
  fuel_removal_reason_id: '',

  // Quantities
  before_removal_quantity: 0,
  after_removal_quantity: 0,
  removal_quantity: 0,
  verified_removal_quantity: 0,
  diff_removal_quantity: 0,

  odometer_reading: 0,

  // Event Time
  date_time: new Date().toISOString(),
  removal_details: '',

  // Cost Info
  cost_per_unit: 0,
  total_cost: 0,

  // Source Details
  entry_source: RefillEntrySource.Manual,
  source_reference_id: '',
  source_notes: '',

  // Verification
  admin_verify_status: GPSFuelApproveStatus.Pending,
  transporter_verify_status: GPSFuelApproveStatus.Pending,

  // Location Details
  latitude: 0,
  longitude: 0,
  google_location: '',

  // Metadata
  status: Status.Active,

  // Required
  time_zone_id: '',

  // Children
  FleetFuelRemovalFile: [],
});

// API Methods
export const findFleetFuelRemoval = async (data: FleetFuelRemovalQueryDTO): Promise<FBR<FleetFuelRemoval[]>> => {
  return apiPost<FBR<FleetFuelRemoval[]>, FleetFuelRemovalQueryDTO>(ENDPOINTS.find, data);
};

export const createFleetFuelRemoval = async (data: FleetFuelRemovalDTO): Promise<SBR> => {
  return apiPost<SBR, FleetFuelRemovalDTO>(ENDPOINTS.create, data);
};

export const updateFleetFuelRemoval = async (id: string, data: FleetFuelRemovalDTO): Promise<SBR> => {
  return apiPatch<SBR, FleetFuelRemovalDTO>(ENDPOINTS.update(id), data);
};

export const deleteFleetFuelRemoval = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// API Methods Files
export const getFleetFuelRemovalPresignedUrl = async (data: FilePresignedUrlDTO): Promise<BR<AWSPresignedUrl>> => {
  return apiPost<BR<AWSPresignedUrl>, FilePresignedUrlDTO>(ENDPOINTS.presigned_url, data);
};

export const createFleetFuelRemovalFile = async (data: FleetFuelRemovalFileDTO): Promise<SBR> => {
  return apiPost<SBR, FleetFuelRemovalFileDTO>(ENDPOINTS.create_file, data);
};

export const removeFleetFuelRemovalFile = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.remove_file(id));
};
