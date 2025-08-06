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
import { MasterVehicle } from '../../../services/main/vehicle/master_vehicle_service';

const URL = 'master/organisation/branch';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
  cache: (organisation_id: string): string => `${URL}/cache/${organisation_id}`,
  cache_count: (organisation_id: string): string => `${URL}/cache_count/${organisation_id}`,
  cache_child: (organisation_id: string): string => `${URL}/cache_child/${organisation_id}`,
};

// Organisation Branch Interface
export interface OrganisationBranch extends Record<string, unknown> {
  // Primary Fields
  organisation_branch_id: string;
  branch_name: string; // Min: 3, Max: 100
  branch_city: string; // Min: 3, Max: 100
  branch_address: string; // Min: 3, Max: 100
  description?: string; // Optional, Max: 300

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations
  organisation_id: string;
  UserOrganisation: UserOrganisation;

  // Relations - Child
  MasterVehicle: MasterVehicle[];

  // Count
  _count?: {
    MasterVehicle: number;
  };
}

// ✅ OrganisationBranch Create/Update DTO Schema
export const OrganisationBranchSchema = z.object({
  organisation_id: single_select_mandatory('Organisation'), // ✅ Single-selection -> UserOrganisation
  branch_name: stringMandatory('Branch Name', 3, 100),
  branch_city: stringMandatory('Branch City', 3, 100),
  branch_address: stringMandatory('Branch Address', 3, 100),
  description: stringOptional('Description', 0, 300),
  status: enumMandatory('Status', Status, Status.Active),
});
export type OrganisationBranchDTO = z.infer<typeof OrganisationBranchSchema>;

// ✅ OrganisationBranch Query DTO Schema
export const OrganisationBranchQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('Organisation'), // ✅ Multi-selection -> UserOrganisation
  organisation_branch_ids: multi_select_optional('Organisation Branch'), // ✅ Multi-selection -> OrganisationBranch
});
export type OrganisationBranchQueryDTO = z.infer<
  typeof OrganisationBranchQuerySchema
>;

// Convert existing data to a payload structure
export const toOrganisationBranchPayload = (
  row: OrganisationBranch
): OrganisationBranchDTO => ({
  organisation_id: row.organisation_id,
  branch_name: row.branch_name,
  branch_city: row.branch_city,
  branch_address: row.branch_address,
  description: row.description || '',
  status: row.status,
});

// Generate a new payload with default values
export const newOrganisationBranchPayload = (): OrganisationBranchDTO => ({
  organisation_id: '',
  branch_name: '',
  branch_city: '',
  branch_address: '',
  description: '',
  status: Status.Active,
});

// API Methods
export const findOrganisationBranches = async (
  data: OrganisationBranchQueryDTO
): Promise<FBR<OrganisationBranch[]>> => {
  return apiPost<FBR<OrganisationBranch[]>, OrganisationBranchQueryDTO>(
    ENDPOINTS.find,
    data
  );
};

export const createOrganisationBranch = async (
  data: OrganisationBranchDTO
): Promise<SBR> => {
  return apiPost<SBR, OrganisationBranchDTO>(ENDPOINTS.create, data);
};

export const updateOrganisationBranch = async (
  id: string,
  data: OrganisationBranchDTO
): Promise<SBR> => {
  return apiPatch<SBR, OrganisationBranchDTO>(ENDPOINTS.update(id), data);
};

export const deleteOrganisationBranch = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// API Cache Methods
export const getOrganisationBranchCache = async (
  organisation_id: string
): Promise<FBR<OrganisationBranch[]>> => {
  return apiGet<FBR<OrganisationBranch[]>>(ENDPOINTS.cache(organisation_id));
};

export const getOrganisationBranchCacheCount = async (
  organisation_id: string
): Promise<FBR<OrganisationBranch[]>> => {
  return apiGet<FBR<OrganisationBranch[]>>(
    ENDPOINTS.cache_count(organisation_id)
  );
};

export const getOrganisationBranchCacheChild = async (
  organisation_id: string
): Promise<FBR<OrganisationBranch[]>> => {
  return apiGet<FBR<OrganisationBranch[]>>(
    ENDPOINTS.cache_child(organisation_id)
  );
};
