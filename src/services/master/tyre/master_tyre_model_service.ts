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
  stringUUIDMandatory,
} from '../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../zod_utils/zod_base_schema';

// Enums
import { Status } from '../../../core/Enums';

// Other Models
import { UserOrganisation } from '../../../services/main/users/user_organisation_service';
import { MasterTyreMake } from '../../../services/master/tyre/master_tyre_make_service';
//import { FleetTyreInventory } from "@api/services/fleet/fleet_tyre_inventory_service";

const URL = 'master/tyre/model';

const ENDPOINTS = {
  // MasterTyreModel APIs
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,

  // Cache APIs
  cache: (organisation_id: string, tyre_make_id?: string): string => `${URL}/cache/${organisation_id}?tyre_make_id=${tyre_make_id || '0'}`,
  cache_count: (organisation_id: string, tyre_make_id?: string): string => `${URL}/cache_count/${organisation_id}?tyre_make_id=${tyre_make_id || '0'}`,
};

// MasterTyreModel Interface
export interface MasterTyreModel extends Record<string, unknown> {
  // Primary Fields
  tyre_model_id: string;

  // Main Field Details
  tyre_model: string;
  description?: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent
  organisation_id: string;
  UserOrganisation?: UserOrganisation;
  organisation_name?: string;
  organisation_code?: string;

  tyre_make_id: string;
  MasterTyreMake?: MasterTyreMake;

  // Relations - Child
  // Child - Fleet
  // FleetTyreInventory?: FleetTyreInventory[];

  // Relations - Child Count
  _count?: {
    FleetTyreInventory?: number;
  };
}

// MasterTyreModel Create/Update Schema
export const MasterTyreModelSchema = z.object({
  // Relations - Parent
  organisation_id: single_select_mandatory('UserOrganisation'), // Single-Selection -> UserOrganisation
  tyre_make_id: single_select_mandatory('MasterTyreMake'), // Single-Selection -> MasterTyreMake

  // Main Field Details
  tyre_model: stringMandatory('Tyre Model', 3, 100),
  description: stringOptional('Description', 0, 300),

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterTyreModelDTO = z.infer<typeof MasterTyreModelSchema>;

// MasterTyreModel Query Schema
export const MasterTyreModelQuerySchema = BaseQuerySchema.extend({
  // Self Table
  tyre_model_ids: multi_select_optional('MasterTyreModel'), // Multi-selection -> MasterTyreModel

  // Relations - Parent
  organisation_ids: multi_select_optional('UserOrganisation'), // Multi-selection -> UserOrganisation
  tyre_make_ids: multi_select_optional('MasterTyreMake'), // Multi-selection -> MasterTyreMake
});
export type MasterTyreModelQueryDTO = z.infer<
  typeof MasterTyreModelQuerySchema
>;

export const FindCacheSchema = z.object({
  tyre_make_id: stringUUIDMandatory('tyre_make_id'),
});
export type FindCacheDTO = z.infer<typeof FindCacheSchema>;

// Convert MasterTyreModel Data to API Payload
export const toMasterTyreModelPayload = (row: MasterTyreModel): MasterTyreModelDTO => ({
  organisation_id: row.organisation_id || '',
  tyre_make_id: row.tyre_make_id || '',

  tyre_model: row.tyre_model || '',
  description: row.description || '',

  status: row.status || Status.Active,
});

// Create New MasterTyreModel Payload
export const newMasterTyreModelPayload = (): MasterTyreModelDTO => ({
  organisation_id: '',
  tyre_make_id: '',

  tyre_model: '',
  description: '',

  status: Status.Active,
});

// MasterTyreModel APIs
export const findMasterTyreModels = async (data: MasterTyreModelQueryDTO): Promise<FBR<MasterTyreModel[]>> => {
  return apiPost<FBR<MasterTyreModel[]>, MasterTyreModelQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterTyreModel = async (data: MasterTyreModelDTO): Promise<SBR> => {
  return apiPost<SBR, MasterTyreModelDTO>(ENDPOINTS.create, data);
};

export const updateMasterTyreModel = async (id: string, data: MasterTyreModelDTO): Promise<SBR> => {
  return apiPatch<SBR, MasterTyreModelDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterTyreModel = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// Cache APIs
export const getMasterTyreModelCache = async (organisation_id: string, tyre_make_id?: string): Promise<FBR<MasterTyreModel[]>> => {
  return apiGet<FBR<MasterTyreModel[]>>(ENDPOINTS.cache(organisation_id, tyre_make_id));
};

export const getMasterTyreModelCacheCount = async (organisation_id: string, tyre_make_id?: string): Promise<FBR<MasterTyreModel[]>> => {
  return apiGet<FBR<MasterTyreModel[]>>(ENDPOINTS.cache_count(organisation_id, tyre_make_id));
};

