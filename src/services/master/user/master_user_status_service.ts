// Axios
import { apiGet, apiPost, apiPatch, apiDelete } from 'core/apiCall';
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

const URL = 'master/user/status';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
  cache: (organisation_id: string): string => `${URL}/cache/${organisation_id}`,
};

// User Status Interface
export interface MasterUserStatus extends Record<string, unknown> {
  // Primary Fields
  user_status_id: string;
  user_status: string; // Min: 3, Max: 100

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

// ✅ User Status Create/Update Schema
export const MasterUserStatusSchema = z.object({
  organisation_id: single_select_mandatory('Organisation'), // ✅ Single-selection -> UserOrganisation
  user_status: stringMandatory('User Status', 3, 100),
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterUserStatusDTO = z.infer<typeof MasterUserStatusSchema>;

// ✅ User Status Query Schema
export const MasterUserStatusQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('Organisation'), // ✅ Multi-selection -> UserOrganisation
  user_status_ids: multi_select_optional('User Status'), // ✅ Multi-selection -> MasterUserStatus
});
export type MasterUserStatusQueryDTO = z.infer<
  typeof MasterUserStatusQuerySchema
>;

// Convert existing data to a payload structure
export const toMasterUserStatusPayload = (
  userStatus: MasterUserStatus
): MasterUserStatusDTO => ({
  organisation_id: userStatus.organisation_id ?? '',
  user_status: userStatus.user_status,
  status: userStatus.status,
});

// Generate a new payload with default values
export const newMasterUserStatusPayload = (): MasterUserStatusDTO => ({
  organisation_id: '',
  user_status: '',
  status: Status.Active,
});

// API Methods
export const findMasterUserStatuses = async (
  data: MasterUserStatusQueryDTO
): Promise<FBR<MasterUserStatus[]>> => {
  return apiPost<FBR<MasterUserStatus[]>, MasterUserStatusQueryDTO>(
    ENDPOINTS.find,
    data
  );
};

export const createMasterUserStatus = async (
  data: MasterUserStatusDTO
): Promise<SBR> => {
  return apiPost<SBR, MasterUserStatusDTO>(ENDPOINTS.create, data);
};

export const updateMasterUserStatus = async (
  id: string,
  data: MasterUserStatusDTO
): Promise<SBR> => {
  return apiPatch<SBR, MasterUserStatusDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterUserStatus = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// API Cache Methods
export const getMasterUserStatusCache = async (
  organisation_id: string
): Promise<FBR<MasterUserStatus[]>> => {
  return apiGet<FBR<MasterUserStatus[]>>(ENDPOINTS.cache(organisation_id));
};
