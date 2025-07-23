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
import { UserOrganisation } from '../../../../services/main/users/user_organisation_service';

// URL and Endpoints
const URL = 'gps/features/gps_geofence_data';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
};

// Model Interface
export interface GPSGeofenceData extends Record<string, unknown> {
  gps_geofence_id: string;
  geofence_name: string;
  location_name: string;
  geofence_type: GeofenceType;
  radius_km?: number;
  latitude?: number;
  longitude?: number;
  poliline_data?: GPSGeofencePolilineData[];
  geofence_description?: string;
  geofence_purpose_type: GeofencePurposeType;
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations
  organisation_id: string;
  UserOrganisation?: UserOrganisation;
}

export interface GPSGeofencePolilineData {
  latitude: number;
  longitude: number;
}

// ✅ GPS Geofence Poliline Data Create/Update Schema
export const GPSGeofencePolilineDataSchema = z.object({
  latitude: doubleMandatoryLatLng('latitude'),
  longitude: doubleMandatoryLatLng('longitude'),
});
export type GPSGeofencePolilineDataDTO = z.infer<
  typeof GPSGeofencePolilineDataSchema
>;

// ✅ GPS Geofence Data Create/Update Schema
export const GPSGeofenceDataSchema = z.object({
  organisation_id: single_select_mandatory('Organisation ID'),
  geofence_name: stringMandatory('Geofence Name', 3, 100),
  location_name: stringMandatory('Location Name', 3, 100),
  geofence_type: enumMandatory(
    'Geofence Type',
    GeofenceType,
    GeofenceType.Circle
  ),
  radius_km: doubleOptional('radius_km'),
  latitude: doubleOptionalLatLng('latitude'),
  longitude: doubleOptionalLatLng('longitude'),
  poliline_data: nestedArrayOfObjectsOptional(
    'Polyline Data',
    GPSGeofencePolilineDataSchema,
    []
  ),
  geofence_description: stringOptional('Geofence Description', 0, 500),
  geofence_purpose_type: enumMandatory(
    'Geofence Purpuse Type',
    GeofencePurposeType,
    GeofencePurposeType.TripSourceLocation
  ),
  status: enumMandatory('Status', Status, Status.Active),
});
export type GPSGeofenceDataDTO = z.infer<typeof GPSGeofenceDataSchema>;

// ✅ GPS Geofence Data Query Schema
export const GPSGeofenceDataQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('User Organisation IDs'), // ✅ Multi-selection -> UserOrganisation
  geofence_type: enumArrayOptional(
    'Geofence Type',
    GeofenceType,
    getAllEnums(GeofenceType)
  ),
  geofence_purpose_type: enumArrayOptional(
    'Geofence Purpose Type',
    GeofencePurposeType,
    getAllEnums(GeofencePurposeType)
  ),
});
export type GPSGeofenceDataQueryDTO = z.infer<
  typeof GPSGeofenceDataQuerySchema
>;

// Payload Conversions
export const toGPSGeofenceDataPayload = (
  data: GPSGeofenceData
): GPSGeofenceDataDTO => ({
  organisation_id: data.organisation_id,
  geofence_name: data.geofence_name,
  location_name: data.location_name,
  geofence_type: data.geofence_type,
  radius_km: data.radius_km,
  latitude: data.latitude,
  longitude: data.longitude,
  poliline_data: data.poliline_data ?? [],
  geofence_description: data.geofence_description ?? '',
  geofence_purpose_type: data.geofence_purpose_type,
  status: data.status,
});

export const newGPSGeofenceDataPayload = (): GPSGeofenceDataDTO => ({
  organisation_id: '',
  geofence_name: '',
  location_name: '',
  geofence_type: GeofenceType.Circle,
  radius_km: 0,
  latitude: 0,
  longitude: 0,
  poliline_data: [],
  geofence_description: '',
  geofence_purpose_type: GeofencePurposeType.TripSourceLocation,
  status: Status.Active,
});

// 8. ✅ API Methods (CRUD)
export const findGPSGeofenceData = async (
  data: GPSGeofenceDataQueryDTO
): Promise<FBR<GPSGeofenceData[]>> => {
  return apiPost(ENDPOINTS.find, data);
};

export const createGPSGeofenceData = async (
  data: GPSGeofenceDataDTO
): Promise<SBR> => {
  return apiPost(ENDPOINTS.create, data);
};

export const updateGPSGeofenceData = async (
  id: string,
  data: GPSGeofenceDataDTO
): Promise<SBR> => {
  return apiPatch(ENDPOINTS.update(id), data);
};

export const deleteGPSGeofenceData = async (id: string): Promise<SBR> => {
  return apiDelete(ENDPOINTS.delete(id));
};
