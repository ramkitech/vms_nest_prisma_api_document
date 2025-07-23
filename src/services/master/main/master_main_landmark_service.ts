// Axios
import { apiPost, apiPatch, apiDelete } from 'apiCall';
import { SBR, FBR } from 'core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  stringMandatory,
  stringOptional,
  doubleOptionalLatLng,
  enumMandatory,
  single_select_mandatory,
  multi_select_optional,
} from 'zod/zod_utils';
import { BaseQuerySchema } from 'zod/zod_base_schema';

// Enums
import { Status } from 'core/Enums';

// Other Models
import { MasterMainState } from 'services/master/main/master_main_state_service';
import { MasterMainCountry } from 'services/master/main/master_main_country_service';

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

// ✅ Master Main Landmark Create/Update Schema
export const MasterMainLandmarkSchema = z.object({
  country_id: single_select_mandatory('Country'), // ✅ Single-selection -> MasterMainCountry
  state_id: single_select_mandatory('State'), // ✅ Single-selection -> MasterMainState
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

// ✅ Master Main Landmark Query Schema
export const MasterMainLandmarkQuerySchema = BaseQuerySchema.extend({
  country_ids: multi_select_optional('Country'), // ✅ Multi-selection -> MasterMainCountry
  state_ids: multi_select_optional('State'), // ✅ Multi-selection -> MasterMainState
  landmark_ids: multi_select_optional('Landmark'), // ✅ Multi-selection -> MasterMainLandmark
});
export type MasterMainLandmarkQueryDTO = z.infer<
  typeof MasterMainLandmarkQuerySchema
>;

// Convert existing data to a payload structure
export const toMasterMainLandmarkPayload = (
  landmark: MasterMainLandmark
): MasterMainLandmarkDTO => ({
  country_id: landmark.country_id,
  state_id: landmark.state_id,
  landmark_name: landmark.landmark_name,
  location: landmark.location,
  google_location: landmark.google_location,
  locality: landmark.locality,
  city_district_town: landmark.city_district_town,
  zip_code: landmark.zip_code,
  latitude: landmark.latitude,
  longitude: landmark.longitude,
  status: landmark.status,
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
