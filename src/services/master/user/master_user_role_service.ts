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

const URL = 'master/user/role';

const ENDPOINTS = {
  // MasterUserRole APIs
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,

  // Cache APIs
  cache: (organisation_id: string): string => `${URL}/cache/${organisation_id}`,
  cache_count: (organisation_id: string): string => `${URL}/cache_count/${organisation_id}`,
};

// UserRole Interface
export interface MasterUserRole extends Record<string, unknown> {
  // Primary Fields
  user_role_id: string;
  user_role: string;
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

// MasterUserRole Create/Update Schema
export const MasterUserRoleSchema = z.object({
  organisation_id: single_select_mandatory('UserOrganisation'), // Single-Selection -> UserOrganisation
  user_role: stringMandatory('User Role', 3, 100),
  description: stringOptional('Description', 0, 300),
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterUserRoleDTO = z.infer<typeof MasterUserRoleSchema>;

// MasterUserRole Query Schema
export const MasterUserRoleQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('UserOrganisation'), // Multi-selection -> UserOrganisation
  user_role_ids: multi_select_optional('MasterUserRole'), // Multi-selection -> MasterUserRole
});
export type MasterUserRoleQueryDTO = z.infer<typeof MasterUserRoleQuerySchema>;

// Convert MasterUserRole Data to API Payload
export const toMasterUserRolePayload = (row: MasterUserRole): MasterUserRoleDTO => ({
  organisation_id: row.organisation_id || '',

  user_role: row.user_role || '',
  description: row.description || '',
  status: row.status || Status.Active,
});

// Create New MasterUserRole Payload
export const newMasterUserRolePayload = (): MasterUserRoleDTO => ({
  organisation_id: '',
  user_role: '',
  description: '',
  status: Status.Active,
});

// MasterUserRole APIs
export const findMasterUserRoles = async (data: MasterUserRoleQueryDTO): Promise<FBR<MasterUserRole[]>> => {
  return apiPost<FBR<MasterUserRole[]>, MasterUserRoleQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterUserRole = async (data: MasterUserRoleDTO): Promise<SBR> => {
  return apiPost<SBR, MasterUserRoleDTO>(ENDPOINTS.create, data);
};

export const updateMasterUserRole = async (id: string, data: MasterUserRoleDTO): Promise<SBR> => {
  return apiPatch<SBR, MasterUserRoleDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterUserRole = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// Cache APIs
export const getMasterUserRoleCache = async (organisation_id: string): Promise<FBR<MasterUserRole[]>> => {
  return apiGet<FBR<MasterUserRole[]>>(ENDPOINTS.cache(organisation_id));
};

export const getMasterUserRoleCacheCount = async (organisation_id: string): Promise<FBR<MasterUserRole>> => {
  return apiGet<FBR<MasterUserRole>>(ENDPOINTS.cache_count(organisation_id));
};

