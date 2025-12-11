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
import { MasterMainCountry } from '../../../services/master/main/master_main_country_service';

const URL = 'master/main/landmark';

const ENDPOINTS = {
  // MasterMainLandmark APIs
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
};

// MasterMainLandMark Interface
export interface MasterMainLandMark extends Record<string, unknown> {
  // Primary Fields
  landmark_id: string;

  landmark_name: string;
  location: string;
  locality: string;
  city_district_town: string;
  zip_code: string;

  latitude: number;
  longitude: number;
  google_location: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent
  country_id?: string;
  MasterMainCountry?: MasterMainCountry;
}

// MasterMainLandmark Create/Update Schema
export const MasterMainLandmarkSchema = z.object({
  country_id: single_select_mandatory('MasterMainCountry'), // Single-Selection -> MasterMainCountry

  landmark_name: stringMandatory('Landmark Name', 3, 100),
  location: stringOptional('Location', 0, 100),
  locality: stringOptional('Locality', 0, 100),
  city_district_town: stringOptional('City/District/Town', 0, 100),
  zip_code: stringOptional('Zip Code', 0, 10),

  latitude: doubleOptionalLatLng('Latitude'),
  longitude: doubleOptionalLatLng('Longitude'),
  google_location: stringOptional('Google Location', 0, 100),

  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterMainLandmarkDTO = z.infer<typeof MasterMainLandmarkSchema>;

// MasterMainLandmark Query Schema
export const MasterMainLandmarkQuerySchema = BaseQuerySchema.extend({
  landmark_ids: multi_select_optional('MasterMainLandmark'), // Multi-selection -> MasterMainLandmark

  country_ids: multi_select_optional('MasterMainCountry'), // Multi-selection -> MasterMainCountry
});
export type MasterMainLandmarkQueryDTO = z.infer<
  typeof MasterMainLandmarkQuerySchema
>;

// Convert MasterMainLandmark Data to API Payload
export const toMasterMainLandmarkPayload = (row: MasterMainLandMark): MasterMainLandmarkDTO => ({
  country_id: row.country_id || '',

  landmark_name: row.landmark_name || '',
  location: row.location || '',
  locality: row.locality || '',
  city_district_town: row.city_district_town || '',
  zip_code: row.zip_code || '',

  google_location: row.google_location || '',
  latitude: row.latitude || 0,
  longitude: row.longitude || 0,

  status: row.status || Status.Active,
});

// Create New MasterMainLandmark Payload
export const newMasterMainLandmarkPayload = (): MasterMainLandmarkDTO => ({
  country_id: '',

  landmark_name: '',
  location: '',
  locality: '',
  city_district_town: '',
  zip_code: '',

  google_location: '',
  latitude: 0,
  longitude: 0,

  status: Status.Active,
});

// MasterMainLandmark APIs
export const findMasterMainCountries = async (data: MasterMainLandmarkQueryDTO): Promise<FBR<MasterMainLandMark[]>> => {
  return apiPost<FBR<MasterMainLandMark[]>, MasterMainLandmarkQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterMainCountry = async (data: MasterMainLandmarkDTO): Promise<SBR> => {
  return apiPost<SBR, MasterMainLandmarkDTO>(ENDPOINTS.create, data);
};

export const updateMasterMainCountry = async (id: string, data: MasterMainLandmarkDTO): Promise<SBR> => {
  return apiPatch<SBR, MasterMainLandmarkDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterMainCountry = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};
