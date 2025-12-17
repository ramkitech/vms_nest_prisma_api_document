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

const URL = 'master/main/unit_mileage';

const ENDPOINTS = {
  // MasterMainUnitMileage APIs
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,

  // Cache APIs
  cache: `${URL}/cache`,
};

// MasterMainUnitMileage Interface
export interface MasterMainUnitMileage extends Record<string, unknown> {
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

// MasterMainUnitMileage Create/Update Schema
export const MasterMainUnitMileageSchema = z.object({
  // Main Field Details
  unit_name: stringMandatory('Unit Name', 1, 50),
  unit_code: stringMandatory('Unit Code', 1, 10),

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterMainUnitMileageDTO = z.infer<
  typeof MasterMainUnitMileageSchema
>;

// MasterMainUnitMileage Query Schema
export const MasterMainUnitMileageQuerySchema = BaseQuerySchema.extend({
  // Self Table
  unit_ids: multi_select_optional('Unit Mileage'), // Multi-selection -> MasterMainUnitMileage
});
export type MasterMainUnitMileageQueryDTO = z.infer<
  typeof MasterMainUnitMileageQuerySchema
>;

// Convert MasterMainUnitMileage Data to API Payload
export const toMasterMainUnitMileagePayload = (row: MasterMainUnitMileage): MasterMainUnitMileageDTO => ({
  unit_name: row.unit_name || '',
  unit_code: row.unit_code || '',

  status: row.status || Status.Active,
});

// Create New MasterMainUnitMileage Payload
export const newMasterMainUnitMileagePayload = (): MasterMainUnitMileageDTO => ({
  unit_name: '',
  unit_code: '',

  status: Status.Active,
});

// MasterMainUnitMileage APIs
export const findMasterMainUnitMileages = async (data: MasterMainUnitMileageQueryDTO): Promise<FBR<MasterMainUnitMileage[]>> => {
  return apiPost<FBR<MasterMainUnitMileage[]>, MasterMainUnitMileageQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterMainUnitMileage = async (data: MasterMainUnitMileageDTO): Promise<SBR> => {
  return apiPost<SBR, MasterMainUnitMileageDTO>(ENDPOINTS.create, data);
};

export const updateMasterMainUnitMileage = async (id: string, data: MasterMainUnitMileageDTO): Promise<SBR> => {
  return apiPatch<SBR, MasterMainUnitMileageDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterMainUnitMileage = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// Cache APIs
export const getMasterMainUnitMileageCache = async (): Promise<FBR<MasterMainUnitMileage[]>> => {
  return apiGet<FBR<MasterMainUnitMileage[]>>(ENDPOINTS.cache);
};

