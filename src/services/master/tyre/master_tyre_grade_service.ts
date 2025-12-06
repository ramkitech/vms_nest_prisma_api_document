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
// import { FleetTyreInventory } from "@api/services/fleet/fleet_tyre_inventory_service";

const URL = 'master/tyre/grade';

const ENDPOINTS = {
  // MasterTyreGrade APIs
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,

  // Cache APIs
  cache: (organisation_id: string): string => `${URL}/cache/${organisation_id}`,
  cache_count: (organisation_id: string): string => `${URL}/cache_count/${organisation_id}`,
};

// MasterTyreGrade Interface
export interface MasterTyreGrade extends Record<string, unknown> {
  // Primary Fields
  tyre_grade_id: string;
  tyre_grade: string;
  description?: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent
  organisation_id: string;
  UserOrganisation?: UserOrganisation;

   // Relations - Child
  // Child - Fleet
  // FleetTyreInventory?: FleetTyreInventory[];

  // Relations - Child Count
  _count?: {
    FleetTyreInventory?: number;
  };
}

// ✅ MasterTyreGrade Create/Update Schema
export const MasterTyreGradeSchema = z.object({
  organisation_id: single_select_mandatory('UserOrganisation'), // ✅ Single-Selection -> UserOrganisation
  tyre_grade: stringMandatory('Tyre Grade', 1, 100),
  description: stringOptional('Description', 0, 300),
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterTyreGradeDTO = z.infer<typeof MasterTyreGradeSchema>;

// ✅ MasterTyreGrade Query Schema
export const MasterTyreGradeQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('UserOrganisation'), // ✅ Multi-selection -> UserOrganisation
  tyre_grade_ids: multi_select_optional('MasterTyreGrade'), // ✅ Multi-selection -> MasterTyreGrade
});
export type MasterTyreGradeQueryDTO = z.infer<
  typeof MasterTyreGradeQuerySchema
>;

// Convert MasterTyreGrade Data to API Payload
export const toMasterTyreGradePayload = (row: MasterTyreGrade): MasterTyreGradeDTO => ({
  organisation_id: row.organisation_id || '',

  tyre_grade: row.tyre_grade || '',
  description: row.description || '',
  status: row.status || Status.Active,
});

// Create New MasterTyreGrade Payload
export const newMasterTyreGradePayload = (): MasterTyreGradeDTO => ({
  organisation_id: '',
  tyre_grade: '',
  description: '',
  status: Status.Active,
});

// MasterTyreGrade APIs
export const findMasterTyreGrades = async (data: MasterTyreGradeQueryDTO): Promise<FBR<MasterTyreGrade[]>> => {
  return apiPost<FBR<MasterTyreGrade[]>, MasterTyreGradeQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterTyreGrade = async (data: MasterTyreGradeDTO): Promise<SBR> => {
  return apiPost<SBR, MasterTyreGradeDTO>(ENDPOINTS.create, data);
};

export const updateMasterTyreGrade = async (id: string, data: MasterTyreGradeDTO): Promise<SBR> => {
  return apiPatch<SBR, MasterTyreGradeDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterTyreGrade = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// Cache APIs
export const getMasterTyreGradeCache = async (organisation_id: string): Promise<FBR<MasterTyreGrade[]>> => {
  return apiGet<FBR<MasterTyreGrade[]>>(ENDPOINTS.cache(organisation_id));
};

export const getMasterTyreGradeCacheCount = async (organisation_id: string): Promise<FBR<MasterTyreGrade[]>> => {
  return apiGet<FBR<MasterTyreGrade[]>>(ENDPOINTS.cache_count(organisation_id));
};

