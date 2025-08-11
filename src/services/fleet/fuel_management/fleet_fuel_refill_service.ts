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

const URL = 'fleet/fuel_management/fleet_fuel_refill';

const ENDPOINTS = {
    find: `${URL}/search`,
    create: URL,
    update: (id: string): string => `${URL}/${id}`,
    delete: (id: string): string => `${URL}/${id}`,
};

// ✅ FleetFuelRefill Interface
export interface FleetFuelRefill extends Record<string, unknown> {
  // Primary Fields
  fleet_fuel_refill_id: string;

  // Quantities
  before_refill_quantity: number;
  after_refill_quantity: number;
  refill_quantity: number;
  verified_refill_quantity: number;
  diff_refill_quantity: number;

  odometer_reading?: number;
  is_full_tank: YesNo;
  is_previous_entries_missed: YesNo;

  // Event Time
  date_time: string; // ISO string
  date_time_f?: string;

  // Cost Details
  cost_per_unit?: number;
  total_cost?: number;

  // Payment Info
  invoice_number?: string;
  payment_mode: PaymentMode;
  payment_status: PaymentStatus;
  payment_reference_number?: string;
  fuel_card_number?: string;
  payment_notes?: string;

  // Other Details
  refill_method?: RefillMethod;
  refill_details?: string;
  payment_details?: string;
  filled_by_person?: string;

  // Source Details
  entry_source: RefillEntrySource;
  source_reference_id?: string;
  source_notes?: string;

  // Verification
  admin_verify_status: GPSFuelApproveStatus;
  transporter_verify_status: GPSFuelApproveStatus;

  // Analytics Fields
  last_refill_date?: string; // ISO string
  last_odometer_reading?: number;
  last_refill_quantity?: number;
  diff_distance?: number;
  fuel_efficiency?: number;

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

  vendor_id?: string;
  //FleetVendor?: FleetVendor;
  vendor_name?: string;

  fuel_station_id?: string;
  //FleetVendorFuelStation?: FleetVendorFuelStation;
  station_name: string;
  company_name: string;

  vehicle_fuel_type_id?: string;
  MasterVehicleFuelType?: MasterVehicleFuelType;
  fuel_type?: string;

  vehicle_fuel_unit_id?: string;
  MasterVehicleFuelUnit?: MasterVehicleFuelUnit;
  fuel_unit?: string;

  // Child Relations
  FleetFuelRefillFile?: FleetFuelRefillFile[];

  // Optional Count
  _count?: {
    FleetFuelRefillFile?: number;
  };
}

// ✅ FleetFuelRefillFile Interface
export interface FleetFuelRefillFile extends Record<string, unknown> {
  // Primary Fields
  fleet_fuel_refill_file_id: string;

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

  fleet_fuel_refill_id: string;
  FleetFuelRefill?: FleetFuelRefill;
}

// ✅ FleetFuelRefill Create/Update Schema
export const FleetFuelRefillSchema = z.object({
  organisation_id: single_select_mandatory('UserOrganisation'),
  user_id: single_select_optional('User'),
  vehicle_id: single_select_mandatory('MasterVehicle'),
  driver_id: single_select_optional('MasterDriver'),
  device_id: single_select_optional('MasterDevice'),
  vendor_id: single_select_optional('FleetVendor'),
  fuel_station_id: single_select_optional('FleetVendorFuelStation'),
  vehicle_fuel_type_id: single_select_optional('MasterVehicleFuelType'),
  vehicle_fuel_unit_id: single_select_optional('MasterVehicleFuelUnit'),

  // Refill Quantity
  before_refill_quantity: doubleMandatory('Before Refill Quantity'),
  after_refill_quantity: doubleMandatory('After Refill Quantity'),
  refill_quantity: doubleMandatory('Refill Quantity'),
  verified_refill_quantity: doubleMandatory('Verified Refill Quantity'),
  diff_refill_quantity: doubleOptional('Difference Refill Quantity'),

  odometer_reading: numberOptional('Odometer Reading'),
  is_full_tank: enumMandatory('Is Full Tank', YesNo, YesNo.No),
  is_previous_entries_missed: enumMandatory(
    'Is Previous Entries Missed',
    YesNo,
    YesNo.No,
  ),

  // Event Time
  date_time: dateMandatory('Date Time'),

  // Cost Details
  cost_per_unit: doubleOptional('Cost Per Unit'),
  total_cost: doubleOptional('Total Cost'),

  // Payment Info
  invoice_number: stringOptional('Invoice Number', 0, 100),
  payment_mode: enumMandatory('Payment Mode', PaymentMode, PaymentMode.Cash),
  payment_status: enumMandatory(
    'Payment Status',
    PaymentStatus,
    PaymentStatus.Paid,
  ),
  payment_reference_number: stringOptional('Payment Reference Number', 0, 100),
  fuel_card_number: stringOptional('Fuel Card Number', 0, 50),
  payment_notes: stringOptional('Payment Notes', 0, 500),

  //Other Details
  refill_method: enumOptional(
    'Refill Method',
    RefillMethod,
    RefillMethod.Dispenser,
  ),
  refill_details: stringOptional('Refill Details', 0, 300),
  payment_details: stringOptional('Payment Details', 0, 300),
  filled_by_person: stringOptional('Filled By Person', 0, 100),

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
export type FleetFuelRefillDTO = z.infer<typeof FleetFuelRefillSchema>;

// ✅ FleetFuelRefill Query Schema
export const FleetFuelRefillQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('User Organisation IDs'), // ✅ Multi-selection -> UserOrganisation
  user_ids: multi_select_optional('User IDs'), // ✅ Multi-selection -> User
  vehicle_ids: multi_select_optional('Master Vehicle IDs'), // ✅ Multi-selection -> MasterVehicle
  driver_ids: multi_select_optional('Master Driver IDs'), // ✅ Multi-selection -> MasterDriver
  device_ids: multi_select_optional('Master Device IDs'), // ✅ Multi-selection -> MasterDevice
  vendor_ids: multi_select_optional('Vendor IDs'), // ✅ Multi-selection -> FleetVendor
  fuel_station_ids: multi_select_optional('Fuel Station IDs'), // ✅ Multi-selection -> FleetVendorFuelStation
  vehicle_fuel_type_ids: multi_select_optional('Vehicle Fuel Type IDs'), // ✅ Multi-selection -> MasterVehicleFuelType
  vehicle_fuel_unit_ids: multi_select_optional('Vehicle Fuel Unit IDs'), // ✅ Multi-selection -> MasterVehicleFuelUnit

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
export type FleetFuelRefillQueryDTO = z.infer<
  typeof FleetFuelRefillQuerySchema
>;

// Convert existing data to a payload structure
export const toFleetFuelRefillPayload = (
  row: FleetFuelRefill
): FleetFuelRefillDTO => ({
  organisation_id: row.organisation_id ?? '',
  user_id: row.user_id || '',
  vehicle_id: row.vehicle_id ?? '',
  driver_id: row.driver_id || '',
  device_id: row.device_id || '',
  vendor_id: row.vendor_id || '',
  fuel_station_id: row.fuel_station_id || '',
  vehicle_fuel_type_id: row.vehicle_fuel_type_id || '',
  vehicle_fuel_unit_id: row.vehicle_fuel_unit_id || '',

  before_refill_quantity: row.before_refill_quantity,
  after_refill_quantity: row.after_refill_quantity,
  refill_quantity: row.refill_quantity,
  verified_refill_quantity: row.verified_refill_quantity,
  diff_refill_quantity: row.diff_refill_quantity || 0,

  odometer_reading: row.odometer_reading || 0,
  is_full_tank: row.is_full_tank,
  is_previous_entries_missed: row.is_previous_entries_missed,

  date_time: row.date_time,

  cost_per_unit: row.cost_per_unit || 0,
  total_cost: row.total_cost || 0,

  invoice_number: row.invoice_number || '',
  payment_mode: row.payment_mode,
  payment_status: row.payment_status,
  payment_reference_number: row.payment_reference_number || '',
  fuel_card_number: row.fuel_card_number || '',
  payment_notes: row.payment_notes || '',

  refill_method: row.refill_method || RefillMethod.Dispenser,
  refill_details: row.refill_details || '',
  payment_details: row.payment_details || '',
  filled_by_person: row.filled_by_person || '',

  entry_source: row.entry_source || RefillEntrySource.Manual,
  source_reference_id: row.source_reference_id || '',
  source_notes: row.source_notes || '',

  admin_verify_status: row.admin_verify_status,
  transporter_verify_status: row.transporter_verify_status,

  latitude: row.latitude || 0,
  longitude: row.longitude || 0,
  google_location: row.google_location || '',

  status: row.status,

  time_zone_id: '',
});

// Generate a new payload with default values
export const newFleetFuelRefillPayload = (): FleetFuelRefillDTO => ({
  // Relations
  organisation_id: '',
  user_id: '',
  vehicle_id: '',
  driver_id: '',
  device_id: '',
  vendor_id: '',
  fuel_station_id: '',
  vehicle_fuel_type_id: '',
  vehicle_fuel_unit_id: '',

  // Refill Quantity
  before_refill_quantity: 0,
  after_refill_quantity: 0,
  refill_quantity: 0,
  verified_refill_quantity: 0,
  diff_refill_quantity: 0,

  // Odometer & Tank Info
  odometer_reading: 0,
  is_full_tank: YesNo.No,
  is_previous_entries_missed: YesNo.No,

  // Event Time
  date_time: new Date().toISOString(),

  // Cost Details
  cost_per_unit: 0,
  total_cost: 0,

  // Payment Info
  invoice_number: '',
  payment_mode: PaymentMode.Cash,
  payment_status: PaymentStatus.Paid,
  payment_reference_number: '',
  fuel_card_number: '',
  payment_notes: '',

  // Other Details
  refill_method: RefillMethod.Dispenser,
  refill_details: '',
  payment_details: '',
  filled_by_person: '',

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
export const findFleetFuelRefill = async (
    data: FleetFuelRefillQueryDTO
): Promise<FBR<FleetFuelRefill[]>> => {
    return apiPost<FBR<FleetFuelRefill[]>, FleetFuelRefillQueryDTO>(
        ENDPOINTS.find,
        data
    );
};

export const createFleetFuelRefill = async (
    data: FleetFuelRefillDTO
): Promise<SBR> => {
    return apiPost<SBR, FleetFuelRefillDTO>(ENDPOINTS.create, data);
};

export const updateFleetFuelRefill = async (
    id: string,
    data: FleetFuelRefillDTO
): Promise<SBR> => {
    return apiPatch<SBR, FleetFuelRefillDTO>(ENDPOINTS.update(id), data);
};

export const deleteFleetFuelRefill = async (id: string): Promise<SBR> => {
    return apiDelete<SBR>(ENDPOINTS.delete(id));
};
