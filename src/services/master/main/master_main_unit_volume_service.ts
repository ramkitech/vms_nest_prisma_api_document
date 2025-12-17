// Axios
import { apiGet, apiPost, apiPatch, apiDelete } from '../../../core/apiCall';
import { SBR, FBR } from '../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  stringMandatory,
  enumMandatory,
  multi_select_optional,
} from '../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../zod_utils/zod_base_schema';

// Enums
import { Status } from '../../../core/Enums';

// Other Models
import { UserOrganisation } from '../../../services/main/users/user_organisation_service';

const URL = 'master/main/unit_volume';

const ENDPOINTS = {
  // MasterMainUnitVolume APIs
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,

  // Cache APIs
  cache: `${URL}/cache`,
};

// MasterMainUnitVolume Interface
export interface MasterMainUnitVolume extends Record<string, unknown> {
  // Primary Fields
  unit_id: string;

  // Main Field Details
  unit_name: string;
  unit_code: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Child
  // Child - User
  UserOrganisation?: UserOrganisation[];

  // Relations - Child Count
  _count?: {
    UserOrganisation?: number;
  };
}

// MasterMainUnitVolume Create/Update Schema
export const MasterMainUnitVolumeSchema = z.object({
  // Main Field Details
  unit_name: stringMandatory('Unit Name', 1, 50),
  unit_code: stringMandatory('Unit Code', 1, 10),

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterMainUnitVolumeDTO = z.infer<
  typeof MasterMainUnitVolumeSchema
>;

// MasterMainUnitVolume Query Schema
export const MasterMainUnitVolumeQuerySchema = BaseQuerySchema.extend({
  // Self Table
  unit_ids: multi_select_optional('Unit Volume'), // Multi-selection -> MasterMainUnitVolume
});
export type MasterMainUnitVolumeQueryDTO = z.infer<
  typeof MasterMainUnitVolumeQuerySchema
>;

// Convert MasterMainUnitVolume Data to API Payload
export const toMasterMainUnitVolumePayload = (row: MasterMainUnitVolume): MasterMainUnitVolumeDTO => ({
  unit_name: row.unit_name || '',
  unit_code: row.unit_code || '',

  status: row.status || Status.Active,
});

// Create New MasterMainUnitVolume Payload
export const newMasterMainUnitVolumePayload = (): MasterMainUnitVolumeDTO => ({
  unit_name: '',
  unit_code: '',

  status: Status.Active,
});

// MasterMainUnitVolume APIs
export const findMasterMainUnitVolumes = async (data: MasterMainUnitVolumeQueryDTO): Promise<FBR<MasterMainUnitVolume[]>> => {
  return apiPost<FBR<MasterMainUnitVolume[]>, MasterMainUnitVolumeQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterMainUnitVolume = async (data: MasterMainUnitVolumeDTO): Promise<SBR> => {
  return apiPost<SBR, MasterMainUnitVolumeDTO>(ENDPOINTS.create, data);
};

export const updateMasterMainUnitVolume = async (id: string, data: MasterMainUnitVolumeDTO): Promise<SBR> => {
  return apiPatch<SBR, MasterMainUnitVolumeDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterMainUnitVolume = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// Cache APIs
export const getMasterMainUnitVolumeCache = async (): Promise<FBR<MasterMainUnitVolume[]>> => {
  return apiGet<FBR<MasterMainUnitVolume[]>>(ENDPOINTS.cache);
};

