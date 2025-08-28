// Axios
import { apiPost, apiPatch, apiDelete } from '../../../../core/apiCall';
import { SBR, FBR } from '../../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  stringMandatory,
  stringOptional,
  enumMandatory,
  enumArrayOptional,
  multi_select_optional,
  single_select_mandatory,
  doubleOptional,
  doubleMandatoryLatLng,
  nestedArrayOfObjectsOptional,
  getAllEnums,
  doubleOptionalLatLng,
} from '../../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../../zod_utils/zod_base_schema';

// Enums
import { Status, GeofenceType, GeofencePurposeType } from '../../../../core/Enums';

// Other Models
import { UserOrganisation } from '../../../main/users/user_organisation_service';

// URL and Endpoints
const URL = 'gps/features/gps_geofence';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
};

// Model Interface
export interface GPSGeofence extends Record<string, unknown> {
  gps_geofence_id: string;
  geofence_name: string;
  geofence_purpose_type: GeofencePurposeType;
  geofence_description?: string;
  geofence_location: string;

  geofence_type: GeofenceType;
  radius_m?: number;
  radius_km?: number;
  latitude?: number;
  longitude?: number;
  poliline_data?: GPSGeofencePolilineData[];
  
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  geofence_details?: String;

  // Relations
  organisation_id: string;
  UserOrganisation?: UserOrganisation;
}

export interface GPSGeofencePolilineData {
  latitude: number;
  longitude: number;
}

// ✅ GPSGeofenceSchema Poliline Data Create/Update Schema
export const GPSGeofencePolilineDataSchema = z.object({
  latitude: doubleMandatoryLatLng('latitude'),
  longitude: doubleMandatoryLatLng('longitude'),
});
export type GPSGeofencePolilineDataDTO = z.infer<
  typeof GPSGeofencePolilineDataSchema
>;

// ✅ GPSGeofenceSchema Create/Update Schema
export const GPSGeofenceSchema = z.object({
  organisation_id: single_select_mandatory('UserOrganisation'),

  geofence_name: stringMandatory('Geofence Name', 3, 100),
  geofence_location: stringMandatory('Geofence Location', 3, 200),
  geofence_description: stringOptional('Geofence Description', 0, 500),
  geofence_purpose_type: enumMandatory(
    'Geofence Purpuse Type',
    GeofencePurposeType,
    GeofencePurposeType.TripSourceLocation,
  ),

  geofence_type: enumMandatory(
    'Geofence Type',
    GeofenceType,
    GeofenceType.Circle,
  ),
  radius_km: doubleOptional('radius_km'),
  radius_m: doubleOptional('radius_m'),
  latitude: doubleOptionalLatLng('latitude'),
  longitude: doubleOptionalLatLng('longitude'),
  poliline_data: nestedArrayOfObjectsOptional(
    'Polyline Data',
    GPSGeofencePolilineDataSchema,
    [],
  ),

  status: enumMandatory('Status', Status, Status.Active),
});
export type GPSGeofenceDTO = z.infer<typeof GPSGeofenceSchema>;

// ✅ GPSGeofence Query Schema
export const GPSGeofenceQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('UserOrganisation'), // ✅ Multi-selection -> UserOrganisation
  geofence_purpose_type: enumArrayOptional(
    'Geofence Purpose Type',
    GeofencePurposeType,
    getAllEnums(GeofencePurposeType),
  ),
  geofence_type: enumArrayOptional(
    'Geofence Type',
    GeofenceType,
    getAllEnums(GeofenceType),
  ),
  gps_geofence_ids: multi_select_optional('GPSGeofence'), // ✅ Multi-selection -> GPSGeofence
});
export type GPSGeofenceQueryDTO = z.infer<typeof GPSGeofenceQuerySchema>;

// Payload Conversions
export const toGPSGeofencePayload = (
  data: GPSGeofence
): GPSGeofenceDTO => ({
  organisation_id: data.organisation_id,
  geofence_name: data.geofence_name,
  geofence_location: data.geofence_location,
  geofence_description: data.geofence_description ?? '',
  geofence_purpose_type: data.geofence_purpose_type,

  geofence_type: data.geofence_type,
  radius_m: data.radius_m,
  radius_km: data.radius_km,
  latitude: data.latitude,
  longitude: data.longitude,
  poliline_data: data.poliline_data ?? [],
  
  status: data.status,
});

export const newGPSGeofencePayload = (): GPSGeofenceDTO => ({
  organisation_id: '',
  geofence_name: '',
  geofence_location: '',
  geofence_description: '',
  geofence_purpose_type: GeofencePurposeType.TripSourceLocation,

  geofence_type: GeofenceType.Circle,
  radius_m: 0,
  radius_km: 0,
  latitude: 0,
  longitude: 0,
  poliline_data: [],
  
  status: Status.Active,
});

// API Methods
export const findGPSGeofence = async (data: GPSGeofenceQueryDTO): Promise<FBR<GPSGeofence[]>> => {
  return apiPost<FBR<GPSGeofence[]>, GPSGeofenceQueryDTO>(ENDPOINTS.find, data);
};

export const createGPSGeofence = async (data: GPSGeofenceDTO): Promise<SBR> => {
  return apiPost<SBR, GPSGeofenceDTO>(ENDPOINTS.create, data);
};

export const updateGPSGeofence = async (id: string, data: GPSGeofenceDTO): Promise<SBR> => {
  return apiPatch<SBR, GPSGeofenceDTO>(ENDPOINTS.update(id), data);
};

export const deleteGPSGeofence = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};
