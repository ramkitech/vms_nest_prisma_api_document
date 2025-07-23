// Axios
import { apiGet, apiPost, apiPatch, apiDelete } from 'core/apiCall';
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

const URL = 'master/main/date_format';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
  cache: `${URL}/cache`,
};

// Master Main Date Format Interface
export interface MasterMainDateFormat extends Record<string, unknown> {
  // Primary Fields
  date_format_id: string;
  date_format_date: string; // Min: 3, Max: 50
  date_format_time: string; // Min: 3, Max: 50

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

// ✅ Master Main Date Format Create/Update Schema
export const MasterMainDateFormatSchema = z.object({
  date_format_date: stringMandatory('Date Format Date', 3, 50),
  date_format_time: stringMandatory('Date Format Time', 3, 50),
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterMainDateFormatDTO = z.infer<
  typeof MasterMainDateFormatSchema
>;

// ✅ Master Main Date Format Query Schema
export const MasterMainDateFormatQuerySchema = BaseQuerySchema.extend({
  date_format_ids: multi_select_optional('Date Format'), // ✅ Multi-selection -> MasterMainDateFormat
});
export type MasterMainDateFormatQueryDTO = z.infer<
  typeof MasterMainDateFormatQuerySchema
>;

// Convert existing data to a payload structure
export const toMasterMainDateFormatPayload = (
  dateFormat: MasterMainDateFormat
): MasterMainDateFormatDTO => ({
  date_format_date: dateFormat.date_format_date,
  date_format_time: dateFormat.date_format_time,
  status: dateFormat.status,
});

// Generate a new payload with default values
export const newMasterMainDateFormatPayload = (): MasterMainDateFormatDTO => ({
  date_format_date: '',
  date_format_time: '',
  status: Status.Active,
});

// API Methods
export const findMasterMainDateFormats = async (
  data: MasterMainDateFormatQueryDTO
): Promise<FBR<MasterMainDateFormat[]>> => {
  return apiPost<FBR<MasterMainDateFormat[]>, MasterMainDateFormatQueryDTO>(
    ENDPOINTS.find,
    data
  );
};

export const createMasterMainDateFormat = async (
  data: MasterMainDateFormatDTO
): Promise<SBR> => {
  return apiPost<SBR, MasterMainDateFormatDTO>(ENDPOINTS.create, data);
};

export const updateMasterMainDateFormat = async (
  id: string,
  data: MasterMainDateFormatDTO
): Promise<SBR> => {
  return apiPatch<SBR, MasterMainDateFormatDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterMainDateFormat = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// API Cache Methods
export const getMasterMainDateFormatCache = async (): Promise<
  FBR<MasterMainDateFormat[]>
> => {
  return apiGet<FBR<MasterMainDateFormat[]>>(ENDPOINTS.cache);
};
