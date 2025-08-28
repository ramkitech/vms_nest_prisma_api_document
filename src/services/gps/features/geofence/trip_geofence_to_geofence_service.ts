// Axios
import { apiPost, apiPatch, apiDelete } from '../../../../core/apiCall';
import { SBR, FBR } from '../../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  single_select_mandatory,
  single_select_optional,
  multi_select_optional,
  numberMandatory,
  numberOptional,
  doubleOptional,
  enumMandatory,
  dateMandatory,
} from '../../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../../zod_utils/zod_base_schema';

// Enums
import { Status } from '../../../../core/Enums';

// Other Models
import { UserOrganisation } from '../../../../services/main/users/user_organisation_service';
import { MasterVehicle } from '../../../../services/main/vehicle/master_vehicle_service';
import { MasterDriver } from '../../../../services/main/drivers/master_driver_service';
import { GPSGeofenceData } from '../../../../services/gps/features/geofence/gps_geofence_data_service';

// URL and Endpoints
const URL = 'gps/features/trip_geofence_to_geofence';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
};

// Interface
export interface TripGeofenceToGeofence extends Record<string, unknown> {
  trip_geofence_to_geofence_id: string;
  from_geofence_exit_date_time: string;
  to_geofence_enter_date_time: string;
  duration_seconds: number;

  travel_duration_seconds?: number;
  stopped_duration_seconds?: number;
  distance_meters?: number;
  max_speed?: number;
  avg_speed?: number;

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

  from_geofence_id: string;
  FromGeofence?: GPSGeofenceData;
  from_geofence_details?: string;

  to_geofence_id: string;
  ToGeofence?: GPSGeofenceData;
  to_geofence_details?: string;

  // processed fields
  duration_seconds_f?: string;
  travel_duration_seconds_f?: string;
  stopped_duration_seconds_f?: string;
  distance_km_f?: string;
}

// ✅ Trip Geofence To Geofence Create/Update Schema
export const TripGeofenceToGeofenceSchema = z.object({
  organisation_id: single_select_mandatory('Organisation ID'),
  vehicle_id: single_select_mandatory('Master Vehicle ID'),
  driver_id: single_select_optional('Driver ID'),
  from_geofence_id: single_select_mandatory('From Geofence ID'),
  to_geofence_id: single_select_mandatory('To Geofence ID'),
  
  from_geofence_exit_date_time: dateMandatory('From Geofence Exit Date Time'),
  to_geofence_enter_date_time: dateMandatory('To Geofence Enter Date Time'),
  duration_seconds: numberMandatory('Duration Seconds'),

  // Optional analytics
  travel_duration_seconds: numberOptional('Travel Duration Seconds'),
  stopped_duration_seconds: numberOptional('Stopped Duration Seconds'),
  distance_meters: doubleOptional('Distance KM'),
  max_speed: numberOptional('Max Speed'),
  avg_speed: numberOptional('Avg Speed'),

  status: enumMandatory('Status', Status, Status.Active),
});
export type TripGeofenceToGeofenceDTO = z.infer<
  typeof TripGeofenceToGeofenceSchema
>;

// ✅ Trip Geofence To Geofence Query Schema
export const TripGeofenceToGeofenceQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('User Organisation IDs'), // ✅ Multi-selection -> UserOrganisation
  vehicle_ids: multi_select_optional('Master Vehicle IDs'), // ✅ Multi-selection -> MasterVehicle
  driver_ids: multi_select_optional('Master Driver IDs'), // ✅ Multi-selection -> Master Driver
  from_geofence_ids: multi_select_optional('From Geofence IDs'), // ✅ Multi-selection -> From Geofence
  to_geofence_ids: multi_select_optional('To Geofence IDs'), // ✅ Multi-selection -> To Geofence
  from_date: dateMandatory('From Date'),
  to_date: dateMandatory('To Date'),
});
export type TripGeofenceToGeofenceQueryDTO = z.infer<
  typeof TripGeofenceToGeofenceQuerySchema
>;

// Payload Converters
export const toTripGeofenceToGeofencePayload = (
  data: TripGeofenceToGeofence
): TripGeofenceToGeofenceDTO => ({
  organisation_id: data.organisation_id,
  vehicle_id: data.vehicle_id,
  driver_id: data.driver_id || '',
  from_geofence_id: data.from_geofence_id,
  to_geofence_id: data.to_geofence_id,
  from_geofence_exit_date_time: data.from_geofence_exit_date_time,
  to_geofence_enter_date_time: data.to_geofence_enter_date_time,
  duration_seconds: data.duration_seconds,
  travel_duration_seconds: data.travel_duration_seconds || 0,
  stopped_duration_seconds: data.stopped_duration_seconds || 0,
  distance_meters: data.distance_meters,
  max_speed: data.max_speed || 0,
  avg_speed: data.avg_speed || 0,
  status: data.status,
});

export const newTripGeofenceToGeofencePayload =
  (): TripGeofenceToGeofenceDTO => ({
    organisation_id: '',
    vehicle_id: '',
    driver_id: '',
    from_geofence_id: '',
    to_geofence_id: '',
    from_geofence_exit_date_time: '',
    to_geofence_enter_date_time: '',
    duration_seconds: 0,
    travel_duration_seconds: 0,
    stopped_duration_seconds: 0,
    distance_meters: 0,
    max_speed: 0,
    avg_speed: 0,
    status: Status.Active,
  });

// API Methods (CRUD)
export const findTripGeofenceToGeofence = async (
  data: TripGeofenceToGeofenceQueryDTO
): Promise<FBR<TripGeofenceToGeofence[]>> => {
  return apiPost(ENDPOINTS.find, data);
};

export const createTripGeofenceToGeofence = async (
  data: TripGeofenceToGeofenceDTO
): Promise<SBR> => {
  return apiPost(ENDPOINTS.create, data);
};

export const updateTripGeofenceToGeofence = async (
  id: string,
  data: TripGeofenceToGeofenceDTO
): Promise<SBR> => {
  return apiPatch(ENDPOINTS.update(id), data);
};

export const deleteTripGeofenceToGeofence = async (
  id: string
): Promise<SBR> => {
  return apiDelete(ENDPOINTS.delete(id));
};
