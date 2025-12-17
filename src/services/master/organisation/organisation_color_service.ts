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
import { MasterVehicle } from 'src/services/main/vehicle/master_vehicle_service';
import { MasterDriver } from 'src/services/main/drivers/master_driver_service';

const URL = 'master/organisation/color';

const ENDPOINTS = {
  // OrganisationColor APIs
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,

  // Cache APIs
  cache: (organisation_id: string): string => `${URL}/cache/${organisation_id}`,
  cache_count: (organisation_id: string): string => `${URL}/cache_count/${organisation_id}`,
  cache_child: (organisation_id: string): string => `${URL}/cache_child/${organisation_id}`,
};

// OrganisationColor Interface
export interface OrganisationColor extends Record<string, unknown> {
  // Primary Field
  organisation_color_id: string;

  // Main Field Details
  color_name: string;
  color_code: string;
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
  MasterVehicle?: MasterVehicle[];
  MasterDriver?: MasterDriver[];

  // Relations - Child Count
  _count?: {
    MasterVehicle?: number;
    MasterDriver?: number;
  };
}

// OrganisationColor Create/Update Schema
export const OrganisationColorSchema = z.object({
  // Relations - Parent
  organisation_id: single_select_mandatory('UserOrganisation'), // Single-Selection -> UserOrganisation

  // Main Field Details
  color_name: stringMandatory('Color Name', 3, 100),
  color_code: stringMandatory('Color Code', 3, 100),
  description: stringOptional('Description', 0, 300),

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),
});
export type OrganisationColorDTO = z.infer<typeof OrganisationColorSchema>;

// OrganisationColor Query Schema
export const OrganisationColorQuerySchema = BaseQuerySchema.extend({
  // Self Table
  organisation_color_ids: multi_select_optional('OrganisationColor'), // Multi-selection -> OrganisationColor

  // Relations - Parent
  organisation_ids: multi_select_optional('UserOrganisation'), // Multi-selection -> UserOrganisation
});
export type OrganisationColorQueryDTO = z.infer<
  typeof OrganisationColorQuerySchema
>;

// Convert OrganisationColor Data to API Payload
export const toOrganisationColorPayload = (row: OrganisationColor): OrganisationColorDTO => ({
  organisation_id: row.organisation_id || '',

  color_name: row.color_name || '',
  color_code: row.color_code || '',
  description: row.description || '',

  status: row.status || Status.Active,
});

// Create New OrganisationColor Payload
export const newOrganisationColorPayload = (): OrganisationColorDTO => ({
  organisation_id: '',

  color_name: '',
  color_code: '',
  description: '',
  
  status: Status.Active,
});

// OrganisationColor APIs
export const findOrganisationColors = async (data: OrganisationColorQueryDTO): Promise<FBR<OrganisationColor[]>> => {
  return apiPost<FBR<OrganisationColor[]>, OrganisationColorQueryDTO>(ENDPOINTS.find, data);
};

export const createOrganisationColor = async (data: OrganisationColorDTO): Promise<SBR> => {
  return apiPost<SBR, OrganisationColorDTO>(ENDPOINTS.create, data);
};

export const updateOrganisationColor = async (id: string, data: OrganisationColorDTO): Promise<SBR> => {
  return apiPatch<SBR, OrganisationColorDTO>(ENDPOINTS.update(id), data);
};

export const deleteOrganisationColor = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// Cache APIs
export const getOrganisationColorCache = async (organisation_id: string): Promise<FBR<OrganisationColor[]>> => {
  return apiGet<FBR<OrganisationColor[]>>(ENDPOINTS.cache(organisation_id));
};

export const getOrganisationColorCacheCount = async (organisation_id: string): Promise<FBR<OrganisationColor[]>> => {
  return apiGet<FBR<OrganisationColor[]>>(ENDPOINTS.cache_count(organisation_id));
};

export const getOrganisationColorCacheChild = async (organisation_id: string): Promise<FBR<OrganisationColor[]>> => {
  return apiGet<FBR<OrganisationColor[]>>(ENDPOINTS.cache_child(organisation_id));
};
