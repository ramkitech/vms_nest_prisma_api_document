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

const URL = 'master/bus/relationship';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
  cache: (organisation_id: string): string => `${URL}/cache/${organisation_id}`,
  cache_count: (organisation_id: string): string => `${URL}/cache_count/${organisation_id}`,
};

// MasterRelationship Interface
export interface MasterRelationship extends Record<string, unknown> {
  // Primary Fields
  relationship_id: string;
  relationship_name: string; // Min: 3, Max: 100
  description?: string; // Optional, Max: 300

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations
  organisation_id?: string;
  UserOrganisation?: UserOrganisation;

  // Relations - Child
  StudentGuardianLink: User[];

  // Count
  _count?: {
    StudentGuardianLink: number;
  };
}

// ✅ MasterRelationship Create/Update Schema
export const MasterRelationshipSchema = z.object({
  organisation_id: single_select_mandatory('UserOrganisation'), // ✅ Single-Selection -> UserOrganisation
  relationship_name: stringMandatory('RelationShip Name', 3, 100),
  description: stringOptional('Description', 0, 300),
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterRelationshipDTO = z.infer<typeof MasterRelationshipSchema>;

// ✅ MasterRelationship Query Schema
export const MasterRelationshipQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('UserOrganisation'), // ✅ Multi-selection -> UserOrganisation
  relationship_ids: multi_select_optional('MasterRelationship'), // ✅ Multi-selection -> MasterRelationship
});
export type MasterRelationshipQueryDTO = z.infer<
  typeof MasterRelationshipQuerySchema
>;

// Convert existing data to a payload structure
export const toMasterRelationshipPayload = (row: MasterRelationship): MasterRelationshipDTO => ({
  organisation_id: row.organisation_id ?? '',
  relationship_name: row.relationship_name,
  description: row.description || '',
  status: row.status,
});

// Generate a new payload with default values
export const newMasterRelationshipPayload = (): MasterRelationshipDTO => ({
  organisation_id: '',
  relationship_name: '',
  description: '',
  status: Status.Active
});

// API Methods
export const findMasterRelationship = async (data: MasterRelationshipQueryDTO): Promise<FBR<MasterRelationship[]>> => {
  return apiPost<FBR<MasterRelationship[]>, MasterRelationshipQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterRelationship = async (data: MasterRelationshipDTO): Promise<SBR> => {
  return apiPost<SBR, MasterRelationshipDTO>(ENDPOINTS.create, data);
};

export const updateMasterRelationship = async (id: string, data: MasterRelationshipDTO): Promise<SBR> => {
  return apiPatch<SBR, MasterRelationshipDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterRelationship = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// API Cache Methods
export const getMasterRelationshipCache = async (organisation_id: string): Promise<FBR<MasterRelationship[]>> => {
  return apiGet<FBR<MasterRelationship[]>>(ENDPOINTS.cache(organisation_id));
};

export const getMasterRelationshipCacheCount = async (organisation_id: string): Promise<FBR<MasterRelationship>> => {
  return apiGet<FBR<MasterRelationship>>(ENDPOINTS.cache_count(organisation_id));
};

