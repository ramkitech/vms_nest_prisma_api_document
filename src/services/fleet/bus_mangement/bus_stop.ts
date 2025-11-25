// Axios
import { apiGet, apiPost, apiPatch, apiDelete } from '../../../core/apiCall';
import { SBR, FBR } from '../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  stringMandatory,
  stringOptional,
  single_select_mandatory,
  single_select_optional,
  multi_select_optional,
  enumMandatory,
  enumArrayOptional,
  doubleOptional,
  doubleOptionalLatLng,
  doubleMandatoryLatLng,
  nestedArrayOfObjectsOptional,
  numberOptional,
  getAllEnums,
} from '../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../zod_utils/zod_base_schema';

// Enums
import { BusStopType, GeofenceType, Status } from '../../../core/Enums';

// Other Models
import { UserOrganisation } from '../../main/users/user_organisation_service';
import { OrganisationBranch } from 'src/services/master/organisation/organisation_branch_service';
import { MasterRouteStop } from './master_route';

// --------------------------------------------------------------
// URL & ENDPOINTS
// --------------------------------------------------------------
const URL = 'bus_stop';

const ENDPOINTS = {
  create: URL,
  find: `${URL}/search`,
  update: (id: string): string => `${URL}/${id}`,
  remove: (id: string): string => `${URL}/${id}`,
};

// --------------------------------------------------------------
// Interfaces
// --------------------------------------------------------------

// ✅ Polygon Data Interface
export interface BusStopPolygonData {
  latitude: number;
  longitude: number;
}

// ✅ BusStop Interface
export interface BusStop extends Record<string, unknown> {
  // Primary Fields
  bus_stop_id: string;

  // Basic Info
  stop_name: string;
  stop_code?: string;
  stop_type: BusStopType;
  stop_description?: string;
  stop_duration_seconds?: number;

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

  // Location
  google_location?: string;
  geofence_type: GeofenceType;
  stop_latitude?: number;
  stop_longitude?: number;
  radius_meters?: number;
  radius_km?: number;
  polygon_data?: BusStopPolygonData[];

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations
  organisation_id: string;
  UserOrganisation?: UserOrganisation;

  organisation_branch_id?: string;
  OrganisationBranch?: OrganisationBranch;

  MasterRouteStop: MasterRouteStop[];

  // ✅ Count (Child Relations)
  _count?: {
    MasterRouteStop: number;
  };
}

// --------------------------------------------------------------
// Zod Schemas
// --------------------------------------------------------------

// ✅ BusStop Polygon Data Create/Update Schema
export const BusStopPolygonDataSchema = z.object({
  latitude: doubleMandatoryLatLng('latitude'),
  longitude: doubleMandatoryLatLng('longitude'),
});
export type BusStopPolygonDataDTO = z.infer<typeof BusStopPolygonDataSchema>;

// ✅ BusStop Create/Update Schema
export const BusStopSchema = z.object({
  organisation_id: single_select_mandatory('UserOrganisation'), // ✅ Single-Selection -> UserOrganisation
  organisation_branch_id: single_select_optional('OrganisationBranch'), // ✅ Single-Selection -> OrganisationBranch

  // Basic Info
  stop_name: stringMandatory('Stop Name', 3, 120),
  stop_code: stringOptional('Stop Code', 0, 50),
  stop_type: enumMandatory('Stop Type', BusStopType, BusStopType.FixedStop),
  stop_description: stringOptional('Stop Description', 0, 2000),
  stop_duration_seconds: numberOptional('Stop Duration Seconds'),

  // Address
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

  google_location: stringOptional('Google Location', 0, 500),

  geofence_type: enumMandatory(
    'Geofence Type',
    GeofenceType,
    GeofenceType.Circle,
  ),
  stop_latitude: doubleOptionalLatLng('Stop Latitude'),
  stop_longitude: doubleOptionalLatLng('Stop Longitude'),
  radius_meters: doubleOptional('Radius Meters'),
  radius_km: doubleOptional('Radius KM'),
  polygon_data: nestedArrayOfObjectsOptional(
    'Polygon Data',
    BusStopPolygonDataSchema,
    [],
  ),

  status: enumMandatory('Status', Status, Status.Active),
});
export type BusStopDTO = z.infer<typeof BusStopSchema>;

// ✅ BusStop Query Schema
export const BusStopQuerySchema = BaseQuerySchema.extend({
  bus_stop_ids: multi_select_optional('BusStop'), // ✅ Multi-selection -> BusStop

  organisation_ids: multi_select_optional('UserOrganisation'), // ✅ Multi-selection -> UserOrganisation
  organisation_branch_ids: multi_select_optional('OrganisationBranch'), // ✅ Multi-selection -> OrganisationBranch

  stop_type: enumArrayOptional(
    'Stop Type',
    BusStopType,
    getAllEnums(BusStopType),
  ),
  geofence_type: enumArrayOptional(
    'Geofence Type',
    GeofenceType,
    getAllEnums(GeofenceType),
  ),
});
export type BusStopQueryDTO = z.infer<typeof BusStopQuerySchema>;

// --------------------------------------------------------------
// Payload Helpers
// --------------------------------------------------------------

// Convert existing data to DTO
export const toBusStopPayload = (row: BusStop): BusStopDTO => ({
  organisation_id: row.organisation_id || '',
  organisation_branch_id: row.organisation_branch_id || '',

  stop_name: row.stop_name || '',
  stop_code: row.stop_code || '',
  stop_type: row.stop_type || BusStopType.FixedStop,
  stop_description: row.stop_description || '',
  stop_duration_seconds: row.stop_duration_seconds || 0,

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

  geofence_type: row.geofence_type || GeofenceType.Circle,
  stop_latitude: row.stop_latitude || 0,
  stop_longitude: row.stop_longitude || 0,
  radius_meters: row.radius_meters || 0,
  radius_km: row.radius_km || 0,
  polygon_data: row.polygon_data || [],
  status: row.status,
});

// New payload with default values
export const newBusStopPayload = (): BusStopDTO => ({
  organisation_id: '',
  organisation_branch_id: '',

  stop_name: '',
  stop_code: '',
  stop_type: BusStopType.FixedStop,
  stop_description: '',
  stop_duration_seconds: 0,

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

  geofence_type: GeofenceType.Circle,
  stop_latitude: 0,
  stop_longitude: 0,
  radius_meters: 0,
  radius_km: 0,
  polygon_data: [],
  status: Status.Active,
});

// --------------------------------------------------------------
// API Methods
// --------------------------------------------------------------
export const findBusStop = async (data: BusStopQueryDTO): Promise<FBR<BusStop[]>> => {
  return apiPost<FBR<BusStop[]>, BusStopQueryDTO>(ENDPOINTS.find, data);
};

export const createBusStop = async (data: BusStopDTO): Promise<SBR> => {
  return apiPost<SBR, BusStopDTO>(ENDPOINTS.create, data);
};

export const updateBusStop = async (id: string, data: BusStopDTO): Promise<SBR> => {
  return apiPatch<SBR, BusStopDTO>(ENDPOINTS.update(id), data);
};

export const deleteBusStop = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.remove(id));
};
