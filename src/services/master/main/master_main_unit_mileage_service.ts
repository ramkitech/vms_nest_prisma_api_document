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

const URL = 'master/main/unit_mileage';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
  cache: `${URL}/cache`,
};

// Master Main Unit Mileage Interface
export interface MasterMainUnitMileage extends Record<string, unknown> {
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

// ✅ Master Main Unit Mileage Create/Update Schema
export const MasterMainUnitMileageSchema = z.object({
  unit_name: stringMandatory('Unit Name', 1, 50),
  unit_code: stringMandatory('Unit Code', 1, 10),
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterMainUnitMileageDTO = z.infer<typeof MasterMainUnitMileageSchema>;

// ✅ Master Main Unit Mileage Query Schema
export const MasterMainUnitMileageQuerySchema = BaseQuerySchema.extend({
  unit_ids: multi_select_optional('Unit Mileage'), // ✅ Multi-selection -> MasterMainUnitMileage
});
export type MasterMainUnitMileageQueryDTO = z.infer<typeof MasterMainUnitMileageQuerySchema>;

// Convert existing data to a payload structure
export const toMasterMainUnitMileagePayload = (
  unitMileage: MasterMainUnitMileage
): MasterMainUnitMileageDTO => ({
  unit_name: unitMileage.unit_name,
  unit_code: unitMileage.unit_code,
  status: unitMileage.status,
});

// Generate a new payload with default values
export const newMasterMainUnitMileagePayload = (): MasterMainUnitMileageDTO => ({
  unit_name: '',
  unit_code: '',
  status: Status.Active,
});

// API Methods
export const findMasterMainUnitMileages = async (
  data: MasterMainUnitMileageQueryDTO
): Promise<FBR<MasterMainUnitMileage[]>> => {
  return apiPost<FBR<MasterMainUnitMileage[]>, MasterMainUnitMileageQueryDTO>(
    ENDPOINTS.find,
    data
  );
};

export const createMasterMainUnitMileage = async (
  data: MasterMainUnitMileageDTO
): Promise<SBR> => {
  return apiPost<SBR, MasterMainUnitMileageDTO>(ENDPOINTS.create, data);
};

export const updateMasterMainUnitMileage = async (
  id: string,
  data: MasterMainUnitMileageDTO
): Promise<SBR> => {
  return apiPatch<SBR, MasterMainUnitMileageDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterMainUnitMileage = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// API Cache Methods
export const getMasterMainUnitMileageCache = async (): Promise<FBR<MasterMainUnitMileage[]>> => {
  return apiGet<FBR<MasterMainUnitMileage[]>>(ENDPOINTS.cache);
};
