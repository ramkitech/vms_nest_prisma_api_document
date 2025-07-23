// Axios
import { apiGet, apiPost, apiPatch, apiDelete } from '../../../core/apiCall';
import { SBR, FBR } from '../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  stringMandatory,
  stringOptional,
  enumMandatory,
  multi_select_optional,
} from '../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../zod_utils/zod_base_schema';

// Enums
import { Status } from '../../../core/Enums';

// Other Models
import { UserOrganisation } from '../../../services/main/users/user_organisation_service';

const URL = 'master/main/industry';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
  cache: `${URL}/cache`,
};

// Master Main Industry Interface
export interface MasterMainIndustry extends Record<string, unknown> {
  // Primary Fields
  industry_id: string;
  industry_name: string; // Min: 3, Max: 100
  industry_description?: string; // Optional, Max: 300

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

// ✅ Master Main Industry Create/Update Schema
export const MasterMainIndustrySchema = z.object({
  industry_name: stringMandatory('Industry Name', 3, 100),
  industry_description: stringOptional('Industry Description', 0, 300),
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterMainIndustryDTO = z.infer<typeof MasterMainIndustrySchema>;

// ✅ Master Main Industry Query Schema
export const MasterMainIndustryQuerySchema = BaseQuerySchema.extend({
  industry_ids: multi_select_optional('Industry'), // ✅ Multi-selection -> MasterMainIndustry
});
export type MasterMainIndustryQueryDTO = z.infer<
  typeof MasterMainIndustryQuerySchema
>;

// Convert existing data to a payload structure
export const toMasterMainIndustryPayload = (
  industry: MasterMainIndustry
): MasterMainIndustryDTO => ({
  industry_name: industry.industry_name,
  industry_description: industry.industry_description ?? '',
  status: industry.status,
});

// Generate a new payload with default values
export const newMasterMainIndustryPayload = (): MasterMainIndustryDTO => ({
  industry_name: '',
  industry_description: '',
  status: Status.Active,
});

// API Methods
export const findMasterMainIndustries = async (
  data: MasterMainIndustryQueryDTO
): Promise<FBR<MasterMainIndustry[]>> => {
  return apiPost<FBR<MasterMainIndustry[]>, MasterMainIndustryQueryDTO>(
    ENDPOINTS.find,
    data
  );
};

export const createMasterMainIndustry = async (
  data: MasterMainIndustryDTO
): Promise<SBR> => {
  return apiPost<SBR, MasterMainIndustryDTO>(ENDPOINTS.create, data);
};

export const updateMasterMainIndustry = async (
  id: string,
  data: MasterMainIndustryDTO
): Promise<SBR> => {
  return apiPatch<SBR, MasterMainIndustryDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterMainIndustry = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// API Cache Methods
export const getMasterMainIndustryCache = async (): Promise<
  FBR<MasterMainIndustry[]>
> => {
  return apiGet<FBR<MasterMainIndustry[]>>(ENDPOINTS.cache);
};
