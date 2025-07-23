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

// URL & Endpoints
const URL = 'master/organisation/group';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
  cache: (organisation_id: string): string => `${URL}/cache/${organisation_id}`,
  cacheChild: (organisation_id: string): string =>
    `${URL}/cache_child/${organisation_id}`,
  cacheCount: (organisation_id: string): string =>
    `${URL}/cache_count/${organisation_id}`,
};

// Organisation Group Interface
export interface OrganisationGroup extends Record<string, unknown> {
  // Primary Fields
  organisation_group_id: string;
  organisation_group_name: string; // Min: 3, Max: 100

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations
  organisation_id: string;
  UserOrganisation?: UserOrganisation;

  // Relations - Child
  VehicleOrganisationGroupLink: VehicleOrganisationGroupLink[];

  // Count
  _count?: {
    VehicleOrganisationGroupLink: number;
  };
}

export interface VehicleOrganisationGroupLink extends Record<string, unknown> {
  // ✅ Primary Fields
  group_link_id: string;

  // ✅ Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // ✅ Relations
  organisation_group_id: string;
  OrganisationGroup?: OrganisationGroup;

  vehicle_id: string;
  Vehicle?: MasterVehicle;
}

// ✅ Organisation Group Create/Update Schema
export const OrganisationGroupSchema = z.object({
  organisation_id: single_select_mandatory('Organisation'), // ✅ Single-selection -> UserOrganisation
  organisation_group_name: stringMandatory('Group Name', 3, 100),
  vehicle_ids: multi_select_optional('Vehicle'), // ✅ Multi-selection -> Vehicle
  status: enumMandatory('Status', Status, Status.Active),
});
export type OrganisationGroupDTO = z.infer<typeof OrganisationGroupSchema>;

// ✅ Organisation Group Query Schema
export const OrganisationGroupQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('Organisation'), // ✅ Multi-selection -> UserOrganisation
  organisation_group_ids: multi_select_optional('Organisation Group'), // ✅ Multi-selection -> OrganisationGroup
  vehicle_ids: multi_select_optional('Vehicle'), // ✅ Multi-selection -> Vehicle
});
export type OrganisationGroupQueryDTO = z.infer<
  typeof OrganisationGroupQuerySchema
>;

// Convert existing data to a payload structure
export const toOrganisationGroupPayload = (
  group: OrganisationGroup
): OrganisationGroupDTO => ({
  organisation_id: group.organisation_id,
  organisation_group_name: group.organisation_group_name,
  vehicle_ids:
    group.VehicleOrganisationGroupLink?.map((v) => v.vehicle_id) ?? [],
  status: group.status,
});

// Generate a new payload with default values
export const newOrganisationGroupPayload = (): OrganisationGroupDTO => ({
  organisation_id: '',
  organisation_group_name: '',
  vehicle_ids: [],
  status: Status.Active,
});

// API Methods
export const findOrganisationGroups = async (
  data: OrganisationGroupQueryDTO
): Promise<FBR<OrganisationGroup[]>> => {
  return apiPost<FBR<OrganisationGroup[]>, OrganisationGroupQueryDTO>(
    ENDPOINTS.find,
    data
  );
};

export const createOrganisationGroup = async (
  data: OrganisationGroupDTO
): Promise<SBR> => {
  return apiPost<SBR, OrganisationGroupDTO>(ENDPOINTS.create, data);
};

export const updateOrganisationGroup = async (
  id: string,
  data: OrganisationGroupDTO
): Promise<SBR> => {
  return apiPatch<SBR, OrganisationGroupDTO>(ENDPOINTS.update(id), data);
};

export const deleteOrganisationGroup = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// API Cache Methods
export const getOrganisationGroupCache = async (
  organisation_id: string
): Promise<FBR<OrganisationGroup[]>> => {
  return apiGet<FBR<OrganisationGroup[]>>(ENDPOINTS.cache(organisation_id));
};

export const getOrganisationGroupCacheChild = async (
  organisation_id: string
): Promise<FBR<OrganisationGroup[]>> => {
  return apiGet<FBR<OrganisationGroup[]>>(
    ENDPOINTS.cacheChild(organisation_id)
  );
};

export const getOrganisationGroupCacheCount = async (
  organisation_id: string
): Promise<FBR<OrganisationGroup[]>> => {
  return apiGet<FBR<OrganisationGroup[]>>(
    ENDPOINTS.cacheCount(organisation_id)
  );
};
