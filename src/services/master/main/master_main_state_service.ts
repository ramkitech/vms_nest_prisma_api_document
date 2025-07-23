// Axios
import { apiGet, apiPost, apiPatch, apiDelete } from '../../../core/apiCall';
import { SBR, FBR } from '../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  stringMandatory,
  stringOptional,
  enumMandatory,
  single_select_mandatory,
  multi_select_optional,
} from '../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../zod_utils/zod_base_schema';

// Enums
import { Status } from '../../../core/Enums';

// Other Models
import { MasterMainCountry } from '../../../services/master/main/master_main_country_service';
import { UserOrganisation } from '../../../services/main/users/user_organisation_service';
//import { MasterMainLandMark } from "@api/services/master/main/master_main_landmark_service";

const URL = 'master/main/state';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
  cache: (country_id: string): string =>
    `${URL}/cache?country_id=${country_id}`,
};

// Master Main State Interface
export interface MasterMainState extends Record<string, unknown> {
  // Primary Fields
  state_id: string;
  state_name: string; // Min: 3, Max: 100
  state_code?: string; // Optional, Max: 10

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations
  country_id: string;
  MasterMainCountry?: MasterMainCountry;

  // Relations - Child
  UserOrganisation: UserOrganisation[];
  //MasterMainLandMark: MasterMainLandMark[];

  // Count
  _count?: {
    UserOrganisation: number;
    MasterMainLandMark: number;
  };
}

// ✅ Master Main State Create/Update Schema
export const MasterMainStateSchema = z.object({
  country_id: single_select_mandatory('Country'), // ✅ Single-selection -> MasterMainCountry
  state_name: stringMandatory('State Name', 3, 100),
  state_code: stringOptional('State Code', 0, 10),
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterMainStateDTO = z.infer<typeof MasterMainStateSchema>;

// ✅ Master Main State Query Schema
export const MasterMainStateQuerySchema = BaseQuerySchema.extend({
  country_ids: multi_select_optional('Country'), // ✅ Multi-selection -> MasterMainCountry
  state_ids: multi_select_optional('State'), // ✅ Multi-selection -> MasterMainState
});
export type MasterMainStateQueryDTO = z.infer<
  typeof MasterMainStateQuerySchema
>;

// Convert existing data to a payload structure
export const toMasterMainStatePayload = (
  state: MasterMainState
): MasterMainStateDTO => ({
  country_id: state.country_id,
  state_name: state.state_name,
  state_code: state.state_code ?? '',
  status: state.status,
});

// Generate a new payload with default values
export const newMasterMainStatePayload = (): MasterMainStateDTO => ({
  country_id: '',
  state_name: '',
  state_code: '',
  status: Status.Active,
});

// API Methods
export const findMasterMainStates = async (
  data: MasterMainStateQueryDTO
): Promise<FBR<MasterMainState[]>> => {
  return apiPost<FBR<MasterMainState[]>, MasterMainStateQueryDTO>(
    ENDPOINTS.find,
    data
  );
};

export const createMasterMainState = async (
  data: MasterMainStateDTO
): Promise<SBR> => {
  return apiPost<SBR, MasterMainStateDTO>(ENDPOINTS.create, data);
};

export const updateMasterMainState = async (
  id: string,
  data: MasterMainStateDTO
): Promise<SBR> => {
  return apiPatch<SBR, MasterMainStateDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterMainState = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// API Cache Methods
export const getMasterMainStateCache = async (
  country_id: string
): Promise<FBR<MasterMainState[]>> => {
  return apiGet<FBR<MasterMainState[]>>(ENDPOINTS.cache(country_id));
};
