// Axios
import { apiPost, apiPatch, apiDelete } from '../../../core/apiCall';
import { SBR, FBR, AWSPresignedUrl, BR, BaseCommonFile } from '../../../core/BaseResponse';

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
import { FileType, GPSFuelApproveStatus, PaymentMode, PaymentStatus, RefillEntrySource, RefillMethod, Status, YesNo } from '../../../core/Enums';

// Other Models
import { UserOrganisation } from '../../main/users/user_organisation_service';
import { User } from 'src/services/main/users/user_service';
import { MasterVehicle } from '../../main/vehicle/master_vehicle_service';
import { MasterDriver } from 'src/services/main/drivers/master_driver_service';
import { MasterDevice } from 'src/services/main/devices/master_device_service';
import { MasterMainLandMark } from 'src/services/master/main/master_main_landmark_service';
import { MasterVehicleFuelType } from 'src/services/master/vehicle/master_vehicle_fuel_type_service';
import { MasterVehicleFuelUnit } from 'src/services/master/vehicle/master_vehicle_fuel_unit_service';
import { FleetVendor } from '../vendor_management/fleet_vendor_service';
import { FleetVendorFuelStation } from '../vendor_management/fleet_vendor_fuel_station';

const URL = 'fleet/fuel_management/fleet_fuel_refill';

const ENDPOINTS = {
  // AWS S3 PRESIGNED
  fuel_refill_file_presigned_url: `${URL}/fuel_refill_file_presigned_url`,

  // File Uploads
  create_fuel_refill_file: `${URL}/create_fuel_refill_file`,
  remove_fuel_refill_file: (id: string): string => `${URL}/remove_fuel_refill_file/${id}`,

  // FleetFuelRefill APIs
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
};

// FleetFuelRefill Interface
export interface FleetFuelRefill extends Record<string, unknown> {
  // Primary Fields
  fleet_fuel_refill_id: string;

  // Refill Quantity
  before_refill_quantity: number;
  after_refill_quantity: number;
  refill_quantity: number;
  verified_refill_quantity: number;
  diff_refill_quantity: number;

  // Event Time
  date_time: string;
  date_time_f?: string;
  date: string;
  date_f?: string;

  // Verification
  admin_verify_status: GPSFuelApproveStatus;
  transporter_verify_status: GPSFuelApproveStatus;

  // Cost Details
  cost_per_unit?: number;
  total_cost?: number;

  // Source Details
  entry_source: RefillEntrySource;
  source_reference_id?: string;
  source_notes?: string;

  // Refill Details
  refill_method?: RefillMethod;
  refill_details?: string;
  filled_by_person?: string;

  // Payment Details
  invoice_number?: string;
  payment_mode: PaymentMode;
  payment_status: PaymentStatus;
  payment_reference_number?: string;
  fuel_card_number?: string;
  payment_notes?: string;

  // Location Details
  latitude?: number;
  longitude?: number;
  google_location?: string;

  landmark_id?: string;
  MasterMainLandmark?: MasterMainLandMark;
  landmark_location?: string;
  landmark_distance?: number;

  // Analytics Fields
  odometer_reading?: number;
  tank_size?: number;
  is_full_tank: YesNo;
  is_previous_entries_missed: YesNo;

  last_refill_date?: string;
  last_refill_date_f?: string;
  last_odometer_reading?: number;
  last_refill_quantity?: number;
  diff_distance?: number;
  fuel_efficiency?: number;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent
  organisation_id: string;
  UserOrganisation?: UserOrganisation;

  user_id?: string;
  User?: User;
  user_details?: string;

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

  vendor_id?: string;
  FleetVendor?: FleetVendor;
  vendor_name?: string;

  fuel_station_id?: string;
  FleetVendorFuelStation?: FleetVendorFuelStation;
  fuel_station_name?: string;

  vehicle_fuel_type_id?: string;
  MasterVehicleFuelType?: MasterVehicleFuelType;
  fuel_type?: string;

  vehicle_fuel_unit_id?: string;
  MasterVehicleFuelUnit?: MasterVehicleFuelUnit;
  fuel_unit?: string;

  // Relations - Child
  FleetFuelRefillFile?: FleetFuelRefillFile[];

  // Relations - Child Count
  _count?: {
    FleetFuelRefillFile?: number;
  };
}

// FleetFuelRefillFile Interface
export interface FleetFuelRefillFile extends BaseCommonFile {
  // Primary Fields
  fleet_fuel_refill_file_id: string;

  // Relations - Parent
  organisation_id: string;
  UserOrganisation?: UserOrganisation;

  fleet_fuel_refill_id: string;
  FleetFuelRefill?: FleetFuelRefill;
}

// FleetFuelRefillFile Schema
export const FleetFuelRefillFileSchema = BaseFileSchema.extend({
  organisation_id: single_select_optional('UserOrganisation'), // ✅ Single-Selection -> UserOrganisation
  fleet_fuel_refill_id: single_select_optional('FleetFuelRefill'), // ✅ Single-Selection -> FleetFuelRefill
});
export type FleetFuelRefillFileDTO = z.infer<typeof FleetFuelRefillFileSchema>;

// FleetFuelRefill Create/Update Schema
export const FleetFuelRefillSchema = z.object({
  organisation_id: single_select_mandatory('UserOrganisation'), // ✅ Single-Selection -> UserOrganisation
  user_id: single_select_optional('User'), // ✅ Single-Selection -> User
  vehicle_id: single_select_mandatory('MasterVehicle'), // ✅ Single-Selection -> MasterVehicle
  driver_id: single_select_optional('MasterDriver'), // ✅ Single-Selection -> MasterDriver
  device_id: single_select_optional('MasterDevice'), // ✅ Single-Selection -> MasterDevice
  vendor_id: single_select_optional('FleetVendor'), // ✅ Single-Selection -> FleetVendor
  fuel_station_id: single_select_optional('FleetVendorFuelStation'), // ✅ Single-Selection -> FleetVendorFuelStation
  vehicle_fuel_type_id: single_select_optional('MasterVehicleFuelType'), // ✅ Single-Selection -> MasterVehicleFuelType
  vehicle_fuel_unit_id: single_select_optional('MasterVehicleFuelUnit'), // ✅ Single-Selection -> MasterVehicleFuelUnit

  // Refill Quantity
  before_refill_quantity: doubleOptional('Before Refill Quantity'),
  after_refill_quantity: doubleOptional('After Refill Quantity'),
  refill_quantity: doubleOptional('Refill Quantity'),
  verified_refill_quantity: doubleOptional('Verified Refill Quantity'),
  diff_refill_quantity: doubleOptional('Difference Refill Quantity', -100),

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

  // Refill Details
  refill_method: enumOptional(
    'Refill Method',
    RefillMethod,
    RefillMethod.Dispenser,
  ),
  refill_details: stringOptional('Refill Details', 0, 500),
  filled_by_person: stringOptional('Filled By Person', 0, 100),

  // Payment Details
  invoice_number: stringOptional('Invoice Number', 0, 100),
  payment_mode: enumMandatory('Payment Mode', PaymentMode, PaymentMode.Cash),
  payment_status: enumMandatory(
    'Payment Status',
    PaymentStatus,
    PaymentStatus.Paid,
  ),
  payment_reference_number: stringOptional('Payment Reference Number', 0, 100),
  fuel_card_number: stringOptional('Fuel Card Number', 0, 100),
  payment_notes: stringOptional('Payment Notes', 0, 500),

  // Location Details
  latitude: doubleOptionalLatLng('Latitude'),
  longitude: doubleOptionalLatLng('Longitude'),
  google_location: stringOptional('Google Location', 0, 500),

  // Analytics Fields
  odometer_reading: numberOptional('Odometer Reading'),
  tank_size: numberOptional('Tank Size'),
  is_full_tank: enumMandatory('Is Full Tank', YesNo, YesNo.No),
  is_previous_entries_missed: enumMandatory(
    'Is Previous Entries Missed',
    YesNo,
    YesNo.No,
  ),

  // Other
  status: enumMandatory('Status', Status, Status.Active),
  time_zone_id: single_select_mandatory('MasterMainTimeZone'),

  FleetFuelRefillFile: nestedArrayOfObjectsOptional(
    'FleetFuelRefillFile',
    FleetFuelRefillFileSchema,
    [],
  ),
});
export type FleetFuelRefillDTO = z.infer<typeof FleetFuelRefillSchema>;

// FleetFuelRefill Query Schema
export const FleetFuelRefillQuerySchema = BaseQuerySchema.extend({
  fleet_fuel_refill_ids: multi_select_optional('FleetFuelRefill'), // ✅ Multi-selection -> FleetFuelRefill

  organisation_ids: multi_select_optional('UserOrganisation'), // ✅ Multi-selection -> UserOrganisation
  user_ids: multi_select_optional('User'), // ✅ Multi-selection -> User
  vehicle_ids: multi_select_optional('MasterVehicle'), // ✅ Multi-selection -> MasterVehicle
  driver_ids: multi_select_optional('MasterDriver'), // ✅ Multi-selection -> MasterDriver
  device_ids: multi_select_optional('MasterDevice'), // ✅ Multi-selection -> MasterDevice
  vendor_ids: multi_select_optional('FleetVendor'), // ✅ Multi-selection -> FleetVendor
  fuel_station_ids: multi_select_optional('FleetVendorFuelStation'), // ✅ Multi-selection -> FleetVendorFuelStation
  vehicle_fuel_type_ids: multi_select_optional('MasterVehicleFuelType'), // ✅ Multi-selection -> MasterVehicleFuelType
  vehicle_fuel_unit_ids: multi_select_optional('MasterVehicleFuelUnit'), // ✅ Multi-selection -> MasterVehicleFuelUnit

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

  refill_method: enumArrayOptional(
    'Refill Method',
    RefillMethod,
    getAllEnums(RefillMethod),
  ),
  payment_mode: enumArrayOptional(
    'Payment Mode',
    PaymentMode,
    getAllEnums(PaymentMode),
  ),
  payment_status: enumArrayOptional(
    'Payment Status',
    PaymentStatus,
    getAllEnums(PaymentStatus),
  ),
  is_full_tank: enumArrayOptional('Is Full Tank', YesNo, getAllEnums(YesNo)),
  is_previous_entries_missed: enumArrayOptional(
    'Is Previous Entries Missed',
    YesNo,
    getAllEnums(YesNo),
  ),

  from_date: dateMandatory('From Date'),
  to_date: dateMandatory('To Date'),
});
export type FleetFuelRefillQueryDTO = z.infer<
  typeof FleetFuelRefillQuerySchema
>;

// Convert FleetFuelRefill Data to API Payload
export const toFleetFuelRefillPayload = (row: FleetFuelRefill): FleetFuelRefillDTO => ({
  organisation_id: row.organisation_id ?? '',
  user_id: row.user_id || '',
  vehicle_id: row.vehicle_id || '',
  driver_id: row.driver_id || '',
  device_id: row.device_id || '',
  vendor_id: row.vendor_id || '',
  fuel_station_id: row.fuel_station_id || '',
  vehicle_fuel_type_id: row.vehicle_fuel_type_id || '',
  vehicle_fuel_unit_id: row.vehicle_fuel_unit_id || '',

  // Refill Quantity
  before_refill_quantity: row.before_refill_quantity || 0,
  after_refill_quantity: row.after_refill_quantity || 0,
  refill_quantity: row.refill_quantity || 0,
  verified_refill_quantity: row.verified_refill_quantity || 0,
  diff_refill_quantity: row.diff_refill_quantity || 0,

  // Event Time
  date_time: row.date_time || '',

  // Verification
  admin_verify_status: row.admin_verify_status || GPSFuelApproveStatus.Pending,
  transporter_verify_status: row.transporter_verify_status || GPSFuelApproveStatus.Pending,

  // Cost Details
  cost_per_unit: row.cost_per_unit || 0,
  total_cost: row.total_cost || 0,

  // Source Details
  entry_source: row.entry_source || RefillEntrySource.Manual,
  source_reference_id: row.source_reference_id || '',
  source_notes: row.source_notes || '',

  // Refill Details
  refill_method: row.refill_method || RefillMethod.Dispenser,
  refill_details: row.refill_details || '',
  filled_by_person: row.filled_by_person || '',

  // Payment Details
  invoice_number: row.invoice_number || '',
  payment_mode: row.payment_mode || PaymentMode.Cash,
  payment_status: row.payment_status || PaymentStatus.Paid,
  payment_reference_number: row.payment_reference_number || '',
  fuel_card_number: row.fuel_card_number || '',
  payment_notes: row.payment_notes || '',

  // Location Details
  latitude: row.latitude || 0,
  longitude: row.longitude || 0,
  google_location: row.google_location || '',

  // Analytics Fields
  odometer_reading: row.odometer_reading || 0,
  tank_size: row.tank_size || 0,
  is_full_tank: row.is_full_tank || YesNo.No,
  is_previous_entries_missed: row.is_previous_entries_missed || YesNo.No,

  status: row.status || Status.Active,

  time_zone_id: '', // Needs to be provided manually

  FleetFuelRefillFile: row.FleetFuelRefillFile?.map((file) => ({
    organisation_id: file.organisation_id || '',
    fleet_fuel_refill_id: file.fleet_fuel_refill_id || '',
    fleet_fuel_refill_file_id: file.fleet_fuel_refill_file_id || '',

    // Usage Type -> Odometer Image, Fuel Bill, Fuel Tank Image, Refill Recording Video
    usage_type: file.usage_type || '',

    file_type: file.file_type || FileType.Image,
    file_url: file.file_url || '',
    file_key: file.file_key || '',
    file_name: file.file_name || '',
    file_description: file.file_description || '',
    file_size: file.file_size || 0,
    file_metadata: file.file_metadata || {},

    status: file.status || Status.Active,
  })) || [],
});

// Create New FleetFuelRefill Payload
export const newFleetFuelRefillPayload = (): FleetFuelRefillDTO => ({
  organisation_id: '',
  user_id: '',
  vehicle_id: '',
  driver_id: '',
  device_id: '',
  vendor_id: '',
  fuel_station_id: '',
  vehicle_fuel_type_id: '',
  vehicle_fuel_unit_id: '',

  before_refill_quantity: 0,
  after_refill_quantity: 0,
  refill_quantity: 0,
  verified_refill_quantity: 0,
  diff_refill_quantity: 0,

  date_time: '',

  admin_verify_status: GPSFuelApproveStatus.Pending,
  transporter_verify_status: GPSFuelApproveStatus.Pending,

  cost_per_unit: 0,
  total_cost: 0,

  entry_source: RefillEntrySource.Manual,
  source_reference_id: '',
  source_notes: '',

  refill_method: RefillMethod.Dispenser,
  refill_details: '',
  filled_by_person: '',
  invoice_number: '',
  payment_mode: PaymentMode.Cash,
  payment_status: PaymentStatus.Paid,
  payment_reference_number: '',
  fuel_card_number: '',
  payment_notes: '',

  latitude: 0,
  longitude: 0,
  google_location: '',

  odometer_reading: 0,
  tank_size: 0,
  is_full_tank: YesNo.No,
  is_previous_entries_missed: YesNo.No,

  status: Status.Active,

  time_zone_id: '', // Needs to be provided manually

  FleetFuelRefillFile: [],
});

// AWS S3 PRESIGNED
export const get_fuel_refill_file_presigned_url = async (data: FilePresignedUrlDTO): Promise<BR<AWSPresignedUrl>> => {
  return apiPost<BR<AWSPresignedUrl>, FilePresignedUrlDTO>(ENDPOINTS.fuel_refill_file_presigned_url, data);
};

// File Uploads
export const create_fuel_refill_file = async (data: FleetFuelRefillFileDTO): Promise<SBR> => {
  return apiPost<SBR, FleetFuelRefillFileDTO>(ENDPOINTS.create_fuel_refill_file, data);
};

export const remove_fuel_refill_file = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.remove_fuel_refill_file(id));
};

// FleetFuelRefill APIs
export const findFleetFuelRefill = async (data: FleetFuelRefillQueryDTO): Promise<FBR<FleetFuelRefill[]>> => {
  return apiPost<FBR<FleetFuelRefill[]>, FleetFuelRefillQueryDTO>(ENDPOINTS.find, data);
};

export const createFleetFuelRefill = async (data: FleetFuelRefillDTO): Promise<SBR> => {
  return apiPost<SBR, FleetFuelRefillDTO>(ENDPOINTS.create, data);
};

export const updateFleetFuelRefill = async (id: string, data: FleetFuelRefillDTO): Promise<SBR> => {
  return apiPatch<SBR, FleetFuelRefillDTO>(ENDPOINTS.update(id), data);
};

export const deleteFleetFuelRefill = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

