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

const URL = 'master/organisation/group';

const ENDPOINTS = {
  // OrganisationGroup APIs
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,

  // Cache APIs
  cache: (organisation_id: string): string => `${URL}/cache/${organisation_id}`,
  cache_count: (organisation_id: string): string => `${URL}/cache_count/${organisation_id}`,
  cache_child: (organisation_id: string): string => `${URL}/cache_child/${organisation_id}`,
};

// OrganisationGroup Interface
export interface OrganisationGroup extends Record<string, unknown> {
  // Primary Field
  organisation_group_id: string;

  // Main Field Details
  group_name: string;
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
  // Child - Master
  VehicleOrganisationGroupLink?: VehicleOrganisationGroupLink[]

  // Count
  _count?: {
    VehicleOrganisationGroupLink?: number;
  };
}

export interface VehicleOrganisationGroupLink extends Record<string, unknown> {
  // Primary Fields
  group_link_id: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent
  organisation_group_id: string;
  OrganisationGroup?: OrganisationGroup;
  group_name?: string;

  vehicle_id: string;
  MasterVehicle?: MasterVehicle;
  vehicle_number?: string;
  vehicle_type?: string;
}

// OrganisationGroup Create/Update Schema
export const OrganisationGroupSchema = z.object({
  // Relations - Parent
  organisation_id: single_select_mandatory('UserOrganisation'), // Single-Selection -> UserOrganisation
  vehicle_ids: multi_select_optional('MasterVehicle'), // Multi-selection -> MasterVehicle

  // Main Field Details
  group_name: stringMandatory('Group Name', 3, 100),
  description: stringOptional('Description', 0, 300),

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),
});
export type OrganisationGroupDTO = z.infer<typeof OrganisationGroupSchema>;

// OrganisationGroup Query Schema
export const OrganisationGroupQuerySchema = BaseQuerySchema.extend({
  // Self Table
  organisation_group_ids: multi_select_optional('OrganisationGroup'), // Multi-selection -> OrganisationGroup

  // Relations - Parent
  organisation_ids: multi_select_optional('UserOrganisation'), // Multi-selection -> UserOrganisation
  vehicle_ids: multi_select_optional('MasterVehicle'), // Multi-selection -> MasterVehicle
});
export type OrganisationGroupQueryDTO = z.infer<
  typeof OrganisationGroupQuerySchema
>;

// Convert OrganisationGroup Data to API Payload
export const toOrganisationGroupPayload = (row: OrganisationGroup): OrganisationGroupDTO => ({
  organisation_id: row.organisation_id || '',

  group_name: row.group_name,
  description: row.description || '',
  vehicle_ids:
    row.VehicleOrganisationGroupLink?.map((v) => v.vehicle_id) ?? [],

  status: row.status,
});

// Create New OrganisationGroup Payload
export const newOrganisationGroupPayload = (): OrganisationGroupDTO => ({
  organisation_id: '',

  group_name: '',
  description: '',
  vehicle_ids: [],

  status: Status.Active,
});

// OrganisationGroup APIs
export const findOrganisationGroups = async (data: OrganisationGroupQueryDTO): Promise<FBR<OrganisationGroup[]>> => {
  return apiPost<FBR<OrganisationGroup[]>, OrganisationGroupQueryDTO>(ENDPOINTS.find, data);
};

export const createOrganisationGroup = async (data: OrganisationGroupDTO): Promise<SBR> => {
  return apiPost<SBR, OrganisationGroupDTO>(ENDPOINTS.create, data);
};

export const updateOrganisationGroup = async (id: string, data: OrganisationGroupDTO): Promise<SBR> => {
  return apiPatch<SBR, OrganisationGroupDTO>(ENDPOINTS.update(id), data);
};

export const deleteOrganisationGroup = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// Cache APIs
export const getOrganisationGroupCache = async (organisation_id: string): Promise<FBR<OrganisationGroup[]>> => {
  return apiGet<FBR<OrganisationGroup[]>>(ENDPOINTS.cache(organisation_id));
};

export const getOrganisationGroupCacheCount = async (organisation_id: string): Promise<FBR<OrganisationGroup[]>> => {
  return apiGet<FBR<OrganisationGroup[]>>(ENDPOINTS.cache_count(organisation_id));
};

export const getOrganisationGroupCacheChild = async (organisation_id: string): Promise<FBR<OrganisationGroup[]>> => {
  return apiGet<FBR<OrganisationGroup[]>>(ENDPOINTS.cache_child(organisation_id));
};
