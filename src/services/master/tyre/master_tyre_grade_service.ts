// Axios
import { apiGet, apiPost, apiPatch, apiDelete } from 'apiCall';
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
// import { FleetTyreInventory } from "@api/services/fleet/fleet_tyre_inventory_service";

const URL = 'master/tyre/grade';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
  cache: (organisation_id: string): string => `${URL}/cache/${organisation_id}`,
};

// Master Tyre Grade Interface
export interface MasterTyreGrade extends Record<string, unknown> {
  // Primary Fields
  tyre_grade_id: string;
  tyre_grade: string; // Min: 1, Max: 100

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations
  organisation_id?: string;
  UserOrganisation?: UserOrganisation;

  // Relations - Child
  // FleetTyreInventory: FleetTyreInventory[];

  // Count
  _count?: {
    FleetTyreInventory: number;
  };
}

// ✅ Tyre Grade Create/Update Schema
export const MasterTyreGradeSchema = z.object({
  organisation_id: single_select_mandatory('Organisation'), // ✅ Single-selection -> UserOrganisation
  tyre_grade: stringMandatory('Tyre Grade', 1, 100),
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterTyreGradeDTO = z.infer<typeof MasterTyreGradeSchema>;

// ✅ Tyre Grade Query Schema
export const MasterTyreGradeQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('Organisation'), // ✅ Multi-selection -> UserOrganisation
  tyre_grade_ids: multi_select_optional('Tyre Grade'), // ✅ Multi-selection -> MasterTyreGrade
});
export type MasterTyreGradeQueryDTO = z.infer<
  typeof MasterTyreGradeQuerySchema
>;

// Convert existing data to a payload structure
export const toMasterTyreGradePayload = (
  tyreGrade: MasterTyreGrade
): MasterTyreGradeDTO => ({
  organisation_id: tyreGrade.organisation_id ?? '',
  tyre_grade: tyreGrade.tyre_grade,
  status: tyreGrade.status,
});

// Generate a new payload with default values
export const newMasterTyreGradePayload = (): MasterTyreGradeDTO => ({
  organisation_id: '',
  tyre_grade: '',
  status: Status.Active,
});

// API Methods
export const findMasterTyreGrades = async (
  data: MasterTyreGradeQueryDTO
): Promise<FBR<MasterTyreGrade[]>> => {
  return apiPost<FBR<MasterTyreGrade[]>, MasterTyreGradeQueryDTO>(
    ENDPOINTS.find,
    data
  );
};

export const createMasterTyreGrade = async (
  data: MasterTyreGradeDTO
): Promise<SBR> => {
  return apiPost<SBR, MasterTyreGradeDTO>(ENDPOINTS.create, data);
};

export const updateMasterTyreGrade = async (
  id: string,
  data: MasterTyreGradeDTO
): Promise<SBR> => {
  return apiPatch<SBR, MasterTyreGradeDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterTyreGrade = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// API Cache Methods
export const getMasterTyreGradeCache = async (
  organisation_id: string
): Promise<FBR<MasterTyreGrade[]>> => {
  return apiGet<FBR<MasterTyreGrade[]>>(ENDPOINTS.cache(organisation_id));
};
