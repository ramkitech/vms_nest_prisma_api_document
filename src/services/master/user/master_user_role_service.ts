// Axios
import { apiGet, apiPost, apiPatch, apiDelete } from 'apiCall';
import { SBR, FBR } from 'core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  stringMandatory,
  single_select_mandatory,
  multi_select_optional,
  enumMandatory,
} from 'zod/zod_utils';
import { BaseQuerySchema } from 'zod/zod_base_schema';

// Enums
import { Status } from 'core/Enums';

// Other Models
import { UserOrganisation } from 'services/main/users/user_organisation_service';
import { User } from 'services/main/users/user_service';

const URL = 'master/user/role';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
  cache: (organisation_id: string): string => `${URL}/cache/${organisation_id}`,
};

// User Role Interface
export interface MasterUserRole extends Record<string, unknown> {
  // Primary Fields
  user_role_id: string;
  user_role: string; // Min: 3, Max: 100

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations
  organisation_id?: string;
  UserOrganisation?: UserOrganisation;

  // Relations - Child
  User: User[];

  // Count
  _count?: {
    User: number;
  };
}

// ✅ User Role Create/Update Schema
export const MasterUserRoleSchema = z.object({
  organisation_id: single_select_mandatory('Organisation'), // ✅ Single-selection -> UserOrganisation
  user_role: stringMandatory('User Role', 3, 100),
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterUserRoleDTO = z.infer<typeof MasterUserRoleSchema>;

// ✅ User Role Query Schema
export const MasterUserRoleQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('Organisation'), // ✅ Multi-selection -> UserOrganisation
  user_role_ids: multi_select_optional('User Role'), // ✅ Multi-selection -> MasterUserRole
});
export type MasterUserRoleQueryDTO = z.infer<typeof MasterUserRoleQuerySchema>;

// Convert existing data to a payload structure
export const toMasterUserRolePayload = (
  userRole: MasterUserRole
): MasterUserRoleDTO => ({
  organisation_id: userRole.organisation_id ?? '',
  user_role: userRole.user_role,
  status: userRole.status,
});

// Generate a new payload with default values
export const newMasterUserRolePayload = (): MasterUserRoleDTO => ({
  organisation_id: '',
  user_role: '',
  status: Status.Active,
});

// API Methods
export const findMasterUserRoles = async (
  data: MasterUserRoleQueryDTO
): Promise<FBR<MasterUserRole[]>> => {
  return apiPost<FBR<MasterUserRole[]>, MasterUserRoleQueryDTO>(
    ENDPOINTS.find,
    data
  );
};

export const createMasterUserRole = async (
  data: MasterUserRoleDTO
): Promise<SBR> => {
  return apiPost<SBR, MasterUserRoleDTO>(ENDPOINTS.create, data);
};

export const updateMasterUserRole = async (
  id: string,
  data: MasterUserRoleDTO
): Promise<SBR> => {
  return apiPatch<SBR, MasterUserRoleDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterUserRole = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// API Cache Methods
export const getMasterUserRoleCache = async (
  organisation_id: string
): Promise<FBR<MasterUserRole[]>> => {
  return apiGet<FBR<MasterUserRole[]>>(ENDPOINTS.cache(organisation_id));
};
