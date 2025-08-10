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
import { User } from '../../../services/main/users/user_service';

const URL = 'master/main/language';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
  cache: `${URL}/cache`,
};

// Master Main Language Interface
export interface MasterMainLanguage extends Record<string, unknown> {
  // Primary Fields
  language_id: string;
  language_name: string; // Min: 3, Max: 50
  language_code: string; // Min: 2, Max: 10

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Child
  User: User[];

  // Count
  _count?: {
    User: number;
  };
}

// ✅ MasterMainLanguage Create/Update Schema
export const MasterMainLanguageSchema = z.object({
  language_name: stringMandatory('Language Name', 3, 50),
  language_code: stringMandatory('Language Code', 2, 10),
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterMainLanguageDTO = z.infer<typeof MasterMainLanguageSchema>;

// ✅ MasterMainLanguage Query Schema
export const MasterMainLanguageQuerySchema = BaseQuerySchema.extend({
  language_ids: multi_select_optional('Language'), // ✅ Multi-selection -> MasterMainLanguage
});
export type MasterMainLanguageQueryDTO = z.infer<
  typeof MasterMainLanguageQuerySchema
>;

// Convert existing data to a payload structure
export const toMasterMainLanguagePayload = (row: MasterMainLanguage): MasterMainLanguageDTO => ({
  language_name: row.language_name,
  language_code: row.language_code,
  status: row.status,
});

// Generate a new payload with default values
export const newMasterMainLanguagePayload = (): MasterMainLanguageDTO => ({
  language_name: '',
  language_code: '',
  status: Status.Active,
});

// API Methods
export const findMasterMainLanguages = async (data: MasterMainLanguageQueryDTO): Promise<FBR<MasterMainLanguage[]>> => {
  return apiPost<FBR<MasterMainLanguage[]>, MasterMainLanguageQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterMainLanguage = async (data: MasterMainLanguageDTO): Promise<SBR> => {
  return apiPost<SBR, MasterMainLanguageDTO>(ENDPOINTS.create, data);
};

export const updateMasterMainLanguage = async (id: string, data: MasterMainLanguageDTO): Promise<SBR> => {
  return apiPatch<SBR, MasterMainLanguageDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterMainLanguage = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// API Cache Methods
export const getMasterMainLanguageCache = async (): Promise<FBR<MasterMainLanguage[]>> => {
  return apiGet<FBR<MasterMainLanguage[]>>(ENDPOINTS.cache);
};

