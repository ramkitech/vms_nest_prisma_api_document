// Axios
import { apiGet, apiPost, apiPatch, apiDelete } from '../../../core/apiCall';
import { SBR, FBR } from '../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  stringMandatory,
  single_select_mandatory,
  multi_select_optional,
  enumMandatory,
  stringOptional,
} from '../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../zod_utils/zod_base_schema';

// Enums
import { Status } from '../../../core/Enums';

// Other Models
import { UserOrganisation } from '../../main/users/user_organisation_service';
import { User } from '../../main/users/user_service';

const URL = 'master/bus/year';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
  cache: (organisation_id: string): string => `${URL}/cache/${organisation_id}`,
  cache_count: (organisation_id: string): string => `${URL}/cache_count/${organisation_id}`,
};

// MasterYear Interface
export interface MasterYear extends Record<string, unknown> {
  // Primary Fields
  year_id: string;
  year_name: string; // Min: 3, Max: 100
  description?: string; // Optional, Max: 300

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations
  organisation_id?: string;
  UserOrganisation?: UserOrganisation;

  // Relations - Child
  Student: User[];

  // Count
  _count?: {
    Student: number;
  };
}

// ✅ MasterYear Create/Update Schema
export const MasterYearSchema = z.object({
  organisation_id: single_select_mandatory('UserOrganisation'), // ✅ Single-Selection -> UserOrganisation
  year_name: stringMandatory('Year Name', 3, 100),
  description: stringOptional('Description', 0, 300),
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterYearDTO = z.infer<typeof MasterYearSchema>;

// ✅ MasterYear Query Schema
export const MasterYearQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('UserOrganisation'), // ✅ Multi-selection -> UserOrganisation
  year_ids: multi_select_optional('MasterYear'), // ✅ Multi-selection -> MasterYear
});
export type MasterYearQueryDTO = z.infer<typeof MasterYearQuerySchema>;

// Convert existing data to a payload structure
export const toMasterYearPayload = (row: MasterYear): MasterYearDTO => ({
  organisation_id: row.organisation_id ?? '',
  year_name: row.year_name,
  description: row.description || '',
  status: row.status,
});

// Generate a new payload with default values
export const newMasterYearPayload = (): MasterYearDTO => ({
  organisation_id: '',
  year_name: '',
  description: '',
  status: Status.Active
});

// API Methods
export const findMasterYear = async (data: MasterYearQueryDTO): Promise<FBR<MasterYear[]>> => {
  return apiPost<FBR<MasterYear[]>, MasterYearQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterYear = async (data: MasterYearDTO): Promise<SBR> => {
  return apiPost<SBR, MasterYearDTO>(ENDPOINTS.create, data);
};

export const updateMasterYear = async (id: string, data: MasterYearDTO): Promise<SBR> => {
  return apiPatch<SBR, MasterYearDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterYear = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// API Cache Methods
export const getMasterYearCache = async (organisation_id: string): Promise<FBR<MasterYear[]>> => {
  return apiGet<FBR<MasterYear[]>>(ENDPOINTS.cache(organisation_id));
};

export const getMasterYearCacheCount = async (organisation_id: string): Promise<FBR<MasterYear>> => {
  return apiGet<FBR<MasterYear>>(ENDPOINTS.cache_count(organisation_id));
};

