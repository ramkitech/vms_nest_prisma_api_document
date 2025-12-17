// Axios
import { apiPost, apiPatch, apiDelete } from '../../../../core/apiCall';
import { SBR, FBR } from '../../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  dateMandatory,
  dateOptional,
  enumMandatory,
  multi_select_optional,
  numberOptional,
  single_select_mandatory,
  single_select_optional,
} from '../../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../../zod_utils/zod_base_schema';

// Enums
import { Status } from '../../../../core/Enums';

// Other Models
import { MasterVehicle } from '../../../../services/main/vehicle/master_vehicle_service';
import { UserOrganisation } from '../../../../services/main/users/user_organisation_service';
import { MasterDriver } from '../../../../services/main/drivers/master_driver_service';
import { GPSGeofence } from './gps_geofence_service';
import { GPSGeofenceTransaction } from '../../../../services/gps/features/geofence/gps_geofence_transaction_service';

const URL = 'gps/features/gps_geofence_transaction_summary';

const ENDPOINTS = {
  // GPSGeofenceTransactionSummary APIs
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
};

// GPSGeofenceTransactionSummary Interface
export interface GPSGeofenceTransactionSummary extends Record<string, unknown> {
  // Primary Fields
  gps_geofence_transaction_summary_id: string;

  // Main Field Details
  geofence_enter_date_time: string;
  geofence_exit_date_time?: string;
  duration_seconds?: number;
  duration_seconds_f?: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent
  organisation_id: string;
  UserOrganisation?: UserOrganisation;

  vehicle_id: string;
  MasterVehicle?: MasterVehicle;
  vehicle_number?: string;
  vehicle_type?: string;

  driver_id?: string;
  MasterDriver?: MasterDriver;
  driver_details?: string;

  gps_geofence_id: string;
  GPSGeofenceData?: GPSGeofence;
  geofence_details?: string;

  enter_gps_geofence_transaction_id: string;
  EnterGPSGeofenceTransaction?: GPSGeofenceTransaction;

  exit_gps_geofence_transaction_id?: string;
  ExitGPSGeofenceTransaction?: GPSGeofenceTransaction;
}

// GPSGeofenceTransaction Summary Create/Update Schema
export const GPSGeofenceTransactionSummarySchema = z.object({
  organisation_id: single_select_mandatory('UserOrganisation'),
  vehicle_id: single_select_mandatory('Master Vehicle ID'),
  driver_id: single_select_optional('Driver ID'),
  gps_geofence_id: single_select_mandatory('GPS Geofence ID'),
  enter_gps_geofence_transaction_id: single_select_mandatory(
    'Enter GPS Geofence Transaction ID',
  ),
  exit_gps_geofence_transaction_id: single_select_optional(
    'Exit GPS Geofence Transaction ID',
  ),
  geofence_enter_date_time: dateMandatory('Geofence Enter Date Time'),
  geofence_exit_date_time: dateOptional('Geofence Exit Date Time'),
  duration_seconds: numberOptional('Duration Seconds'),
  status: enumMandatory('Status', Status, Status.Active),

  time_zone_id: single_select_mandatory('MasterMainTimeZone'),
});
export type GPSGeofenceTransactionSummaryDTO = z.infer<
  typeof GPSGeofenceTransactionSummarySchema
>;

// GPSGeofenceTransaction Summary Query Schema
export const GPSGeofenceTransactionSummaryQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('UserOrganisation'), // Multi-selection -> UserOrganisation
  vehicle_ids: multi_select_optional('MasterVehicle'), // Multi-selection -> MasterVehicle
  driver_ids: multi_select_optional('MasterDriver'), // Multi-selection -> MasterDriver
  gps_geofence_ids: multi_select_optional('Gps Geofence IDs'), // Multi-selection -> Gps Geofence
  from_date: dateMandatory('From Date'),
  to_date: dateMandatory('To Date'),
});
export type GPSGeofenceTransactionSummaryQueryDTO = z.infer<
  typeof GPSGeofenceTransactionSummaryQuerySchema
>;

// Convert GPSGeofenceTransactionSummary Data to API Payload
export const toGPSGeofenceTransactionSummaryPayload = (data: GPSGeofenceTransactionSummary): GPSGeofenceTransactionSummaryDTO => ({
  organisation_id: data.organisation_id || '',
  vehicle_id: data.vehicle_id || '',
  driver_id: data.driver_id || '',
  gps_geofence_id: data.gps_geofence_id || '',
  enter_gps_geofence_transaction_id: data.enter_gps_geofence_transaction_id || '',
  exit_gps_geofence_transaction_id: data.exit_gps_geofence_transaction_id || '',

  geofence_enter_date_time: data.geofence_enter_date_time || '',
  geofence_exit_date_time: data.geofence_exit_date_time || '',
  duration_seconds: data.duration_seconds || 0,

  status: data.status || Status.Active,
  time_zone_id: '', // Needs to be provided manually
});

// Create New GPSGeofenceTransactionSummary Payload
export const newGPSGeofenceTransactionSummaryPayload = (): GPSGeofenceTransactionSummaryDTO => ({
  organisation_id: '',
  vehicle_id: '',
  driver_id: '',
  gps_geofence_id: '',
  enter_gps_geofence_transaction_id: '',
  exit_gps_geofence_transaction_id: '',

  geofence_enter_date_time: '',
  geofence_exit_date_time: '',
  duration_seconds: 0,
  
  status: Status.Active,
  time_zone_id: '', // Needs to be provided manually
});

// GPSGeofenceTransactionSummary APIs
export const findGPSGeofenceTransactionSummary = async (data: GPSGeofenceTransactionSummaryQueryDTO): Promise<FBR<GPSGeofenceTransactionSummary[]>> => {
  return apiPost<FBR<GPSGeofenceTransactionSummary[]>, GPSGeofenceTransactionSummaryQueryDTO>(ENDPOINTS.find, data);
};

export const createGPSGeofenceTransactionSummary = async (data: GPSGeofenceTransactionSummaryDTO): Promise<SBR> => {
  return apiPost<SBR, GPSGeofenceTransactionSummaryDTO>(ENDPOINTS.create, data);
};

export const updateGPSGeofenceTransactionSummary = async (id: string, data: GPSGeofenceTransactionSummaryDTO): Promise<SBR> => {
  return apiPatch<SBR, GPSGeofenceTransactionSummaryDTO>(ENDPOINTS.update(id), data);
};

export const deleteGPSGeofenceTransactionSummary = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};
