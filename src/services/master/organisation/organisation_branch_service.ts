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
import { MasterVehicle } from 'services/main/vehicle/master_vehicle_service';

const URL = 'master/organisation/branch';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
  cache: (organisation_id: string): string => `${URL}/cache/${organisation_id}`,
  cache_child: (organisation_id: string): string =>
    `${URL}/cache_child/${organisation_id}`,
  cache_count: (organisation_id: string): string =>
    `${URL}/cache_count/${organisation_id}`,
};

// Organisation Branch Interface
export interface OrganisationBranch extends Record<string, unknown> {
  // Primary Fields
  organisation_branch_id: string;
  organisation_branch_name: string; // Min: 3, Max: 100
  organisation_branch_city: string; // Min: 3, Max: 100
  organisation_branch_address: string; // Min: 3, Max: 100

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

// ✅ Organisation Branch Create/Update Schema
export const OrganisationBranchSchema = z.object({
  organisation_id: single_select_mandatory('Organisation'), // ✅ Single-selection -> UserOrganisation
  organisation_branch_name: stringMandatory('Branch Name', 3, 100),
  organisation_branch_city: stringMandatory('Branch City', 3, 100),
  organisation_branch_address: stringMandatory('Branch Address', 3, 100),
  status: enumMandatory('Status', Status, Status.Active),
});
export type OrganisationBranchDTO = z.infer<typeof OrganisationBranchSchema>;

// ✅ Organisation Branch Query Schema
export const OrganisationBranchQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('Organisation'), // ✅ Multi-selection -> UserOrganisation
  organisation_branch_ids: multi_select_optional('Organisation Branch'), // ✅ Multi-selection -> OrganisationBranch
});
export type OrganisationBranchQueryDTO = z.infer<
  typeof OrganisationBranchQuerySchema
>;

// Convert existing data to a payload structure
export const toOrganisationBranchPayload = (
  branch: OrganisationBranch
): OrganisationBranchDTO => ({
  organisation_id: branch.organisation_id,
  organisation_branch_name: branch.organisation_branch_name,
  organisation_branch_city: branch.organisation_branch_city,
  organisation_branch_address: branch.organisation_branch_address,
  status: branch.status,
});

// Generate a new payload with default values
export const newOrganisationBranchPayload = (): OrganisationBranchDTO => ({
  organisation_id: '',
  organisation_branch_name: '',
  organisation_branch_city: '',
  organisation_branch_address: '',
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

export const getOrganisationBranchCacheChild = async (
  organisation_id: string
): Promise<FBR<OrganisationBranch[]>> => {
  return apiGet<FBR<OrganisationBranch[]>>(
    ENDPOINTS.cache_child(organisation_id)
  );
};

export const getOrganisationBranchCacheCount = async (
  organisation_id: string
): Promise<FBR<OrganisationBranch[]>> => {
  return apiGet<FBR<OrganisationBranch[]>>(
    ENDPOINTS.cache_count(organisation_id)
  );
};
