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
import { UserOrganisation } from '../../../services/main/users/user_organisation_service';
import { User } from '../../../services/main/users/user_service';

const URL = 'master/user/status';

const ENDPOINTS = {
  // MasterUserStatus APIs
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,

  // Cache APIs
  cache: (organisation_id: string): string => `${URL}/cache/${organisation_id}`,
  cache_count: (organisation_id: string): string => `${URL}/cache_count/${organisation_id}`,
};

// UserStatus Interface
export interface MasterUserStatus extends Record<string, unknown> {
  // Primary Fields
  user_status_id: string;
  user_status: string;
  description?: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent
  organisation_id: string;
  UserOrganisation?: UserOrganisation;

  // Relations - Child
  // Child - User
  User?: User[];

  // Relations - Child Count
  _count?: {
    User?: number;
  };
}

// MasterUserStatus Create/Update Schema
export const MasterUserStatusSchema = z.object({
  organisation_id: single_select_mandatory('UserOrganisation'), // Single-Selection -> UserOrganisation
  user_status: stringMandatory('User Status', 3, 100),
  description: stringOptional('Description', 0, 300),
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterUserStatusDTO = z.infer<typeof MasterUserStatusSchema>;

// MasterUserStatus Query Schema
export const MasterUserStatusQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('UserOrganisation'), // Multi-selection -> UserOrganisation
  user_status_ids: multi_select_optional('MasterUserStatus'), // Multi-selection -> MasterUserStatus
});
export type MasterUserStatusQueryDTO = z.infer<
  typeof MasterUserStatusQuerySchema
>;

// Convert MasterUserStatus Data to API Payload
export const toMasterUserStatusPayload = (row: MasterUserStatus): MasterUserStatusDTO => ({
  organisation_id: row.organisation_id || '',
  user_status: row.user_status || '',
  description: row.description || '',
  status: row.status || Status.Active,
});

// Create New MasterUserStatus Payload
export const newMasterUserStatusPayload = (): MasterUserStatusDTO => ({
  organisation_id: '',
  user_status: '',
  description: '',
  status: Status.Active,
});

// MasterUserStatus APIs
export const findMasterUserStatuses = async (data: MasterUserStatusQueryDTO): Promise<FBR<MasterUserStatus[]>> => {
  return apiPost<FBR<MasterUserStatus[]>, MasterUserStatusQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterUserStatus = async (data: MasterUserStatusDTO): Promise<SBR> => {
  return apiPost<SBR, MasterUserStatusDTO>(ENDPOINTS.create, data);
};

export const updateMasterUserStatus = async (id: string, data: MasterUserStatusDTO): Promise<SBR> => {
  return apiPatch<SBR, MasterUserStatusDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterUserStatus = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// Cache APIs
export const getMasterUserStatusCache = async (organisation_id: string): Promise<FBR<MasterUserStatus[]>> => {
  return apiGet<FBR<MasterUserStatus[]>>(ENDPOINTS.cache(organisation_id));
};

export const getMasterUserStatusCacheCount = async (organisation_id: string): Promise<FBR<MasterUserStatus>> => {
  return apiGet<FBR<MasterUserStatus>>(ENDPOINTS.cache_count(organisation_id));
};

