// Axios
import { apiGet, apiPost, apiPatch, apiDelete } from 'apiCall';
import { SBR, FBR } from 'core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  stringMandatory,
  enumMandatory,
  multi_select_optional,
} from 'zod/zod_utils';
import { BaseQuerySchema } from 'zod/zod_base_schema';

// Enums
import { Status } from 'core/Enums';

// Other Models
import { UserOrganisation } from 'services/main/users/user_organisation_service';

const URL = 'master/main/unit_volume';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
  cache: `${URL}/cache`,
};

// Master Main Unit Volume Interface
export interface MasterMainUnitVolume extends Record<string, unknown> {
  // Primary Fields
  unit_id: string;
  unit_name: string; // Min: 1, Max: 20
  unit_code: string; // Min: 1, Max: 10

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Child
  UserOrganisation: UserOrganisation[];

  // Count
  _count?: {
    UserOrganisation: number;
  };
}

// ✅ Master Main Unit Volume Create/Update Schema
export const MasterMainUnitVolumeSchema = z.object({
  unit_name: stringMandatory('Unit Name', 1, 50),
  unit_code: stringMandatory('Unit Code', 1, 10),
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterMainUnitVolumeDTO = z.infer<
  typeof MasterMainUnitVolumeSchema
>;

// ✅ Master Main Unit Volume Query Schema
export const MasterMainUnitVolumeQuerySchema = BaseQuerySchema.extend({
  unit_ids: multi_select_optional('Unit Volume'), // ✅ Multi-selection -> MasterMainUnitVolume
});
export type MasterMainUnitVolumeQueryDTO = z.infer<
  typeof MasterMainUnitVolumeQuerySchema
>;

// Convert existing data to a payload structure
export const toMasterMainUnitVolumePayload = (
  unitVolume: MasterMainUnitVolume
): MasterMainUnitVolumeDTO => ({
  unit_name: unitVolume.unit_name,
  unit_code: unitVolume.unit_code,
  status: unitVolume.status,
});

// Generate a new payload with default values
export const newMasterMainUnitVolumePayload = (): MasterMainUnitVolumeDTO => ({
  unit_name: '',
  unit_code: '',
  status: Status.Active,
});

// API Methods
export const findMasterMainUnitVolumes = async (
  data: MasterMainUnitVolumeQueryDTO
): Promise<FBR<MasterMainUnitVolume[]>> => {
  return apiPost<FBR<MasterMainUnitVolume[]>, MasterMainUnitVolumeQueryDTO>(
    ENDPOINTS.find,
    data
  );
};

export const createMasterMainUnitVolume = async (
  data: MasterMainUnitVolumeDTO
): Promise<SBR> => {
  return apiPost<SBR, MasterMainUnitVolumeDTO>(ENDPOINTS.create, data);
};

export const updateMasterMainUnitVolume = async (
  id: string,
  data: MasterMainUnitVolumeDTO
): Promise<SBR> => {
  return apiPatch<SBR, MasterMainUnitVolumeDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterMainUnitVolume = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// API Cache Methods
export const getMasterMainUnitVolumeCache = async (): Promise<
  FBR<MasterMainUnitVolume[]>
> => {
  return apiGet<FBR<MasterMainUnitVolume[]>>(ENDPOINTS.cache);
};
