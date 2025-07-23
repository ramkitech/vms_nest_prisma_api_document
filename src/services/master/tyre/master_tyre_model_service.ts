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
import { MasterTyreMake } from 'services/master/tyre/master_tyre_make_service';
//import { FleetTyreInventory } from "@api/services/fleet/fleet_tyre_inventory_service";

const URL = 'master/tyre/model';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
  cache: (organisation_id: string, tyre_make_id?: string): string =>
    `${URL}/cache/${organisation_id}?tyre_make_id=${tyre_make_id || '0'}`,
};

// Master Tyre Model Interface
export interface MasterTyreModel extends Record<string, unknown> {
  // Primary Fields
  tyre_model_id: string;
  tyre_model: string; // Min: 3, Max: 100

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations
  organisation_id?: string;
  UserOrganisation?: UserOrganisation;
  tyre_make_id: string;
  MasterTyreMake?: MasterTyreMake;

  // Relations - Child
  // FleetTyreInventory: FleetTyreInventory[];

  // Count
  _count?: {
    FleetTyreInventory: number;
  };
}

// ✅ Tyre Model Create/Update Schema
export const MasterTyreModelSchema = z.object({
  organisation_id: single_select_mandatory('Organisation'), // ✅ Single-selection -> UserOrganisation
  tyre_make_id: single_select_mandatory('Tyre Make'), // ✅ Single-selection -> MasterTyreMake
  tyre_model: stringMandatory('Tyre Model', 3, 100),
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterTyreModelDTO = z.infer<typeof MasterTyreModelSchema>;

// ✅ Tyre Model Query Schema
export const MasterTyreModelQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('Organisation'), // ✅ Multi-selection -> UserOrganisation
  tyre_make_ids: multi_select_optional('Tyre Make'), // ✅ Multi-selection -> MasterTyreMake
  tyre_model_ids: multi_select_optional('Tyre Model'), // ✅ Multi-selection -> MasterTyreModel
});
export type MasterTyreModelQueryDTO = z.infer<
  typeof MasterTyreModelQuerySchema
>;

// Convert existing data to a payload structure
export const toMasterTyreModelPayload = (
  tyreModel: MasterTyreModel
): MasterTyreModelDTO => ({
  organisation_id: tyreModel.organisation_id ?? '',
  tyre_make_id: tyreModel.tyre_make_id,
  tyre_model: tyreModel.tyre_model,
  status: tyreModel.status,
});

// Generate a new payload with default values
export const newMasterTyreModelPayload = (): MasterTyreModelDTO => ({
  organisation_id: '',
  tyre_make_id: '',
  tyre_model: '',
  status: Status.Active,
});

// API Methods
export const findMasterTyreModels = async (
  data: MasterTyreModelQueryDTO
): Promise<FBR<MasterTyreModel[]>> => {
  return apiPost<FBR<MasterTyreModel[]>, MasterTyreModelQueryDTO>(
    ENDPOINTS.find,
    data
  );
};

export const createMasterTyreModel = async (
  data: MasterTyreModelDTO
): Promise<SBR> => {
  return apiPost<SBR, MasterTyreModelDTO>(ENDPOINTS.create, data);
};

export const updateMasterTyreModel = async (
  id: string,
  data: MasterTyreModelDTO
): Promise<SBR> => {
  return apiPatch<SBR, MasterTyreModelDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterTyreModel = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// API Cache Methods
export const getMasterTyreModelCache = async (
  organisation_id: string,
  tyre_make_id?: string
): Promise<FBR<MasterTyreModel[]>> => {
  return apiGet<FBR<MasterTyreModel[]>>(
    ENDPOINTS.cache(organisation_id, tyre_make_id)
  );
};
