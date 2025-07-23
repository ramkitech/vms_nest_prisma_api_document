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

const URL = 'master/organisation/color';

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

// Organisation Color Interface
export interface OrganisationColor extends Record<string, unknown> {
  // Primary Fields
  organisation_color_id: string;
  organisation_color_name: string; // Min: 3, Max: 100
  organisation_color_code: string; // Min: 3, Max: 100

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations
  organisation_id?: string;
  UserOrganisation?: UserOrganisation;

  // Relations - Child
  MasterVehicle: MasterVehicle[];

  // Count
  _count?: {
    MasterVehicle: number;
  };
}

// ✅ Organisation Color Create/Update Schema
export const OrganisationColorSchema = z.object({
  organisation_id: single_select_mandatory('Organisation'), // ✅ Single-selection -> UserOrganisation
  organisation_color_name: stringMandatory('Color Name', 3, 100),
  organisation_color_code: stringMandatory('Color Code', 3, 100),
  status: enumMandatory('Status', Status, Status.Active),
});
export type OrganisationColorDTO = z.infer<typeof OrganisationColorSchema>;

// ✅ Organisation Color Query Schema
export const OrganisationColorQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('Organisation'), // ✅ Multi-selection -> UserOrganisation
  organisation_color_ids: multi_select_optional('Organisation Color'), // ✅ Multi-selection -> OrganisationColor
});
export type OrganisationColorQueryDTO = z.infer<
  typeof OrganisationColorQuerySchema
>;

// Convert existing data to a payload structure
export const toOrganisationColorPayload = (
  color: OrganisationColor
): OrganisationColorDTO => ({
  organisation_id: color.organisation_id ?? '',
  organisation_color_name: color.organisation_color_name,
  organisation_color_code: color.organisation_color_code,
  status: color.status,
});

// Generate a new payload with default values
export const newOrganisationColorPayload = (): OrganisationColorDTO => ({
  organisation_id: '',
  organisation_color_name: '',
  organisation_color_code: '',
  status: Status.Active,
});

// API Methods
export const findOrganisationColors = async (
  data: OrganisationColorQueryDTO
): Promise<FBR<OrganisationColor[]>> => {
  return apiPost<FBR<OrganisationColor[]>, OrganisationColorQueryDTO>(
    ENDPOINTS.find,
    data
  );
};

export const createOrganisationColor = async (
  data: OrganisationColorDTO
): Promise<SBR> => {
  return apiPost<SBR, OrganisationColorDTO>(ENDPOINTS.create, data);
};

export const updateOrganisationColor = async (
  id: string,
  data: OrganisationColorDTO
): Promise<SBR> => {
  return apiPatch<SBR, OrganisationColorDTO>(ENDPOINTS.update(id), data);
};

export const deleteOrganisationColor = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// API Cache Methods
export const getOrganisationColorCache = async (
  organisation_id: string
): Promise<FBR<OrganisationColor[]>> => {
  return apiGet<FBR<OrganisationColor[]>>(ENDPOINTS.cache(organisation_id));
};

export const getOrganisationColorCacheChild = async (
  organisation_id: string
): Promise<FBR<OrganisationColor[]>> => {
  return apiGet<FBR<OrganisationColor[]>>(
    ENDPOINTS.cache_child(organisation_id)
  );
};

export const getOrganisationColorCacheCount = async (
  organisation_id: string
): Promise<FBR<OrganisationColor[]>> => {
  return apiGet<FBR<OrganisationColor[]>>(
    ENDPOINTS.cache_count(organisation_id)
  );
};
