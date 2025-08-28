// Axios
import { apiPost, apiPatch, apiDelete } from '../../../../core/apiCall';
import { SBR, FBR } from '../../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  enumMandatory,
  enumArrayOptional,
  single_select_mandatory,
  single_select_optional,
  dateMandatory,
  getAllEnums,
  multi_select_optional,
} from '../../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../../zod_utils/zod_base_schema';

// Enums
import { Status, GeofenceStatusType } from '../../../../core/Enums';

// Other Models
import { UserOrganisation } from '../../../../services/main/users/user_organisation_service';
import { MasterVehicle } from '../../../../services/main/vehicle/master_vehicle_service';
import { MasterDriver } from '../../../../services/main/drivers/master_driver_service';
import { GPSGeofence } from './gps_geofence_service';

// URL and Endpoints
const URL = 'gps/features/gps_geofence_transaction';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
};

// Model Interface
export interface GPSGeofenceTransaction extends Record<string, unknown> {
  gps_geofence_transaction_id: string;
  geofence_status_type: GeofenceStatusType;
  geofence_time: string;

  status: Status;
  added_date_time: string;
  modified_date_time: string;

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
}

// ✅ GPSGeofenceTransaction Create/Update Schema
export const GPSGeofenceTransactionSchema = z.object({
  organisation_id: single_select_mandatory('UserOrganisation'),
  vehicle_id: single_select_mandatory('Master Vehicle ID'),
  driver_id: single_select_optional('Driver ID'),
  gps_geofence_id: single_select_mandatory('GPS Geofence ID'),
  geofence_status_type: enumMandatory(
    'Geofence Status Type',
    GeofenceStatusType,
    GeofenceStatusType.Enter,
  ),
  geofence_time: dateMandatory('Geofence Time'),
  status: enumMandatory('Status', Status, Status.Active),

  time_zone_id: single_select_mandatory('MasterMainTimeZone'),
});
export type GPSGeofenceTransactionDTO = z.infer<
  typeof GPSGeofenceTransactionSchema
>;

// ✅ GPSGeofenceTransaction Query Schema
export const GPSGeofenceTransactionQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('UserOrganisation'), // ✅ Multi-selection -> UserOrganisation
  vehicle_ids: multi_select_optional('MasterVehicle'), // ✅ Multi-selection -> MasterVehicle
  driver_ids: multi_select_optional('MasterDriver'), // ✅ Multi-selection -> MasterDriver
  gps_geofence_ids: multi_select_optional('Gps Geofence IDs'), // ✅ Multi-selection -> Gps Geofence
  geofence_status_type: enumArrayOptional(
    'Geofence Status Type',
    GeofenceStatusType,
    getAllEnums(GeofenceStatusType),
  ),

  from_date: dateMandatory('From Date'),
  to_date: dateMandatory('To Date'),
});
export type GPSGeofenceTransactionQueryDTO = z.infer<
  typeof GPSGeofenceTransactionQuerySchema
>;

// Payload Conversions
export const toGPSGeofenceTransactionPayload = (data: GPSGeofenceTransaction): GPSGeofenceTransactionDTO => ({
  organisation_id: data.organisation_id,
  vehicle_id: data.vehicle_id,
  gps_geofence_id: data.gps_geofence_id,
  driver_id: data.driver_id || '',
  geofence_status_type: data.geofence_status_type,
  geofence_time: data.geofence_time,
  status: data.status,
  time_zone_id: '',
});

export const newGPSGeofenceTransactionPayload = (): GPSGeofenceTransactionDTO => ({
  organisation_id: '',
  vehicle_id: '',
  gps_geofence_id: '',
  driver_id: '',
  geofence_status_type: GeofenceStatusType.Enter,
  geofence_time: new Date().toISOString(),
  status: Status.Active,
  time_zone_id: '',
});

// API Methods
export const findGPSGeofenceTransaction = async (data: GPSGeofenceTransactionQueryDTO): Promise<FBR<GPSGeofenceTransaction[]>> => {
  return apiPost<FBR<GPSGeofenceTransaction[]>, GPSGeofenceTransactionQueryDTO>(ENDPOINTS.find, data);
};

export const createGPSGeofenceTransaction = async (data: GPSGeofenceTransactionDTO): Promise<SBR> => {
  return apiPost<SBR, GPSGeofenceTransactionDTO>(ENDPOINTS.create, data);
};

export const updateGPSGeofenceTransaction = async (id: string, data: GPSGeofenceTransactionDTO): Promise<SBR> => {
  return apiPatch<SBR, GPSGeofenceTransactionDTO>(ENDPOINTS.update(id), data);
};

export const deleteGPSGeofenceTransaction = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};
