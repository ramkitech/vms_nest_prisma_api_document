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
import { Student } from 'src/services/fleet/bus_mangement/student';

const URL = 'master/bus/stream';

const ENDPOINTS = {
  // MasterStream APIs
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,

  // Cache APIs
  cache: (organisation_id: string): string => `${URL}/cache/${organisation_id}`,
  cache_count: (organisation_id: string): string => `${URL}/cache_count/${organisation_id}`,
};

// MasterStream Interface
export interface MasterStream extends Record<string, unknown> {
  // Primary Fields
  stream_id: string;

  // Main Field Details
  stream_name: string;
  description?: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent
  organisation_id: string;
  UserOrganisation?: UserOrganisation;
  organisation_name?: string;

  // Relations - Child
  // Child - Fleet
  Student?: Student[];

  // Relations - Child Count
  _count?: {
    Student?: number;
  };
}

// MasterStream Create/Update Schema
export const MasterStreamSchema = z.object({
  // Relations - Parent
  organisation_id: single_select_mandatory('UserOrganisation'), // Single-Selection -> UserOrganisation

  // Main Field Details
  stream_name: stringMandatory('Stream Name', 3, 100),
  description: stringOptional('Description', 0, 300),

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterStreamDTO = z.infer<typeof MasterStreamSchema>;

// MasterStream Query Schema
export const MasterStreamQuerySchema = BaseQuerySchema.extend({
  // Self Table
  stream_ids: multi_select_optional('MasterStream'), // Multi-selection -> MasterStream

  // Relations - Parent
  organisation_ids: multi_select_optional('UserOrganisation'), // Multi-selection -> UserOrganisation
});
export type MasterStreamQueryDTO = z.infer<typeof MasterStreamQuerySchema>;

// Convert MasterStream Data to API Payload
export const toMasterStreamPayload = (row: MasterStream): MasterStreamDTO => ({
  organisation_id: row.organisation_id || '',

  stream_name: row.stream_name || '',
  description: row.description || '',

  status: row.status || Status.Active,
});

// Create New MasterStream Payload
export const newMasterStreamPayload = (): MasterStreamDTO => ({
  organisation_id: '',

  stream_name: '',
  description: '',

  status: Status.Active
});

// MasterStream APIs
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

// Cache APIs
export const getMasterStreamCache = async (organisation_id: string): Promise<FBR<MasterStream[]>> => {
  return apiGet<FBR<MasterStream[]>>(ENDPOINTS.cache(organisation_id));
};

export const getMasterStreamCacheCount = async (organisation_id: string): Promise<FBR<MasterStream>> => {
  return apiGet<FBR<MasterStream>>(ENDPOINTS.cache_count(organisation_id));
};

