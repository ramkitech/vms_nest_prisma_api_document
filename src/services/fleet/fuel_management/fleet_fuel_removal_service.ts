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
  enumArrayOptional,
  getAllEnums,
  doubleOptionalLatLng,
  stringOptional,
  doubleOptional,
  numberOptional,
} from '../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../zod_utils/zod_base_schema';

// Enums
import { FileType, GPSFuelApproveStatus, PaymentMode, PaymentStatus, RefillEntrySource, RefillMethod, Status, YesNo } from '../../../core/Enums';

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
};

// ✅ FleetFuelRemoval Interface
export interface FleetFuelRemoval extends Record<string, unknown> {
  // Primary Fields
  fleet_fuel_removal_id: string;

  // Quantities
  before_removal_quantity: number;
  after_removal_quantity: number;
  removed_quantity: number;
  verified_quantity: number;
  diff_quantity: number;

  odometer_reading?: number;

  // Event Time
  date_time: string;
  date_time_f?: string;

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

  // Verification
  admin_verify_status: GPSFuelApproveStatus;
  transporter_verify_status: GPSFuelApproveStatus;

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
export interface FleetFuelRemovalFile extends Record<string, unknown> {
  // Primary Fields
  fleet_fuel_removal_file_id: string;

  // File Details
  file_type: FileType;
  file_url?: string;
  file_key?: string;
  file_name?: string;
  file_description?: string;
  file_size?: number;
  file_metadata?: Record<string, unknown>;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations
  organisation_id: string;
  UserOrganisation?: UserOrganisation;

  fleet_fuel_removal_id: string;
  FleetFuelRemoval?: FleetFuelRemoval;
}


// ✅ FleetFuelRemoval Create/Update Schema
export const FleetFuelRemovalSchema = z.object({
  organisation_id: single_select_mandatory('UserOrganisation'),
  user_id: single_select_optional('User'),
  vehicle_id: single_select_mandatory('MasterVehicle'),
  driver_id: single_select_optional('MasterDriver'),
  device_id: single_select_optional('MasterDevice'),
  vehicle_fuel_type_id: single_select_optional('MasterVehicleFuelType'),
  vehicle_fuel_unit_id: single_select_optional('MasterVehicleFuelUnit'),
  fuel_removal_reason_id: single_select_optional(
    'MasterVehicleFuelRemovalReason',
  ),

  // Removal Quantity
  before_removal_quantity: doubleMandatory('Before Remove Quantity'),
  after_removal_quantity: doubleMandatory('After Remove Quantity'),
  removed_quantity: doubleMandatory('Removal Quantity'),
  verified_quantity: doubleMandatory('Verified Removal Quantity'),
  diff_quantity: doubleOptional('Difference Removal Quantity'),

  odometer_reading: numberOptional('Odometer Reading'),

  // Event Time
  date_time: dateMandatory('Date Time'),
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

  // Location Details
  latitude: doubleOptionalLatLng('Latitude'),
  longitude: doubleOptionalLatLng('Longitude'),
  google_location: stringOptional('Google Location', 0, 500),

  status: enumMandatory('Status', Status, Status.Active),

  time_zone_id: single_select_mandatory('MasterMainTimeZone'),
});
export type FleetFuelRemovalDTO = z.infer<typeof FleetFuelRemovalSchema>;

// ✅ FleetFuelRemoval Query Schema
export const FleetFuelRemovalQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('User Organisation IDs'), // ✅ Multi-selection -> UserOrganisation
  user_ids: multi_select_optional('User IDs'), // ✅ Multi-selection -> User
  vehicle_ids: multi_select_optional('Master Vehicle IDs'), // ✅ Multi-selection -> MasterVehicle
  driver_ids: multi_select_optional('Master Driver IDs'), // ✅ Multi-selection -> MasterDriver
  device_ids: multi_select_optional('Master Device IDs'), // ✅ Multi-selection -> MasterDevice
  vehicle_fuel_type_ids: multi_select_optional('Vehicle Fuel Type IDs'), // ✅ Multi-selection -> MasterVehicleFuelType
  vehicle_fuel_unit_ids: multi_select_optional('Vehicle Fuel Unit IDs'), // ✅ Multi-selection -> MasterVehicleFuelUnit
  fuel_removal_reason_ids: multi_select_optional('Fuel Removal Reason IDs'), // ✅ Multi-selection -> MasterVehicleFuelRemovalReason

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
export const toFleetFuelRemovalPayload = (
  row: FleetFuelRemoval
): FleetFuelRemovalDTO => ({
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
  removed_quantity: row.removed_quantity,
  verified_quantity: row.verified_quantity,
  diff_quantity: row.diff_quantity || 0,

  odometer_reading: row.odometer_reading || 0,

  date_time: row.date_time,
  removal_details: row.removal_details || '',

  cost_per_unit: row.cost_per_unit || 0,
  total_cost: row.total_cost || 0,

  entry_source: row.entry_source || RefillEntrySource.Manual,
  source_reference_id: row.source_reference_id || '',
  source_notes: row.source_notes || '',

  admin_verify_status: row.admin_verify_status,
  transporter_verify_status: row.transporter_verify_status,

  latitude: row.latitude || 0,
  longitude: row.longitude || 0,
  google_location: row.google_location || '',

  status: row.status,

  time_zone_id: '', // ✅ You must provide this from context
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
  removed_quantity: 0,
  verified_quantity: 0,
  diff_quantity: 0,

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
});

// API Methods
export const findFleetFuelRemoval = async (
  data: FleetFuelRemovalQueryDTO
): Promise<FBR<FleetFuelRemoval[]>> => {
  return apiPost<FBR<FleetFuelRemoval[]>, FleetFuelRemovalQueryDTO>(
    ENDPOINTS.find,
    data
  );
};

export const createFleetFuelRemoval = async (
  data: FleetFuelRemovalDTO
): Promise<SBR> => {
  return apiPost<SBR, FleetFuelRemovalDTO>(ENDPOINTS.create, data);
};

export const updateFleetFuelRemoval = async (
  id: string,
  data: FleetFuelRemovalDTO
): Promise<SBR> => {
  return apiPatch<SBR, FleetFuelRemovalDTO>(ENDPOINTS.update(id), data);
};

export const deleteFleetFuelRemoval = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};
