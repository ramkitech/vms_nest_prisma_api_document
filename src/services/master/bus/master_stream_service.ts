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

const URL = 'master/bus/stream';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
  cache: (organisation_id: string): string => `${URL}/cache/${organisation_id}`,
  cache_count: (organisation_id: string): string => `${URL}/cache_count/${organisation_id}`,
};

// MasterStream Interface
export interface MasterStream extends Record<string, unknown> {
  // Primary Fields
  stream_id: string;
  stream_name: string; // Min: 3, Max: 100
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

// ✅ MasterStream Create/Update Schema
export const MasterStreamSchema = z.object({
  organisation_id: single_select_mandatory('UserOrganisation'), // ✅ Single-Selection -> UserOrganisation
  stream_name: stringMandatory('Stream Name', 3, 100),
  description: stringOptional('Description', 0, 300),
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterStreamDTO = z.infer<typeof MasterStreamSchema>;

// ✅ MasterStream Query Schema
export const MasterStreamQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('UserOrganisation'), // ✅ Multi-selection -> UserOrganisation
  stream_ids: multi_select_optional('MasterStream'), // ✅ Multi-selection -> MasterStream
});
export type MasterStreamQueryDTO = z.infer<typeof MasterStreamQuerySchema>;

// Convert existing data to a payload structure
export const toMasterStreamPayload = (row: MasterStream): MasterStreamDTO => ({
  organisation_id: row.organisation_id ?? '',
  stream_name: row.stream_name,
  description: row.description || '',
  status: row.status,
});

// Generate a new payload with default values
export const newMasterStreamPayload = (): MasterStreamDTO => ({
  organisation_id: '',
  stream_name: '',
  description: '',
  status: Status.Active
});

// API Methods
export const findMasterStream = async (data: MasterStreamQueryDTO): Promise<FBR<MasterStream[]>> => {
  return apiPost<FBR<MasterStream[]>, MasterStreamQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterStream = async (data: MasterStreamDTO): Promise<SBR> => {
  return apiPost<SBR, MasterStreamDTO>(ENDPOINTS.create, data);
};

export const updateMasterStream = async (id: string, data: MasterStreamDTO): Promise<SBR> => {
  return apiPatch<SBR, MasterStreamDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterStream = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// API Cache Methods
export const getMasterStreamCache = async (organisation_id: string): Promise<FBR<MasterStream[]>> => {
  return apiGet<FBR<MasterStream[]>>(ENDPOINTS.cache(organisation_id));
};

export const getMasterStreamCacheCount = async (organisation_id: string): Promise<FBR<MasterStream>> => {
  return apiGet<FBR<MasterStream>>(ENDPOINTS.cache_count(organisation_id));
};

