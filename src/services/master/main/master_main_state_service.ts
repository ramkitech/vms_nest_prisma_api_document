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
  // MasterMainState APIs
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,

  // Cache APIs
  cache: (country_id: string): string => `${URL}/cache?country_id=${country_id}`,
};

// MasterMainState Interface
export interface MasterMainState extends Record<string, unknown> {
  // Primary Fields
  state_id: string;

  // Main Field Details
  state_name: string;
  state_code?: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent
  country_id: string;
  MasterMainCountry?: MasterMainCountry;
  country_name?: string;

  // Relations - Child
  // Child - User
  UserOrganisation?: UserOrganisation[]

  // Relations - Child Count
  _count?: {
    UserOrganisation?: number;
  };
}

// MasterMainState Create/Update Schema
export const MasterMainStateSchema = z.object({
  // Relations - Parent
  country_id: single_select_mandatory('MasterMainCountry'), // Single-Selection -> MasterMainCountry

  // Main Field Details
  state_name: stringMandatory('State Name', 3, 100),
  state_code: stringOptional('State Code', 0, 10),

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterMainStateDTO = z.infer<typeof MasterMainStateSchema>;

// MasterMainState Query Schema
export const MasterMainStateQuerySchema = BaseQuerySchema.extend({
  // Self Table
  state_ids: multi_select_optional('MasterMainState'), // Multi-selection -> MasterMainState

  // Relations - Parent
  country_ids: multi_select_optional('MasterMainCountry'), // Multi-selection -> MasterMainCountry
});
export type MasterMainStateQueryDTO = z.infer<
  typeof MasterMainStateQuerySchema
>;

// Convert MasterMainState Data to API Payload
export const toMasterMainStatePayload = (row: MasterMainState): MasterMainStateDTO => ({
  country_id: row.country_id || '',

  state_name: row.state_name || '',
  state_code: row.state_code || '',

  status: row.status || Status.Active,
});

// Create New MasterMainState Payload
export const newMasterMainStatePayload = (): MasterMainStateDTO => ({
  country_id: '',

  state_name: '',
  state_code: '',

  status: Status.Active,
});

// MasterMainState APIs
export const findMasterMainStates = async (data: MasterMainStateQueryDTO): Promise<FBR<MasterMainState[]>> => {
  return apiPost<FBR<MasterMainState[]>, MasterMainStateQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterMainState = async (data: MasterMainStateDTO): Promise<SBR> => {
  return apiPost<SBR, MasterMainStateDTO>(ENDPOINTS.create, data);
};

export const updateMasterMainState = async (id: string, data: MasterMainStateDTO): Promise<SBR> => {
  return apiPatch<SBR, MasterMainStateDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterMainState = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// Cache APIs
export const getMasterMainStateCache = async (country_id: string): Promise<FBR<MasterMainState[]>> => {
  return apiGet<FBR<MasterMainState[]>>(ENDPOINTS.cache(country_id));
};

