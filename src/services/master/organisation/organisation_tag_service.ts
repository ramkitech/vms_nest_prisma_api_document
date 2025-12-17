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
import { MasterDriver } from 'src/services/main/drivers/master_driver_service';

const URL = 'master/organisation/tag';

const ENDPOINTS = {
  // OrganisationTag APIs
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,

  // Cache APIs
  cache: (organisation_id: string): string => `${URL}/cache/${organisation_id}`,
  cache_count: (organisation_id: string): string => `${URL}/cache_count/${organisation_id}`,
  cache_child: (organisation_id: string): string => `${URL}/cache_child/${organisation_id}`,
};

// OrganisationTag Interface
export interface OrganisationTag extends Record<string, unknown> {
  // Primary Field
  organisation_tag_id: string;

  // Main Field Details
  tag_name: string;
  description?: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent
  organisation_id?: string;
  UserOrganisation?: UserOrganisation;

  // Relations - Child
  MasterVehicle?: MasterVehicle[];
  MasterDriver?: MasterDriver[];

  // Relations - Child Count
  _count?: {
    MasterVehicle?: number;
    MasterDriver?: number;
  };
}

// OrganisationTag Create/Update Schema
export const OrganisationTagSchema = z.object({
  organisation_id: single_select_mandatory('UserOrganisation'), // Single-Selection -> UserOrganisation
  tag_name: stringMandatory('Tag Name', 3, 100),
  description: stringOptional('Description', 0, 300),
  status: enumMandatory('Status', Status, Status.Active),
});
export type OrganisationTagDTO = z.infer<typeof OrganisationTagSchema>;

// OrganisationTag Query Schema
export const OrganisationTagQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('UserOrganisation'), // Multi-selection -> UserOrganisation
  organisation_tag_ids: multi_select_optional('OrganisationTag'), // Multi-selection -> OrganisationTag
});
export type OrganisationTagQueryDTO = z.infer<
  typeof OrganisationTagQuerySchema
>;

// Convert OrganisationTag Data to API Payload
export const toOrganisationTagPayload = (row: OrganisationTag): OrganisationTagDTO => ({
  organisation_id: row.organisation_id || '',
  tag_name: row.tag_name || '',
  description: row.description || '',
  status: row.status || Status.Active,
});

// Create New OrganisationTag Payload
export const newOrganisationTagPayload = (): OrganisationTagDTO => ({
  organisation_id: '',
  tag_name: '',
  description: '',
  status: Status.Active,
});

// OrganisationTag APIs
export const findOrganisationTags = async (data: OrganisationTagQueryDTO): Promise<FBR<OrganisationTag[]>> => {
  return apiPost<FBR<OrganisationTag[]>, OrganisationTagQueryDTO>(ENDPOINTS.find, data);
};

export const createOrganisationTag = async (data: OrganisationTagDTO): Promise<SBR> => {
  return apiPost<SBR, OrganisationTagDTO>(ENDPOINTS.create, data);
};

export const updateOrganisationTag = async (id: string, data: OrganisationTagDTO): Promise<SBR> => {
  return apiPatch<SBR, OrganisationTagDTO>(ENDPOINTS.update(id), data);
};

export const deleteOrganisationTag = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// Cache APIs
export const getOrganisationTagCache = async (organisation_id: string): Promise<FBR<OrganisationTag[]>> => {
  return apiGet<FBR<OrganisationTag[]>>(ENDPOINTS.cache(organisation_id));
};

export const getOrganisationTagCacheCount = async (organisation_id: string): Promise<FBR<OrganisationTag[]>> => {
  return apiGet<FBR<OrganisationTag[]>>(ENDPOINTS.cache_count(organisation_id));
};

export const getOrganisationTagCacheChild = async (organisation_id: string): Promise<FBR<OrganisationTag[]>> => {
  return apiGet<FBR<OrganisationTag[]>>(ENDPOINTS.cache_child(organisation_id));
};



