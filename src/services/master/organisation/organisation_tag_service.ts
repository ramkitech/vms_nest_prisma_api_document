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

const URL = 'master/organisation/tag';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
  cache: (organisation_id: string): string => `${URL}/cache/${organisation_id}`,
  cache_count: (organisation_id: string): string => `${URL}/cache_count/${organisation_id}`,
  cache_child: (organisation_id: string): string => `${URL}/cache_child/${organisation_id}`,
};

// Organisation Tag Interface
export interface OrganisationTag extends Record<string, unknown> {
  // Primary Fields
  organisation_tag_id: string;
  tag_name: string; // Min: 3, Max: 100
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

// ✅ OrganisationTag Create/Update DTO Schema
export const OrganisationTagSchema = z.object({
  organisation_id: single_select_mandatory('Organisation'), // ✅ Single-selection -> UserOrganisation
  tag_name: stringMandatory('Tag Name', 3, 100),
  description: stringOptional('Description', 0, 300),
  status: enumMandatory('Status', Status, Status.Active),
});
export type OrganisationTagDTO = z.infer<typeof OrganisationTagSchema>;

// ✅ OrganisationTag Query DTO Schema
export const OrganisationTagQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('Organisation'), // ✅ Multi-selection -> UserOrganisation
  organisation_tag_ids: multi_select_optional('Organisation Tag'), // ✅ Multi-selection -> OrganisationTag
});
export type OrganisationTagQueryDTO = z.infer<
  typeof OrganisationTagQuerySchema
>;

// Convert existing data to a payload structure
export const toOrganisationTagPayload = (
  row: OrganisationTag
): OrganisationTagDTO => ({
  organisation_id: row.organisation_id,
  tag_name: row.tag_name,
  description: row.description || '',
  status: row.status,
});

// Generate a new payload with default values
export const newOrganisationTagPayload = (): OrganisationTagDTO => ({
  organisation_id: '',
  tag_name: '',
  description: '',
  status: Status.Active,
});

// API Methods
export const findOrganisationTags = async (
  data: OrganisationTagQueryDTO
): Promise<FBR<OrganisationTag[]>> => {
  return apiPost<FBR<OrganisationTag[]>, OrganisationTagQueryDTO>(
    ENDPOINTS.find,
    data
  );
};

export const createOrganisationTag = async (
  data: OrganisationTagDTO
): Promise<SBR> => {
  return apiPost<SBR, OrganisationTagDTO>(ENDPOINTS.create, data);
};

export const updateOrganisationTag = async (
  id: string,
  data: OrganisationTagDTO
): Promise<SBR> => {
  return apiPatch<SBR, OrganisationTagDTO>(ENDPOINTS.update(id), data);
};

export const deleteOrganisationTag = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// API Cache Methods
export const getOrganisationTagCache = async (
  organisation_id: string
): Promise<FBR<OrganisationTag[]>> => {
  return apiGet<FBR<OrganisationTag[]>>(ENDPOINTS.cache(organisation_id));
};

export const getOrganisationTagCacheCount = async (
  organisation_id: string
): Promise<FBR<OrganisationTag[]>> => {
  return apiGet<FBR<OrganisationTag[]>>(ENDPOINTS.cache_count(organisation_id));
};

export const getOrganisationTagCacheChild = async (
  organisation_id: string
): Promise<FBR<OrganisationTag[]>> => {
  return apiGet<FBR<OrganisationTag[]>>(ENDPOINTS.cache_child(organisation_id));
};


