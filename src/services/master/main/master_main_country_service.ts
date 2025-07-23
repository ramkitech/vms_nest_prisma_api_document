// Axios
import { apiGet, apiPost, apiPatch, apiDelete } from '../../../core/apiCall';
import { SBR, FBR } from '../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  stringMandatory,
  enumMandatory,
  multi_select_optional,
} from '../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../zod_utils/zod_base_schema';

// Enums
import { Status } from '../../../core/Enums';

// Other Models
import { MasterMainCurrency } from '../../../services/master/main/master_main_currency_service';
import { MasterMainTimeZone } from '../../../services/master/main/master_main_timezone_service';
import { MasterMainState } from '../../../services/master/main/master_main_state_service';
import { UserOrganisation } from '../../../services/main/users/user_organisation_service';
//import { MasterMainLandMark } from "@api/services/main/master_main_land_mark_service";

const URL = 'master/main/country';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
  cache: `${URL}/cache`,
  cache_child: `${URL}/cache_child`,
};

// Master Main Country Interface
export interface MasterMainCountry extends Record<string, unknown> {
  // Primary Fields
  country_id: string;
  country_name: string; // Min: 3, Max: 100
  country_code: string; // Min: 2, Max: 10
  country_mobile_code: string; // Min: 2, Max: 10

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Child
  MasterMainCurrency: MasterMainCurrency[];
  MasterMainTimeZone: MasterMainTimeZone[];
  MasterMainState: MasterMainState[];
  UserOrganisation: UserOrganisation[];
  //MasterMainLandMark: MasterMainLandMark[];

  // Count
  _count?: {
    MasterMainCurrency: number;
    MasterMainTimeZone: number;
    MasterMainState: number;
    UserOrganisation: number;
    MasterMainLandMark: number;
  };
}

// ✅ Master Main Country Create/Update Schema
export const MasterMainCountrySchema = z.object({
  country_name: stringMandatory('Country Name', 3, 100),
  country_code: stringMandatory('Country Code', 2, 10),
  country_mobile_code: stringMandatory('Country Mobile Code', 1, 10),
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterMainCountryDTO = z.infer<typeof MasterMainCountrySchema>;

// ✅ Master Main Country Query Schema
export const MasterMainCountryQuerySchema = BaseQuerySchema.extend({
  country_ids: multi_select_optional('Country'), // ✅ Multi-selection -> MasterMainCountry
});
export type MasterMainCountryQueryDTO = z.infer<
  typeof MasterMainCountryQuerySchema
>;

// Convert existing data to a payload structure
export const toMasterMainCountryPayload = (
  country: MasterMainCountry
): MasterMainCountryDTO => ({
  country_name: country.country_name,
  country_code: country.country_code,
  country_mobile_code: country.country_mobile_code,
  status: country.status,
});

// Generate a new payload with default values
export const newMasterMainCountryPayload = (): MasterMainCountryDTO => ({
  country_name: '',
  country_code: '',
  country_mobile_code: '',
  status: Status.Active,
});

// API Methods
export const findMasterMainCountries = async (
  data: MasterMainCountryQueryDTO
): Promise<FBR<MasterMainCountry[]>> => {
  return apiPost<FBR<MasterMainCountry[]>, MasterMainCountryQueryDTO>(
    ENDPOINTS.find,
    data
  );
};

export const createMasterMainCountry = async (
  data: MasterMainCountryDTO
): Promise<SBR> => {
  return apiPost<SBR, MasterMainCountryDTO>(ENDPOINTS.create, data);
};

export const updateMasterMainCountry = async (
  id: string,
  data: MasterMainCountryDTO
): Promise<SBR> => {
  return apiPatch<SBR, MasterMainCountryDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterMainCountry = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// API Cache Methods
export const getMasterMainCountryCache = async (): Promise<
  FBR<MasterMainCountry[]>
> => {
  return apiGet<FBR<MasterMainCountry[]>>(ENDPOINTS.cache);
};

export const getMasterMainCountryCacheChild = async (): Promise<
  FBR<MasterMainCountry[]>
> => {
  return apiGet<FBR<MasterMainCountry[]>>(ENDPOINTS.cache_child);
};
