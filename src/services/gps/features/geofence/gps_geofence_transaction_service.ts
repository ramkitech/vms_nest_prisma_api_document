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
import { GPSGeofenceData } from '../../../../services/gps/features/geofence/gps_geofence_data_service';

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
  GPSGeofenceData?: GPSGeofenceData;
  geofence_details?: string;
}

// ✅ GPS Geofence Transaction Create/Update Schema
export const GPSGeofenceTransactionSchema = z.object({
  organisation_id: single_select_mandatory('Organisation ID'),
  vehicle_id: single_select_mandatory('Master Vehicle ID'),
  driver_id: single_select_optional('Driver ID'),
  gps_geofence_id: single_select_mandatory('GPS Geofence ID'),
  geofence_status_type: enumMandatory(
    'Geofence Status Type',
    GeofenceStatusType,
    GeofenceStatusType.Enter
  ),
  geofence_time: dateMandatory('Geofence Time'),
  status: enumMandatory('Status', Status, Status.Active),
});
export type GPSGeofenceTransactionDTO = z.infer<
  typeof GPSGeofenceTransactionSchema
>;

// ✅ GPS Geofence Transaction Query Schema
export const GPSGeofenceTransactionQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('User Organisation IDs'), // ✅ Multi-selection -> UserOrganisation
  vehicle_ids: multi_select_optional('Master Vehicle IDs'), // ✅ Multi-selection -> Master Vehicle
  driver_ids: multi_select_optional('Master Driver IDs'), // ✅ Multi-selection -> Master Driver
  gps_geofence_ids: multi_select_optional('Gps Geofence IDs'), // ✅ Multi-selection -> Gps Geofence
  geofence_status_type: enumArrayOptional(
    'Geofence Status Type',
    GeofenceStatusType,
    getAllEnums(GeofenceStatusType)
  ),
});
export type GPSGeofenceTransactionQueryDTO = z.infer<
  typeof GPSGeofenceTransactionQuerySchema
>;

// Payload Conversions
export const toGPSGeofenceTransactionPayload = (
  data: GPSGeofenceTransaction
): GPSGeofenceTransactionDTO => ({
  organisation_id: data.organisation_id,
  vehicle_id: data.vehicle_id,
  gps_geofence_id: data.gps_geofence_id,
  driver_id: data.driver_id || '',
  geofence_status_type: data.geofence_status_type,
  geofence_time: data.geofence_time,
  status: data.status,
});

export const newGPSGeofenceTransactionPayload =
  (): GPSGeofenceTransactionDTO => ({
    organisation_id: '',
    vehicle_id: '',
    gps_geofence_id: '',
    driver_id: '',
    geofence_status_type: GeofenceStatusType.Enter,
    geofence_time: new Date().toISOString(),
    status: Status.Active,
  });

// 9. API Methods (CRUD)

export const findGPSGeofenceTransactions = async (
  data: GPSGeofenceTransactionQueryDTO
): Promise<FBR<GPSGeofenceTransaction[]>> => {
  return apiPost(ENDPOINTS.find, data);
};

export const createGPSGeofenceTransaction = async (
  data: GPSGeofenceTransactionDTO
): Promise<SBR> => {
  return apiPost(ENDPOINTS.create, data);
};

export const updateGPSGeofenceTransaction = async (
  id: string,
  data: GPSGeofenceTransactionDTO
): Promise<SBR> => {
  return apiPatch(ENDPOINTS.update(id), data);
};

export const deleteGPSGeofenceTransaction = async (
  id: string
): Promise<SBR> => {
  return apiDelete(ENDPOINTS.delete(id));
};
