// Axios
import { apiGet, apiPost, apiPatch, apiDelete } from 'core/apiCall';
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
import { MasterTyreModel } from 'services/master/tyre/master_tyre_model_service';
// import { FleetTyreInventory } from "@api/services/fleet/fleet_tyre_inventory_service";

const URL = 'master/tyre/make';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
  cache_admin: `${URL}/cache`,
  cache: (organisation_id: string): string => `${URL}/cache/${organisation_id}`,
  cache_count: (organisation_id: string): string =>
    `${URL}/cache_count/${organisation_id}`,
  cache_child: (organisation_id: string): string =>
    `${URL}/cache_child/${organisation_id}`,
};

// Master Tyre Make Interface
export interface MasterTyreMake extends Record<string, unknown> {
  // Primary Fields
  tyre_make_id: string;
  tyre_make: string; // Min: 3, Max: 100

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations
  organisation_id?: string;
  UserOrganisation?: UserOrganisation;

  // Relations - Child
  MasterTyreModel: MasterTyreModel[];
  // FleetTyreInventory: FleetTyreInventory[];

  // Count
  _count?: {
    MasterTyreModel: number;
    FleetTyreInventory: number;
  };
}

// ✅ Tyre Make Create/Update Schema
export const MasterTyreMakeSchema = z.object({
  organisation_id: single_select_mandatory('Organisation'), // ✅ Single-selection -> UserOrganisation
  tyre_make: stringMandatory('Tyre Make', 3, 100),
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterTyreMakeDTO = z.infer<typeof MasterTyreMakeSchema>;

// ✅ Tyre Make Query Schema
export const MasterTyreMakeQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('Organisation'), // ✅ Multi-selection -> UserOrganisation
  tyre_make_ids: multi_select_optional('Tyre Make'), // ✅ Multi-selection -> MasterTyreMake
});
export type MasterTyreMakeQueryDTO = z.infer<typeof MasterTyreMakeQuerySchema>;

// Convert existing data to a payload structure
export const toMasterTyreMakePayload = (
  tyreMake: MasterTyreMake
): MasterTyreMakeDTO => ({
  organisation_id: tyreMake.organisation_id ?? '',
  tyre_make: tyreMake.tyre_make,
  status: tyreMake.status,
});

// Generate a new payload with default values
export const newMasterTyreMakePayload = (): MasterTyreMakeDTO => ({
  organisation_id: '',
  tyre_make: '',
  status: Status.Active,
});

// API Methods
export const findMasterTyreMakes = async (
  data: MasterTyreMakeQueryDTO
): Promise<FBR<MasterTyreMake[]>> => {
  return apiPost<FBR<MasterTyreMake[]>, MasterTyreMakeQueryDTO>(
    ENDPOINTS.find,
    data
  );
};

export const createMasterTyreMake = async (
  data: MasterTyreMakeDTO
): Promise<SBR> => {
  return apiPost<SBR, MasterTyreMakeDTO>(ENDPOINTS.create, data);
};

export const updateMasterTyreMake = async (
  id: string,
  data: MasterTyreMakeDTO
): Promise<SBR> => {
  return apiPatch<SBR, MasterTyreMakeDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterTyreMake = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// API Cache Methods
export const getMasterTyreMakeCacheAdmin = async (): Promise<
  FBR<MasterTyreMake[]>
> => {
  return apiGet<FBR<MasterTyreMake[]>>(ENDPOINTS.cache_admin);
};

export const getMasterTyreMakeCache = async (
  organisation_id: string
): Promise<FBR<MasterTyreMake[]>> => {
  return apiGet<FBR<MasterTyreMake[]>>(ENDPOINTS.cache(organisation_id));
};

export const getMasterTyreMakeCacheCount = async (
  organisation_id: string
): Promise<FBR<number>> => {
  return apiGet<FBR<number>>(ENDPOINTS.cache_count(organisation_id));
};

export const getMasterTyreMakeCacheChild = async (
  organisation_id: string
): Promise<FBR<MasterTyreMake[]>> => {
  return apiGet<FBR<MasterTyreMake[]>>(ENDPOINTS.cache_child(organisation_id));
};
