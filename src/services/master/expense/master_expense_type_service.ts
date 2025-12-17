// Axios
import { apiGet, apiPost, apiPatch, apiDelete } from '../../../core/apiCall';
import { SBR, FBR } from '../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  stringMandatory,
  enumMandatory,
  multi_select_optional,
  single_select_mandatory,
  stringOptional,
} from '../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../zod_utils/zod_base_schema';

// Enums
import { Status } from '../../../core/Enums';

// Other Models
import { UserOrganisation } from '../../../services/main/users/user_organisation_service';

const URL = 'master/expense/expense_type';

const ENDPOINTS = {
  // MasterExpenseType APIs
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,

  // Cache APIs
  cache: (organisation_id: string): string => `${URL}/cache/${organisation_id}`,
};

// MasterExpenseType Interface
export interface MasterExpenseType extends Record<string, unknown> {
  // Primary Fields
  expense_type_id: string;

  // Main Field Details
  expense_type_name: string;
  description?: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent
  organisation_id: string;
  UserOrganisation?: UserOrganisation;
  organisation_name?: string;
}

// MasterExpenseType Create/Update Schema
export const MasterExpenseTypeSchema = z.object({
  // Relations - Parent
  organisation_id: single_select_mandatory('UserOrganisation'), // Single-Selection -> UserOrganisation

  // Main Field Details
  expense_type_name: stringMandatory('Expense Type Name', 3, 100),
  description: stringOptional('Description', 0, 300),

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterExpenseTypeDTO = z.infer<typeof MasterExpenseTypeSchema>;

// MasterExpenseType Query Schema
export const MasterExpenseTypeQuerySchema = BaseQuerySchema.extend({
  // Self Table
  expense_type_ids: multi_select_optional('MasterExpenseType'), // Multi-Selection -> MasterExpenseType

  // Relations - Parent
  organisation_ids: multi_select_optional('UserOrganisation'), // Multi-Selection -> UserOrganisation
});
export type MasterExpenseTypeQueryDTO = z.infer<
  typeof MasterExpenseTypeQuerySchema
>;

// Convert MasterExpenseType Data to API Payload
export const toMasterExpenseTypePayload = (row: MasterExpenseType): MasterExpenseTypeDTO => ({
  organisation_id: row.organisation_id || '',

  expense_type_name: row.expense_type_name || '',
  description: row.description || '',

  status: row.status || Status.Active,
});

// Create New MasterExpenseType Payload
export const newMasterExpenseTypePayload = (): MasterExpenseTypeDTO => ({
  organisation_id: '',

  expense_type_name: '',
  description: '',

  status: Status.Active,
});

// MasterExpenseType APIs
export const findMasterExpenseTypes = async (data: MasterExpenseTypeQueryDTO): Promise<FBR<MasterExpenseType[]>> => {
  return apiPost<FBR<MasterExpenseType[]>, MasterExpenseTypeQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterExpenseType = async (data: MasterExpenseTypeDTO): Promise<SBR> => {
  return apiPost<SBR, MasterExpenseTypeDTO>(ENDPOINTS.create, data);
};

export const updateMasterExpenseType = async (id: string, data: MasterExpenseTypeDTO): Promise<SBR> => {
  return apiPatch<SBR, MasterExpenseTypeDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterExpenseType = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// Cache APIs
export const getMasterExpenseTypeCache = async (organisation_id: string): Promise<FBR<MasterExpenseType[]>> => {
  return apiGet<FBR<MasterExpenseType[]>>(ENDPOINTS.cache(organisation_id));
};

