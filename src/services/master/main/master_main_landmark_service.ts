// Axios
import { apiPost, apiPatch, apiDelete } from '../../../core/apiCall';
import { SBR, FBR } from '../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  stringMandatory,
  stringOptional,
  doubleOptionalLatLng,
  enumMandatory,
  single_select_mandatory,
  multi_select_optional,
} from '../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../zod_utils/zod_base_schema';

// Enums
import { Status } from '../../../core/Enums';

// Other Models
import { MasterMainState } from '../../../services/master/main/master_main_state_service';
import { MasterMainCountry } from '../../../services/master/main/master_main_country_service';

const URL = 'master/main/landmark';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
};

// Master Main Country Interface
export interface MasterMainLandmark extends Record<string, unknown> {
  // Primary Fields
  landmark_id: string;
  landmark_name: string; // Min: 3, Max: 100

  location: string; // Min: 2, Max: 100
  locality: string; // Min: 2, Max: 100
  city_district_town: string; // Min: 2, Max: 100
  zip_code: string; // Min: 2, Max: 10

  latitude: number;
  longitude: number;
  google_location: string; // Min: 2, Max: 100

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations
  country_id: string;
  MasterMainCountry?: MasterMainCountry;

  state_id: string;
  MasterMainState?: MasterMainState;

  // Relations - Child
  //VehicleDetailGPS: VehicleDetailGPS[];

  // Count
  _count?: {
    VehicleDetailGPS: number;
  };
}

// ✅ MasterMainLandmark Create/Update Schema
export const MasterMainLandmarkSchema = z.object({
  country_id: single_select_mandatory('MasterMainCountry'), // ✅ Single-Selection -> MasterMainCountry
  state_id: single_select_mandatory('MasterMainState'), // ✅ Single-Selection -> MasterMainState
  landmark_name: stringMandatory('Landmark Name', 3, 100),
  location: stringOptional('Location', 0, 100),
  google_location: stringOptional('Google Location', 0, 100),
  locality: stringOptional('Locality', 0, 100),
  city_district_town: stringOptional('City/District/Town', 0, 100),
  zip_code: stringOptional('Zip Code', 0, 10),
  latitude: doubleOptionalLatLng('Latitude'),
  longitude: doubleOptionalLatLng('Longitude'),
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterMainLandmarkDTO = z.infer<typeof MasterMainLandmarkSchema>;

// ✅ MasterMainLandmark Query Schema
export const MasterMainLandmarkQuerySchema = BaseQuerySchema.extend({
  country_ids: multi_select_optional('MasterMainCountry'), // ✅ Multi-selection -> MasterMainCountry
  state_ids: multi_select_optional('MasterMainState'), // ✅ Multi-selection -> MasterMainState
  landmark_ids: multi_select_optional('MasterMainLandmark'), // ✅ Multi-selection -> MasterMainLandmark
});
export type MasterMainLandmarkQueryDTO = z.infer<
  typeof MasterMainLandmarkQuerySchema
>;

// Convert existing data to a payload structure
export const toMasterMainLandmarkPayload = (row: MasterMainLandmark): MasterMainLandmarkDTO => ({
  country_id: row.country_id,
  state_id: row.state_id,
  landmark_name: row.landmark_name,
  location: row.location,
  google_location: row.google_location,
  locality: row.locality,
  city_district_town: row.city_district_town,
  zip_code: row.zip_code,
  latitude: row.latitude,
  longitude: row.longitude,
  status: row.status,
});

// Generate a new payload with default values
export const newMasterMainLandmarkPayload = (): MasterMainLandmarkDTO => ({
  country_id: '',
  state_id: '',
  landmark_name: '',
  location: '',
  google_location: '',
  locality: '',
  city_district_town: '',
  zip_code: '',
  latitude: 0,
  longitude: 0,
  status: Status.Active,
});

// API Methods
export const findMasterMainCountries = async (
  data: MasterMainLandmarkQueryDTO
): Promise<FBR<MasterMainLandmark[]>> => {
  return apiPost<FBR<MasterMainLandmark[]>, MasterMainLandmarkQueryDTO>(
    ENDPOINTS.find,
    data
  );
};

export const createMasterMainCountry = async (
  data: MasterMainLandmarkDTO
): Promise<SBR> => {
  return apiPost<SBR, MasterMainLandmarkDTO>(ENDPOINTS.create, data);
};

export const updateMasterMainCountry = async (
  id: string,
  data: MasterMainLandmarkDTO
): Promise<SBR> => {
  return apiPatch<SBR, MasterMainLandmarkDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterMainCountry = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};
