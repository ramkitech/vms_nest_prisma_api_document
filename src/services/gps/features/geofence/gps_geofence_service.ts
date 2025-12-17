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
import { OrganisationNotificationPreferenceGeofenceLink } from 'src/services/account/notification_preferences.service';
import { GPSGeofenceTransaction } from './gps_geofence_transaction_service';
import { GPSGeofenceTransactionSummary } from './gps_geofence_transaction_summary_service';
import { TripGeofenceToGeofence } from './trip_geofence_to_geofence_service';

const URL = 'gps/features/gps_geofence';

const ENDPOINTS = {
  // GPSGeofence APIs
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
};

// GPSGeofence Interface
export interface GPSGeofence extends Record<string, unknown> {
  // Primary Fields
  gps_geofence_id: string;

  // Main Field Details
  geofence_name: string;
  geofence_purpose_type: GeofencePurposeType;
  geofence_description?: string;

  geofence_type: GeofenceType;
  radius_m?: number;
  radius_km?: number;
  latitude?: number;
  longitude?: number;
  poliline_data?: GPSGeofencePolilineData[];

  // Address
  address_line1?: string;
  address_line2?: string;
  locality_landmark?: string;
  neighborhood?: string;
  town_city?: string;
  district_county?: string;
  state_province_region?: string;
  postal_code?: string;
  country?: string;
  country_code?: string;

  google_location?: string;

  // Join data
  geofence_details?: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent
  organisation_id: string;
  UserOrganisation?: UserOrganisation;
  organisation_name?: string;

  // Relations - Child
  // Child - GPS
  GPSGeofenceTransaction?: GPSGeofenceTransaction[]
  GPSGeofenceTransactionSummary?: GPSGeofenceTransactionSummary[]
  FromGeofence?: TripGeofenceToGeofence[]
  ToGeofence?: TripGeofenceToGeofence[]
  OrganisationNotificationPreferenceGeofenceLink?: OrganisationNotificationPreferenceGeofenceLink[]

  // Relations - Child Count
  _count?: {
    GPSGeofenceTransaction?: number;
    GPSGeofenceTransactionSummary?: number;
    FromGeofence?: number;
    ToGeofence?: number;
    OrganisationNotificationPreferenceGeofenceLink?: number;
  };
}

export interface GPSGeofencePolilineData {
  latitude: number;
  longitude: number;
}

// GPSGeofenceSchema Poliline Data Create/Update Schema
export const GPSGeofencePolilineDataSchema = z.object({
  latitude: doubleMandatoryLatLng('latitude'),
  longitude: doubleMandatoryLatLng('longitude'),
});
export type GPSGeofencePolilineDataDTO = z.infer<
  typeof GPSGeofencePolilineDataSchema
>;

// GPSGeofenceSchema Create/Update Schema
export const GPSGeofenceSchema = z.object({
  // Relations - Parent
  organisation_id: single_select_mandatory('UserOrganisation'),

  // Main Field Details
  geofence_name: stringMandatory('Geofence Name', 3, 100),
  geofence_purpose_type: enumMandatory(
    'Geofence Purpuse Type',
    GeofencePurposeType,
    GeofencePurposeType.TripSourceLocation,
  ),
  geofence_description: stringOptional('Geofence Description', 0, 500),

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

  // Address Details
  address_line1: stringOptional('Address Line 1', 0, 150),
  address_line2: stringOptional('Address Line 2', 0, 150),
  locality_landmark: stringOptional('Locality / Landmark', 0, 150),
  neighborhood: stringOptional('Neighborhood', 0, 100),
  town_city: stringOptional('Town / City', 0, 100),
  district_county: stringOptional('District / County', 0, 100),
  state_province_region: stringOptional('State / Province / Region', 0, 100),
  postal_code: stringOptional('Postal Code', 0, 20),
  country: stringOptional('Country', 0, 100),
  country_code: stringOptional('Country Code', 0, 5),

  google_location: stringOptional('Google Location', 0, 100),

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),
});
export type GPSGeofenceDTO = z.infer<typeof GPSGeofenceSchema>;

// GPS Geofence Data Query Schema
export const GPSGeofenceQuerySchema = BaseQuerySchema.extend({
  // Self Table
  gps_geofence_ids: multi_select_optional('GPSGeofence'), // Multi-selection -> GPSGeofence

  // Relations - Parent
  organisation_ids: multi_select_optional('UserOrganisation'), // Multi-selection -> UserOrganisation

  // Enums
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
});
export type GPSGeofenceQueryDTO = z.infer<typeof GPSGeofenceQuerySchema>;

// Convert GPSGeofence Data to API Payload
export const toGPSGeofencePayload = (row: GPSGeofence): GPSGeofenceDTO => ({
  organisation_id: row.organisation_id || '',

  geofence_name: row.geofence_name || '',
  geofence_description: row.geofence_description || '',
  geofence_purpose_type: row.geofence_purpose_type || GeofencePurposeType.TripSourceLocation,

  geofence_type: row.geofence_type || GeofenceType.Circle,
  radius_m: row.radius_m || 0,
  radius_km: row.radius_km || 0,
  latitude: row.latitude || 0,
  longitude: row.longitude || 0,
  poliline_data: row.poliline_data || [],

  address_line1: row.address_line1 || '',
  address_line2: row.address_line2 || '',
  locality_landmark: row.locality_landmark || '',
  neighborhood: row.neighborhood || '',
  town_city: row.town_city || '',
  district_county: row.district_county || '',
  state_province_region: row.state_province_region || '',
  postal_code: row.postal_code || '',
  country: row.country || '',
  country_code: row.country_code || '',
  google_location: row.google_location || '',

  status: row.status || Status.Active,
});

// Create New GPSGeofence Payload
export const newGPSGeofencePayload = (): GPSGeofenceDTO => ({
  organisation_id: '',
  
  geofence_name: '',
  geofence_purpose_type: GeofencePurposeType.TripSourceLocation,
  geofence_description: '',

  geofence_type: GeofenceType.Circle,
  radius_m: 0,
  radius_km: 0,
  latitude: 0,
  longitude: 0,
  poliline_data: [],

  address_line1: '',
  address_line2: '',
  locality_landmark: '',
  neighborhood: '',
  town_city: '',
  district_county: '',
  state_province_region: '',
  postal_code: '',
  country: '',
  country_code: '',

  google_location: '',

  status: Status.Active,
});

// GPSGeofence APIs
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
