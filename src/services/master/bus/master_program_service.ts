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

const URL = 'master/bus/program';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
  cache: (organisation_id: string): string => `${URL}/cache/${organisation_id}`,
  cache_count: (organisation_id: string): string => `${URL}/cache_count/${organisation_id}`,
};

// MasterProgram Interface
export interface MasterProgram extends Record<string, unknown> {
  // Primary Fields
  program_id: string;
  program_name: string; // Min: 3, Max: 100
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

// ✅ MasterProgram Create/Update Schema
export const MasterProgramSchema = z.object({
  organisation_id: single_select_mandatory('UserOrganisation'), // ✅ Single-Selection -> UserOrganisation
  program_name: stringMandatory('Program Name', 3, 100),
  description: stringOptional('Description', 0, 300),
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterProgramDTO = z.infer<typeof MasterProgramSchema>;

// ✅ MasterProgram Query Schema
export const MasterProgramQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('UserOrganisation'), // ✅ Multi-selection -> UserOrganisation
  program_ids: multi_select_optional('MasterProgram'), // ✅ Multi-selection -> MasterProgram
});
export type MasterProgramQueryDTO = z.infer<typeof MasterProgramQuerySchema>;

// Convert existing data to a payload structure
export const toMasterProgramPayload = (row: MasterProgram): MasterProgramDTO => ({
  organisation_id: row.organisation_id ?? '',
  program_name: row.program_name,
  description: row.description || '',
  status: row.status,
});

// Generate a new payload with default values
export const newMasterProgramPayload = (): MasterProgramDTO => ({
  organisation_id: '',
  program_name: '',
  description: '',
  status: Status.Active
});

// API Methods
export const findMasterProgram = async (data: MasterProgramQueryDTO): Promise<FBR<MasterProgram[]>> => {
  return apiPost<FBR<MasterProgram[]>, MasterProgramQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterProgram = async (data: MasterProgramDTO): Promise<SBR> => {
  return apiPost<SBR, MasterProgramDTO>(ENDPOINTS.create, data);
};

export const updateMasterProgram = async (id: string, data: MasterProgramDTO): Promise<SBR> => {
  return apiPatch<SBR, MasterProgramDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterProgram = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// API Cache Methods
export const getMasterProgramCache = async (organisation_id: string): Promise<FBR<MasterProgram[]>> => {
  return apiGet<FBR<MasterProgram[]>>(ENDPOINTS.cache(organisation_id));
};

export const getMasterProgramCacheCount = async (organisation_id: string): Promise<FBR<MasterProgram>> => {
  return apiGet<FBR<MasterProgram>>(ENDPOINTS.cache_count(organisation_id));
};

