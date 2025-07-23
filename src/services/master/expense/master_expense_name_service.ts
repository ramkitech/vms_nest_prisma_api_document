// Axios
import { apiGet, apiPost, apiPatch, apiDelete } from 'core/apiCall';
import { SBR, FBR } from 'core/BaseResponse';

//Zod
import { z } from 'zod';
import {
  stringMandatory,
  enumMandatory,
  enumArrayOptional,
  multi_select_optional,
  single_select_mandatory,
} from 'zod/zod_utils';
import { BaseQuerySchema } from 'zod/zod_base_schema';

//Enums
import { ExpenseCategory, Status } from 'core/Enums';

//Other Models
import { UserOrganisation } from 'services/main/users/user_organisation_service';

const URL = 'master/expense/expense_name';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
  cache: (organisation_id: string): string => `${URL}/cache/${organisation_id}`,
};

// Master Expense Name Interface
export interface MasterExpenseName extends Record<string, unknown> {
  // Primary Fields
  expense_name_id: string;
  expense_name: string; // Min: 3, Max: 100
  expense_category: ExpenseCategory;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations
  organisation_id?: string;
  UserOrganisation?: UserOrganisation;

  // Relations - Child
  //VehicleDocument: VehicleDocument[];
  //FleetIncidentManagementCost: FleetIncidentManagementCost[];

  // Count
  _count?: {
    VehicleDocument: number;
    FleetIncidentManagementCost: number;
  };
}

// ✅ Master Expense Name Create/Update Schema
export const MasterExpenseNameSchema = z.object({
  organisation_id: single_select_mandatory('Organisation'), // ✅ Single-selection -> UserOrganisation
  expense_name: stringMandatory('Expense Name', 3, 100),
  expense_category: enumMandatory(
    'Expense Category',
    ExpenseCategory,
    ExpenseCategory.Main,
  ),
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterExpenseNameDTO = z.infer<typeof MasterExpenseNameSchema>;

// ✅ Master Expense Name Query Schema
export const MasterExpenseNameQuerySchema = BaseQuerySchema.extend({
  organisation_ids: multi_select_optional('Organisation'), // ✅ Multi-selection -> UserOrganisation
  expense_name_ids: multi_select_optional('Expense Name'), // ✅ Multi-selection -> MasterExpenseName
  expense_category: enumArrayOptional('Expense Category', ExpenseCategory), // ✅ Multi-selection -> ExpenseCategory
});
export type MasterExpenseNameQueryDTO = z.infer<
  typeof MasterExpenseNameQuerySchema
>;

// Convert existing data to a payload structure
export const toMasterExpenseNamePayload = (expense: MasterExpenseName): MasterExpenseNameDTO => ({
  organisation_id: expense.organisation_id ?? '',
  expense_name: expense.expense_name,
  expense_category: expense.expense_category,
  status: expense.status,
});

// Generate a new payload with default values
export const newMasterExpenseNamePayload = (): MasterExpenseNameDTO => ({
  organisation_id: '',
  expense_name: '',
  expense_category: ExpenseCategory.Main,
  status: Status.Active,
});

// API Methods
export const findMasterExpenseNames = async (
  data: MasterExpenseNameQueryDTO
): Promise<FBR<MasterExpenseName[]>> => {
  return apiPost<FBR<MasterExpenseName[]>, MasterExpenseNameQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterExpenseName = async (
  data: MasterExpenseNameDTO
): Promise<SBR> => {
  return apiPost<SBR, MasterExpenseNameDTO>(ENDPOINTS.create, data);
};

export const updateMasterExpenseName = async (
  id: string,
  data: MasterExpenseNameDTO
): Promise<SBR> => {
  return apiPatch<SBR, MasterExpenseNameDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterExpenseName = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// API CacheMethods
export const getMasterExpenseNameCache = async (
  organisation_id: string
): Promise<FBR<MasterExpenseName[]>> => {
  return apiGet<FBR<MasterExpenseName[]>>(ENDPOINTS.cache(organisation_id));
};

