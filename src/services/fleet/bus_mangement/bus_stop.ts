// Axios
import { apiGet, apiPost, apiPatch, apiDelete } from '../../../core/apiCall';
import { SBR, FBR } from '../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  stringMandatory,
  stringOptional,
  single_select_mandatory,
  multi_select_optional,
  enumMandatory,
  enumArrayOptional,
  doubleOptional,
  doubleOptionalLatLng,
  doubleMandatoryLatLng,
  nestedArrayOfObjectsOptional,
  numberOptional,
  getAllEnums,
  multi_select_mandatory,
} from '../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../zod_utils/zod_base_schema';

// Enums
import { BusStopType, GeofenceType, Status } from '../../../core/Enums';

// Other Models
import { UserOrganisation } from '../../main/users/user_organisation_service';
import { OrganisationBranch } from 'src/services/master/organisation/organisation_branch_service';
import { MasterRouteStop } from './master_route';

const URL = 'bus_stop';

const ENDPOINTS = {
  // BusStop APIs
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  remove: (id: string): string => `${URL}/${id}`,

  // DASHBOARD
   bus_dashboard: `${URL}/bus_dashboard`,
};

// BusStopPolygonData Interface
export interface BusStopPolygonData {
  latitude: number;
  longitude: number;
}

// BusStop Interface
export interface BusStop extends Record<string, unknown> {
  // Primary Fields
  bus_stop_id: string;

  // Basic Info
  stop_name: string;
  stop_type: BusStopType;
  stop_description?: string;

  // Geofence Info
  geofence_type: GeofenceType;
  radius_m?: number;
  radius_km?: number;
  latitude?: number;
  longitude?: number;
  poliline_data?: BusStopPolygonData[];

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

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent
  organisation_id: string;
  UserOrganisation?: UserOrganisation;
  organisation_name?: string;
  organisation_code?: string;

  organisation_branch_id?: string;
  OrganisationBranch?: OrganisationBranch;

  // Relations - Child
  MasterRouteStop?: MasterRouteStop[];

  // Relations - Child Count
  _count?: {
    MasterRouteStop?: number;
  };
}

export interface BusDashboard {
    main_counts: {
        bus_stops: number;
        bus_routes: number;
        bus_schedules: number;
    };
}

// BusStop Polygon Data Create/Update Schema
export const BusStopPolygonDataSchema = z.object({
  latitude: doubleMandatoryLatLng('latitude'),
  longitude: doubleMandatoryLatLng('longitude'),
});
export type BusStopPolygonDataDTO = z.infer<typeof BusStopPolygonDataSchema>;

// BusStop Create/Update Schema
export const BusStopSchema = z.object({
  // Relations - Parent
  organisation_id: single_select_mandatory('UserOrganisation'), // Single-Selection -> UserOrganisation
  organisation_branch_id: single_select_mandatory('OrganisationBranch'), // Single-Selection -> OrganisationBranch

  // Basic Info
  stop_name: stringMandatory('Stop Name', 3, 100),
  stop_type: enumMandatory(
    'Stop Type',
    BusStopType,
    BusStopType.CommonPickupPoint,
  ),
  stop_description: stringOptional('Stop Description', 0, 2000),

  // Geofence Info
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
    BusStopPolygonDataSchema,
    [],
  ),

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

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),
});
export type BusStopDTO = z.infer<typeof BusStopSchema>;

// BusStop Query Schema
export const BusStopQuerySchema = BaseQuerySchema.extend({
  // Self Table
  bus_stop_ids: multi_select_optional('BusStop'), // Multi-selection -> BusStop

  // Relations - Parent
  organisation_ids: multi_select_optional('UserOrganisation'), // Multi-selection -> UserOrganisation
  organisation_branch_ids: multi_select_optional('OrganisationBranch'), // Multi-selection -> OrganisationBranch

  // Enums
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

// BusDashBoard Query Schema
export const BusDashBoardQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_mandatory('UserOrganisation'), // Multi-Selection -> UserOrganisation
  organisation_branch_ids: multi_select_mandatory('OrganisationBranch'), // Multi-Selection -> OrganisationBranch
});
export type BusDashBoardQueryDTO = z.infer<typeof BusDashBoardQuerySchema>;

// Convert BusStop Data to API Payload
export const toBusStopPayload = (row: BusStop): BusStopDTO => ({
  organisation_id: row.organisation_id || '',
  organisation_branch_id: row.organisation_branch_id || '',

  stop_name: row.stop_name || '',
  stop_type: row.stop_type || BusStopType.CommonPickupPoint,
  stop_description: row.stop_description || '',

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

// Create New BusStop Payload
export const newBusStopPayload = (): BusStopDTO => ({
  organisation_id: '',
  organisation_branch_id: '',

  stop_name: '',
  stop_type: BusStopType.CommonPickupPoint,
  stop_description: '',

  geofence_type: GeofenceType.Circle,
  latitude: 0,
  longitude: 0,
  radius_m: 0,
  radius_km: 0,
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

// BusStop APIs
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

export const bus_dashboard = async (data: BusDashBoardQueryDTO,): Promise<FBR<BusDashboard[]>> => {
    return apiPost<FBR<BusDashboard[]>, BusDashBoardQueryDTO>(ENDPOINTS.bus_dashboard, data);
};
