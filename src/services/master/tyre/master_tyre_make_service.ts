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
import { MasterTyreModel } from '../../../services/master/tyre/master_tyre_model_service';
// import { FleetTyreInventory } from "@api/services/fleet/fleet_tyre_inventory_service";

const URL = 'master/tyre/make';

const ENDPOINTS = {
  // MasterTyreMake APIs
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,

  // Cache APIs
  cache: (organisation_id: string): string => `${URL}/cache/${organisation_id}`,
  cache_count: (organisation_id: string): string => `${URL}/cache_count/${organisation_id}`,
  cache_child: (organisation_id: string): string => `${URL}/cache_child/${organisation_id}`,
};

// MasterTyreMake Interface
export interface MasterTyreMake extends Record<string, unknown> {
  // Primary Fields
  tyre_make_id: string;
  tyre_make: string;
  description?: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent
  organisation_id: string;
  UserOrganisation?: UserOrganisation;

  // Relations - Child
  // Child - Master
  MasterTyreModel?: MasterTyreModel[];
  // Child - Fleet
  // FleetTyreInventory?: FleetTyreInventory[];

  // Relations - Child Count
  _count?: {
    MasterTyreModel?: number;
    FleetTyreInventory?: number;
  };
}

// ✅ MasterTyreMake Create/Update Schema
export const MasterTyreMakeSchema = z.object({
  organisation_id: single_select_mandatory('UserOrganisation'), // ✅ Single-Selection -> UserOrganisation
  tyre_make: stringMandatory('Tyre Make', 3, 100),
  description: stringOptional('Description', 0, 300),
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterTyreMakeDTO = z.infer<typeof MasterTyreMakeSchema>;

// ✅ MasterTyreMake Query Schema
export const MasterTyreMakeQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('UserOrganisation'), // ✅ Multi-selection -> UserOrganisation
  tyre_make_ids: multi_select_optional('MasterTyreMake'), // ✅ Multi-selection -> MasterTyreMake
});
export type MasterTyreMakeQueryDTO = z.infer<typeof MasterTyreMakeQuerySchema>;

// Convert MasterTyreMake Data to API Payload
export const toMasterTyreMakePayload = (row: MasterTyreMake): MasterTyreMakeDTO => ({
  organisation_id: row.organisation_id || '',
  tyre_make: row.tyre_make || '',
  description: row.description || '',
  status: row.status || Status.Active,
});

// Create New MasterTyreMake Payload
export const newMasterTyreMakePayload = (): MasterTyreMakeDTO => ({
  organisation_id: '',
  tyre_make: '',
  description: '',
  status: Status.Active,
});

// MasterTyreMake APIs
export const findMasterTyreMakes = async (data: MasterTyreMakeQueryDTO): Promise<FBR<MasterTyreMake[]>> => {
  return apiPost<FBR<MasterTyreMake[]>, MasterTyreMakeQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterTyreMake = async (data: MasterTyreMakeDTO): Promise<SBR> => {
  return apiPost<SBR, MasterTyreMakeDTO>(ENDPOINTS.create, data);
};

export const updateMasterTyreMake = async (id: string, data: MasterTyreMakeDTO): Promise<SBR> => {
  return apiPatch<SBR, MasterTyreMakeDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterTyreMake = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// Cache APIs
export const getMasterTyreMakeCache = async (organisation_id: string): Promise<FBR<MasterTyreMake[]>> => {
  return apiGet<FBR<MasterTyreMake[]>>(ENDPOINTS.cache(organisation_id));
};

export const getMasterTyreMakeCacheCount = async (organisation_id: string): Promise<FBR<number>> => {
  return apiGet<FBR<number>>(ENDPOINTS.cache_count(organisation_id));
};

export const getMasterTyreMakeCacheChild = async (organisation_id: string): Promise<FBR<MasterTyreMake[]>> => {
  return apiGet<FBR<MasterTyreMake[]>>(ENDPOINTS.cache_child(organisation_id));
};

